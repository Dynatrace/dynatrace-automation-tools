import figlet from "figlet";
import { Command, Option } from "commander";
import SRGCommand from "./SRGAutomation/SRGCommand";

const program = new Command();
program
  .name("Dynatrace automation tools CLI")
  .version("0.0.1")
  //global options
  .addOption(
    new Option("-i --interactive", "Enable interactive mode").default(false)
  )
  .description("Dynatrace automation tools CLI");
console.log(figlet.textSync("DT automation"));
//Register the commands here

new SRGCommand(program);

program.parseAsync(process.argv);
