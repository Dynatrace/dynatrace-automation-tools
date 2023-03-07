import DTApiV3 from "../../dynatrace/dt-api-v3";
import Logger from "../../common/logger";
import baseWorkflow from "./templates/baseWorkflow.json";
class SRGConfigure {
  constructor() {}

  async configureEvaluation(
    dynatrace_url: string,
    account_urn: string,
    client_id: string,
    secret: string,
    sso_url: string,
    appId: string
  ) {
    Logger.info("Creating SRG evaluation Workflow");
    let dtApi = new DTApiV3(
      dynatrace_url,
      sso_url,
      account_urn,
      client_id,
      secret
    );
    // let srgProject = dtApi.CreateSRGProject(appId);
    await dtApi.CreateWorkflow(baseWorkflow);
  }
}

export default SRGConfigure;
