import * as crypto from "crypto";
import { SRGEvaluationTimeOptions } from "../../dynatrace/SRGEvaluationTimeOptions";
import { SRGEvaluationDescriptionOptions } from "../../dynatrace/SRGEvaluationDescriptionOptions";

class SRGEvaluationEvent {
  "timeframe.from": string;

  "timeframe.to": string;

  "execution_context": ExecutionContext;

  "service": string;

  "application": string;

  "stage": string;

  "event.id": string;

  "event.provider": string;

  "event.type": string;

  [key: `variables.${string}`]: string;

  constructor(
    timeOption: SRGEvaluationTimeOptions,
    descriptionOption: SRGEvaluationDescriptionOptions
  ) {
    const eventId = crypto.randomUUID().toString();
    const timeframe = this.getTimeframe(
      timeOption["startTime"],
      timeOption["endTime"],
      timeOption["timespan"]
    );

    this["timeframe.from"] = timeframe.Start;
    this["timeframe.to"] = timeframe.End;
    this["execution_context"] = new ExecutionContext(
      eventId,
      descriptionOption["buildId"],
      descriptionOption["releaseVersion"]
    );
    this["service"] = descriptionOption["service"];
    this["application"] = descriptionOption["application"];
    this["stage"] = descriptionOption["stage"];
    this["event.id"] = eventId;
    this["event.provider"] = descriptionOption["provider"];
    this["event.type"] = "guardian.validation.triggered";

    const srgContext = new SRGContext(descriptionOption["variables"]);
    Object.entries(srgContext.variables).forEach(([name, value]) => {
      this[`variables.${name}` as `variables.${string}`] = value;
    });
  }

  getTimeframe(
    startTime?: string,
    endTime?: string,
    timeSpan?: string
  ): TimeFrame {
    if (
      startTime == undefined &&
      endTime === undefined &&
      timeSpan !== "" &&
      timeSpan !== undefined
    ) {
      const date = new Date();
      date.setMinutes(date.getMinutes() - parseInt(timeSpan));
      startTime = date.toISOString();
      endTime = new Date().toISOString();
    } else if (
      startTime === "" ||
      startTime === undefined ||
      endTime === "" ||
      endTime === undefined
    ) {
      throw new Error(
        "Either (start time and end time) or timespan must be provided"
      );
    }

    return new TimeFrame(startTime, endTime);
  }
}
class SRGContext {
  variables: { [key: string]: string };

  constructor(variables: string[] = []) {
    this.variables = {};
    variables.forEach((variableExpression) => {
      this.validateVariableExpression(variableExpression);
      const [name, value] = variableExpression.split("=");
      this.variables[name] = value;
    });
  }

  validateVariableExpression(
    variableExpression: string
  ): asserts variableExpression {
    if (variableExpression.split("=").length != 2) {
      throw new Error(
        `Malformed variable expression '${variableExpression}'. The allowed format is 'name=value'`
      );
    }

    if (
      variableExpression.split("=").some((variable) => variable.trim() === "")
    ) {
      throw new Error(
        `Malformed variable expression '${variableExpression}'. Empty variable value or name is not allowed`
      );
    }
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
