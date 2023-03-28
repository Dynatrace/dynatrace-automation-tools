import { Command, Option } from "commander";
import DTOAuth from "../common/oauth";
import Logger from "../common/logger";
import axios, { AxiosInstance } from "axios";
//Abstracts the authentication options for the CLI. Common class since all Dynatrace API interactions would use the same authentication options.

class AuthOptions {
  private options: any;

  addOathOptions(mainCommand: Command): Command {
    mainCommand
      .addOption(
        new Option(
          "<account_urn>",
          "Account URN i.e. urn:dtaccount:xxxx-xxxx-xxxx-xxx"
        )
          .env("ACCOUNT_URN")
          .makeOptionMandatory()
      )
      .addOption(
        new Option("<dynatrace_url_gen3>", "dynatrace environment URL")
          .env("DYNATRACE_URL_GEN3")
          .makeOptionMandatory()
      )
      .addOption(
        new Option("<client_id>", "Dynatrace Client ID i.e dt0s02.xxx")
          .env("DYNATRACE_CLIENT_ID")
          .makeOptionMandatory()
      )
      .addOption(
        new Option(
          "<client_secret>",
          "Dynatrace Oauth secret i.e. dt0s02.xxxxxxxx"
        )
          .env("DYNATRACE_SECRET")
          .makeOptionMandatory()
      )
      .addOption(
        new Option(
          "<sso_url>",
          "Dynatrace SSO Oauth URL. Defaults to https://sso.dynatrace.com/sso/oauth2/token"
        )
          .env("DYNATRACE_SSO_URL")
          .default("https://sso.dynatrace.com/sso/oauth2/token")
      );
    return mainCommand;
  }

  setOptionsValuesForAuth(options: { [key: string]: string }) {
    this.options = options;
  }

  getGen3ClientWithScopeRequest = async (scope: string) => {
    const oauth = new DTOAuth(
      this.options["<sso_url>"],
      this.options["<client_id>"],
      this.options["<client_secret>"],
      this.options["<account_urn>"]
    );

    Logger.debug("DTApiV3: Requesting scoped token for " + scope);
    const token = await oauth.GetScopedToken(scope);
    const axiosApiInstance: AxiosInstance = axios.create();
    axiosApiInstance.defaults.headers.common["Authorization"] =
      "Bearer " + token;
    axiosApiInstance.defaults.headers.common["Content-Type"] =
      "application/json";
    axiosApiInstance.defaults.baseURL = this.options["<dynatrace_url_gen3>"];
    return axiosApiInstance;
  };
}

export default AuthOptions;
