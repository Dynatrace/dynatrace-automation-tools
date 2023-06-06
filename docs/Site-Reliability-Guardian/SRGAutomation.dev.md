# Development documentation for Site Reliability Automation

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

To pack the application cd into the cli folder and run `npm run pack` and then to build a container to test use `docker build -t dta .`

## Cloud event description and example

Internally, to trigger a quality gate evaluation using SRG we are using Dynatrace Biz Event that is documented on the SRG help section in the app.
