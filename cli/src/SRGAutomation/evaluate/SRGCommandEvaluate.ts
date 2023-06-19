import { Argument, Command, Option } from "commander";
import { BaseCommand } from "../../common/interfaces";
import Logger from "../../common/logger";
import SRGEvaluate from "./SRGEvaluate";
import AuthOptions from "../../dynatrace/AuthOptions";
import DTApiV3 from "../../dynatrace/DTApiV3";
class SRGCommandEvaluate implements BaseCommand {
  constructor(mainCommand: Command) {
    this.init(mainCommand);
  }

  init(mainCommand: Command) {
    const subcommand = mainCommand
      .command("evaluate")
      .description(
        "executes a Site Reliability Guardian evaluation by sending a Dynatrace Biz Event. (check the docs for more info)"
      );
    const auth = new AuthOptions();
    //adds the options for oauth authentication
    auth.addOathOptions(subcommand);
    subcommand

      .addOption(
        new Option("--start-time [starttime]", "Evaluation start time")
          .conflicts("timespan")
          .env("SRG_EVALUATION_START_TIME")
      )
      .addOption(
        new Option("--end-time [endtime]", "Evaluation end time")
          .conflicts("timespan")

          .env("SRG_EVALUATION_END_TIME")
      )
      .addOption(
        new Option(
          "--timespan [timespan]",
          "Grab the last X minutes of data for the evaluation"
        )
          .default("5")
          .conflicts(["start-time", "end-time"])
          .env("SRG_EVALUATION_TIMESPAN")
      )
      .addOption(
        new Option("--application [application]", "Application name")
          .default("")
          .env("SRG_EVALUATION_APPLICATION")
      )
      .addOption(
        new Option(
          "--service [service]",
          "Service name. i.e. backend-service, api-gateway, etc."
        )
          .env("SRG_EVALUATION_SERVICE")
          .makeOptionMandatory(true)
      )
      .addOption(
        new Option(
          "--stage [stage]",
          "Evaluation stage, can be dev, test,quality-gate, prod, etc."
        )
          .env("SRG_EVALUATION_STAGE")
          .makeOptionMandatory(true)
      )
      .addOption(
        new Option(
          "--provider [provider]",
          "Provider of the request. i.e. github, jenkins, jenkins-production-1 etc."
        )
          .default("cicd")
          .env("SRG_EVALUATION_PROVIDER")
      )
      .addOption(
        new Option(
          "--version [version]",
          "Version of the app. v1.0.1 for example"
        )
          .default("")
          .env("SRG_APP_VERSION")
      )
      .addOption(
        new Option(
          "--buildId [buildId]",
          "Build ID. optional for reference in the evaluation. Can also be used for the Git commit ID"
        )
          .default("")
          .env("SRG_EVALUATION_BUILD_ID")
      )
      .addOption(
        new Option(
          "-s, --stop-on-failure [stopOnFailure]",
          "stop execution if evaluation fails"
        )
          .default("true")
          .env("SRG_EVALUATION_STOP_ON_FAILURE")
      )
      .addOption(
        new Option(
          "-w, --stop-on-warning [stopOnWarning]",
          "stop execution if evaluation has warnings"
        )
          .default("false")
          .env("SRG_EVALUATION_STOP_ON_WARNING")
      )
      .addOption(
        new Option(
          "-d, --delay [delay]",
          "Delay time (in seconds) before sending the evaluation request to give time for the data to be ingested"
        )
          .default("90")
          .env("SRG_EVALUATION_DELAY")
      )
      .action(async (options) => {
        const success = await executeEvaluation(options, auth);

        if (!success) {
          mainCommand.error("Execution stop", {
            exitCode: 1,
            code: "pipeline_execution_stop",
          });
        }
      });
  }
}

async function executeEvaluation(
  options: { [key: string]: string },
  auth: AuthOptions
): Promise<boolean> {
  let res = false;

  try {
    Logger.info(
      "Executing SRG evaluation for service " +
        options["service"] +
        " in stage " +
        options["stage"]
    );
    //sets the options values for authentication that the user provided
    auth.setOptionsValuesForAuth(options);
    const api = new DTApiV3(auth);
    const manager = new SRGEvaluate(api);
    await manager.triggerEvaluation(options);
    res = true;
  } catch (err) {
    Logger.error("While executing SRG evaluation ", err);
  }

  return res;
}

export default SRGCommandEvaluate;
