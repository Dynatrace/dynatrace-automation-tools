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
export class EventDeployPayload {
  eventType: string;

  title: string;

  entitySelector: string;

  properties: EventProperties;

  constructor(options: { [key: string]: string }) {
    this.eventType = "CUSTOM_DEPLOYMENT";
    this.title = options["name"];
    this.entitySelector = options["entitySelector"];
    this.properties = new EventProperties(options);
  }
}
export class EventProperties {
  "dt.event.deployment.name": string;

  "dt.event.deployment.version"?: string;

  "dt.event.deployment.project"?: string;

  "dt.event.source"?: string;

  "dt.event.deployment.release_stage"?: string;

  "dt.event.deployment.release_product"?: string;

  "dt.event.deployment.release_build_version"?: string;

  "approver"?: string;

  "dt.event.deployment.ci_back_link"?: string;

  "gitcommit"?: string;

  "change-request"?: string;

  "dt.event.deployment.remediation_action_link"?: string;

  "dt.event.is_rootcause_relevant": string;

  constructor(options: { [key: string]: string }) {
    this["dt.event.deployment.name"] = options["name"];
    this["dt.event.deployment.version"] = this.returnUndefinedIfBlank(
      options["releaseVersion"]
    );
    this["dt.event.deployment.project"] = this.returnUndefinedIfBlank(
      options["project"]
    );
    this["dt.event.source"] = this.returnUndefinedIfBlank(options["source"]);
    this["dt.event.deployment.release_stage"] = this.returnUndefinedIfBlank(
      options["releaseStage"]
    );
    this["dt.event.deployment.release_product"] = this.returnUndefinedIfBlank(
      options["releaseProductName"]
    );
    this["dt.event.deployment.release_build_version"] =
      this.returnUndefinedIfBlank(options["releaseBuildVersion"]);
    this["approver"] = this.returnUndefinedIfBlank(options["approver"]);
    this["dt.event.deployment.ci_back_link"] = this.returnUndefinedIfBlank(
      options["ciBackLink"]
    );
    this["gitcommit"] = this.returnUndefinedIfBlank(options["gitcommit"]);
    this["change-request"] = this.returnUndefinedIfBlank(
      options["changeRequest"]
    );
    this["dt.event.deployment.remediation_action_link"] =
      this.returnUndefinedIfBlank(options["remediationActionLink"]);
    this["dt.event.is_rootcause_relevant"] = options["isRootCauseRelevant"];
  }

  returnUndefinedIfBlank(value: string) {
    if (value === "") {
      return undefined;
    }

    return value;
  }
}

export default EventDeploy;
