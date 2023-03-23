import Logger from "../../common/logger";
import DTApiV3 from "../../dynatrace/DTApiV3";
import SRGTemplateManager, { SRGTemplate } from "./SRGTemplateManager";

//Executes the SRG template configuration
//Steps:
//1. Validate or request template values
//1. Create SRG project
//2. Create SRG workflow
class SRGConfigure {
  private api: DTApiV3;

  constructor(api: DTApiV3) {
    this.api = api;
  }

  async configureEvaluation(options: { [key: string]: string }) {
    const templateManager = new SRGTemplateManager(options);
    const srgTemplate = await templateManager.GetParsedSRGTemplate();
    await this.createSRGEntities(templateManager, srgTemplate);
  }

  private async createSRGEntities(
    templateManager: SRGTemplateManager,
    srgTemplate: SRGTemplate
  ) {
    Logger.debug("Creating SRG evaluation project");
    //Logger.verbose(srgAppDefinition);
    const srgProject = await this.api.SRGProjectCreate(
      srgTemplate.srgAppDefinition
    );
    Logger.info("SRG evaluation app created successfully");
    Logger.debug("Creating SRG evaluation Workflow");
    Logger.verbose(srgProject);
    srgTemplate.workflowDefinition = templateManager.ReplaceDependencies(
      srgTemplate.workflowDefinition,
      srgProject
    );
    const srgWorkflow = await this.api.WorkflowCreate(
      srgTemplate.workflowDefinition
    );
    Logger.info("SRG evaluation Workflow created successfully ");
    Logger.verbose(srgWorkflow);
  }
}

export default SRGConfigure;
