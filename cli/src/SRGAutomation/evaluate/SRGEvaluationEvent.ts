import * as crypto from "crypto";

class SRGEvaluationEvent {
  "timeframe.from": string;

  "timeframe.to": string;

  execution_context: any;

  "tag.service": string;

  "tag.application": string;

  "tag.stage": string;

  "event.id": string;

  "event.provider": string;

  "event.type": string;

  constructor(options: { [key: string]: string }) {
    const eventId = crypto.randomUUID().toString();
    const timeframe = this.getTimeframe(
      options["startTime"],
      options["endTime"],
      options["timespan"]
    );

    this["timeframe.from"] = timeframe.Start;
    this["timeframe.to"] = timeframe.End;
    this.execution_context = new ExecutionContext(
      eventId,
      options["buildId"],
      options["version"]
    );
    this["tag.service"] = options["service"];
    this["tag.application"] = options["application"];
    this["tag.stage"] = options["stage"];
    this["event.id"] = eventId;
    this["event.provider"] = options["provider"];
    this["event.type"] = "guardian.validation.triggered";
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
class ExecutionContext {
  id: string;

  buildId: string;

  version: string;

  constructor(id: string, buildId: string, version: string) {
    this.id = id;
    this.buildId = buildId;
    this.version = version;
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
export default SRGEvaluationEvent;
