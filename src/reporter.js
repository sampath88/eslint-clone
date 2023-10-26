import chalk from "chalk";
import * as astring from "astring";
import fs from "node:fs";
import path from "node:path";

export default class Reporter {
  static space = "\x20";
  static errCode = "ERR!";
  static report({ errors, ast, outputFilePath }) {
    errors.forEach(({ message, errorLocation }) => {
      const errorMessage = `${chalk.red("ERR!")} ${message}`;
      const finalMessage = `${errorMessage}\n${this.space.repeat(
        this.errCode.length + 1
      )}at ${chalk.gray(errorLocation)}`;
      console.error(finalMessage);
    });

    const updatedCode = astring.generate(ast);
    fs.writeFileSync(outputFilePath, updatedCode, "utf-8");
    if (!errors.length) {
      console.log(chalk.green("Linting completed without errors."));
    } else {
      console.log(
        chalk.red(`Linting completed with ${errors.length} error(s).`)
      );
    }
    console.log(
      chalk.green("\nCode fixed and saved at"),
      chalk.yellow("./" + path.basename(outputFilePath)),
      chalk.green("successfully!")
    );
  }
}
