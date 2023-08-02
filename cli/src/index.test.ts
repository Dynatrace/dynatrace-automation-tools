import figlet from "figlet";
import {
  createCLIProgram,
  registerCommands,
  printBanner,
  initialize,
} from "./index";
import { Command } from "commander";
import SRGCommand from "./SRGAutomation/SRGCommand";
import EventCommand from "./Events/EventCommand";
// import { Command } from "commander";
// Mocks
jest.mock("figlet");
jest.mock("./SRGAutomation/SRGCommand");
jest.mock("./Events/EventCommand");

describe("printBanner", () => {
  it("should print the DT automation banner", () => {
    printBanner();
    expect(figlet.textSync).toHaveBeenCalledWith("DT automation");
  });
});
it("Code should be 0", async () => {
  const result = await initialize("0.0.1", ["-h"]);
  expect(result).toBeInstanceOf(Command);
});

describe("createCLIProgram", () => {
  it("should create a new CLI program", () => {
    const program = createCLIProgram("0.0.1");
    expect(program).toBeInstanceOf(Command);
  });
});

describe("registerCommands", () => {
  it("should register SRGCommand and EventCommand with the program", () => {
    const mockProgram = new Command();
    registerCommands(mockProgram);
    expect(SRGCommand).toHaveBeenCalledWith(mockProgram);
    expect(EventCommand).toHaveBeenCalledWith(mockProgram);
  });
});
