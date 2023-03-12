import Logger from "../../common/logger";
import ApiManager from "../../dynatrace/ApiManager";
import SRGTemplateManager, { SRGTemplate } from "./SRGTemplateManager";

//Executes the SRG template configuration
//Steps:
//1. Validate or request template values
//1. Create SRG project
//2. Create SRG workflow
class SRGConfigure {
  private api: ApiManager;
  constructor(apiManager: ApiManager) {
    this.api = apiManager;
  }

  async configureEvaluation(options: { [key: string]: string }) {
    const templateManager = new SRGTemplateManager(options);
    const srgTemplate = await templateManager.GetParsedSRGTemplate();
    await this.createSRGEntities(srgTemplate);
  }
  private async createSRGEntities(srgTemplate: SRGTemplate) {
    Logger.debug("Creating SRG evaluation project");
    //Logger.verbose(srgAppDefinition);
    let srgProject = await this.api.gen3?.SRGProjectCreate(
      srgTemplate.srgAppDefinition
    );
    Logger.info("SRG evaluation app created successfully");
    Logger.debug("Creating SRG evaluation Workflow");
    let srgWorkflow = await this.api.gen3?.WorkflowCreate(
      srgTemplate.workflowDefinition
    );
    Logger.info("SRG evaluation Workflow created successfully ");
  }
}

export default SRGConfigure;
