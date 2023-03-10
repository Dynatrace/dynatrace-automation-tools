import DTApiV3 from "../../dynatrace/DTApiV3";
import Logger from "../../common/logger";
import baseWorkflow from "./templates/baseWorkflow.json";
class SRGConfigure {
  async configureEvaluation(
    dynatraceUrl: string,
    accountUrn: string,
    clientId: string,
    clientSecret: string,
    ssoUrl: string,
    appId: string
  ) {
    const dtApi = new DTApiV3(
      dynatraceUrl,
      ssoUrl,
      accountUrn,
      clientId,
      clientSecret
    );
    Logger.debug("Creating SRG evaluation Workflow for app " + appId);
    await dtApi.CreateWorkflow(baseWorkflow);
    Logger.info(
      "SRG evaluation Workflow for " + appId + " created successfully "
    );
  }
}

export default SRGConfigure;
