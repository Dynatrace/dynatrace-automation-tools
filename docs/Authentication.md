# Authentication

Currently, there are 2 ways to authenticate with Dynatrace depending on the API to be use.

## Oauth2 Authentication

To generate a new Oauth2 authentication token. The process if documented here https://www.dynatrace.com/support/help/dynatrace-api/basics/dynatrace-api-authentication/account-api-authentication and an example for BizEvents here https://www.dynatrace.com/support/help/platform-modules/business-analytics/ba-events-capturing#newOauth.

After getting the authentication credentials, create the following environment variables before running the command.
For example, in Linux you can use `export ACCOUNT_URN=xxxx`.
In Windows, you can use PowerShell and execute `$env:ACCOUNT_URN='xxxx'`

```
DYNATRACE_URL_GEN3=https://xxxx.apps.xxx.com
ACCOUNT_URN=urn:dtaccount:xxxxx
DYNATRACE_CLIENT_ID=dtxx.xxxxxx
DYNATRACE_SECRET=dtxx.xxxxxxxxxxxxxx
DYNATRACE_SSO_URL=https://sso-xxxx.dynatrace.com/sso/oauth2/token # this variable depends on your environment stage (sprint,dev or production)
```

> Note: The authentication values can only be provided as environment variables for security reasons.

## Token Authentication

Follow this guide to generate a token authentication with the required scopes https://www.dynatrace.com/support/help/dynatrace-api/basics/dynatrace-api-authentication.
After getting the authentication credentials, create the following environment variables before running the command.
For example, in Linux you can use `export DYNATRACE_URL=xxxx`.
In Windows, you can use PowerShell and execute `$env:DYNATRACE_URL='xxxx'`

```
DYNATRACE_URL=https://xxxx.dynatrace.com
DYNATRACE_TOKEN=xxx
```

> Note: The authentication values can only be provided as environment variables for security reasons.
