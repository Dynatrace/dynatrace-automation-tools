import SRGEvaluationResult from "./SRGEvaluationResult";
import Logger from "../../common/logger";

afterEach(() => {
  jest.clearAllMocks();
});
const demo = {
  "validation.status": "success",
  "validation.summary": "this is a summary ",
  "guardian.id": "12",
  "validation.id": "1",
};
describe("SRGEvaluationResult", () => {
  it("should be defined", () => {
    const info = jest.spyOn(Logger, "info");
    const mod = new SRGEvaluationResult(demo, "https://test.com");

    mod.printEvaluationResults(false, false);
    expect(info).toHaveBeenCalledTimes(6);
  });
  it("should exit with code 1", () => {
    const info = jest.spyOn(Logger, "info");
    const failed = demo;
    failed["validation.status"] = "fail";
    const mod = new SRGEvaluationResult(failed, "https://test.com");

    const status = mod.printEvaluationResults(true, false);

    expect(info).toHaveBeenCalledTimes(8);
    expect(status).toBe(false);
  });

  it("show log error when validation status is fail", () => {
    const info = jest.spyOn(Logger, "info");
    const error = jest.spyOn(Logger, "error");
    const failed = demo;
    failed["validation.status"] = "fail";
    const mod = new SRGEvaluationResult(failed, "https://test.com");

    mod.printEvaluationResults(false, false);
    expect(error).toHaveBeenCalledTimes(1);
    expect(info).toHaveBeenCalledTimes(8);
  });
});
