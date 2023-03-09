import Logger from "../common/logger";
import axios, { AxiosInstance } from "axios";
import DTOAuth from "../common/oauth";
//Dynatrace API v3 for gen3 endpoints
class DTApiV3 {
  DynatraceUrl: string;
  axiosApiInstance: AxiosInstance;
  OauthClient: DTOAuth;
  constructor(
    dynatraceUrl: string,
    ssoUrl: string,
    account_urn: string,
    client_id: string,
    secret: string
  ) {
    Logger.debug("Creating DTApi instance");
    this.DynatraceUrl = dynatraceUrl;
    this.OauthClient = new DTOAuth(ssoUrl, client_id, secret, account_urn);
    this.axiosApiInstance = axios.create();
  }
  private setTokenHeader = (token: string) => {
    this.axiosApiInstance.defaults.headers.common["Authorization"] =
      "Bearer " + token;
    this.axiosApiInstance.defaults.headers.common["Content-Type"] =
      "application/json";
  };
  private getScopedRequest = async (scope: string) => {
    const token = await this.OauthClient.GetScopedToken(scope);
    this.setTokenHeader(token);
    return this.axiosApiInstance;
  };

  CreateSRGProject = async (SRGTemplate: string) => {
    const api = await this.getScopedRequest("settings:objects:write");

    const res = await api.post(
      this.DynatraceUrl +
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
  CreateWorkflow = async (workflow: string): Promise<boolean> => {
    const api = await this.getScopedRequest("automation:workflows:write");
    const res = await api.post(
      this.DynatraceUrl + "/platform/automation/v0.2/workflows",
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
