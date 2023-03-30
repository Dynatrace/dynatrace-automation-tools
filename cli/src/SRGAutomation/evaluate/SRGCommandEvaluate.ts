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
        new Option(
          "--service [service]",
          "Service name. i.e. backend-service, api-gateway, etc."
        )
          .default("")
          .env("SRG_EVALUATION_SERVICE")
      )
      .addOption(
        new Option(
          "--stage [stage]",
          "Evaluation stage, can be dev, test,quality-gate, prod, etc."
        )
          .default("")
          .env("SRG_EVALUATION_STAGE")
      )
      .addOption(
        new Option(
          "--source [source]",
          "Source of the request. i.e. github, jenkins, jenkins-production-1 etc."
        )
          .default("cicd")
          .env("SRG_EVALUATION_SOURCE")
      )
      .addOption(
        new Option(
          "--gitCommitId [gitCommitId]",
          "Git commit ID. optional for reference in the evaluation."
        )
          .default("")
          .env("SRG_EVALUATION_GIT_COMMIT_ID")
      )
      .addOption(
        new Option(
          "--labels [labels]",
          "Labels. Additional properties to send with the evaluation. Format using comma separated values like key1=value1,key2=value2"
        )
          .default("")
          .env("SRG_EVALUATION_LABELS")
      )
      .addOption(
        new Option(
          "-s, --stop-on-failure",
          "stop execution if evaluation fails"
        )
          .default(true)
          .env("SRG_EVALUATION_STOP_ON_FAILURE")
      )
      .addOption(
        new Option(
          "-w, --stop-on-warning",
          "stop execution if evaluation has warnings"
        )
          .default(false)
          .env("SRG_EVALUATION_STOP_ON_WARNING")
      )
      .addArgument(new Argument("appName", "Application name").argRequired())
      .action(async (arg, options) => {
        const success = await executeEvaluation(arg, options, auth);

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
  appName: any,
  options: { [key: string]: string },
  auth: AuthOptions
): Promise<boolean> {
  let res = false;

  try {
    Logger.info("Executing SRG evaluation for " + appName);
    //sets the options values for authentication that the user provided
    auth.setOptionsValuesForAuth(options);
    const api = new DTApiV3(auth);
    const manager = new SRGEvaluate(api);
    await manager.triggerEvaluation(appName, options);
    res = true;
  } catch (err) {
    Logger.error("While executing SRG evaluation ", err);
  }

  return res;
}

export default SRGCommandEvaluate;
