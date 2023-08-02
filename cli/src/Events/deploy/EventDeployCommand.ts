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
          .env("DT_EVENT_DEPLOY_NAME")
          .makeOptionMandatory(true)
      )
      .addOption(
        new Option(
          "-e --entity-selector [entitySelector]",
          "Dynatrace entity selector expression : i.e.type(PROCESS_GROUP_INSTANCE),tag(easytravel)"
        )
          .env("DT_ENTITY_SELECTOR")
          .makeOptionMandatory(true)
      )
      .addOption(
        new Option(
          "--version [version]",
          "Deployment version. i.e. 1.0.0 or v1.0.0"
        )
          .env("DT_RELEASE_VERSION")
          .default("")
      )
      .addOption(
        new Option(
          "--project [project]",
          "Project name. i.e. simple-node-project."
        )
          .env("DT_PROJECT")
          .default("")
      )
      .addOption(
        new Option(
          "--source [source]",
          "Source name. i.e. Jenkins, Gitlab, etc."
        )
          .env("DT_SOURCE")
          .default("")
      )
      .addOption(
        new Option(
          "--release-stage [releaseStage]",
          "Release stage for the application. i.e. dev, staging, etc."
        )
          .env("DT_RELEASE_STAGE")
          .default("")
      )
      .addOption(
        new Option(
          "--release-product-name [releaseProductName]",
          "Release product name (useful when having multiple component of a single application) i.e. your-app-commercial-name."
        )
          .env("DT_RELEASE_PRODUCT")
          .default("")
      )
      .addOption(
        new Option(
          "--release-build-version [releaseBuildVersion]",
          "Release build version i.e. your internal build id (git commit id, cicd build id, etc)"
        )
          .env("DT_RELEASE_BUILD_VERSION")
          .default("")
      )
      .addOption(
        new Option("--approver [approver]", "Approver name for the deployment")
          .env("DT_APPROVER")
          .default("")
      )
      .addOption(
        new Option(
          "--ci-back-link [ciBackLink]",
          "CI/CD back link i.e. https://pipelines/easytravel/123"
        )
          .env("DT_CI_BACK_LINK")
          .default("")
      )
      .addOption(
        new Option("--gitcommit [gitcommit]", "Git commit id")
          .env("DT_GITCOMMIT")
          .default("")
      )
      .addOption(
        new Option(
          "--change-request [changeRequest]",
          "Change request code if applicable"
        )
          .env("DT_CHANGE_REQUEST")
          .default("")
      )
      .addOption(
        new Option(
          "--remediation-action-link [remediationActionLink]",
          "Remediation link for auto-remediation scenarios that you might want to implement"
        )
          .env("DT_REMEDIATION_ACTION_LINK")
          .default("")
      )
      .addOption(
        new Option(
          "--is-root-cause-relevant [isRootCauseRelevant]",
          "Set's if this would be relevant to a root cause analysis from Dynatrace Davis AI"
        )
          .env("DT_ROOT_CAUSE_RELEVANT")
          .default(true)
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
