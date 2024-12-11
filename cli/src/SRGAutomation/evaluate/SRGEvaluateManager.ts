import Logger from "../../common/logger";
import AuthOptions, { AuthOption } from "../../dynatrace/AuthOptions";
import { SRGEvaluationTimeOptions } from "../../dynatrace/SRGEvaluationTimeOptions";
import { SRGEvaluationDescriptionOptions } from "../../dynatrace/SRGEvaluationDescriptionOptions";
import { SRGEvaluationAdditionalOptions } from "../../dynatrace/SRGEvaluationAdditionalOptions";
import DTApiV3 from "../../dynatrace/DTApiV3";
import SRGEvaluate from "./SRGEvaluate";

class SRGEvaluateManager {
  public static async executeEvaluation(
    options:
      | AuthOption
      | SRGEvaluationTimeOptions
      | SRGEvaluationDescriptionOptions
      | SRGEvaluationAdditionalOptions,
    auth: AuthOptions
  ): Promise<boolean> {
    let res = false;

    const authOptions = options as AuthOption;
    const timeOption = options as SRGEvaluationTimeOptions;
    const descritionOption = options as SRGEvaluationDescriptionOptions;
    const additionalOptions = options as SRGEvaluationAdditionalOptions;

    try {
      Logger.info(
        "Executing SRG evaluation for service " +
          descritionOption["service"] +
          " in stage " +
          descritionOption["stage"]
      );
      //sets the options values for authentication that the user provided
      auth.setOptionsValuesForAuth(authOptions);
      const api = new DTApiV3(auth);

      const evaluate = new SRGEvaluate(api);
      const event = evaluate.getCloudEvent(timeOption, descritionOption);
      await evaluate.waitForData(additionalOptions["delay"]);
      await evaluate.sendEvent(event);
      const result = await evaluate.waitForEvaluationResult(
        event,
        authOptions["<dynatrace_url_gen3>"]
      );
      const stopOnFailure =
        additionalOptions["stopOnFailure"].toString() === "true";
      const stopOnWarning =
        additionalOptions["stopOnWarning"].toString() === "true";
      res = result.printEvaluationResults(stopOnFailure, stopOnWarning);
    } catch (err) {
      Logger.error("While executing SRG evaluation ", err);
    }

    return res;
  }
}
export default SRGEvaluateManager;
