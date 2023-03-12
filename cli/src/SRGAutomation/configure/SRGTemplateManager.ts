import * as path from "path";
import Logger from "../../common/logger";
import { readFile } from "fs/promises";
export class SRGTemplate {
  srgAppDefinition: any;
  workflowDefinition: any;
}
class SRGTemplateManager {
  private options: any;

  constructor(options: { [key: string]: string }) {
    this.options = options;
  }
  async GetParsedSRGTemplate(): Promise<SRGTemplate> {
    Logger.debug("Processing SRG template");
    const [templatePath, templateName] = this.getTemplatePathAndName();
    const vars = await this.getTemplateVariables(templatePath);
    const values = this.requireTemplateVariables(templateName, vars);
    return this.setTemplateValues(values);
  }

  //scans the template files for variables
  private async getTemplateVariables(templatePath: string): Promise<string[]> {
    Logger.debug("Getting template variables from template files");
    const srgVars = await this.readTemplateFileVars(
      path.join(templatePath, "SRG.json")
    );
    const workflowVars = await this.readTemplateFileVars(
      path.join(templatePath, "workflow.json")
    );
    const vars = [...srgVars, ...workflowVars];
    return vars;
  }
  private getTemplatePathAndName(): string[] {
    if (this.options.template) {
      Logger.debug("Using template " + this.options.template);
      return [
        path.join(__dirname, "templates", this.options.template),
        this.options.template,
      ];
    } else if (this.options.templatePath) {
      const templateName = path.basename(this.options.templatePath);
      Logger.debug(
        "Using custom template in path " +
          this.options.templatePath +
          " with name " +
          templateName
      );
      return [this.options.templatePath, templateName];
    } else {
      throw new Error(
        "\n No --template or --template-path option provided. Please check srg configure -h for more information."
      );
    }
  }
  private async readTemplateFileVars(templatePath: string) {
    const file = await readFile(templatePath, "utf8");
    const pattern = /\{\{\.([^{}]+)\}\}/gm;
    const matches = [];
    let match;
    while ((match = pattern.exec(file)) !== null) {
      matches.push(match[1]);
    }
    Logger.debug(
      "Found template " + templatePath + " with variables: " + matches.join(",")
    );
    return matches;
  }
  //if interactive mode is enable, prompts the user for the template variables. If not, validates the template variables are present as env variables.
  private requireTemplateVariables(
    templateName: string,
    vars: string[]
  ): Map<string, string> {
    Logger.debug("Validating template variables existence");
    if (this.options.interactive) {
      Logger.info(
        "Interactive mode enabled. Please provide the following values:"
      );
      return new Map<string, string>();
    } else {
      Logger.info(
        "Interactive mode disabled (If you want to use interactive mode, please use the --interactive flag.)." +
          "\nChecking that the values exist as environment variables. Each value should be prefixed with SRG_TEMPLATENAME_VARNAME (i.e. SRG_PERFORMANCE_APPNAME)(always uppercase). " +
          "If you are using a custom template, the template name is the name of the folder where the template is located. "
      );
      return this.checkVariableExistenceAsEnv(templateName, vars);
    }
  }
  private checkVariableExistenceAsEnv(
    templateName: string,
    vars: string[]
  ): Map<string, string> {
    let missingVars: Map<string, string> = new Map();
    let finalVars: Map<string, string> = new Map();
    vars.forEach((el) => {
      let name = "SRG_" + templateName.toUpperCase() + "_" + el.toUpperCase();
      process.env[name]
        ? finalVars.set(el, process.env[name] ?? "")
        : missingVars.set(el, name);
    });
    if (missingVars.size > 0) {
      Logger.error(
        "The following variables are missing as environment variables: " +
          Array.from(missingVars.values()).join(",")
      );
      throw new Error(
        "The following variables are missing as environment variables: " +
          Array.from(missingVars.values()).join(",")
      );
    }
    return finalVars;
  }
  //sets the template values on the 2 properties based on the user input or the env variables
  private setTemplateValues(values: Map<string, string>): SRGTemplate {
    Logger.debug("Setting values to template objects");
    return new SRGTemplate();
  }
}

export default SRGTemplateManager;
