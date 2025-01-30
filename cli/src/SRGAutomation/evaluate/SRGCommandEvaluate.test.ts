import { Command } from "commander";
import SRGCommandEvaluate from "./SRGCommandEvaluate";
jest.mock("../../dynatrace/AuthOptions");
jest.mock("../../dynatrace/DTApiV3");
jest.mock("./SRGEvaluateManager");

describe("SRGCommandEvaluate", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("Evaluate command created", async () => {
    const mockProgram = new Command();
    mockProgram.command = jest.fn().mockReturnValue(new Command());
    new SRGCommandEvaluate(mockProgram);
    expect(mockProgram.command).toHaveBeenCalledWith("evaluate");
  });
  const addOption = jest.spyOn(Command.prototype, "addOption");
  const getAdditionalConfigOptions = jest.spyOn(
    SRGCommandEvaluate.prototype,
    "getAdditionalConfigOptions"
  );
  const getDescriptionOptions = jest.spyOn(
    SRGCommandEvaluate.prototype,
    "getDescriptionOptions"
  );
  const getTimeframeOptions = jest.spyOn(
    SRGCommandEvaluate.prototype,
    "getTimeframeOptions"
  );
  it("Evaluate command has options", async () => {
    const mockProgram = new Command();
    mockProgram.command = jest.fn().mockReturnValue(new Command());
    new SRGCommandEvaluate(mockProgram);

    //13 options are added
    expect(addOption).toHaveBeenCalledTimes(13);
    const timeOptions = getTimeframeOptions.mock.results[0];
    const descriptionOptions = getDescriptionOptions.mock.results[0];
    const additionalConfigOptions = getAdditionalConfigOptions.mock.results[0];
    expect(timeOptions.value).toHaveLength(3);
    expect(descriptionOptions.value).toHaveLength(7);
    expect(additionalConfigOptions.value).toHaveLength(3);
  });
  it("Evaluate command has action", async () => {
    const mockProgram = new Command();
    mockProgram.command = jest.fn().mockReturnValue(new Command());

    new SRGCommandEvaluate(mockProgram);
    expect(mockProgram.command).toHaveBeenCalledTimes(1);
  });
  it("Evaluate parsing function transforms space separated strings in array", async () => {
    const mockProgram = new Command();
    mockProgram.command = jest.fn().mockReturnValue(new Command());

    const SRGCommandEvaluateInstance = new SRGCommandEvaluate(mockProgram);
    const parsedInput = SRGCommandEvaluateInstance.parseExtraVarsVariadicInput(
      "variadic input parts"
    );
    expect(parsedInput).toEqual(["variadic", "input", "parts"]);
  });
  it("Evaluate parsing function keeps previous inputs", async () => {
    const mockProgram = new Command();
    mockProgram.command = jest.fn().mockReturnValue(new Command());

    const SRGCommandEvaluateInstance = new SRGCommandEvaluate(mockProgram);
    const parsedInput = SRGCommandEvaluateInstance.parseExtraVarsVariadicInput(
      "next input parts",
      ["already", "parsed", "input"]
    );
    expect(parsedInput).toEqual([
      "already",
      "parsed",
      "input",
      "next",
      "input",
      "parts"
    ]);
  });
});
