import SRGEvaluate from "./SRGEvaluate";
import DTApiV3 from "../../dynatrace/DTApiV3";
import { setTimeout } from "timers/promises";
import SRGEvaluationEvent from "./SRGEvaluationEvent";

jest.mock("../../dynatrace/DQLQuery");
jest.mock("../../dynatrace/DTApiV3");
jest.mock("./SRGEvaluationEvent");
jest.mock("./SRGEvaluationResult");
jest.mock("timers/promises");
beforeEach(() => {
  jest.useFakeTimers();
});
afterEach(() => {
  jest.clearAllMocks();
});
afterAll(() => {
  jest.useRealTimers();
});

const testDescriptionOption = {
  buildId: "test",
  releaseVersion: "test",
  service: "test",
  application: "test",
  stage: "test",
  provider: "test"
};

describe("SRGEvaluate", () => {
  process.env.LOG_LEVEL = "verbose";

  it("wait for evaluation result", async () => {
    const mockApi = jest.fn() as unknown as DTApiV3;
    mockApi.BizEventSend = jest.fn();
    mockApi.BizEventQuery = jest.fn();
    const evaluate = new SRGEvaluate(mockApi);
    const event = new SRGEvaluationEvent(
      { timespan: "test" },
      testDescriptionOption
    );

    try {
      await evaluate.waitForEvaluationResult(event, "https://test.com");
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (e: any) {
      expect(e.message).toContain("Failed to find evaluation result");
    }

    //12 retries with 5 seconds delay
    expect(mockApi.BizEventQuery).toHaveBeenCalledTimes(12);
  });

  it("send event called", async () => {
    const mockApi = jest.fn() as unknown as DTApiV3;
    mockApi.BizEventSend = jest.fn();
    mockApi.BizEventQuery = jest.fn();
    const evaluate = new SRGEvaluate(mockApi);
    const event = new SRGEvaluationEvent(
      { timespan: "test" },
      testDescriptionOption
    );
    await evaluate.sendEvent(event);
    expect(mockApi.BizEventSend).toHaveBeenCalledTimes(1);
  });
  it("wait 130 seconds for data", async () => {
    const mockApi = jest.fn() as unknown as DTApiV3;
    mockApi.BizEventSend = jest.fn();
    mockApi.BizEventQuery = jest.fn();
    const evaluate = new SRGEvaluate(mockApi);
    await evaluate.waitForData("130");
    expect(setTimeout).toHaveBeenCalledTimes(5);
    expect(setTimeout).toHaveBeenLastCalledWith(10000);
  });
});
