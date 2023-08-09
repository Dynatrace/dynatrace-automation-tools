import DTApiV3 from "../../dynatrace/DTApiV3";
import EventDeploy, { EventDeployPayload } from "./EventDeploy";
jest.mock("../../dynatrace/DTApiV3");
describe("EventDeploy", () => {
  it("should be defined", async () => {
    const mockApi = jest.fn() as unknown as DTApiV3;
    mockApi.EventSend = jest.fn();

    const manager = new EventDeploy(mockApi);
    manager.send({ demo: "demo" });
  });
  it("should have required properties mapped", () => {
    const event = new EventDeployPayload({
      name: "test",
      entitySelector: "test-selector",
    });
    expect(event.title).toBe("test");
    expect(event.entitySelector).toBe("test-selector");
  });
});
