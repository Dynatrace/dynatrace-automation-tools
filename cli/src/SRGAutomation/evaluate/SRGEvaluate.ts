import Logger from "../../common/logger";
import DQLQuery from "../../dynatrace/DQLQuery";
import DTApiV3 from "../../dynatrace/DTApiV3";
import SRGEvaluationEvent from "./SRGEvaluationEvent";
import { SRGEvaluationTimeOptions } from "../../dynatrace/SRGEvaluationTimeOptions";
import { SRGEvaluationDescriptionOptions } from "../../dynatrace/SRGEvaluationDescriptionOptions";
import { setTimeout } from "timers/promises";
import SRGEvaluationResult, { EvalResultPayload } from "./SRGEvaluationResult";
class SRGEvaluate {
  private api: DTApiV3;

  constructor(api: DTApiV3) {
    this.api = api;
  }

  //Provides a delay to allow data to be available in Dynatrace before sending the event.
  //Returns user feedback every 30 seconds until the delay is over.
  async waitForData(delay: string) {
    let delayInt = parseInt(delay);

    while (delayInt > 0) {
      Logger.info(
        "Waiting " + delayInt + " seconds for data to be available in Dynatrace"
      );

      if (delayInt > 30) {
        delayInt = delayInt - 30;
        await setTimeout(30 * 1000);
      } else {
        await setTimeout(delayInt * 1000);
        delayInt = 0;
      }
    }
  }

  getCloudEvent(
    timeOptions: SRGEvaluationTimeOptions,
    descriptionOptions: SRGEvaluationDescriptionOptions
  ): SRGEvaluationEvent {
    const data = new SRGEvaluationEvent(timeOptions, descriptionOptions);
    return data;
  }

  async sendEvent(event: SRGEvaluationEvent) {
    Logger.debug("Sending SRG evaluation event");
    Logger.verbose(event);
    const bizEventResult = await this.api.BizEventSend(event);
    Logger.verbose(bizEventResult);
    Logger.info("SRG evaluation event sent");
  }

  async waitForEvaluationResult(
    event: SRGEvaluationEvent,
    dynatraceUrl: string
  ): Promise<SRGEvaluationResult> {
    Logger.info("Waiting for evaluation results to be available");
    const query = this.getDQLQuery(event);
    Logger.verbose("Query used to find the event \n ");
    Logger.verbose(query);

    //queries for 60 seconds for the event to be available
    for (let i = 0; i < 12; i++) {
      const result = await this.api.BizEventQuery(query);
      Logger.verbose("records retrieved: " + result?.length);
      Logger.verbose(result);

      if (result?.length > 0) {
        const resultPayload = result[0] as EvalResultPayload;
        return new SRGEvaluationResult(resultPayload, dynatraceUrl);
      }

      Logger.info("No results yet. Waiting 5 seconds...");

      await setTimeout(5000);
    }

    Logger.verbose(
      "Query used to find the event \n " +
        query.query +
        "with start time for event filter " +
        query.defaultTimeframeStart +
        " and end time " +
        query.defaultTimeframeEnd
    );
    throw new Error(
      "Failed to find evaluation result for service " +
        event["service"] +
        "in stage " +
        event["stage"] +
        " after 60 seconds. Check your configuration."
    );
  }

  private getDQLQuery(event: SRGEvaluationEvent): DQLQuery {
    const dqlExp = this.getExpression(event);
    const date = new Date();
    //queries for events that happened in the last 10 minutes
    date.setMinutes(date.getMinutes() - 10);
    const startTime = date.toISOString();
    date.setMinutes(date.getMinutes() + 20);
    const endTime = date.toISOString();
    const query = new DQLQuery(
      dqlExp,
      startTime,
      endTime,
      "UTC",
      "en_US",
      5,
      10,
      20000,
      true,
      1000,
      1
    );
    return query;
  }

  private getExpression(event: SRGEvaluationEvent) {
    const initialDql =
      'fetch bizevents | filter event.type == "guardian.validation.finished" AND contains(execution_context,"' +
      event["event.id"] +
      '") ';

    const finalDql = initialDql + " | sort timestamp desc | limit 1 ";

    return finalDql;
  }
}

export default SRGEvaluate;
