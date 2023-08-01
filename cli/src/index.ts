import figlet from "figlet";
import { Command } from "commander";
import SRGCommand from "./SRGAutomation/SRGCommand";
import { DTA_CLI_VERSION } from "./version";
import EventCommand from "./Events/EventCommand";

export function printBanner() {
  console.log(figlet.textSync("DT automation"));
}

export function createCLIProgram(version: string) {
  const program = new Command();
  program
    .name("Dynatrace automation tools CLI")
    .version(version)
    .description("Dynatrace automation tools CLI");
  return program;
}

export function registerCommands(program: Command) {
  //Register the commands here
  new SRGCommand(program);
  new EventCommand(program);
}

export async function initialize(version: string, args: string[]) {
  printBanner();
  const program = createCLIProgram(version);
  registerCommands(program);
  return await program.parseAsync(args);
}

initialize(DTA_CLI_VERSION, process.argv);
