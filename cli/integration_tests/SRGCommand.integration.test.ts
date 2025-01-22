import { initialize } from "../src/app";
import DTApiV3 from "../src/dynatrace/DTApiV3";
import AuthOptions from "../src/dynatrace/AuthOptions";
import DQLQuery from "../src/dynatrace/DQLQuery";

describe("SRGCommand", () => {
  const dynatraceURLGen3 = process.env.DYNATRACE_URL_GEN3 ?? "";
  const accountURN = process.env.ACCOUNT_URN ?? "";
  const dynatraceClientId = process.env.DYNATRACE_CLIENT_ID ?? "";
  const dynatraceSecret = process.env.DYNATRACE_SECRET ?? "";
  const dynatraceSSOURL = process.env.DYNATRACE_SSO_URL ?? "";
  const service = "it-service";
  const stage = "it-stage";
  const startTime = "1970-01-01 00:00:00.000Z";
  const endTime = "1970-01-01 00:00:00.001Z";
  const application = "it-app";
  const extra_var1 = "key1=value1";
  const extra_var2 = "key2=value2";
  const provider = "it-provider";
  const releaseVersion = "it-release-version";
  const zeroDelay = "0";

  const authOptions: AuthOptions = new AuthOptions();
  const authValues = {
    "<account_urn>": accountURN,
    "<dynatrace_url_gen3>": dynatraceURLGen3,
    "<client_id>": dynatraceClientId,
    "<client_secret>": dynatraceSecret,
    "<sso_url>": dynatraceSSOURL
  };
  authOptions.setOptionsValuesForAuth(authValues);
  const api = new DTApiV3(authOptions);

  const date = new Date();

  date.setMinutes(date.getMinutes() - 10);
  const queryStartTime = date.toISOString();
  date.setMinutes(date.getMinutes() + 20);
  const queryEndTime = date.toISOString();
  it("should send bizevent to trigger SRG Validation - options passed as arguments", async () => {
    console.log("Log muted, test will take around 60s.");
    const mockExit = jest.spyOn(process, "exit").mockImplementation();
    const mockStdout = jest.spyOn(process.stdout, "write").mockImplementation();
    const randomBuildId = Math.random().toString();

    await initialize("0.0.1", [
      "",
      "",
      "srg",
      "evaluate",
      dynatraceURLGen3,
      accountURN,
      dynatraceClientId,
      dynatraceSecret,
      dynatraceSSOURL,
      "--service",
      service,
      "--stage",
      stage,
      "--start-time",
      startTime,
      "--end-time",
      endTime,
      // "--timespan",
      // "5",
      "--application",
      application,
      "--extra_vars",
      extra_var1,
      extra_var2,
      "--provider",
      provider,
      "--release-version",
      releaseVersion,
      "--buildId",
      randomBuildId,
      "--delay",
      zeroDelay
    ]);

    expect(mockExit).toHaveBeenCalledWith(1);
    expect(mockStdout).toHaveBeenNthCalledWith(
      18,
      expect.stringContaining(
        `Failed to find evaluation result for service ${service}in stage ${stage} after 60 seconds. Check your configuration.`
      )
    );

    const query = new DQLQuery(
      "fetch bizevents",
      queryStartTime,
      queryEndTime,
      "UTC",
      "en_US",
      5,
      10,
      20000,
      true,
      1000,
      1
    );

    const bizevents = await api.BizEventQuery(query);
    expect(bizevents).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          application: "it-app",
          "dt.openpipeline.pipelines": ["bizevents:default"],
          "dt.openpipeline.source": "/api/v2/bizevents/ingest",
          "event.kind": "BIZ_EVENT",
          "event.provider": "it-provider",
          "event.type": "guardian.validation.triggered",
          execution_context:
            expect.stringContaining(randomBuildId) &&
            expect.stringContaining(releaseVersion),
          "extra_vars.key1": "value1",
          "extra_vars.key2": "value2",
          service: "it-service",
          stage: "it-stage",
          "timeframe.from": "1970-01-01T00:00:00.000Z",
          "timeframe.to": "1970-01-01T00:00:00.001Z"
        })
      ])
    );

    mockExit.mockRestore();
    mockStdout.mockRestore();
  }, 120000);

  it("should send bizevent to trigger SRG Validation - options passed as env variables", async () => {
    console.log("Log muted, test will take around 60s.");
    const mockExit = jest.spyOn(process, "exit").mockImplementation();
    const mockStdout = jest.spyOn(process.stdout, "write").mockImplementation();
    const randomBuildId = Math.random().toString();

    process.env.SRG_EVALUATION_SERVICE = service;
    process.env.SRG_EVALUATION_STAGE = stage;
    process.env.SRG_EVALUATION_START_TIME = startTime;
    process.env.SRG_EVALUATION_END_TIME = endTime;
    // process.env.SRG_EVALUATION_TIMESPAN
    process.env.SRG_EVALUATION_APPLICATION = application;
    process.env.VARIABLES = extra_var1;
    process.env.SRG_EVALUATION_PROVIDER = provider;
    process.env.SRG_EVALUATION_VERSION = releaseVersion;
    process.env.SRG_EVALUATION_BUILD_ID = randomBuildId;
    process.env.SRG_EVALUATION_DELAY = zeroDelay;

    await initialize("0.0.1", ["", "", "srg", "evaluate"]);

    expect(mockExit).toHaveBeenCalledWith(1);
    expect(mockStdout).toHaveBeenNthCalledWith(
      18,
      expect.stringContaining(
        `Failed to find evaluation result for service ${service}in stage ${stage} after 60 seconds. Check your configuration.`
      )
    );

    const query = new DQLQuery(
      "fetch bizevents",
      queryStartTime,
      queryEndTime,
      "UTC",
      "en_US",
      5,
      10,
      20000,
      true,
      1000,
      1
    );

    const bizevents = await api.BizEventQuery(query);
    expect(bizevents).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          application: "it-app",
          "dt.openpipeline.pipelines": ["bizevents:default"],
          "dt.openpipeline.source": "/api/v2/bizevents/ingest",
          "event.kind": "BIZ_EVENT",
          "event.provider": "it-provider",
          "event.type": "guardian.validation.triggered",
          execution_context:
            expect.stringContaining(randomBuildId) &&
            expect.stringContaining(releaseVersion),
          "extra_vars.key1": "value1",
          "extra_vars.key2": "value2",
          service: "it-service",
          stage: "it-stage",
          "timeframe.from": "1970-01-01T00:00:00.000Z",
          "timeframe.to": "1970-01-01T00:00:00.001Z"
        })
      ])
    );

    mockExit.mockRestore();
    mockStdout.mockRestore();
  }, 120000);
});
