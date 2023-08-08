import { Command } from "commander";

export interface BaseCommand {
  // eslint-disable-next-line no-unused-vars
  init(program: Command): void;
}
