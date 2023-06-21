# Dynatrace-automation-tools

This CLI allows automating different Dynatrace use-cases to be used with CI/CD or automation platforms. The current implemented use cases:

1. [Site Reliability Guardian Automation](docs/Site-Reliability-Guardian/SRGAutomation.md)
1. [Dynatrace Events](docs/Events/Dynatrace-Events.md)

## Installation options

To use the CLI you have different deployment options:

### Docker container

Use the docker container image from Docker Hub: https://hub.docker.com/repository/docker/dynatraceace/dt-automation-cli. This container is made for CI/CD pipelines, to run it locally you can use the following:

1. `docker run -i -t dynatraceace/dt-automation-cli:latest bash`. This will open terminal inside the container where you can use the commands for the CLI like `/dta -h`. Reference for each command is described in the documentation for each use case.

### Executable app

Download the CLI executable from the Github repo

For Linux users execute the following:

```(bash)
wget https://github.com/dynatrace-ace/dynatrace-automation-tools/releases/download/0.1.0/dta
./chmod +rx ./dta
./dta -h
```

For detail instructions for each use case please refer to the corresponding README file.

### Troubleshooting

To collect different a detail log level of the execution please set the environment variables:

- LOG_LEVEL=verbose
- LOG_FILE=true

This will output a file with the logs for the CLI in the path `logs/logs.log`

## Contributing and development

For development instructions please check [Development](docs/Development.md)
