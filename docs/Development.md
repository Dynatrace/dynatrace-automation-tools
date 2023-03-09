# Development instructions

To run the solution as development mode:

- cd into `cli` folder
- Run `npm install` to get the libraries.
- Run `npm run build` to build the solution
- To execute the CLI use `node dist/index.js`
- To start the automatic compilation mode when something changes run `npm run dev`

## Using VS Code

- Check the `.vscode/launch.json`. This file contains the settings to execute a CLI command. You can run the command by using VS Code Debug option and choose the command you want to run.
- Some commands added in the `launch.json` might require the usage of an environment file to hold the required variables. Please create a file named `.env` in the `cli` folder. By default, this file is not committed and can hold secrets. Check more details in each dev documentation for the command.

## Folder structure

The folder `cli/src/common/` contains common functions that could be shared across multiple use cases like OAuth access and Logging functionality.
The folder `cli/src/dynatrace` contains the Dynatrace specific information to interact with the API's. Some of these functions can later be replaced by the Dynatrace SDK libraries as those libraries start getting support for the different endpoints.

- AuthOptions: A class that wraps the logic to access tokens from gen3 (oauth2) or classic tokens. Check the reference usage in the SRG command. This class is shared to avoid requiring the same properties for each command but it should be added to each automation since requirements might differ (i.e. some automations might only require gen3 access).
  The folder `cli/dist` contains the automatically compiled code from typescript to javascript.
  The folder `cli/executables` contains the automatically compiled executables.
  The folder `cli/logs` contains the logs generated when running a local execution. (folder skipped using .gitignore)

## Log levels

By default, the log level is set to info, with the available log levels being:

```(bash)
  error: 0, Every time you have an error in the application that would block the user from going foward.
  warn: 1, When something is missing or some error is happening but it doesn't affect the end result.
  info: 2, Use it to log information that you consider important for the final user in a happy path. Like current progress of an automation
  http: 3, Not commonly use. Mainly for registering when an http call in made
  debug: 4, Use for general troubleshooting and understanding which part of the code is failing
  verbose: 5, Use this level when trying to troubleshoot an specific problem and have the need to visualize the details of the methods. Don't use it in production since it might log secret information.
```

You can set your log level by setting the env variable LOG_LEVEL=debug for example.

By default, the logger will output the logs to the console. If you want to enable file logging use the env variable LOG_FILE=true. (by default file logs are at the error level)

## Creating a new use case

1. You can take the folder structure inside `cli/src/automation-srg` and clone it to create a new use case.
2. To enable the debug mode for the new use case, create a new item in the file `.vscode/launch.json` with the command options.

## Getting a release version of the CLI

To generate a new release of the application ,cd into `cli` and use the command `npm run pack`. This would generate executables in the `cli/executables` folder.
Test the Cli by using `./executables/dt-automation-cli-linux -h`.
To generate a new docker container use the command first run `npm run pack` and then `npm run docker`. This would copy the Linux executable file and put it in a docker container.
