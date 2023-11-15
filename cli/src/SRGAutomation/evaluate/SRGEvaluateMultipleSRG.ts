import Logger from "../../common/logger";
import DTApiV3 from "../../dynatrace/DTApiV3";
import SRGEvaluationEvent from "./SRGEvaluationEvent";
import { setTimeout } from "timers/promises";
import {
  SRGEvaluationResult,
  EvalResultPayload,
  EvaluationResultSummary
} from "./SRGEvaluationResult";
import DQLQuery from "../../dynatrace/DQLQuery";

//TODO: Update to 30 min
const MAX_WAIT_TIME_MINUTES_FOR_EXECUTION = 1;
//Gets the SRG evaluations from multiple workflows and each workflow can have multiple guardians
class SRGEvaluateMultipleSRG {
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
  getCloudEvent(options: { [key: string]: string }): SRGEvaluationEvent {
    const data = new SRGEvaluationEvent(options);
    return data;
  }
  async sendEvent(event: SRGEvaluationEvent) {
    Logger.debug("Sending SRG evaluation event");
    Logger.verbose(event);
    const bizEventResult = await this.api.BizEventSend(event);
    Logger.verbose(bizEventResult);
    Logger.info("SRG evaluation event sent");
  }
  //get's the workflows that have been triggered, waits for them to finalized and then gets the biz-events for SRG evaluations
  async waitForWorkflowsDone(eventTimeBeforeExecution: Date) {
    const workflowList = await this.getWorkflowsTriggered(
      eventTimeBeforeExecution
    );
    await this.checkWorkflowsStatus(eventTimeBeforeExecution, workflowList);
  }
  //Get all the workflows trigger after the eventTimeBeforeExecution
  async getWorkflowsTriggered(
    eventTimeBeforeExecution: Date
  ): Promise<WorkflowExecution[]> {
    Logger.info("Waiting 10 seconds for workflows to be triggered");
    await setTimeout(10 * 1000);
    Logger.verbose(
      "Getting workflows that have been triggered after " +
        eventTimeBeforeExecution
    );
    const executions: WorkflowExecution[] =
      (await this.api.WorkflowExecutionsByTime(
        eventTimeBeforeExecution
      )) as WorkflowExecution[];
    Logger.verbose("Workflows triggered: " + executions.length);

    if (executions.length == 0) {
      Logger.error(
        "No workflows were triggered. Please check the configuration of the workflow biz-event trigger"
      );
      throw new Error("No workflows were triggered");
    }

    return executions;
  }
  //check the status of the workflows every 30 seconds until the list is done or MAX_WAIT_TIME_MINUTES_FOR_EXECUTION is reached
  async checkWorkflowsStatus(
    eventTimeBeforeExecution: Date,
    executionList: WorkflowExecution[]
  ) {
    //log the workflows that were done and the missing ones based on timeout
    const idList = executionList.map((execution) => execution.workflow);
    const endTime = new Date(
      new Date().getTime() + MAX_WAIT_TIME_MINUTES_FOR_EXECUTION * 60000
    );
    let done = false;
    let currentTime = new Date();
    let wfStatusList: WorkflowExecution[] = [];

    while (endTime > currentTime && done == false) {
      currentTime = new Date();
      wfStatusList = (await this.api.WorkflowExecutionsByTimeAndWfId(
        eventTimeBeforeExecution,
        idList
      )) as WorkflowExecution[];
      const pending = wfStatusList.find((wfStatus) => {
        wfStatus.state == "RUNNING";
      });
      pending == undefined ? (done = true) : (done = false);

      if (done == false) {
        Logger.info("Waiting 30 seconds for workflows to be completed");
        await setTimeout(30 * 1000);
      }
    }

    if (!done) {
      Logger.info("Waiting for workflow execution hit the timeout");
      Logger.info("Workflows that are still running: ");
      wfStatusList
        .filter((wfStatus) => {
          wfStatus.state == "RUNNING";
        })
        .forEach((wfStatus) => {
          Logger.info(wfStatus.title);
        });
      Logger.info("Process will continue with the workflows that are done");
    }
  }

  //collects evaluation results from the SRG biz events that were created by the workflows
  async collectEvaluationResults(
    event: SRGEvaluationEvent,
    dynatraceUrl: string
  ): Promise<EvaluationResultSummary> {
    //waits for biz-events to be ready
    Logger.info(
      "Waiting for 30 seconds for evaluation results to be available"
    );
    await setTimeout(30 * 1000);
    Logger.info("Getting evaluation results");
    const query = this.getDQLQuery(event);
    Logger.verbose("Query used to find the event \n ");
    Logger.verbose(query);
    const result = await this.api.BizEventQuery(query);
    Logger.verbose("records retrieved: " + result?.length);
    Logger.verbose(result);
    let finalResults: SRGEvaluationResult[] = [];

    if (result?.length > 0) {
      const results = result as EvalResultPayload[];
      finalResults = results.map((result) => {
        return new SRGEvaluationResult(result, dynatraceUrl);
      });
    }

    return new EvaluationResultSummary(finalResults);
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
      50,
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

    const finalDql = initialDql + " | sort timestamp desc ";

    return finalDql;
  }
}

export default SRGEvaluateMultipleSRG;

type WorkflowExecution = {
  workflow: string;
  state: string;
  title: string;
};
