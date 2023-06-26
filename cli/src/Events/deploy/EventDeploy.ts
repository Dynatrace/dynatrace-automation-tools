import DTApiV3 from "../../dynatrace/DTApiV3";
import Logger from "../../common/logger";

class EventDeploy {
  private api: DTApiV3;

  constructor(api: DTApiV3) {
    this.api = api;
  }

  async send(options: { [key: string]: string }) {
    const event = new EventDeployPayload(options);
    await this.sendEvent(event);
  }

  private async sendEvent(event: EventDeployPayload) {
    Logger.debug("Sending deploy event");
    Logger.verbose(event);
    const eventResult = await this.api.EventSend(event);
    Logger.verbose(eventResult);
    Logger.info("Deploy event successfully sent");
  }
}

// const eventDeploySample = {
//   eventType: "CUSTOM_DEPLOYMENT",
//   title: "Easytravel 1.1",
//   entitySelector: "type(PROCESS_GROUP_INSTANCE),tag(easytravel)",
//   properties: {
//     "dt.event.deployment.name": "Easytravel 1.1",
//     "dt.event.deployment.version": "1.1",
//     "dt.event.deployment.release_stage": "production",
//     "dt.event.deployment.release_product": "frontend",
//     "dt.event.deployment.release_build_version": "123",
//     approver: "Jason Miller",
//     "dt.event.deployment.ci_back_link": "https://pipelines/easytravel/123",
//     gitcommit: "e5a6baac7eb",
//     "change-request": "CR-42",
//     "dt.event.deployment.remediation_action_link": "https://url.com",
//     "dt.event.is_rootcause_relevant": true,
//   },
// };
class EventDeployPayload {
  eventType: string;
  title: string;
  entitySelector: string;
  properties: EventProperties;
  //properties: { [key: string]: string };

  constructor(options: { [key: string]: string }) {
    this.eventType = "CUSTOM_DEPLOYMENT";
    this.title = options["name"];
    this.entitySelector = options["entitySelector"];
    // this.properties = {
    //   "dt.event.deployment.name": options["name"],
    // };
    this.properties = new EventProperties(options);
  }
}
class EventProperties {
  "dt.event.deployment.name": string;
  "dt.event.deployment.version": string;
  "dt.event.deployment.release_stage": string;
  "dt.event.deployment.release_product": string;
  "dt.event.deployment.release_build_version": string;
  "approver": string;
  "dt.event.deployment.ci_back_link": string;
  "gitcommit": string;
  "change-request": string;
  "dt.event.deployment.remediation_action_link": string;
  "dt.event.is_rootcause_relevant": string;

  constructor(options: { [key: string]: string }) {
    this["dt.event.deployment.name"] = options["name"];
    this["dt.event.deployment.version"] = options["version"];
    this["dt.event.deployment.release_stage"] = options["releaseStage"];
    this["dt.event.deployment.release_product"] = options["releaseProduct"];
    this["dt.event.deployment.release_build_version"] =
      options["releaseBuildVersion"];
    this["approver"] = options["approver"];
    this["dt.event.deployment.ci_back_link"] = options["ci_back_link"];
    this["gitcommit"] = options["gitcommit"];
    this["change-request"] = options["changeRequest"];
    this["dt.event.deployment.remediation_action_link"] =
      options["remediationActionLink"];
    this["dt.event.is_rootcause_relevant"] = options["isRootCauseRelevant"];
  }
}

export default EventDeploy;
