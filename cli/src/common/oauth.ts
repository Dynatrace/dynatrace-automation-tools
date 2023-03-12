import axios, { AxiosInstance } from "axios";
import Logger from "./logger";

export class OauthParams {
  SSOUrl: string;

  ClientId: string;

  ClientSecret: string;

  AccountUUID: string;
  constructor(
    SSOUrl: string,
    ClientId: string,
    ClientSecret: string,
    AccountUUID: string
  ) {
    this.SSOUrl = SSOUrl;
    this.ClientId = ClientId;
    this.ClientSecret = ClientSecret;
    this.AccountUUID = AccountUUID;
  }
}
class DTOAuth {
  oauthParams: OauthParams;
  axiosApiInstance: AxiosInstance;

  constructor(
    ssoUrl: string,
    clientId: string,
    clientSecret: string,
    accountUUID: string
  ) {
    this.oauthParams = new OauthParams(
      ssoUrl,
      clientId,
      clientSecret,
      accountUUID
    );
    this.axiosApiInstance = axios.create();
  }

  async GetScopedToken(scope: string): Promise<string> {
    const data = {
      grantType: "client_credentials",
      clientId: this.oauthParams.ClientId,
      clientSecret: this.oauthParams.ClientSecret,
      scope: scope,
      resource: this.oauthParams.AccountUUID,
    };
    const res = await this.axiosApiInstance.post(
      this.oauthParams.SSOUrl,
      data,
      {
        headers: { "content-type": "application/x-www-form-urlencoded" },
      }
    );

    if (res.status != 200) {
      Logger.error("Failed to get token");
      Logger.verbose(res);
      throw new Error("Failed to get token");
    }

    return res.data.access_token;
  }
}
export default DTOAuth;
