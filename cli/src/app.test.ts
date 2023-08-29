import figlet from "figlet";
import { initialize } from "./app";
import { Command } from "commander";
import SRGCommand from "./SRGAutomation/SRGCommand";
import EventCommand from "./Events/EventCommand";

jest.mock("./SRGAutomation/SRGCommand");
jest.mock("./Events/EventCommand");
jest.mock("figlet");

beforeAll(() => {
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  jest.spyOn(console, "log").mockImplementation(() => {});
  process.argv = [""];
});

beforeEach(() => {
  process.argv = [""];
});
afterAll(() => {
  jest.restoreAllMocks();
});

describe("initialize", () => {
  it("Program should be created", async () => {
    const command = await initialize("0.0.1", ["-h"]);
    expect(command).toBeInstanceOf(Command);
    expect(command.name()).toBe("Dynatrace automation tools CLI");
  });
  it("should register SRGCommand and EventCommand with the program", async () => {
    const command = await initialize("0.0.1", ["-h"]);
    expect(figlet.textSync).toHaveBeenCalledWith("DT automation");
    expect(SRGCommand).toHaveBeenCalledWith(command);
    expect(EventCommand).toHaveBeenCalledWith(command);
  });
});
