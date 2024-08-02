import { SRGEvaluationResult } from "./SRGEvaluationResult";
import Logger from "../../common/logger";

afterEach(() => {
  jest.clearAllMocks();
});
const demo = {
  "validation.status": "success",
  "validation.summary": "this is a summary ",
  "guardian.id": "12",
  "guardian.name": "demo-guardian",
  "validation.id": "1"
};
describe("SRGEvaluationResult", () => {
  it("should be defined", () => {
    const info = jest.spyOn(Logger, "info");
    const mod = new SRGEvaluationResult(demo, "https://test.com");

    mod.summarizeSLO();
    expect(info).toHaveBeenCalledTimes(6);
  });
  it("should exit with code 1 when error", () => {
    const info = jest.spyOn(Logger, "info");
    const failed = demo;
    failed["validation.status"] = "fail";
    const mod = new SRGEvaluationResult(failed, "https://test.com");

    const status = mod.summarizeSLO();

    expect(info).toHaveBeenCalledTimes(5);
    expect(status).toBe(false);
  });

  it("show log error when validation status is fail", () => {
    const info = jest.spyOn(Logger, "info");
    const error = jest.spyOn(Logger, "error");
    const failed = demo;
    failed["validation.status"] = "fail";
    const mod = new SRGEvaluationResult(failed, "https://test.com");

    mod.summarizeSLO();
    expect(error).toHaveBeenCalledTimes(1);
    expect(info).toHaveBeenCalledTimes(5);
  });
  it("show log warn when validation status is warning", () => {
    const info = jest.spyOn(Logger, "info");
    const warn = jest.spyOn(Logger, "warn");
    const warning = demo;
    warning["validation.status"] = "warning";
    const mod = new SRGEvaluationResult(warning, "https://test.com");
    mod.summarizeSLO();
    expect(warn).toHaveBeenCalledTimes(1);
    expect(info).toHaveBeenCalledTimes(5);
  });
  it("should exit code 1 with stop on warning is enabled", () => {
    const info = jest.spyOn(Logger, "info");
    const warning = demo;
    warning["validation.status"] = "warning";
    const mod = new SRGEvaluationResult(warning, "https://test.com");
    const status = mod.summarizeSLO();
    expect(info).toHaveBeenCalledTimes(5);
    expect(status).toBe(false);
  });
});
