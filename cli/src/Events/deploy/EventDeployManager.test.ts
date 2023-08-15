import EventDeployManager from "./EventDeployManager";
import AuthOptions, { AuthOption } from "../../dynatrace/AuthOptions";
import EventDeploy from "./EventDeploy";
import DTApiV3 from "../../dynatrace/DTApiV3";

jest.mock("./EventDeploy");
jest.mock("../../dynatrace/DTApiV3");
describe("EventDeployManager", () => {
  it("send event ", async () => {
    const options = {};
    const auth = jest.fn() as unknown as AuthOptions;
    auth.setOptionsValuesForAuth = jest.fn();
    const api = new DTApiV3(auth);
    const send = jest.spyOn(EventDeploy.prototype, "send");
    // deploy.send = jest.fn();
    await EventDeployManager.execute(options, auth);
    expect(send).toHaveBeenCalledTimes(1);
  });
});
