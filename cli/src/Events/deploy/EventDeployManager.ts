import Logger from "../../common/logger";
import AuthOptions, { AuthOption } from "../../dynatrace/AuthOptions";
import DTApiV3 from "../../dynatrace/DTApiV3";
import EventDeploy from "./EventDeploy";

class EventDeployManager {
  static async execute(
    options: { [key: string]: string },
    auth: AuthOptions
  ): Promise<boolean> {
    let res = false;

    try {
      Logger.info("Sending deployment event " + options["name"]);
      //sets the options values for authentication that the user provided
      auth.setOptionsValuesForAuth(options as AuthOption);
      const api = new DTApiV3(auth);
      const manager = new EventDeploy(api);
      await manager.send(options);
      res = true;
    } catch (err) {
      Logger.error("While sending deployment event ", err);
    }

    return res;
  }
}
export default EventDeployManager;
