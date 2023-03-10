import axios, { AxiosInstance } from "axios";
import Logger from "./logger";

class DTOAuth {
  SSOUrl: string;
  ClientId: string;
  ClientSecret: string;
  AccountUUID: string;
  axiosApiInstance: AxiosInstance;
  constructor(
    ssoUrl: string,
    clientId: string,
    clientSecret: string,
    accountUUID: string
  ) {
    this.SSOUrl = ssoUrl;
    this.ClientId = clientId;
    this.ClientSecret = clientSecret;
    this.AccountUUID = accountUUID;

    this.axiosApiInstance = axios.create();
  }
  async GetScopedToken(scope: string): Promise<string> {
    const data = {
      grant_type: "client_credentials",
      client_id: this.ClientId,
      client_secret: this.ClientSecret,
      scope: scope,
      resource: this.AccountUUID,
    };
    const res = await this.axiosApiInstance.post(this.SSOUrl, data, {
      headers: { "content-type": "application/x-www-form-urlencoded" },
    });

    if (res.status != 200) {
      Logger.error("Failed to get token");
      Logger.verbose(res);
      throw new Error("Failed to get token");
    }
    return res.data.access_token;
  }
}
export default DTOAuth;
