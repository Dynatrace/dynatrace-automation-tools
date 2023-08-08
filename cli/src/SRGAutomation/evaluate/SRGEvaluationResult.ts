import Logger from "../../common/logger";

class SRGEvaluationResult {
  status: string;

  validationSummary: string;

  srgLink: string;

  constructor(event: EvalResultPayload, dynatraceUrl: string) {
    this.status = event["validation.status"];
    this.validationSummary = event["validation.summary"];
    this.srgLink =
      dynatraceUrl +
      "/ui/apps/dynatrace.site.reliability.guardian/analysis/" +
      event["guardian.id"] +
      "?validationId=" +
      event["validation.id"];
  }

  printEvaluationResults(
    stopOnFailure: boolean,
    stopOnWarning: boolean
  ): boolean {
    let status = true;
    Logger.info("#############################################");
    Logger.info("Evaluation results:");

    if (this.status == "fail" || this.status == "error") {
      Logger.error("Status: " + this.status);

      this.summarizeSLO();

      Logger.verbose("Stop on warning is " + stopOnWarning + ".");
      Logger.verbose("Stop on failure is " + stopOnFailure + ".");

      //TODO: validate if warning status now exist
      if (stopOnFailure == true || stopOnWarning == true) {
        Logger.verbose("Exiting with code 1.");
        status = false;
      }
    } else {
      Logger.info("  Status: " + this.status);
    }

    this.summarizeSLO();
    return status;
  }

  summarizeSLO() {
    Logger.info(
      " SLO summary (status of each SLO): \n " + this.validationSummary
    );
    Logger.info(" Evaluation Link: \n  " + this.srgLink);
    Logger.info("#############################################");
  }
}
export type EvalResultPayload = {
  "validation.status": string;
  "validation.summary": string;
  "guardian.id": string;
  "validation.id": string;
};

export default SRGEvaluationResult;
