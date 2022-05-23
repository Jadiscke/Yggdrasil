import { program } from "commander";
import { getProjectStructure } from "./analyzes";

program
  .option("--analyze", "Analyze de folder structure of the project")
  .option("-R, --root <dir>", "root directory location", "./src");

program.parse();

const options = program.opts();

console.log(options);

if (options.analyze){
  getProjectStructure(0, process.cwd()).then((result) => {
    console.dir(result, { depth: 4});
  });
}