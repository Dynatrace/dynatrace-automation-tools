pipeline {
    agent {
        //It's an image already defined for the pipeline with the Dynatrace Automation CLI. Check the dta-cli-agent.yml file
        label 'dta-runner'
    }
    environment {
        // Credentials  (This are the required credentials to connect to Dynatrace. For more info check the main docs)
        DYNATRACE_URL_GEN3 = 'your-dynatrace-url-gen3'
        ACCOUNT_URN = credentials('ACCOUNT_URN')
        DYNATRACE_CLIENT_ID = credentials('DYNATRACE_CLIENT_ID')
        DYNATRACE_SECRET = credentials('DYNATRACE_SECRET')
        DYNATRACE_SSO_URL = credentials('DYNATRACE_SSO_URL')
        SRG_EVALUATION_SERVICE = 'your-service-name'
        SRG_EVALUATION_STAGE = 'your-stage-name'
    }
    stages {
        //This is a placeholder for the performance test stage
        stage('Run performance test API') {
            steps {
                //this sets the start time of the evaluation
                sh 'echo $(date --utc +%FT%T.000Z) > srg.test.starttime'
                stash includes: 'srg.test.starttime', name: 'srg.test.starttime'
                //waits 60 seconds to simulate a performance test execution
                container('dta') {
                    script {
                        sh 'sleep 60s'
                    }
                }
                sh 'echo $(date --utc +%FT%T.000Z) > srg.test.endtime'
                //this sets the end time of the evaluation
                stash includes: 'srg.test.endtime', name: 'srg.test.endtime'
            }
        }
        stage('Quality Gate') {
            steps {
                unstash 'srg.test.starttime'
                unstash 'srg.test.endtime'
                    container('dta') {
                    sh """
                        eval_start=\$(cat srg.test.starttime)
                        eval_end=\$(cat srg.test.endtime)
                        dta srg evaluate --start-time \$eval_start --end-time \$eval_end
                    """
                    }
            }
        }
    }
}
