import Logger from "../../common/logger";
import DQLQuery from "../../dynatrace/DQLQuery";
import DTApiV3 from "../../dynatrace/DTApiV3";
import SRGEvaluationEvent from "./SRGEvaluationEvent";
import { setTimeout } from "timers/promises";
import SRGEvaluationResult from "./SRGEvaluationResult";
import { json } from "stream/consumers";
class SRGEvaluate {
  private api: DTApiV3;

  constructor(api: DTApiV3) {
    this.api = api;
  }

  async triggerEvaluation(appName: string, options: { [key: string]: string }) {
    const event = this.getCloudEvent(appName, options);
    await this.sendEvent(event);
    const result = await this.waitForEvaluationResult(
      event,
      options["<dynatrace_url_gen3>"]
    );
    const stopOnFailure = options["stopOnFailure"].toString() === "true";
    const stopOnWarning = options["stopOnWarning"].toString() === "true";
    result.PrintEvaluationResults(result, stopOnFailure, stopOnWarning);
  }

  private getCloudEvent(
    appName: string,
    options: {
      [key: string]: string;
    }
  ): any {
    const data = new SRGEvaluationEvent(appName, options);
    return data;
  }

  private async sendEvent(event: SRGEvaluationEvent) {
    Logger.debug("Sending SRG evaluation event");
    Logger.verbose(event);
    const bizEventResult = await this.api.BizEventSend(event);
    Logger.verbose(bizEventResult);
    Logger.info("SRG evaluation event sent");
  }

  private async waitForEvaluationResult(
    event: SRGEvaluationEvent,
    dynatraceUrl: string
  ): Promise<SRGEvaluationResult> {
    Logger.info("Waiting for evaluation results to be available");
    const query = this.getDQLQuery(event);
    Logger.verbose("Query used to find the event \n ");
    Logger.verbose(query);

    for (let i = 0; i < 12; i++) {
      const result = await this.api.BizEventQuery(query);
      Logger.verbose("records retrieved: " + result.length);
      Logger.verbose(result);

      if (result.length > 0) {
        return new SRGEvaluationResult(result[0], dynatraceUrl);
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
      "Failed to find evaluation result after 60 seconds. Check your configuration."
    );
  }

  private getDQLQuery(event: SRGEvaluationEvent): DQLQuery {
    const dqlExp = this.getExpression(event);
    const date = new Date();
    //queries for events that happened in the last 10 minutes (-1 min to account for time difference between client and server)
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

  //Filters by event type and timeframe and a final filter by app name using tags. Then takes the latest event.
  //Multiple runs for the same timeframe and app name will result in multiple events. The latest event is the one that is used.
  //TODO: Sanitize DQL expression
  private getExpression(event: SRGEvaluationEvent) {
    const initialdql =
      'fetch bizevents | filter event.type == "guardian.validation.finished" AND contains(execution_context,"' +
      event["event.id"] +
      '") ';

    const finalDql = initialdql + " | sort timestamp desc | limit 1 ";

    return finalDql;
  }
}

export default SRGEvaluate;
