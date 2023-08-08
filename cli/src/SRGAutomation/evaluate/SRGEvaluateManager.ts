import Logger from "../../common/logger";
import AuthOptions from "../../dynatrace/AuthOptions";
import DTApiV3 from "../../dynatrace/DTApiV3";
import SRGEvaluate from "./SRGEvaluate";

class SRGEvaluateManager {
  public static async executeEvaluation(
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

      const evaluate = new SRGEvaluate(api);
      const event = evaluate.getCloudEvent(options);
      await evaluate.waitForData(options["delay"]);
      await evaluate.sendEvent(event);
      const result = await evaluate.waitForEvaluationResult(
        event,
        options["<dynatrace_url_gen3>"]
      );
      const stopOnFailure = options["stopOnFailure"].toString() === "true";
      const stopOnWarning = options["stopOnWarning"].toString() === "true";
      result.PrintEvaluationResults(result, stopOnFailure, stopOnWarning);

      res = true;
    } catch (err) {
      Logger.error("While executing SRG evaluation ", err);
    }

    return res;
  }
}
export default SRGEvaluateManager;
