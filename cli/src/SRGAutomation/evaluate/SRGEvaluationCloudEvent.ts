import { CloudEvent } from "cloudevents";
import { v4 as uuidv4 } from "uuid";

class SRGEvaluationCloudEvent {
  data: CloudEvent<SRGEvaluationPayload>;

  constructor(appName: string, options: { [key: string]: string }) {
    const baseEvent: CloudEvent<SRGEvaluationPayload> = new CloudEvent({
      id: uuidv4(),
      type: "com.dynatrace.event.srg.evaluation.triggered.v1",
      source: "ci-cd",
      datacontenttype: "application/json",
      provider: "dynatrace-automation-cli",
      data: new SRGEvaluationPayload(
        options["startTime"],
        options["endTime"],
        options["timespan"],
        options["gitCommitId"],
        options["labels"]
      ),
    });
    //CloudEvent is immutable, so we need to clone it and add the appname and stage
    this.data = baseEvent.cloneWith({
      appname: appName,
      stage: options["stage"],
      service: options["service"],
    });
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
    if (startTime == undefined && endTime === undefined && timeSpan !== "") {
      const date = new Date();
      date.setMinutes(date.getMinutes() - parseInt(timeSpan));
      startTime = date.toISOString();
      endTime = new Date().toISOString();
    } else {
      if (startTime === "" || endTime === "") {
        throw new Error(
          "Either start time or end time or timespan must be provided"
        );
      }
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
