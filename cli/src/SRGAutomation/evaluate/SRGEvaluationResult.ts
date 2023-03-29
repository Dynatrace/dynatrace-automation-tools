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
}

export default SRGEvaluationResult;
