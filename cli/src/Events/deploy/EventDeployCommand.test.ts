import { Command } from "commander";
import EventDeployCommand from "./EventDeployCommand";
import EventDeployManager from "./EventDeployManager";

jest.mock("../../dynatrace/AuthOptions");
jest.mock("./EventDeployManager");
describe("EventDeployCommand", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  it("Event deploy command created", async () => {
    const mockProgram = new Command();
    mockProgram.command = jest.fn().mockReturnValue(new Command());
    new EventDeployCommand(mockProgram);
    expect(mockProgram.command).toHaveBeenCalledWith("deploy");
  });
  it("Event deploy command add options", async () => {
    const mockProgram = new Command();
    mockProgram.command = jest.fn().mockReturnValue(new Command());
    const option = jest.spyOn(Command.prototype, "addOption");
    new EventDeployCommand(mockProgram);
    expect(option).toBeCalledTimes(14);
  });
  it("Event deploy command execute called", async () => {
    const mockProgram = new Command();
    mockProgram.command = jest.fn().mockReturnValue(new Command());
    const event = new EventDeployCommand(mockProgram);
    event.init(mockProgram);
    //execution is triggered
    expect(EventDeployManager.execute).toBeCalledTimes(0);
  });
});
