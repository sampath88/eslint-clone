export default class SyntaxTreeProcessor {
  #filePath;
  #errors = new Map();
  #variables = new Map();
  #messages = {
    singleQuote: () => "use single quotes instead of double quotes",
    useConst: (variableKind) => `use "const" instead of ${variableKind}`,
    useLet: (variableKind) => `use "let" instead of ${variableKind}`,
  };
  #stages = {
    declaration: "declaration",
    expressionDeclaration: "expressionDeclaration",
  };
  #variableKinds = {
    const: "const",
    let: "let",
    var: "var",
  };
  constructor(filePath) {
    this.#filePath = filePath;
  }

  #storeError(message, { line, column }) {
    const errorLocation = `${this.#filePath}:${line}:${column + 1}`;
    this.#errors.set(errorLocation, { message, errorLocation });
  }

  #handleLiteral(nodeDeclaration) {
    if (!(nodeDeclaration.raw && typeof nodeDeclaration.value === "string")) {
      return;
    }

    if (!nodeDeclaration.raw.includes('"')) return;
    nodeDeclaration.raw = nodeDeclaration.raw.replace(/"/g, "'");
    const position = nodeDeclaration.loc.start;
    this.#storeError(this.#messages.singleQuote(), position);
  }

  #handleVariableDeclaration(nodeDeclaration) {
    const originalKind = nodeDeclaration.kind;
    for (const declaration of nodeDeclaration.declarations) {
      const varName = declaration.id.name;
      this.#variables.set(varName, {
        originalKind,
        stage: this.#stages.declaration,
        nodeDeclaration,
      });
    }
  }
  #handleExpressionStatement(node) {
    const { expression } = node;
    if (!expression.left) return;
    const varName = (expression.left.object || expression.left).name;
    if (!this.#variables.has(varName)) return;
    const variable = this.#variables.get(varName);

    const { originalKind, nodeDeclaration, stage } = variable;

    if (
      expression.left.type === "MemberExpression" &&
      stage === this.#stages.declaration
    ) {
      if (originalKind === this.#variableKinds.const) return;
      this.#storeError(
        this.#messages.useConst(originalKind),
        nodeDeclaration.loc.start
      );
      nodeDeclaration.kind = this.#variableKinds.const;
      this.#variables.set(varName, {
        ...variable,
        stage: this.#stages.expressionDeclaration,
        nodeDeclaration,
      });
      return;
    }

    // means keeping the variable as it is if it has 'let'
    if (
      [nodeDeclaration.kind, originalKind].includes(this.#variableKinds.let)
    ) {
      this.#variables.set(varName, {
        ...variable,
        stage: this.#stages.expressionDeclaration,
        nodeDeclaration,
      });
      return;
    }

    // means reassining the variable and using var/const
    this.#storeError(
      this.#messages.useLet(originalKind),
      nodeDeclaration.loc.start
    );
    nodeDeclaration.kind = this.#variableKinds.let;
    this.#variables.set(varName, {
      ...variable,
      stage: this.#stages.expressionDeclaration,
      nodeDeclaration,
    });
    return;
  }

  #checkDeclarationsThatNeverChanged() {
    const variables = [...this.#variables.entries()];
    variables
      .filter(
        ([_, { originalKind, stage }]) =>
          stage === this.#stages.declaration &&
          originalKind !== this.#variableKinds.const
      )
      .forEach(([varName, variable]) => {
        const { originalKind, nodeDeclaration } = variable;
        if (originalKind === this.#variableKinds.const) return;
        this.#storeError(
          this.#messages.useConst(originalKind),
          nodeDeclaration.loc.start
        );
        nodeDeclaration.kind = this.#variableKinds.const;
        this.#variables.set(varName, {
          ...variable,
          stage: this.#stages.expressionDeclaration,
          nodeDeclaration,
        });
      });
  }

  #traverse(nodeDeclaration) {
    const hooks = {
      Literal: (node) => {
        this.#handleLiteral(node);
      },
      VariableDeclaration: (node) => {
        this.#handleVariableDeclaration(node);
      },
      ExpressionStatement: (node) => {
        this.#handleExpressionStatement(node);
      },
    };
    hooks[nodeDeclaration?.type]?.(nodeDeclaration);
    for (const key in nodeDeclaration) {
      if (typeof nodeDeclaration[key] !== "object") continue;
      this.#traverse(nodeDeclaration[key]);
    }
  }

  process(ast) {
    this.#traverse(ast);
    this.#checkDeclarationsThatNeverChanged();
    return [...this.#errors.values()];
  }
}
