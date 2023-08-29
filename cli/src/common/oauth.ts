/* eslint-disable camelcase */
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
      resource: this.AccountUUID
    };
    let res = null;

    try {
      res = await this.axiosApiInstance.post(this.SSOUrl, data, {
        headers: { "content-type": "application/x-www-form-urlencoded" }
      });

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      if (err?.response != 200) {
        Logger.verbose(err.message);

        if (err.response?.status == 400) {
          Logger.error(
            "Please check that the token has the correct permissions for the scope " +
              scope
          );
        }
      }

      throw new Error("Failed to get scoped token");
    }

    return res?.data.access_token;
  }
}
export default DTOAuth;
