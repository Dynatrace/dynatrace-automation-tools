import { Command, Option } from "commander";
import { BaseCommand } from "../../common/interfaces";
import Logger from "../../common/logger";
import SRGConfigure from "./SRGConfigure";

class SRGCommandConfigure implements BaseCommand {
  constructor(mainCommand: Command) {
    this.init(mainCommand);
  }

  init(mainCommand: Command) {
    mainCommand
      .command("configure")
      .argument("<application>", "application name")
      .description("Configures a new SRG evaluation")
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
      )
      .action(async (appId, options, command) => {
        let success = await configureEvaluation(appId, options);
        if (!success) {
          mainCommand.error("Execution stop", {
            exitCode: 1,
            code: "pipeline_execution_stop",
          });
        }
      });
  }
}

async function configureEvaluation(
  appId: string,
  options: any
): Promise<boolean> {
  let res = false;
  try {
    Logger.info("Configuring SRG evaluation");
    const manager = new SRGConfigure();
    let res = await manager.configureEvaluation(
      options.dynatraceUrlGen3,
      options.accountUrn,
      options.clientId,
      options.secret,
      options.ssoUrl,
      appId
    );
  } catch (err) {
    Logger.error("Error configuring SRG evaluation ", err);
  }
  return res;
}
export default SRGCommandConfigure;
