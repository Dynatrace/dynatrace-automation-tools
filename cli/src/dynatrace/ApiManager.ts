import AuthOptions from "./AuthOptions";
import DTApiV3 from "./DTApiV3";
//Abstracts the CLI usage for the rest of commands, including authentication options, and available apis.
// This class will be the central point to be updated once the Dynatrace SDK's increase their coverage.
class ApiManager {
  gen3: DTApiV3 | undefined; //It doesn't exist until initialized properly with InitializeWithValues
  classic: any;
  auth: AuthOptions;

  constructor() {
    this.auth = new AuthOptions();
    this.gen3 = undefined;
  }
  //Initialize the APIs with the authentication options after the user has provide the values.
  InitializeWithValues(options: any) {
    //sets the options values for authentication from the user input
    this.auth.setOptionsValuesForAuth(options);

    this.gen3 = new DTApiV3(this.auth);
  }
  GetGen3Api() {
    return this.gen3;
  }
}

export default ApiManager;
