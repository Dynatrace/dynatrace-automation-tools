import SRGEvaluationEvent from "./SRGEvaluationEvent";

describe("Evaluation event init", () => {
  it("should set event type to guardian.validation.triggered", () => {
    const event = new SRGEvaluationEvent({ timespan: "2" });
    expect(event["event.type"]).toBe("guardian.validation.triggered");
  });
  it("should set event id to a random uuid", () => {
    const event = new SRGEvaluationEvent({ timespan: "2" });
    expect(event["event.id"]).toBeDefined();
  });
  it("should throw error when timeframe.from is not a date", () => {
    const t = () => {
      throw new SRGEvaluationEvent({ startTime: "notadate" });
    };

    expect(t).toThrow();
  });
  const date = new Date();
  date.setMinutes(date.getMinutes() - 10);
  const startTime = date.toISOString();
  const endTime = new Date().toISOString();
  it("should set timeframe.from to the start time", () => {
    const event = new SRGEvaluationEvent({
      startTime: startTime,
      endTime: endTime
    });
    expect(event["timeframe.from"]).toBe(startTime);
  });
  it("should set timeframe.to to the end time", () => {
    const event = new SRGEvaluationEvent({
      startTime: startTime,
      endTime: endTime
    });
    expect(event["timeframe.to"]).toBe(endTime);
  });
  it("should set service to the service name", () => {
    const event = new SRGEvaluationEvent({
      startTime: startTime,
      endTime: endTime,
      service: "demoservice"
    });
    expect(event["service"]).toBe("demoservice");
  });
  it("should set application to the application name", () => {
    const event = new SRGEvaluationEvent({
      startTime: startTime,
      endTime: endTime,
      application: "test"
    });
    expect(event["application"]).toBe("test");
  });
  it("should set stage to the stage name", () => {
    const event = new SRGEvaluationEvent({
      startTime: startTime,
      endTime: endTime,
      stage: "test-stage"
    });
    expect(event["stage"]).toBe("test-stage");
  });
  it("should parse single variable input option and set the values in the event", () => {
    const event = new SRGEvaluationEvent({
      startTime: startTime,
      endTime: endTime,
      variables: "variable-name=variable-value"
    });
    expect(event["variables.variable-name"]).toBe("variable-value");
  });
  it("should parse multiple variables input option and set the values in the event", () => {
    const event = new SRGEvaluationEvent({
      startTime: startTime,
      endTime: endTime,
      variables: "variable-name-1=variable-value-1,variable-name-2=variable-value-2"
    });
    expect(event["variables.variable-name-1"]).toBe("variable-value-1");
    expect(event["variables.variable-name-2"]).toBe("variable-value-2");
  });  
  it("should set event.provider to the provider name", () => {
    const event = new SRGEvaluationEvent({
      startTime: startTime,
      endTime: endTime,
      provider: "test-provider"
    });
    expect(event["event.provider"]).toBe("test-provider");
  });
  it("should set execution_context.id to the event id", () => {
    const event = new SRGEvaluationEvent({
      startTime: startTime,
      endTime: endTime
    });
    expect(event.execution_context.id).toBe(event["event.id"]);
  });
  it("should set execution_context.buildId to the build id", () => {
    const event = new SRGEvaluationEvent({
      startTime: startTime,
      endTime: endTime,
      buildId: "test123"
    });
    expect(event.execution_context.buildId).toBe("test123");
  });
  it("should set execution_context.version to the version", () => {
    const event = new SRGEvaluationEvent({
      startTime: startTime,
      endTime: endTime,
      releaseVersion: "a1"
    });
    expect(event.execution_context.version).toBe("a1");
  });
  it("should throw an error if no start time, end time or timespan is provided", () => {
    expect(() => {
      new SRGEvaluationEvent({ startTime: "d" });
    }).toThrow();
  });
  it("should throw an error if only one of start time or end time is provided", () => {
    expect(() => {
      new SRGEvaluationEvent({ startTime: startTime });
    }).toThrow();
  });
  it("should set timeframe.from to the current time minus the timespan if only timespan is provided", () => {
    const event = new SRGEvaluationEvent({ timespan: "2" });
    expect(event["timeframe.from"]).toBeDefined();
    expect(event["timeframe.to"]).toBeDefined();
    const date1 = new Date(event["timeframe.from"]);
    const date2 = new Date(event["timeframe.to"]);
    expect(date2.getTime()).toBeGreaterThan(date1.getTime());
  });
  it("should throw an error if variables input string is empty", () => {
    expect(() => {
      new SRGEvaluationEvent({
        startTime: startTime,
        endTime: endTime,
        variables: ""
      });
    }).toThrow(Error("Malformed variable expression. Empty variable expression is not allowed"));
  });
  it("should throw an error if variables input string is malformed, the last variable is an empty string", () => {
    expect(() => {
      new SRGEvaluationEvent({
        startTime: startTime,
        endTime: endTime,
        variables: "variable-name-1=variable-value-1,"
      });
    }).toThrow(Error(("Malformed variable expression. Empty variable expression is not allowed")));
  });
  it("should throw an error if variables input string is malformed, one variable is an empty string", () => {
    expect(() => {
      new SRGEvaluationEvent({
        startTime: startTime,
        endTime: endTime,
        variables: "variable-name-1=variable-value-1,,variable-name-3=variable-value-3"
      });
    }).toThrow(Error(("Malformed variable expression. Empty variable expression is not allowed")));
  });
  it("should throw an error if variables input string is malformed, variable has no name", () => {
    expect(() => {
      new SRGEvaluationEvent({
        startTime: startTime,
        endTime: endTime,
        variables: "=variable-value"
      });
    }).toThrow(Error(("Malformed variable expression '=variable-value'. Empty variable value or name is not allowed")));
  });
  it("should throw an error if variables input string is malformed, variable has no value", () => {
    expect(() => {
      new SRGEvaluationEvent({
        startTime: startTime,
        endTime: endTime,
        variables: "variable-name="
      });
    }).toThrow(Error(("Malformed variable expression 'variable-name='. Empty variable value or name is not allowed")));
  });
  it("should throw an error if variables input string is malformed, one variable has no name", () => {
    expect(() => {
      new SRGEvaluationEvent({
        startTime: startTime,
        endTime: endTime,
        variables: "variable-name-1=variable-value-1,=variable-value"
      });
    }).toThrow(Error(("Malformed variable expression '=variable-value'. Empty variable value or name is not allowed")));
  });
  it("should throw an error if variables input string is malformed, one variable has no value", () => {
    expect(() => {
      new SRGEvaluationEvent({
        startTime: startTime,
        endTime: endTime,
        variables: "variable-name-1=variable-value-1,variable-name="
      });
    }).toThrow(Error(("Malformed variable expression 'variable-name='. Empty variable value or name is not allowed")));
  });
  it("should throw an error if variables input string is malformed and it doesn't contain the proper separator", () => {
    expect(() => {
      new SRGEvaluationEvent({
        startTime: startTime,
        endTime: endTime,
        variables: "variable-name-1->variable-value-1"
      });
    }).toThrow(Error("Malformed variable expression 'variable-name-1->variable-value-1'. The allowed format is 'name=value'"));
  });
  it("should throw an error if variables input string is malformed and one variable doesn't contain the proper separator", () => {
    expect(() => {
      new SRGEvaluationEvent({
        startTime: startTime,
        endTime: endTime,
        variables: "variable-name-1=variable-value-1,variable-name-2->variable-value-2"
      });
    }).toThrow(Error("Malformed variable expression 'variable-name-2->variable-value-2'. The allowed format is 'name=value'"));
  });
  it("should throw an error if variables input string is malformed and one variable doesn't contain the separator", () => {
    expect(() => {
      new SRGEvaluationEvent({
        startTime: startTime,
        endTime: endTime,
        variables: "variable-name-1=variable-value-1,variable-name-2variable-value-2"
      });
    }).toThrow(Error("Malformed variable expression 'variable-name-2variable-value-2'. The allowed format is 'name=value'"));
  });
  it("should throw an error if variables input string is malformed and contains multiple the separator", () => {
    expect(() => {
      new SRGEvaluationEvent({
        startTime: startTime,
        endTime: endTime,
        variables: "variable-name-1=variable-value-1=another-value"
      });
    }).toThrow(Error("Malformed variable expression 'variable-name-1=variable-value-1=another-value'. The allowed format is 'name=value'"));
  });
  it("should throw an error if variables input string is malformed and one variable contains multiple the separator", () => {
    expect(() => {
      new SRGEvaluationEvent({
        startTime: startTime,
        endTime: endTime,
        variables: "variable-name-1=variable-value-1,name=multiple=value"
      });
    }).toThrow(Error("Malformed variable expression 'name=multiple=value'. The allowed format is 'name=value'"));
  });
});
