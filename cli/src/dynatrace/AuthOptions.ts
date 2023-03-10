import { Command, Option } from "commander";

//Abstracts the authentication options for the CLI. Common class since all Dynatrace API interactions would use the same authentication options.
class AuthOptions {
  addClassicTokenOptions(mainCommand: Command): Command {
    mainCommand
      .addOption(
        new Option(
          "-u, --dynatrace-url [dynatrace-url]",
          "dynatrace environment URL"
        )
          .env("DYNATRACE_URL")
          .makeOptionMandatory()
      )
      .addOption(
        new Option("-t, --dynatrace-token [dynatrace-token]", "dynatrace token")
          .env("DYNATRACE_TOKEN")
          .makeOptionMandatory()
      );
    return mainCommand;
  }

  addOathOptions(mainCommand: Command): Command {
    mainCommand
      .addOption(
        new Option(
          "-a, --account-urn [account_urn]",
          "Account URN i.e. urn:dtaccount:xxxx-xxxx-xxxx-xxx. Environment variable ACCOUNT_URN"
        )
          .env("ACCOUNT_URN")
          .makeOptionMandatory()
      )
      .addOption(
        new Option(
          "-u3, --dynatrace-url-gen3 [dynatrace_url_gen3]",
          "dynatrace environment URL. Environment variable DYNATRACE_URL_GEN3"
        )
          .env("DYNATRACE_URL_GEN3")
          .makeOptionMandatory()
      )
      .addOption(
        new Option(
          "-c, --client-id [client_id]",
          "Dynatrace Client ID i.e dt0s02.xxx. Environment variable DYNATRACE_CLIENT_ID"
        )
          .env("DYNATRACE_CLIENT_ID")
          .makeOptionMandatory()
      )
      .addOption(
        new Option(
          "-s, --secret [secret]",
          "Dynatrace Oauth secret i.e. dt0s02.xxxxxxxx. Environment variable DYNATRACE_SECRET"
        )
          .env("DYNATRACE_SECRET")
          .makeOptionMandatory()
      )
      .addOption(
        new Option(
          "--ssoUrl [sso_url]",
          "Dynatrace SSO Oauth URL. Defaults to https://sso.dynatrace.com/sso/oauth2/token. Environment variable DYNATRACE_SSO_URL"
        )
          .env("DYNATRACE_SSO_URL")
          .default("https://sso.dynatrace.com/sso/oauth2/token")
      );
    return mainCommand;
  }
}

export default AuthOptions;
