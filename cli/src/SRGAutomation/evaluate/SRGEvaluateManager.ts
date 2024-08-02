import Logger from "../../common/logger";
import AuthOptions, { AuthOption } from "../../dynatrace/AuthOptions";
import DTApiV3 from "../../dynatrace/DTApiV3";
import SRGEvaluate from "./SRGEvaluate";
import SRGEvaluateMultipleSRG from "./SRGEvaluateMultipleSRG";
import { EvaluationResultSummary } from "./SRGEvaluationResult";

class SRGEvaluateManager {
  constructor() {}
  public async executeEvaluation(
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
      auth.setOptionsValuesForAuth(options as AuthOption);
      const api = new DTApiV3(auth);
      const multipleGuardians =
        options["multipleGuardians"].toString().toLowerCase() === "true";
      const summary = await this.requestEvaluation(
        multipleGuardians,
        api,
        options
      );
      const stopOnFailure =
        options["stopOnFailure"].toString().toLowerCase() === "true";
      const stopOnWarning =
        options["stopOnWarning"].toString().toLowerCase() === "true";
      res = summary.printEvaluationResults(stopOnFailure, stopOnWarning);
    } catch (err) {
      Logger.error("While executing SRG evaluation ", err);
    }

    return res;
  }
  async requestEvaluation(
    multipleGuardians: boolean,
    api: DTApiV3,
    options: { [key: string]: string }
  ): Promise<EvaluationResultSummary> {
    if (multipleGuardians) {
      return this.multipleEvaluation(api, options);
    } else {
      return await this.singleEvaluation(api, options);
    }
  }
  async singleEvaluation(
    api: DTApiV3,
    options: { [key: string]: string }
  ): Promise<EvaluationResultSummary> {
    const evaluate = new SRGEvaluate(api);
    const event = evaluate.getCloudEvent(options);
    await evaluate.waitForData(options["delay"]);
    await evaluate.sendEvent(event);
    return await evaluate.waitForEvaluationResult(
      event,
      options["<dynatrace_url_gen3>"]
    );
  }
  async multipleEvaluation(
    api: DTApiV3,
    options: { [key: string]: string }
  ): Promise<EvaluationResultSummary> {
    //TODO: implement multiple evaluation
    const evaluate = new SRGEvaluateMultipleSRG(api);
    const event = evaluate.getCloudEvent(options);
    const eventTimeBeforeExecution = new Date();
    await evaluate.waitForData(options["delay"]);
    await evaluate.sendEvent(event);
    await evaluate.waitForWorkflowsDone(eventTimeBeforeExecution);
    return await evaluate.collectEvaluationResults(
      event,
      options["<dynatrace_url_gen3>"]
    );
  }
}
export default SRGEvaluateManager;
