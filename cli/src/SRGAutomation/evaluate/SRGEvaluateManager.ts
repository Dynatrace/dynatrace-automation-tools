import Logger from "../../common/logger";
import AuthOptions, { AuthOption } from "../../dynatrace/AuthOptions";
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
      auth.setOptionsValuesForAuth(options as AuthOption);
      const api = new DTApiV3(auth);

      const evaluate = new SRGEvaluate(api);
      const event = evaluate.getCloudEvent(options);
      await evaluate.waitForData(options["delay"]);
      await evaluate.sendEvent(event);
      const result = await evaluate.waitForEvaluationResult(
        event,
        options["<dynatrace_url_gen3>"]
      );
      const stopOnFailure =
        options["stopOnFailure"].toString().toLowerCase() === "true";
      const stopOnWarning =
        options["stopOnWarning"].toString().toLowerCase() === "true";
      res = result.printEvaluationResults(stopOnFailure, stopOnWarning);
    } catch (err) {
      Logger.error("While executing SRG evaluation ", err);
    }

    return res;
  }
}
export default SRGEvaluateManager;
