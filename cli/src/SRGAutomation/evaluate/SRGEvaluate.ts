import Logger from "../../common/logger";
import DTApiV3 from "../../dynatrace/DTApiV3";

import SRGEvaluationCloudEvent from "./SRGEvaluationCloudEvent";
class SRGEvaluate {
  private api: DTApiV3;

  constructor(api: DTApiV3) {
    this.api = api;
  }

  async triggerEvaluation(appName: string, options: { [key: string]: string }) {
    const event = this.getCloudEvent(appName, options);
    const eventId = await this.sendEvent(event);
    await this.waitForEvaluationResult(eventId);
  }

  private getCloudEvent(
    appName: string,
    options: {
      [key: string]: string;
    }
  ): SRGEvaluationCloudEvent {
    const data = new SRGEvaluationCloudEvent(appName, options);
    return data;
  }

  private async sendEvent(event: SRGEvaluationCloudEvent) {
    Logger.debug("Sending SRG evaluation event");
    Logger.verbose(event);
    const bizEventResult = await this.api.BizEventSend(event);
    Logger.verbose(bizEventResult);
    Logger.info("SRG evaluation event sent");
    return bizEventResult;
  }

  private async waitForEvaluationResult(eventId: string) {
    Logger.info("Waiting for evaluation results to be available");
    const result = await this.api.BizEventQuery(eventId);
    Logger.verbose(result);
    Logger.info("Evaluation results:");
  }
}

export default SRGEvaluate;
