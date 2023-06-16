# Github integration

To integrate the `dta` CLI with GitHub for the quality gates use case you can use the action `dta-docker` that is in this folder. This action takes the docker image for the CLI and executes the command `/dta srg evaluate` to trigger a new quality gate evaluation. (Note: You need to first manually configure the Dynatrace Workflow and SRG evaluation as described in the main docs).

You can consume the Github action in a workflow like the following example:

```

       - id: build-release
        name: Run CLI with SRG use case
        uses: ./.github/actions/dta-docker #update this reference to where you are hosting the dta-docker action
        with:
          dt-url: ${{ inputs.DYNATRACE_URL_GEN3 }}
          dt-account-urn: ${{ secrets.ACCOUNT_URN }}
          dt-client-id: ${{ secrets.DYNATRACE_CLIENT_ID }}
          dt-client-secret: ${{ secrets.DYNATRACE_SECRET }}
          dt-sso-url: ${{ secrets.DYNATRACE_SSO_URL }}
          srg-timespan: "5" #this would grab the last 5 mins
          dt-service-name: "demo-cli-service"
          dt-stage-name: "dev"

```

The `dt-service-name` and `dt-stage-name` are mandatory.

You will need to add the secrets into GitHub secrets. For more information about the required variables check the main docs.

> Note: It's recommended to add the DYNATRACE_URL_GEN3 as a variable instead of a secret to be able to visualize the result URL in the pipeline execution logs.
> Note: As a best practice replace the `latest` tag with a specific image version in the GitHub action.
