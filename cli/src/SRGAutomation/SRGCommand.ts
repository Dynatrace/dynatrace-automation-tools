import { Command } from "commander";
import { BaseCommand } from "../common/interfaces";
import SRGCommandEvaluate from "./evaluate/SRGCommandEvaluate";

class SRGCommand implements BaseCommand {
  constructor(program: Command) {
    this.init(program);
  }

  init(program: Command) {
    //main command
    const srg = program
      .command("srg")
      .description("Site Reliability Guardian commands.");
    new SRGCommandEvaluate(srg);
  }
}

export default SRGCommand;
