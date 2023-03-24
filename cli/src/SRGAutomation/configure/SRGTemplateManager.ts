import * as path from "path";
import Logger from "../../common/logger";
import { readFile } from "fs/promises";
import { json } from "stream/consumers";
export class SRGTemplate {
  srgAppDefinition = "";

  workflowDefinition = "";
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
    const values = await this.requireTemplateVariables(templateName, vars);
    return this.setTemplateValues(values, templatePath);
  }

  ReplaceDependencies(workflowDefinition: any, srgProject: any): any {
    Logger.debug("Replacing template variables with dependencies");
    const regex = new RegExp(`##OBJECT_ID##`, "g");
    let workflowAsString: string = JSON.stringify(workflowDefinition);
    workflowAsString = workflowAsString.replace(regex, srgProject[0].objectId);
    return JSON.parse(workflowAsString);
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
  private async requireTemplateVariables(
    templateName: string,
    vars: string[]
  ): Promise<Map<string, string>> {
    Logger.debug("Validating template variables existence");

    Logger.info(
      // "Interactive mode disabled (If you want to use interactive mode, please use the --interactive flag.).\n" +
      "Checking that the values exist as environment variables. Each value should be prefixed with SRG_TEMPLATENAME_VARNAME (i.e. SRG_PERFORMANCE_APPNAME)(always uppercase). " +
        "If you are using a custom template, the template name is the name of the folder where the template is located. "
    );
    return this.checkVariableExistenceAsEnv(templateName, vars);
  }

  private checkVariableExistenceAsEnv(
    templateName: string,
    vars: string[]
  ): Map<string, string> {
    const missingVars: Map<string, string> = new Map();
    const finalVars: Map<string, string> = new Map();
    vars.forEach((el) => {
      const name = "SRG_" + templateName.toUpperCase() + "_" + el.toUpperCase();
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
  private async setTemplateValues(
    values: Map<string, string>,
    templatePath: string
  ): Promise<SRGTemplate> {
    Logger.debug("Setting values to template objects");

    const template = new SRGTemplate();
    template.srgAppDefinition = await this.replaceTemplateValues(
      values,
      path.join(templatePath, "SRG.json")
    );
    template.workflowDefinition = await this.replaceTemplateValues(
      values,
      path.join(templatePath, "workflow.json")
    );
    return template;
  }

  private async replaceTemplateValues(
    values: Map<string, string>,
    templatePath: string
  ): Promise<any> {
    const file = await readFile(templatePath, "utf8");

    let content = file;

    for (const [key, value] of values) {
      const regex = new RegExp(`{{.${key}}}`, "g");
      content = content.replace(regex, value);
    }

    content = content.replace("\n", "");

    const result = JSON.parse(content);

    return result;
  }
}

export default SRGTemplateManager;
