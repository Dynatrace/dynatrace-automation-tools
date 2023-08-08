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
    expect(mockProgram.command).toHaveBeenCalledWith(
      "evaluate",
      "executes a Site Reliability Guardian evaluation by sending a Dynatrace Biz Event. (check the docs for more info)"
    );
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

    //12 options are added
    expect(addOption).toHaveBeenCalledTimes(12);
    const timeOptions = getTimeframeOptions.mock.results[0];
    const descriptionOptions = getDescriptionOptions.mock.results[0];
    const additionalConfigOptions = getAdditionalConfigOptions.mock.results[0];
    expect(timeOptions.value).toHaveLength(3);
    expect(descriptionOptions.value).toHaveLength(6);
    expect(additionalConfigOptions.value).toHaveLength(3);
  });
  it("Evaluate command has action", async () => {
    const mockProgram = new Command();
    mockProgram.action = jest.fn();
    new SRGCommandEvaluate(mockProgram);
    expect(mockProgram.action).toHaveBeenCalledTimes(1);
  });
});
