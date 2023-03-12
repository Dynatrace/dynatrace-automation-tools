# Site Reliability automation

This feature allows to automate the process of creating and executing Site Reliability Guardian from a CI/CD or automation platform.

## Instructions

Getting started in 5 mins:

1. Download the CLI or use the docker container version [Main Docs](../README.md)\
1. Generate an Oauth2 token with the scopes `automation:workflows:write`. Details about [Authentication](./Authentication.md)
1. Generate a classic token authentication with scope for `settings.read settings.write`.
1. Run the command `dt-automation-cli srg configure --template=performance` to start the configuration process.
1. Run the command `dt-automation-cli srg evaluate` to trigger a new quality gate evaluation.

## SRG configure command

The SRG configure command allows to configure an SRG application and a workflow to trigger the evaluation by using a template. By default, you have 3 different templates available:

- performance: Measures the performance of the application using response time and error rate as base metrics.
- security
- cost

You can also customize the templates and create your own version by using the command `srg generate --template=performance -o=./template-folder` and specifying the output folder.

To execute a custom template use the command `srg configure --template-path=./template-folder`. This would take the template in the specified folder and apply it to the target environment.

To learn more about template creation check section below Advanced Use Case:Generating custom templates

## SRG evaluate command

## Advanced Use Case:Generating custom templates

To generate a custom template follow the steps:
