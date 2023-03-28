# Site Reliability automation

Allows to automate the process of executing Site Reliability Automation from a CI/CD or automation platform.

## Instructions

Getting started:

1. Follow the guide [Here](./SRGAutomation-initial-setup.md) to configure the base SRG application and workflow.
1. Download the CLI or use the docker container version [Main Docs](../README.md)\
1. Generate an Oauth2 token with the scopes `storage:bizevents:read storage:events:write`. Details about [Authentication](./Authentication.md)
1. Run the command `dt-automation-cli srg execute appName` to trigger a new quality gate evaluation.

## SRG execute command details

The command `dt-automation srg execute appName` triggers a new Site Reliability Guardian evaluation by sending an event into Dynatrace with the required details for the evaluation. On the Dynatrace side, a workflow is listening for the event and triggers a SRG task to execute the evaluation itself.

The required values for this command are:

- appName: This would be used to link the SRG evaluation and the workflow, additional parameters can be used in the optional values.

The available options for this command are:

- start-time and end-time (start-time and end-time )
- timespan (last x mins) (this conflicts with start-time end-time, so only one should be defined)
- stage
- service
- labels
- gitCommitId

The return payload after this command is executed includes:

- evaluation_event_id
- evaluation_result
- evaluation_url_link
