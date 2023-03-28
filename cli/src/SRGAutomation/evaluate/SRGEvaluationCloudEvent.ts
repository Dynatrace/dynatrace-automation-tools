import { CloudEvent } from "cloudevents";
import { v4 as uuidv4 } from "uuid";

class SRGEvaluationCloudEvent extends CloudEvent<SRGEvaluationPayload> {
  appname: string;

  stage: string;

  service: string;

  constructor(appName: string, options: { [key: string]: string }) {
    super({
      id: uuidv4(),
      type: "com.dynatrace.event.srg.evaluation.triggered.v1",
      source: "ci-cd",
      datacontenttype: "application/json",
      provider: "dynatrace-automation-cli",
      data: new SRGEvaluationPayload(
        options["starttime"],
        options["endtime"],
        options["timespan"],
        options["gitCommitId"],
        options["labels"]
      ),
    });
    this.appname = appName;
    this.stage = options["stage"];
    this.service = options["service"];
  }
}

class SRGEvaluationPayload {
  TimeFrame: TimeFrame;

  GitCommitId: string;

  labels: object;

  constructor(
    startTime: string,
    endTime: string,
    timeSpan: string,
    gitCommitId: string,
    labels: string
  ) {
    if (timeSpan !== "") {
      const date = new Date();
      date.setMinutes(date.getMinutes() - parseInt(timeSpan));
      startTime = date.toISOString();
      endTime = new Date().toISOString();
    }

    this.TimeFrame = new TimeFrame(startTime, endTime);
    this.GitCommitId = gitCommitId;
    this.labels = this.commaSeparatedStringToObject(labels);
  }

  private commaSeparatedStringToObject(labels: string) {
    const labelsObject: { [key: string]: string } = {};

    if (labels !== "") {
      labels.split(",").forEach((label) => {
        const [key, value] = label.split("=");
        labelsObject[key] = value;
      });
    }

    return labelsObject;
  }
}
class TimeFrame {
  start: string;

  end: string;

  constructor(start: string, end: string) {
    this.start = this.convertTimeFromString(start);
    this.end = this.convertTimeFromString(end);
  }

  convertTimeFromString(time: string) {
    if (time === "") {
      throw new Error(`Time value is empty: ${time}`);
    }

    const date = new Date(time);

    if (isNaN(date.getTime())) {
      throw new Error(`Invalid time format: ${time}`);
    }

    return date.toISOString();
  }
}
export default SRGEvaluationCloudEvent;
