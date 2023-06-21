import { Command, Option } from "commander";
import { BaseCommand } from "../../common/interfaces";
import Logger from "../../common/logger";
import EventDeploy from "./EventDeploy";
import AuthOptions from "../../dynatrace/AuthOptions";
import DTApiV3 from "../../dynatrace/DTApiV3";
class EventDeployCommand implements BaseCommand {
  constructor(mainCommand: Command) {
    this.init(mainCommand);
  }

  init(mainCommand: Command) {
    const subcommand = mainCommand
      .command("deploy")
      .description("Sends a deployment event to Dynatrace");
    const auth = new AuthOptions();
    //adds the options for oauth authentication
    auth.addOathOptions(subcommand);
    subcommand

      .addOption(
        new Option(
          "-n --name [name]",
          "Deployment event name. i.e. App-simplenode-Release-1.0.0"
        )
          .env("EVENT_DEPLOY_NAME")
          .makeOptionMandatory(true)
      )
      .addOption(
        new Option(
          "-e --entity-selector [entitySelector]",
          "Dynatrace entity selector expression : i.e.type(PROCESS_GROUP_INSTANCE),tag(easytravel)"
        )
          .env("EVENT_ENTITY_SELECTOR")
          .makeOptionMandatory(true)
      )
      .addOption(
        new Option(
          "--version [version]",
          "Deployment version. i.e. 1.0.0. If you have defined SRG_APP_VERSION environment variable, it will be used as default value"
        )
          .env("EVENT_DEPLOY_VERSION")
          .default(process.env.SRG_APP_VERSION || "")
      )
      .action(async (options) => {
        const success = await execute(options, auth);

        if (!success) {
          mainCommand.error("Execution stop", {
            exitCode: 1,
            code: "pipeline_execution_stop",
          });
        }
      });
  }
}

async function execute(
  options: { [key: string]: string },
  auth: AuthOptions
): Promise<boolean> {
  let res = false;

  try {
    Logger.info("Sending deployment event " + options["name"]);
    //sets the options values for authentication that the user provided
    auth.setOptionsValuesForAuth(options);
    const api = new DTApiV3(auth);
    const manager = new EventDeploy(api);
    await manager.send(options);
    res = true;
  } catch (err) {
    Logger.error("While sending deployment event ", err);
  }

  return res;
}

export default EventDeployCommand;
