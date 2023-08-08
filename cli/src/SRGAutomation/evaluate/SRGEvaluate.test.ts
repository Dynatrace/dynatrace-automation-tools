import SRGEvaluate from "./SRGEvaluate";
import DTApiV3 from "../../dynatrace/DTApiV3";
import { setTimeout } from "timers/promises";
import SRGEvaluationEvent from "./SRGEvaluationEvent";

jest.mock("../../dynatrace/DQLQuery");
jest.mock("../../dynatrace/DTApiV3");
jest.mock("./SRGEvaluationEvent");
jest.mock("./SRGEvaluationResult");
jest.mock("timers/promises");
beforeAll(() => {
  jest.useFakeTimers();
});

afterAll(() => {
  jest.useRealTimers();
});

describe("SRGEvaluate", () => {
  process.env.LOG_LEVEL = "verbose";

  // it("Try send biz event and fetch result with error", async () => {
  //   const mockApi = jest.fn() as unknown as DTApiV3;
  //   mockApi.BizEventSend = jest.fn();
  //   mockApi.BizEventQuery = jest.fn();
  //   const evaluate = new SRGEvaluate(mockApi);

  //   try {
  //     return await evaluate.triggerEvaluation({
  //       "<dynatrace_url_gen3>": "https://test.com",
  //       delay: "0",
  //       stopOnFailure: "true",
  //       stopOnWarning: "true",
  //     });
  //     // eslint-disable-next-line @typescript-eslint/no-explicit-any
  //   } catch (e: any) {
  //     expect(e.message).toContain("Failed to find evaluation result");
  //   }
  //   //12 retries with 5 seconds delay
  //   expect(setTimeout).toHaveBeenCalledTimes(12);
  //   //expect(setTimeout).toHaveBeenLastCalledWith(10000);
  // });
  // it("wait 120 seconds for data", async () => {
  //   const waitForEvaluationResult = jest.spyOn(
  //     SRGEvaluate.prototype as any,
  //     "waitForEvaluationResult"
  //   );

  //   // eslint-disable-next-line @typescript-eslint/no-empty-function
  //   waitForEvaluationResult.mockImplementation(() => {});
  //   const mockApi = jest.fn() as unknown as DTApiV3;
  //   mockApi.BizEventSend = jest.fn();
  //   mockApi.BizEventQuery = jest.fn();
  //   const evaluate = new SRGEvaluate(mockApi);

  //   try {
  //     return await evaluate.triggerEvaluation({
  //       "<dynatrace_url_gen3>": "https://test.com",
  //       delay: "0",
  //       stopOnFailure: "true",
  //       stopOnWarning: "true",
  //     });
  //     // eslint-disable-next-line @typescript-eslint/no-explicit-any
  //   } catch (e: any) {
  //     expect(e.message).toContain("Failed to find evaluation result");
  //   }
  //   expect(setTimeout).toHaveBeenCalledTimes(12);
  //   expect(setTimeout).toHaveBeenLastCalledWith(10000);
  // });
  it("send event called", async () => {
    const mockApi = jest.fn() as unknown as DTApiV3;
    mockApi.BizEventSend = jest.fn();
    mockApi.BizEventQuery = jest.fn();
    const evaluate = new SRGEvaluate(mockApi);
    const event = new SRGEvaluationEvent({});
    await evaluate.sendEvent(event);
    expect(mockApi.BizEventSend).toHaveBeenCalledTimes(1);
  });
  it("wait 130 seconds for data", async () => {
    const mockApi = jest.fn() as unknown as DTApiV3;
    const evaluate = new SRGEvaluate(mockApi);
    await evaluate.waitForData("130");
    expect(setTimeout).toHaveBeenCalledTimes(5);
    expect(setTimeout).toHaveBeenLastCalledWith(10000);
  });
});
