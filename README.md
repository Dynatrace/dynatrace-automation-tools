# dynatrace-automation-tools

This CLI allows to automate different Dynatrace use-cases to be use with CI/CD or automation platforms. The current implemented use cases:

1. [Site Reliability Guardian Automation](docs/SRGAutomation.md)

## Installation options

To use the CLI you have different deployment options:

### Docker container

Use the docker container image from DockerHub: https://hub.docker.com/repository/docker/dynatraceace/dt-automation-cli. This container is made for CI/CD pipelines, to run it locally you can use the following:

1. `docker run -i -t dynatraceace/dt-automation-cli:latest bash`. It will open terminal inside the container where you can use the commands for the CLI like `./dt-automation-cli-linux -h`. Reference for each command is described in the documentation for each use case.

### Executable app

Download the CLI executable from this repo.

For Linux users execute the following:

```(bash)
wget https://github.com/dynatrace-ace/dynatrace-automation-tools/releases/download/0.1.0/dt-automation-cli-linux
./chmod +rx ./dt-automation-cli-linux
./dt-automation-cli-linux -h
```

For detail instructions for each use case please refer to the corresponding readme file.

## Development

For development instructions please check [Development](docs/Development.md)
