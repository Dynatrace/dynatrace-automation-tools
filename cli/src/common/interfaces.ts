import { Command } from "commander";

export interface BaseCommand {
  init(program: Command): void;
}
