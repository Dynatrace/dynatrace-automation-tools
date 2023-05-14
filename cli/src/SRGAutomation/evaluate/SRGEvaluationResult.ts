import Logger from "../../common/logger";

class SRGEvaluationResult {
  status: string;

  validationSummary: string;

  srgLink: string;

  constructor(event: any, dynatraceUrl: string) {
    this.status = event["validation.status"];
    this.validationSummary = event["validation.summary"];
    this.srgLink =
      dynatraceUrl +
      "/ui/apps/dynatrace.site.reliability.guardian/analysis/" +
      event["guardian.id"] +
      "?validationId=" +
      event["validation.id"];
  }

  PrintEvaluationResults(
    result: SRGEvaluationResult,
    stopOnFailure: string,
    stopOnWarning: string
  ) {
    Logger.info("#############################################");
    Logger.info("Evaluation results:");

    if (result.status == "fail" || result.status == "error") {
      Logger.error("  Status: " + result.status);

      Logger.verbose("Stop on warning is " + stopOnWarning + ".");
      Logger.verbose("Stop on failure is " + stopOnFailure + ".");

      if (stopOnFailure == "true" || stopOnWarning == "true") {
        process.exit(1);
      }
    } else {
      Logger.info("  Status: " + result.status);
    }

    Logger.info(
      " SLO summary (status of each SLO): \n " + result.validationSummary
    );
    Logger.info(" Evaluation Link: \n  " + result.srgLink);
    Logger.info("#############################################");
  }
}

export default SRGEvaluationResult;
