# Development documentation for Site Reliability Automation

This command uses the AuthOptions to require authentication tokens for Classic and Gen3 API's. The scope for each token is detailed in the main documentation for the command. [SRGAutomation](SRGAutomation.md)

## Using VS Code

To debug with VSCode profiles please create a `.env` file under the `cli` folder with the following variables:

```
DYNATRACE_URL_GEN3=https://xxxx.apps.xxx.com
DYNATRACE_TOKEN=xxxxx
ACCOUNT_URN=urn:dtaccount:xxxxx
DYNATRACE_CLIENT_ID=dtxx.xxxxxx
DYNATRACE_SECRET=dtxx.xxxxxxxxxxxxxx
DYNATRACE_SSO_URL=https://sso-xxxx.dynatrace.com/sso/oauth2/token # this variable depends on your environment stage (sprint,dev or production)
```

## Cloud event description and example

Internally, to trigger a quality gate evaluation using SRG we are using Dynatrace Biz Events with the [Cloud Event standard](https://github.com/cloudevents/spec/blob/v1.0.2/cloudevents/spec.md)

Check the [jsondoc](format-cloud-event.json) for the event example

In this example, the CloudEvents payload includes:

- The **specversion** set to "1.0", which represents the CloudEvents specification version.
- The **type** field is set to "com.dynatrace.event.srg.evaluation.triggered.v1" to indicate that this event triggers a quality gate evaluation.
- The **provider** field contains the source or context of the event, "ci-cd" is used as default, but it can be customized in the CLI.
  The **id** field contains a unique identifier for this event. (source + id should be unique for the event)
  The **datacontenttype** field is set to "application/json", indicating the data payload is in JSON format.

In the data section, the following information is provided:

- The **appName** field contains the specific application name, e.g., "my-example-app".
- The evaluation field contains the details of the quality gate evaluation:
- The timeFrame field specifies the start and end times for the evaluation period.
