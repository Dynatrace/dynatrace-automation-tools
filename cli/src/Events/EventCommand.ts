import { Command } from "commander";
import { BaseCommand } from "../common/interfaces";
import EventDeployCommand from "./deploy/EventDeployCommand";

class EventCommand implements BaseCommand {
  constructor(program: Command) {
    this.init(program);
  }

  init(program: Command) {
    //main command
    const event = program
      .command("event")
      .description("Dynatrace events commands");

    new EventDeployCommand(event);
  }
}

export default EventCommand;
