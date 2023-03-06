# Development instructions

To run the solution as development mode:

- cd into `cli` folder
- Run `npm install` to get the libraries.
- Run `npm run build` to build the solution
- To execute the CLI use `node dist/index.js`

To use VS Code debugger:

- Check the `.vscode/launch.json`. This file contains the settings to execute a CLI command and set ENV variables in debug mode. You can run the command by using VS Code Debug option and choose the command you want to run.

## Folder structure

The folder `cli/src/common/` contains common functions that could be shared across multiple use cases like Oauth access and Logging functionality.
The folder `cli/src/dynatrace` contains the Dynatrace specific information to interact with the API's. Some of this functions can later be replaced by the Dynatrace SDK libraries as those libraries start getting support for the different endpoints.
The folder `cli/dist` contains the automatically compiled code from typescript to javascript.
The folder `cli/executables` contains the automatically compiled executables.
The folder `cli/logs` contains the logs generated when running a local execution. (folder skipped using gitignore)

## Log levels

By default the log level is set to info, with the available log levels being:

```
  error: 0,
  warn: 1,
  info: 2,
  http: 3,
  debug: 4,
  verbose: 5,
```

You can set your log level by setting the env variable LOG_LEVEL=debug for example.

By default, the logger will output the logs to the console. If you want to enable file logging use the env variable LOG_FILE=true. (by default file logs are at the error level)

## Creating a new use case

1. You can take the folder structure inside `cli/src/use-case-srg` and clone it to create a new use case.
2. To enable the debug mode for the new use case, create a new item in the file `.vscode/launch.json` with the command options.

## Getting a release version of the CLI

To generate a new release of the application ,cd into `cli` and use the command `npm run pack`. This would generate executables in the `cli/executables` folder.
Test the cli by using `./executables/dt-automation-cli-linux -h`.
To generate a new docker container use the command first run `npm run pack` and then `npm run docker`.This would copy the Linux executable file and put it in a docker container.
