# GitLab integration

You can copy and paste the following code in your GitLab pipeline to integrate a CI/CD process with quality gates.

```
trigger_evaluation_and_receive_result:
  image: dynatraceace/dt-automation-cli:latest
  stage: evaluate
  needs: ["run-tests"]
  variables:
    SRG_EVALUATION_SERVICE: "your-service-name" # This should match your DQL filter in your dynatrace workflow
    SRG_EVALUATION_STAGE: "your-stage-name" # This should match your DQL filter in your dynatrace workflow
    DYNATRACE_URL_GEN3: $DYNATRACE_URL_GEN3
    ACCOUNT_URN: $ACCOUNT_URN
    DYNATRACE_CLIENT_ID: $DYNATRACE_CLIENT_ID
    DYNATRACE_SECRET: $DYNATRACE_SECRET
    DYNATRACE_SSO_URL: $DYNATRACE_SSO_URL
    SRG_EVALUATION_STOP_ON_FAILURE: "true"
  script:
    - export LOG_LEVEL="verbose" # Enable for initial testing, once in production remove this line.
    - dta srg evaluate

```

> Note: As a best practice replace the `latest` tag with a specific image version.

Additionally, if you want to specify a start time or end time of the validation (by default it grabs the last 5 mins of data), you can use the following expression during the test steps:

```
run-tests:
  before_script:
    - echo $(date -u +"%Y-%m-%dT%H:%M:%SZ") > srg.test.starttime
  after_script:
    - echo $(date -u +"%Y-%m-%dT%H:%M:%SZ") > srg.test.endtime
  stage: test
    #image: Replace this with your testing tool in this example we use locust
    image: locustio/locust
    script:
        - echo locust --config locust.conf --locustfile $locustfile.py --host http://testing-dynatrace.com
    artifacts:
        paths:
        - srg.test.starttime
        - srg.test.endtime
```

And modify the `trigger_evaluation_and_receive_result` step

```
#include the previous section with env variables
  script:
    - eval_start=$(cat srg.test.starttime)
    - eval_end=$(cat srg.test.endtime)
    - export LOG_LEVEL="verbose" # Enable for initial testing, once in production remove this line.
    - dta srg evaluate --start-time=$eval_start --end-time=$eval_end
...
```
