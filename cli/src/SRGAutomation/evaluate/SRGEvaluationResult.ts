import Logger from "../../common/logger";

export class SRGEvaluationResult {
  status: string;
  validationSummary: string;
  srgLink: string;
  guardianId: string;
  guardianName: string;

  constructor(event: EvalResultPayload, dynatraceUrl: string) {
    this.status = event["validation.status"];
    this.validationSummary = event["validation.summary"];
    this.srgLink =
      dynatraceUrl +
      "/ui/apps/dynatrace.site.reliability.guardian/analysis/" +
      event["guardian.id"] +
      "?validationId=" +
      event["validation.id"];
    this.guardianId = event["guardian.id"];
    this.guardianName = event["guardian.name"];
  }

  summarizeSLO() {
    Logger.info("Guardian Name: " + this.guardianName);
    Logger.verbose(" Guardian Id: " + this.guardianId);
    Logger.info(
      " SLO summary (status of each SLO): \n " + this.validationSummary
    );
    Logger.info(" Evaluation Link: \n  " + this.srgLink);
  }
}
export class EvaluationResultSummary {
  evaluations: SRGEvaluationResult[];
  constructor(evaluations: SRGEvaluationResult[]) {
    this.evaluations = evaluations;
  }
  printEvaluationResults(
    stopOnFailure: boolean,
    stopOnWarning: boolean
  ): boolean {
    Logger.verbose("Stop on warning is set to " + stopOnWarning + ".");
    Logger.verbose("Stop on failure is set to " + stopOnFailure + ".");
    Logger.info("#############################################");
    Logger.info("EVALUATION RESULTS");
    const status = this.showSummary(stopOnWarning, stopOnFailure);
    Logger.info("#############################################");
    this.printGuardianResults();

    return status;
  }
  showSummary(stopOnWarning: boolean, stopOnFailure: boolean): boolean {
    const totalEvaluations = this.evaluations.length;
    Logger.info("Total evaluations: " + totalEvaluations);
    const successEvaluations = this.evaluations.filter(
      (c) => c.status == "pass"
    );
    Logger.info("Success evaluations: " + successEvaluations.length);

    const warningEvaluations = this.evaluations.filter(
      (c) => c.status == "warning"
    );
    Logger.info("Warning evaluations: " + warningEvaluations.length);

    const failedEvaluations = this.evaluations.filter(
      (c) => c.status == "fail"
    );
    Logger.info("Failed evaluations: " + failedEvaluations.length);

    const errorEvaluations = this.evaluations.filter(
      (c) => c.status == "error"
    );

    if (errorEvaluations.length > 0) {
      Logger.error(
        "Error evaluations (Something is configured incorrectly in SRG): " +
          errorEvaluations.length
      );
    }

    return this.calculateFinalStatus(
      warningEvaluations,
      failedEvaluations,
      errorEvaluations,
      stopOnFailure,
      stopOnWarning
    );
  }

  calculateFinalStatus(
    warningEvaluations: SRGEvaluationResult[],
    failedEvaluations: SRGEvaluationResult[],
    errorEvaluations: SRGEvaluationResult[],
    stopOnFailure: boolean,
    stopOnWarning: boolean
  ): boolean {
    let status = true;

    if (failedEvaluations.length > 0 || errorEvaluations.length > 0) {
      //TODO: validate if warning status now exist
      if (stopOnFailure == true) {
        Logger.verbose("Exiting with code 1.");
        status = false;
      }
    } else if (warningEvaluations.length > 0) {
      if (stopOnWarning == true) {
        status = false;
      }
    }

    return status;
  }

  printGuardianResults() {
    Logger.info("Detailed results for each guardian");
    Logger.info("---------------------------------------------");
    this.evaluations.forEach((evaluation) => {
      evaluation.summarizeSLO();
      Logger.info("---------------------------------------------");
    });
  }
}
export type EvalResultPayload = {
  "validation.status": string;
  "validation.summary": string;
  "guardian.id": string;
  "validation.id": string;
  "guardian.name": string;
};
