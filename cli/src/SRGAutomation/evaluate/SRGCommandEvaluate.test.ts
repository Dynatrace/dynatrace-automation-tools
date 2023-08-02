import { Command } from "commander";
import SRGCommandEvaluate from "./SRGCommandEvaluate";

//jest.mock("commander");
jest.mock("../../dynatrace/AuthOptions");

it("SRGCommand evaluate", async () => {
  const mockProgram = new Command();
  mockProgram.command = jest.fn().mockReturnValue(new Command());
  new SRGCommandEvaluate(mockProgram);
  expect(mockProgram.command).toHaveBeenCalledWith(
    "evaluate",
    "executes a Site Reliability Guardian evaluation by sending a Dynatrace Biz Event. (check the docs for more info)"
  );
});
