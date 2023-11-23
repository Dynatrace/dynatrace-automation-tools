# Github integration

To integrate the `dta` CLI with GitHub for the quality gates use case you can use the [workflow pipeline in this folder](./github.yml) (Note: You need to first manually configure the Dynatrace Workflow and SRG evaluation as described in the main docs).

You can use the Github workflow by running the evaluation job:

```
  evaluation:
    needs: test
    runs-on: ubuntu-latest
    container:
      image: "dynatraceace/dt-automation-cli:latest"
    steps:
      - name: "Run SRG evaluation"
        run: |
          dta srg evaluate
        env:
          LOG_LEVEL: "verbose"
          DYNATRACE_URL_GEN3: ${{ secrets.DYNATRACE_URL_GEN3 }}
          ACCOUNT_URN: ${{ secrets.ACCOUNT_URN }}
          DYNATRACE_CLIENT_ID: ${{ secrets.DYNATRACE_CLIENT_ID }}
          DYNATRACE_SECRET: ${{ secrets.DYNATRACE_SECRET }}
          DYNATRACE_SSO_URL: ${{ secrets.DYNATRACE_SSO_URL }}
          SRG_EVALUATION_STOP_ON_FAILURE: "true"
          SRG_EVALUATION_SERVICE: "demo"
          SRG_EVALUATION_STAGE: "dev"
          SRG_EVALUATION_START_TIME: "${{ needs.test.outputs.startTime }}"
          SRG_EVALUATION_END_TIME: "${{ needs.test.outputs.endTime }}"

```

The `SRG_EVALUATION_SERVICE` and `SRG_EVALUATION_STAGE` are mandatory.

You will need to add the secrets into GitHub secrets. For more information about the required variables check the main docs.

> Note: It's recommended to add the DYNATRACE_URL_GEN3 as a variable instead of a secret to be able to visualize the result URL in the pipeline execution logs.
> Note: As a best practice replace the `latest` tag with a specific image version in the GitHub pipeline.
