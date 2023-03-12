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

To update th template files before debugging run `npm run copy-assets`
