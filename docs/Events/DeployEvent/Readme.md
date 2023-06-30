# dta event send deploy

The sub-command `dta event send deploy` sends a deployment event to Dynatrace that updates the [release inventory](https://www.dynatrace.com/support/help/platform-modules/cloud-automation/release-monitoring/monitor-releases-with-dynatrace).

## Getting started with deployment events

1. Go to Dynatrace and find your application Process Group Instance (PGI) in the UI. Locate the combination of tags that uniquely identify your PGI. This information will be used in the entity selector.

   Example image:

   <img src="./assets/entity-selector.png"  width="375" height="200">

1. Run the following command to trigger a new deployment event.

```(bash)
dta event send deploy --entity-selector "type(PROCESS_GROUP_INSTANCE),tag(your-pgi-tag)" --name "app-deploy-v1-example" --version "v1.0.0
```

1. Navigate into Dynatrace and check the release inventory being update with the latest version.

### Required Values

The required values for this command are:

| Command           | Environment variable  | Description                                                                             |
| ----------------- | --------------------- | --------------------------------------------------------------------------------------- |
| --entity-selector | EVENT_ENTITY_SELECTOR | Dynatrace entity selector expression : i.e.type(PROCESS_GROUP_INSTANCE),tag(easytravel) |
| --name            | EVENT_DEPLOY_NAME     | Deployment event name. i.e. App-simplenode-Release-1.0.0                                |
|                   |

### Optional Values

The optional values for this command are:

| Command                   | Environment variable                 | Description                                                                                                                    |
| ------------------------- | ------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------ |
| --version                 | EVENT_DEPLOY_VERSION                 | Deployment version. i.e. 1.0.0. default: ""                                                                                    |
| --project                 | EVENT_DEPLOY_PROJECT                 | Project name. i.e. simple-node-project. default: ""                                                                            |
| --source                  | EVENT_DEPLOY_SOURCE                  | Source name. i.e. Jenkins, Gitlab, etc. default: ""                                                                            |
| --release-stage           | EVENT_DEPLOY_RELEASE_STAGE           | Release stage for the application. i.e. dev, staging, etc. default: ""                                                         |
| --release-product-name    | EVENT_DEPLOY_RELEASE_PRODUCT_NAME    | Release product name (useful when having multiple component of a single application) i.e. your-app-commercial-name default: "" |
| --release-build-version   | EVENT_DEPLOY_RELEASE_BUILD_VERSION   | Release build version i.e. your internal build id (git commit id, cicd build id, etc) default: ""                              |
| --approver                | EVENT_DEPLOY_APPROVER                | Approver name for the deployment. default: ""                                                                                  |
| --ci-back-link            | EVENT_DEPLOY_CI_BACK_LINK            | CI/CD back link i.e. https://pipelines/easytravel/123 . default: ""                                                            |
| --gitcommit               | EVENT_DEPLOY_GITCOMMIT               | Git commit id. default: ""                                                                                                     |
| --change-request          | EVENT_DEPLOY_CHANGE_REQUEST          | Change request code if applicable default: ""                                                                                  |
| --remediation-action-link | EVENT_DEPLOY_REMEDIATION_ACTION_LINK | Remediation link for auto-remediation scenarios that you might want to implement                                               |
| --is-root-cause-relevant  | EVENT_DEPLOY_ROOT_CAUSE_RELEVANT     | Set's if this would be relevant to a root cause analysis from Dynatrace Davis AI. default: true                                |

## Resources

- [Dynatrace Events V2 API docs](https://www.dynatrace.com/support/help/dynatrace-api/environment-api/events-v2/get-event-types)
