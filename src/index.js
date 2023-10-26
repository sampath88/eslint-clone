import { parseArgs } from "node:util";
import chalk from "chalk";


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
console.log(filePath);
