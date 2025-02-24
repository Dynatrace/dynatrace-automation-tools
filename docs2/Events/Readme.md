# Dynatrace Events

The `dta event` command automates the process of sending events to Dynatrace.

Pre-requisites:

- Dynatrace One agent installed monitoring the target process/service.

## Getting started

1. Download the CLI from this repo or use the docker container version [Main Docs](/README.md).
1. Generate an Oauth2 token with the scopes `storage:events:write`. Details about generating and configuring [Authentication](/docs/Authentication.md) tokens.
1. Follow instructions specific for each sub-command.

## Available sub-commands

1. `dta event send deploy` [Sends deployment events](/docs/Events/DeployEvent/Readme.md)
