# Site Reliability automation

This feature allows to automate the process of creating and executing Site Reliability Automation from a CI/CD or automation platform.
Currently 2 funcionalities are implemented:

## Configure evaluation

Automatically creates a new Site Reliability project with a DQL definition for the target app and creates a Dynatrace workflow to trigger this project.
Steps:

1. Create a Dyntrace Oauth Token. Detail process documented [here](TokenCreation.md). The scope of this token should include `automation:workflows:write app-engine:apps:run`
2. Get the CLI or the docker container version as describe in the main documentation.
3. Run the command by using `dt-automation-cli srg configure appNameHere`. You will need to set the required variables as arguments or as environment variables. The CLI is self documented with the name of each variable specified in the CLI description.

Required variables:
account
