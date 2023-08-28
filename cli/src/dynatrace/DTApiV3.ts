import Logger from "../common/logger";
import AuthOptions from "./AuthOptions";
import DQLQuery from "./DQLQuery";
//Dynatrace API v3 for gen3 endpoints
class DTApiV3 {
  private Auth: AuthOptions;

  constructor(auth: AuthOptions) {
    Logger.debug("Creating DTApi instance");
    this.Auth = auth;
  }

  EventSend = async (event: object): Promise<object | undefined> => {
    try {
      const client = await this.Auth.getGen3ClientWithScopeRequest(
        "storage:events:write"
      );
      const res = await client.post(
        "/platform/classic/environment-api/v2/events/ingest",
        event
      );

      if (res.status != 201) {
        Logger.error("Failed send event");
        Logger.verbose(res);
        throw new Error("Failed send event");
      }

      return res.data;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (e: any) {
      Logger.verbose(e.response);

      if (e.response.status == 400) {
        if (
          e.response?.data.error.constraintViolations != undefined &&
          e.response?.data.error.constraintViolations.length > 0
        ) {
          e.response?.data.error.constraintViolations.forEach(
            (detail: object) => {
              Logger.error(detail);
            }
          );
        } else {
          Logger.error(e.response?.data[0]);
        }

        throw new Error("Failed to send event");
      }
    }
  };

  BizEventSend = async (event: object): Promise<object | undefined> => {
    try {
      const client = await this.Auth.getGen3ClientWithScopeRequest(
        "storage:events:write"
      );
      const res = await client.post(
        "/platform/classic/environment-api/v2/bizevents/ingest",
        event
      );

      if (res.status != 202) {
        Logger.error("Failed send business event");
        Logger.verbose(res);

        throw new Error("Failed send business event");
      }

      return res.data;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (e: any) {
      Logger.verbose(e);

      if (e.response?.data[0]?.code == 400) {
        const msg: string =
          e.response?.data[0].error.constraintViolations[0].message;
        Logger.error(msg);
      } else {
        Logger.error(e.response?.data[0]);
      }

      throw new Error("Failed to send business event");
    }
  };

  BizEventQuery = async (query: DQLQuery): Promise<object | undefined> => {
    try {
      const client = await this.Auth.getGen3ClientWithScopeRequest(
        "storage:events:read storage:buckets:read storage:bizevents:read"
      );
      const res = await client.post(
        `/platform/storage/query/v1/query:execute`,
        query
      );

      if (res.status != 200) {
        Logger.error("Failed query business event");
        Logger.verbose(res);
        throw new Error("Failed query business event");
      }

      return res.data.result.records;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (e: any) {
      Logger.verbose(e.response);

      if (e.response?.data?.error.code == 400) {
        const msg: string = e.response?.data.error.details.message;
        Logger.error(msg);
      } else {
        Logger.error(e.response?.data[0]);
      }

      throw new Error("Failed query business event");
    }
  };
}
export default DTApiV3;
