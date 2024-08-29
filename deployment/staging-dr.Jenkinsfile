pipeline {
  agent {
    label 'master'
  }
  environment {
    SLACK_CHANNEL = 'build-status'
    ENVIRONMENT = 'staging-dr'
    ACTIVE_JOB = 'wh-react-web-frontend'
  }
  stages {
    stage('Load Environment Variables') {
      steps {
        sh "aws s3 cp --recursive s3://jenkins-server-configs/$ACTIVE_JOB/envs ."
        script {
          env.APP_SPEC_S3 = sh(returnStdout: true, script: "node get_props.js APP_SPEC_S3 $ENVIRONMENT").trim()
          env.DOCKER_REPO = sh(returnStdout: true, script: "node get_props.js DOCKER_REPO $ENVIRONMENT").trim()
          env.NEW_DOCKER_IMAGE_TAG = "${DOCKER_REPO}:${BUILD_NUMBER}"
          env.DOCKER_REPO_URL = sh(returnStdout: true, script: "node get_props.js DOCKER_REPO_URL $ENVIRONMENT").trim()
          env.ECS_FAMILY = sh(returnStdout: true, script: "node get_props.js ECS_FAMILY $ENVIRONMENT").trim()
          env.ECS_NAME = sh(returnStdout: true, script: "node get_props.js ECS_NAME $ENVIRONMENT").trim()
          env.ECS_PORT = sh(returnStdout: true, script: "node get_props.js ECS_PORT $ENVIRONMENT").trim()
          env.ECS_APP_NAME = sh(returnStdout: true, script: "node get_props.js ECS_APP_NAME $ENVIRONMENT").trim()
          env.ECS_DEPLOY_GROUP_NAME = sh(returnStdout: true, script: "node get_props.js ECS_DEPLOY_GROUP_NAME $ENVIRONMENT").trim()
          env.ECS_S3_PREFIX = sh(returnStdout: true, script: "node get_props.js ECS_S3_PREFIX $ENVIRONMENT").trim()
        }
      }
    }
    stage('Deploy to ECS Stagging') {
      agent {
        label 'master'
      }
      steps {
        sh "aws s3 cp --recursive s3://jenkins-server-configs/$ACTIVE_JOB/staging-dr ."
        withCredentials([string(credentialsId: 'docker_conn_string', variable: 'PW1'), string(credentialsId: 'code-deploy-access-aws-staging', variable: 'access'), string(credentialsId: 'code-deploy-secret-aws-staging', variable: 'secret')]) {
          sh "sh ./deploy_to_ecs_staging_dr.sh"
          step([$class: 'AWSCodeDeployPublisher', applicationName: "${ECS_APP_NAME}", credentials: 'awsAccessKey', awsAccessKey:"${access}", awsSecretKey:"${secret}", deploymentGroupAppspec: false, deploymentGroupName: "${ECS_DEPLOY_GROUP_NAME}", deploymentMethod: 'CodeDeployDefault.ECSAllAtOnce', excludes: '', iamRoleArn: '', includes: 'appspec.yaml', proxyHost: '', proxyPort: 0, region: 'us-east-1', s3bucket: "${APP_SPEC_S3}", s3prefix: "${ECS_S3_PREFIX}", subdirectory: '', versionFileName: '', waitForCompletion: false])
        }
      }
    }
  }
  post {
    success {
      script {
        slackSend(channel: "${SLACK_CHANNEL}", message: "Job ${JOB_NAME} ( build: ${BUILD_NUMBER}) is successfully deployed", color: 'good')
      }
    }
    failure {
      script {
        slackSend(channel: "${SLACK_CHANNEL}", message: "Job ${JOB_NAME} is failed", color: '#FF0000')
      }
    }
  }
}
