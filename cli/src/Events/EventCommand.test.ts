import { Command } from "commander";
import EventCommand from "./EventCommand";
import EventDeployCommand from "./deploy/EventDeployCommand";

jest.mock("./deploy/EventDeployCommand");

it("EventCommand init", async () => {
  const mockProgram = new Command();
  const command = jest.spyOn(Command.prototype, "command");
  new EventCommand(mockProgram);
  expect(command).toBeCalledWith("event");
  expect(command).toBeCalledWith("send");
  expect(EventDeployCommand).toBeDefined();
});
