import AuthOptions, { AuthOption } from "./AuthOptions";
import { Command } from "commander";
import DTOAuth from "../common/oauth";

jest.mock("../common/oauth");
jest.mock("../common/logger");

describe("AuthOptions", () => {
  const addOption = jest.spyOn(Command.prototype, "addOption");
  it("should be defined", () => {
    const mockProgram = new Command();
    const auth = new AuthOptions();
    auth.addOathOptions(mockProgram);
    expect(addOption).toHaveBeenCalledTimes(5);
  });
  it("should have options", () => {
    const auth = new AuthOptions();
    const opts: AuthOption = {
      "<account_urn>": "a",
      "<dynatrace_url_gen3>": "b",
      "<client_id>": "c",
      "<client_secret>": "d",
      "<sso_url>": "u"
    };
    auth.setOptionsValuesForAuth(opts);
    expect(auth.options).toEqual(opts);
  });

  it("should have options", async () => {
    const getToken = jest
      .spyOn(DTOAuth.prototype, "GetScopedToken")
      .mockResolvedValue("token");

    const auth = new AuthOptions();
    await auth.getGen3ClientWithScopeRequest("automation:workflows:write");
    expect(getToken).toBeCalledWith("automation:workflows:write");
  });
});
