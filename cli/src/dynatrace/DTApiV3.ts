import Logger from "../common/logger";
import AuthOptions from "./AuthOptions";
import DQLQuery from "./DQLQuery";
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
      if (e.response?.data[0].code == 400) {
        const msg: string =
          e.response?.data[0].error.constraintViolations[0].message;

        if (msg.includes("another guardian with an identical name defined")) {
          Logger.debug(msg);
          return "SRG project already exists";
        }

        Logger.error(msg);
      } else {
        Logger.error(e.response?.data[0]);
      }

      throw new Error("Failed create SRG project");
    }
  };

  WorkflowCreate = async (workflow: string): Promise<any> => {
    try {
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
    } catch (e: any) {
      if (e.response?.data[0].code == 400) {
        const msg: string =
          e.response?.data[0].error.constraintViolations[0].message;
        Logger.error(msg);
      } else {
        Logger.error(e.response?.data[0]);
      }

      throw new Error("Failed create Workflow");
    }
  };

  BizEventSend = async (event: object): Promise<any> => {
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

  BizEventQuery = async (query: DQLQuery): Promise<any> => {
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
