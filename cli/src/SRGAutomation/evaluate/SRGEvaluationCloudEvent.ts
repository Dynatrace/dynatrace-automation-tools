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
      data: new SRGEvaluationPayload(options["gitCommitId"], options["labels"]),
    });
    const timeframe = this.getTimeframe(
      options["startTime"],
      options["endTime"],
      options["timespan"]
    );
    //CloudEvent is immutable, so we need to clone it and add the appname and stage
    //Properties are added outside the data object because restrictions in the Dynatrace workflow side to parse the data
    this.data = baseEvent.cloneWith({
      appname: appName,
      stage: options["stage"],
      service: options["service"],
      starttime: timeframe.Start,
      endtime: timeframe.End,
    });
  }

  getTimeframe(
    startTime: string,
    endTime: string,
    timeSpan: string
  ): TimeFrame {
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

    return new TimeFrame(startTime, endTime);
  }
}

class SRGEvaluationPayload {
  GitCommitId: string;
  labels: object;
  constructor(gitCommitId: string, labels: string) {
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
  Start: string;
  End: string;

  constructor(start: string, end: string) {
    this.Start = this.convertTimeFromString(start);
    this.End = this.convertTimeFromString(end);

    if (this.Start > this.End) {
      throw new Error("Start time must be before end time");
    }
  }

  convertTimeFromString(time: string) {
    if (time === "") {
      throw new Error(`Time value is empty: ${time}`);
    }

    const date = new Date(time);

    if (isNaN(date.getTime())) {
      throw new Error(
        `Invalid time format ${time}. Please use ISO 8601 format (YYYY-MM-DDTHH:mm:ss.sssZ)`
      );
    }

    return date.toISOString();
  }
}
export default SRGEvaluationCloudEvent;
