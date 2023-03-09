import { Command } from "commander";
import { BaseCommand } from "../common/interfaces";
import AuthOptions from "../dynatrace/AuthOptions";

class SRGCommand implements BaseCommand {
  constructor(program: Command) {
    this.init(program);
  }

  init(program: Command) {
    //main command
    const srg = program
      .command("srg")
      .description("Site Reliability Guardian commands.");
    new AuthOptions(srg, true, true);
  }
}

export default SRGCommand;
