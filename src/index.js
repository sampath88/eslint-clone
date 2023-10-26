#!/usr/bin/env node

// It tells the system to use the Node.js interpreter to run the script
/**
 * When you execute this script from the command line, the system will look for the node
 * executable in the system's PATH and use it to execute the JavaScript code in your 
 * script
 */

import { parseArgs } from "node:util";
import chalk from "chalk";
import fs from "node:fs";
import * as espree from "espree";

function getFilePathFromCLI() {
  try {
    const {
      values: { file },
    } = parseArgs({
      options: {
        file: {
          type: "string",
          short: "f",
        },
      },
    });
    if (!file) throw new Error();
    return file;
  } catch (error) {
    console.error(
      chalk.red(
        "Error: Please provide a valid file path as an argument using -f or --file"
      )
    );
    process.exit(1);
  }
}

const filePath = getFilePathFromCLI();
console.log(chalk.blue(`[File] ${filePath}`));
const code = fs.readFileSync(filePath, "utf-8");
const ast = espree.parse(code, {
  ecmaVersion: 2020,
  loc: true,
  sourceType: "module",
});
fs.writeFileSync("ast.json", JSON.stringify(ast, null, 2));
