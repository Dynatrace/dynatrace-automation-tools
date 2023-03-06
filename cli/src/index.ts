import figlet from "figlet";
import { Command, Option } from "commander";
import SRGCommand from "./use-case-srg/SRGCommand";
import { loggers } from "winston";

const program = new Command();
program
  .name("Dynatrace automation tools CLI")
  .version("0.0.1")
  .description("Dynatrace automation tools CLI");
console.log(figlet.textSync("DT automation"));
//Register the commands here

let srgManager = new SRGCommand(program);

program.parseAsync(process.argv);
