import AuthOptions from "../src/dynatrace/AuthOptions";
import DTApiV3 from "../src/dynatrace/DTApiV3";

describe("DTApiV3", () => {
  it("should be defined", async () => {
    const authOptions: AuthOptions = new AuthOptions();
    const authValues = {
      "<account_urn>": process.env.ACCOUNT_URN ?? "",
      "<dynatrace_url_gen3>": process.env.DYNATRACE_URL_GEN3 ?? "",
      "<client_id>": process.env.DYNATRACE_CLIENT_ID ?? "",
      "<client_secret>": process.env.DYNATRACE_SECRET ?? "",
      "<sso_url>": process.env.DYNATRACE_SSO_URL ?? ""
    };
    authOptions.setOptionsValuesForAuth(authValues);
    const api = new DTApiV3(authOptions);
    let res;

    try {
      res = await api.BizEventSend({
        demo: "demo info",
        id: "1",
        "event.type": "com.bizevent.single",
        "event.provider": "com.demo"
      });
    } catch (error: any) {
      console.log(error);
    }

    expect(res).toBeDefined();
    console.log(process.env.ACCOUNT_URN);
    expect(process.env.ACCOUNT_URN).toBeDefined();
    expect(authOptions.options["<account_urn>"]).toBe(process.env.ACCOUNT_URN);
  });
});
