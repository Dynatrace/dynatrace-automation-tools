import { Command } from "commander";
import SRGCommand from "./SRGCommand";

jest.mock("commander");
jest.mock("./evaluate/SRGCommandEvaluate");

it("SRGCommand init", async () => {
  const mockProgram = new Command();
  // mockProgram.command = jest.fn().mockReturnValue(new Command());
  new SRGCommand(mockProgram);
  expect(mockProgram.command).toHaveBeenCalledWith(
    "srg",
    "Site Reliability Guardian commands."
  );
});
