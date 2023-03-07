import Logger from "../common/logger";
import axios, { AxiosInstance } from "axios";
import DTOAuth from "../common/oauth";
class DTApiV3 {
  DynatraceUrl: string = "";
  axiosApiInstance: AxiosInstance;
  OauthClient: DTOAuth;
  constructor(
    dynatraceUrl: string,
    ssoUrl: string,
    account_urn: string,
    client_id: string,
    secret: string
  ) {
    Logger.verbose("Creating DTApi instance");
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
    let token = await this.OauthClient.GetScopedToken(scope);
    this.setTokenHeader(token);
    return this.axiosApiInstance;
  };
  CreateSRGProject = async (appId: string) => {
    let api = await this.getScopedRequest("sre:projects:write");
    try {
    } catch (err) {
      throw err;
    }
  };
  CreateWorkflow = async (workflow: any): Promise<boolean> => {
    let api = await this.getScopedRequest("automation:workflows:write");
    try {
      let res = await api.post(
        this.DynatraceUrl + "/platform/automation/v0.2/workflows",
        workflow
      );
      if (res.status != 201) {
        Logger.error("Failed create workflow");
        Logger.verbose(res);
        throw new Error("Failed create workflow");
      }

      return true;
    } catch (err) {
      throw err;
    }
  };
}
export default DTApiV3;
