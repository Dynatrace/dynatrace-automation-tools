# Contribution guide and project organization

The main objective of *dynatrace-automation-tools* is to provide a simplified, yet comprehensive interface to Dynatrace with focus on automation use cases. Everybody is welcome to contribute new automations, use cases, templates, ... . Therefore, *CONTRIBUTING.md* explains recommended way of working, Github features in use, etc. of this repository.

## Labels

### Automation related

|Label|Description|
|---|---|
|SRG-automation|Everything related to SRG automation functionality|
|Main-CLI|Everything related to main cli functionality including common features and libraries, CI/CD automation to compile and release and general documentation.|

### Other labels

|Label|Description|
|---|---|
|architecture|Should be use to describe and document architecture decisions. This is an epic level task, that should result in the creation of smaller tasks with development, research or documentation tasks. Initially, use a single architecture issue per automation (i.e. one for SRG automation) so that we can collect all related info in a single ticket. (For specific development, or research information or progress use the child tickets created from this task).|
|development|Should be use for actual development work (branches should be created based on this ticket level)
|documentation|For documentation related work.|
|research|Should be use for research topics or tentative solutions for a problem. After the research is done, a development or documentation ticket should be created for the actual work.|
|bug|To fix current functionalities already merged in dev.|

## Projects

To allow for ease of use of the multiple issues and features each automation should have it's own project.

Main CLI: Tracks progress of tasks related to the general CLI architecture or documentation. i.e. cicd automation, security linting, logging, etc.
SRG Automation: Tracks the progress of SRG CLI tasks including configuration, execution and templating.

## Milestones

Milestones should be defined to stablish release dates and features to be included in the CLI. We will use the Github Milestones functionality for this. https://docs.github.com/en/issues/using-labels-and-milestones-to-track-work/about-milestones.

## Contributing

### How to contribute

- TBD: Branching & Commits
- TBD: Testing
- TBD: Linting
- TBD: Pre-commit secret detection
- ...

### How to add a Automation

Automation definition: A automation should be a new main command added to the CLI. It should have a business purpose behind the requirement. Since this has to be defined case by case, please check with the team before creating an automation.

After defining the automation, create a new label and a new project and put the documentation here for the project structure.
After that, create a feature ticket with the architecture tag to collect all the main business requirements and architecture details.
