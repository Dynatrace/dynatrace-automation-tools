import Logger from "../common/logger";
import AuthOptions from "./AuthOptions";
//Dynatrace API v3 for gen3 endpoints
class DTApiV3 {
  Auth: AuthOptions;

  constructor(auth: AuthOptions) {
    Logger.debug("Creating DTApi instance");
    this.Auth = auth;
  }

  SRGProjectCreate = async (SRGTemplate: any): Promise<any> => {
    try {
      const client = await this.Auth.getGen3ClientWithScopeRequest(
        "app-engine:apps:run settings:objects:write storage:logs:read"
      );
      const res = await client.post(
        "/platform/classic/environment-api/v2/settings/objects?validateOnly=false",
        SRGTemplate
      );

      if (res.status != 200) {
        Logger.error("Failed create SRG project");
        Logger.verbose(res);
        throw new Error("Failed create SRG project");
      }

      return res.data;
    } catch (e: any) {
      Logger.error(e.response?.data[0]);
      if (e.response?.data[0].code == 400) {
        Logger.error(e.response?.data[0].error.constraintViolations[0].message);
      }
      throw new Error("Failed create SRG project");
    }
  };

  WorkflowCreate = async (workflow: string): Promise<any> => {
    const client = await this.Auth.getGen3ClientWithScopeRequest(
      "automation:workflows:write"
    );

    Logger.debug("Creating workflow from template");
    const res = await client.post(
      "/platform/automation/v0.2/workflows",
      workflow
    );

    if (res.status != 201) {
      Logger.error("Failed create workflow");
      Logger.verbose(res);
      throw new Error("Failed create workflow");
    }

    return res;
  };
}
export default DTApiV3;
