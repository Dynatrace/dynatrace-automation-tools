import AuthOptions from "../src/dynatrace/AuthOptions";
import DTApiV3 from "../src/dynatrace/DTApiV3";

describe("DTApiV3", () => {
  it("should be defined", async () => {
    const authOptions: AuthOptions = new AuthOptions();
    const authValues = {
      "<account_urn>": process.env.ACCOUNT_URN ?? "",
      "<dynatrace_url_gen3>": process.env.DYNATRACE_URL_GEN3 ?? "",
      "<client_id>": process.env.DYNATRACE_CLIENT_ID ?? "",
      //"<client_secret>": process.env.DYNATRACE_SECRET ?? "",
      "<client_secret>": "dummy",
      "<sso_url>": process.env.DYNATRACE_SSO_URL ?? "",
    };
    authOptions.setOptionsValuesForAuth(authValues);
    const api = new DTApiV3(authOptions);

    // const f = async () => {
    //   const res = await api.EventSend({ demo: "demo" });
    // };

    // expect(f).toThrowError();
  });
});
