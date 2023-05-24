# Authentication

We are using the new Dynatrace authentication for the CLI based on the protocol Oauth2.

## Oauth2 Authentication

To generate a new Oauth2 authentication token. The process is documented here https://www.dynatrace.com/support/help/dynatrace-api/basics/dynatrace-api-authentication/account-api-authentication and an example for BizEvents here authentication (required for the CLI) https://www.dynatrace.com/support/help/platform-modules/business-analytics/ba-events-capturing#newOauth.

After getting the authentication credentials, create the following environment variables before running the command.

For example, in Linux you can use `export ACCOUNT_URN=xxxx`.
In Windows, you can use PowerShell and execute `$env:ACCOUNT_URN='xxxx'`

Required variables:

```
DYNATRACE_URL_GEN3=https://xxxx.apps.xxx.com
ACCOUNT_URN=urn:dtaccount:xxxxx
DYNATRACE_CLIENT_ID=dtxx.xxxxxx
DYNATRACE_SECRET=dtxx.xxxxxxxxxxxxxx
DYNATRACE_SSO_URL=https://sso-xxxx.dynatrace.com/sso/oauth2/token # Only change this variable if you are NOT using a production Dynatrace environment (i.e. sprint,dev)
```

> Note: The authentication values can only be provided as environment variables for security reasons.
> Note2: In the SSO URL don't forget to include the path /sso/oauth2/token
