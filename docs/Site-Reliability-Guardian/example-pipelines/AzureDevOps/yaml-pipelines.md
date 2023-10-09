# Azure DevOps integration using YAML pipelines

To integrate the CLI with Azure DevOps you can use the yaml pipeline that references a docker container:

- Please check the Microsoft pre-requisites for this [here](https://learn.microsoft.com/en-us/azure/devops/pipelines/process/container-phases?view=azure-devops)

```(bash)
  trigger:
  - main
  pool:
    vmImage: 'ubuntu-latest'
  container: dynatraceace/dt-automation-cli:latest
  steps:
  - bash: |
      export LOG_LEVEL="verbose"
      dta srg evaluate --stage="your-stage-here" --service="your-service-name"
    env:
      DYNATRACE_URL_GEN3: $(DYNATRACE_URL_GEN3)
      DYNATRACE_CLIENT_ID: $(DYNATRACE_CLIENT_ID)
      DYNATRACE_SECRET: $(DYNATRACE_SECRET)
      DYNATRACE_SSO_URL: $(DYNATRACE_SSO_URL)
      ACCOUNT_URN: $(ACCOUNT_URN)
    name: srg_evaluation
```

> Note: As a best practice replace the `latest` tag with a specific image version.

If you want to trigger the evaluation for the start/end time of the load test you can set the capture those values using the following:

```(bash)
  - bash: |
      start=$(date -d '1 hour ago' --utc +%FT%TZ)
      end=$(date --utc +%FT%TZ)
      echo "##vso[task.setvariable variable=start;isoutput=true]$start"
      #execute load test here
      echo "##vso[task.setvariable variable=end;isoutput=true]$end"
    name: evalTime
```

After that you can use those values in the quality gate execution like:

```(bash)
  - bash: |
      export LOG_LEVEL="verbose"
      dta srg evaluate --start-time=$(evalTime.start) --end-time=$(evalTime.end) --stage="your-stage-here" --service="your-service-name"
    env:
      DYNATRACE_URL_GEN3: $(DYNATRACE_URL_GEN3)
      DYNATRACE_CLIENT_ID: $(DYNATRACE_CLIENT_ID)
      DYNATRACE_SECRET: $(DYNATRACE_SECRET)
      DYNATRACE_SSO_URL: $(DYNATRACE_SSO_URL)
      ACCOUNT_URN: $(ACCOUNT_URN)
    name: srg_evaluation
```
