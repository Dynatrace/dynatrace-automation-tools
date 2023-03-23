import { Command, Option } from "commander";
import { BaseCommand } from "../../common/interfaces";
import Logger from "../../common/logger";
import SRGConfigure from "./SRGConfigure";
import AuthOptions from "../../dynatrace/AuthOptions";
import DTApiV3 from "../../dynatrace/DTApiV3";
class SRGCommandConfigure implements BaseCommand {
  constructor(mainCommand: Command) {
    this.init(mainCommand);
  }

  init(mainCommand: Command) {
    const subcommand = mainCommand
      .command("configure")
      .description(
        "Select a template (i.e --template=performance) and provide the required values to configure a new SRG evaluation or use a custom template with --template-path option."
      );
    const auth = new AuthOptions();
    //adds the options for oauth authentication
    auth.addOathOptions(subcommand);
    subcommand
      .addOption(
        new Option("--template <template>", "Default template type")
          .choices(["performance", "security", "cost"])
          .env("SRG_TEMPLATE")
          .conflicts("template-path")
      )
      .addOption(
        new Option(
          "--template-path <templatePath>",
          "For custom templates provide the local path"
        )
          .conflicts("template")
          .env("SRG_TEMPLATE_PATH")
      )
      .action(async (options) => {
        const success = await configureEvaluation(options, auth);

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
  options: { [key: string]: string },
  auth: AuthOptions
): Promise<boolean> {
  let res = false;

  try {
    Logger.info("Configuring SRG evaluation with template " + options);
    //sets the options values for authentication that the user provided
    auth.setOptionsValuesForAuth(options);
    const api = new DTApiV3(auth);
    const manager = new SRGConfigure(api);
    await manager.configureEvaluation(options);
    res = true;
  } catch (err) {
    Logger.error("While configuring SRG evaluation ", err);
  }

  return res;
}

export default SRGCommandConfigure;
