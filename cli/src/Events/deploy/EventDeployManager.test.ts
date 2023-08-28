import EventDeployManager from "./EventDeployManager";
import AuthOptions from "../../dynatrace/AuthOptions";
import EventDeploy from "./EventDeploy";

jest.mock("./EventDeploy");
jest.mock("../../dynatrace/DTApiV3");
describe("EventDeployManager", () => {
  it("send event ", async () => {
    const options = {};
    const auth = jest.fn() as unknown as AuthOptions;
    auth.setOptionsValuesForAuth = jest.fn();

    const send = jest.spyOn(EventDeploy.prototype, "send");

    await EventDeployManager.execute(options, auth);
    expect(send).toHaveBeenCalledTimes(1);
  });
});
