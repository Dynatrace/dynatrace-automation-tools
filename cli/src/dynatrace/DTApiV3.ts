import Logger from "../common/logger";
import axios, { AxiosInstance } from "axios";
import DTOAuth from "../common/oauth";
import AuthOptions from "./AuthOptions";
//Dynatrace API v3 for gen3 endpoints
class DTApiV3 {
  Auth: AuthOptions;

  constructor(auth: AuthOptions) {
    Logger.debug("Creating DTApi instance");
    this.Auth = auth;
  }

  SRGProjectCreate = async (SRGTemplate: any) => {
    let client = await this.Auth.getGen3ClientWithScopeRequest(
      "settings:objects:write"
    );
    let res = await client.post(
      "/platform/classic/environment-api/v2/settings/objects?validateOnly=false",
      SRGTemplate
    );
    if (res.status != 200) {
      Logger.error("Failed create SRG project");
      Logger.verbose(res);
      throw new Error("Failed create SRG project");
    }
    return res.data;
  };
  WorkflowCreate = async (workflow: object): Promise<boolean> => {
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

    return true;
  };
}
export default DTApiV3;
