import { Command } from "commander";
import { BaseCommand } from "../../common/interfaces";
import Logger from "../../common/logger";
import SRGConfigure from "./SRGConfigure";
import AuthOptions from "../../dynatrace/AuthOptions";
class SRGCommandConfigure implements BaseCommand {
  constructor(mainCommand: Command) {
    this.init(mainCommand);
  }

  init(mainCommand: Command) {
    const subcommand = mainCommand.command("configure");
    const options = new AuthOptions();
    options.addOathOptions(subcommand);
    subcommand
      .argument("<application>", "application name")
      .description("Configures a new SRG evaluation")
      .action(async (appId, options) => {
        const success = await configureEvaluation(appId, options);
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
    await manager.configureEvaluation(
      options.dynatraceUrlGen3,
      options.accountUrn,
      options.clientId,
      options.secret,
      options.ssoUrl,
      appId
    );
    res = true;
  } catch (err) {
    Logger.error("Error configuring SRG evaluation ", err);
  }
  return res;
}
export default SRGCommandConfigure;
