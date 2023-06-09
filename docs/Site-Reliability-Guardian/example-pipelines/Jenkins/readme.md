# Jenkins integration

For Jenkins, we are using a container definition to create an agent with the Dynatrace Automation CLI and then referencing that agent in the pipeline.

To create an agent you need to specify the agent configuration (using Jenkins as Code as reference)

```
              - containers:
                - args: "cat"
                  command: "/bin/sh -c"
                  image: "dynatraceace/dt-automation-cli:latest"
                  livenessProbe:
                    failureThreshold: 0
                    initialDelaySeconds: 0
                    periodSeconds: 0
                    successThreshold: 0
                    timeoutSeconds: 0
                  name: "dta"
                  ttyEnabled: true
                  workingDir: "/home/jenkins/agent"
                label: "dta-runner"
                name: "dta-runner"
                slaveConnectTimeout: 300
                slaveConnectTimeoutStr: "300"
                yamlMergeStrategy: "override"

```

> Note: As a best practice replace the `latest` tag with a specific image version.

> Note: Alternately, some version of Jenkins can directly consume docker containers when combined with Docker plugins. So you don't need to install the container before using the docker image in the pipeline.

Then you can create a new quality gate step in a Jenkins pipeline like:

```
pipeline {
    environment {
        // Credentials  (This are the required credentials to connect to Dynatrace. For more info check the main docs)
        DYNATRACE_URL_GEN3 = "${env.DYNATRACE_URL_GEN3}"
        ACCOUNT_URN = credentials('ACCOUNT_URN')
        DYNATRACE_CLIENT_ID = credentials('DYNATRACE_CLIENT_ID')
        DYNATRACE_SECRET = credentials('DYNATRACE_SECRET')
        DYNATRACE_SSO_URL = credentials('DYNATRACE_SSO_URL')
        APPNAME = 'your-app-name-here'
    }
    stages {
        stage('Quality Gate') {
            agent {
                label 'dta-runner'
            }
            steps {
                    container('dta') {
                    sh """
                        /dta srg evaluate \$APPNAME
                    """
                    }
            }
        }
    }
}
```

If you want to run a load test and then specify the start time and end time of the evaluation as the start and end time of the test use the following code:

```
pipeline {
    environment {
        // Credentials  (This are the required credentials to connect to Dynatrace. For more info check the main docs)
        DYNATRACE_URL_GEN3 = "${env.DYNATRACE_URL_GEN3}"
        ACCOUNT_URN = credentials('ACCOUNT_URN')
        DYNATRACE_CLIENT_ID = credentials('DYNATRACE_CLIENT_ID')
        DYNATRACE_SECRET = credentials('DYNATRACE_SECRET')
        DYNATRACE_SSO_URL = credentials('DYNATRACE_SSO_URL')
        APPNAME = 'your-app-name-here'
    }
    stages {
      //This performance test uses locust but you can use any testing/load generating tool
        stage('Run performance test API') {
            agent {
                label 'locust-runner'
            }
            steps {
                checkout scm
                //this sets the start time of the evaluation
                sh 'echo $(date --utc +%FT%T.000Z) > srg.test.starttime'
                stash includes: 'srg.test.starttime', name: 'srg.test.starttime'
                container('locust') {
                    script {
                        sh "echo ${env.LOCUST_HOST}"
                        sh "locust --headless --locustfile locustfile.py -t 5m -u 10 -r 10 --host http://testing-app-environment.com"
                    }
                }
                sh 'echo $(date --utc +%FT%T.000Z) > srg.test.endtime'
                //this sets the end time of the evaluation
                stash includes: 'srg.test.endtime', name: 'srg.test.endtime'
            }
        }
        stage('Quality Gate') {
            agent {
                label 'dta-runner'
            }
            steps {
                    container('dta') {
                    sh """
                        eval_start=\$(cat srg.test.starttime)
                        eval_end=\$(cat srg.test.endtime)
                        /dta srg evaluate --start-time \$eval_start --end-time \$eval_end \$APPNAME
                    """
                    }
            }
        }
    }
}

```
