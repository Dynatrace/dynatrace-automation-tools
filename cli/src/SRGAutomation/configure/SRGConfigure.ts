import DTApiV3 from "../../dynatrace/DTApiV3";
import Logger from "../../common/logger";
import baseWorkflow from "./templates/baseWorkflow.json";
class SRGConfigure {
  async configureEvaluation(
    dynatrace_url: string,
    account_urn: string,
    client_id: string,
    secret: string,
    sso_url: string,
    appId: string
  ) {
    const dtApi = new DTApiV3(
      dynatrace_url,
      sso_url,
      account_urn,
      client_id,
      secret
    );
    Logger.debug("Creating SRG evaluation Workflow for app " + appId);
    await dtApi.CreateWorkflow(baseWorkflow);
    Logger.info(
      "SRG evaluation Workflow for " + appId + " created successfully "
    );
  }
}

export default SRGConfigure;
