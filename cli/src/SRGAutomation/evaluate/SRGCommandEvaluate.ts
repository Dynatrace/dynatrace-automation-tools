import { Command, Option } from "commander";
import { BaseCommand } from "../../common/interfaces";
import AuthOptions from "../../dynatrace/AuthOptions";
import SRGEvaluateManager from "./SRGEvaluateManager";
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
    this.configSubCommand(subcommand);
  }

  configSubCommand(subcommand: Command) {
    const auth = new AuthOptions();
    //adds the options for oauth authentication
    auth.addOathOptions(subcommand);
    const timeOptions = this.getTimeframeOptions();
    const descriptionOptions = this.getDescriptionOptions();
    const additionalConfigOptions = this.getAdditionalConfigOptions();
    subcommand = this.addCommandOptions(
      subcommand,
      timeOptions,
      descriptionOptions,
      additionalConfigOptions
    );
    this.addAction(subcommand, auth);
  }

  addAction(subcommand: Command, auth: AuthOptions) {
    subcommand.action(async (options) => {
      const success = await SRGEvaluateManager.executeEvaluation(options, auth);

      if (!success) {
        subcommand.error("Execution stop", {
          exitCode: 1,
          code: "pipeline_execution_stop"
        });
      }
    });
  }

  getAdditionalConfigOptions(): Option[] {
    const options: Option[] = [];

    const stopOnFailure = new Option(
      "-s, --stop-on-failure [stopOnFailure]",
      "stop execution if evaluation fails"
    )
      .default("true")
      .env("SRG_EVALUATION_STOP_ON_FAILURE");
    const stopOnWarning = new Option(
      "-w, --stop-on-warning [stopOnWarning]",
      "stop execution if evaluation has warnings"
    )
      .default("false")
      .env("SRG_EVALUATION_STOP_ON_WARNING");

    const delayResults = new Option(
      "-d, --delay [delay]",
      "Delay time (in seconds) before sending the evaluation request to give time for the data to be ingested"
    )
      .default("90")
      .env("SRG_EVALUATION_DELAY");

    options.push(stopOnFailure);
    options.push(stopOnWarning);
    options.push(delayResults);
    return options;
  }

  getTimeframeOptions(): Option[] {
    const options: Option[] = [];
    const startTime = new Option(
      "--start-time [starttime]",
      "Evaluation start time"
    )
      .conflicts("timespan")
      .env("SRG_EVALUATION_START_TIME");
    const endTime = new Option("--end-time [endtime]", "Evaluation end time")
      .conflicts("timespan")
      .env("SRG_EVALUATION_END_TIME");
    const timeSpan = new Option(
      "--timespan [timespan]",
      "Grab the last X minutes of data for the evaluation"
    )
      .default("5")
      .conflicts(["start-time", "end-time"])
      .env("SRG_EVALUATION_TIMESPAN");
    options.push(startTime);
    options.push(endTime);
    options.push(timeSpan);
    return options;
  }

  getDescriptionOptions(): Option[] {
    const options: Option[] = [];
    const application = new Option(
      "--application [application]",
      "Application name"
    )
      .default("")
      .env("SRG_EVALUATION_APPLICATION");
    const service = new Option(
      "--service [service]",
      "Service name. i.e. backend-service, api-gateway, etc."
    )
      .env("SRG_EVALUATION_SERVICE")
      .makeOptionMandatory(true);

    const stage = new Option(
      "--stage [stage]",
      "Evaluation stage, can be dev, test,quality-gate, prod, etc."
    )
      .env("SRG_EVALUATION_STAGE")
      .makeOptionMandatory(true);
    const variables = new Option(
      "--variables <key1=value1,key2=value2>", 
      "Set SRG DQL variables as suggested. i.e. Image=backend-service,Tag=1.0.0",
    )
      .default("")
      .env("SRG_VARIABLES")    
    const provider = new Option(
      "--provider [provider]",
      "Provider of the request. i.e. github, jenkins, jenkins-production-1 etc."
    )
      .default("cicd")
      .env("SRG_EVALUATION_PROVIDER");
    const version = new Option(
      "--release-version [releaseVersion]",
      "Version of the app. for example v1.0.1"
    )
      .default("")
      .env("SRG_EVALUATION_VERSION");
    const buildId = new Option(
      "--buildId [buildId]",
      "Build ID. optional for reference in the evaluation. Can also be used for the Git commit ID"
    )
      .default("")
      .env("SRG_EVALUATION_BUILD_ID");

    options.push(application);
    options.push(service);
    options.push(stage);
    options.push(variables);
    options.push(provider);
    options.push(version);
    options.push(buildId);
    return options;
  }

  addCommandOptions(
    subcommand: Command,
    timeOptions: Option[],
    descriptionOptions: Option[],
    additionalConfigOptions: Option[]
  ): Command {
    timeOptions.forEach((option) => {
      subcommand.addOption(option);
    });
    descriptionOptions.forEach((option) => {
      subcommand.addOption(option);
    });
    additionalConfigOptions.forEach((option) => {
      subcommand.addOption(option);
    });
    return subcommand;
  }
}

export default SRGCommandEvaluate;
