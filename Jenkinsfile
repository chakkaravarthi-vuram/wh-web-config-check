pipeline {
  agent {
    label 'master'
  }
  environment {
    ENVIRONMENT = 'release'
    PACKAGE_ACCESS_TOKEN = credentials('ui-library-read-token')
    ACTIVE_JOB = 'wh-react-web-frontend'
  }
  stages {
    stage('Install NPM Packages') {
      steps {
        sh "npm install"
      }
    }
    stage('Verify Unit Testcases') {
      steps {
        echo 'Skipping Unit-testcases Verification'
      }
    }
    stage('Versioning through semantic release') {
      steps {
        withCredentials([string(credentialsId: 'release-git-token', variable: 'GH_TOKEN')]) {
          script {
            env.VERSION = ""
            semantic_output = sh(returnStdout: true, script: "npx semantic-release | tail -n 1").trim()
            echo "Semantic version update output: ${semantic_output}"
            def versionMatcher = '(\\d+\\.\\d+\\.\\d+)'
            def matcher = semantic_output =~ versionMatcher
            if (matcher.find()) {
              def extractedVersion = matcher.group(1)
              echo "Extracted version: ${extractedVersion}"
              env.VERSION = extractedVersion
            } else {
              echo "Version not found in the output."
            }
          }
        }
      }
    }
    stage('Load Environment Variables') {
      steps {
        sh "aws s3 cp --recursive s3://jenkins-server-configs/$ACTIVE_JOB/envs ."
        script {
          env.DEPLOY_LOC = sh(returnStdout: true, script: "node get_props.js LABEL $ENVIRONMENT").trim()
          env.DOCKER_REPO = sh(returnStdout: true, script: "node get_props.js DOCKER_REPO $ENVIRONMENT").trim()
          env.NODE_LOC = sh(returnStdout: true, script: "node get_props.js NODE_LOC $ENVIRONMENT").trim()
          env.DOCKER_REPO_URL = sh(returnStdout: true, script: "node get_props.js DOCKER_REPO_URL $ENVIRONMENT").trim()
          env.ECS_FAMILY = sh(returnStdout: true, script: "node get_props.js ECS_FAMILY $ENVIRONMENT").trim()
          env.ECS_NAME = sh(returnStdout: true, script: "node get_props.js ECS_NAME $ENVIRONMENT").trim()
          env.ECS_PORT = sh(returnStdout: true, script: "node get_props.js ECS_PORT $ENVIRONMENT").trim()
          env.ECS_APP_NAME = sh(returnStdout: true, script: "node get_props.js ECS_APP_NAME $ENVIRONMENT").trim()
          env.ECS_DEPLOY_GROUP_NAME = sh(returnStdout: true, script: "node get_props.js ECS_DEPLOY_GROUP_NAME $ENVIRONMENT").trim()
          env.DOCKER_FILE_NAME = sh(returnStdout: true, script: "node get_props.js DOCKER_FILE_NAME $ENVIRONMENT").trim()
          env.ECS_S3_PREFIX = sh(returnStdout: true, script: "node get_props.js ECS_S3_PREFIX $ENVIRONMENT").trim()
        }
      }
    }
    stage('Get old docker image version tag') {
      steps {
        sh "aws s3 cp --recursive s3://jenkins-server-configs/$ACTIVE_JOB/$ENVIRONMENT ."
        script {
          env.REPO_NAME = env.DOCKER_REPO.split("/")[1]
          echo "REPO NAME: ${env.REPO_NAME}"
          if (env.VERSION?.trim() == "") {
            env.VERSION = sh(returnStdout: true, script: "bash ./deployment/version_tag_formatter.sh").trim()
          }
          echo "VERSION NAME: ${env.VERSION}"
          env.DOCKER_IMAGE_TAG = "${DOCKER_REPO}:${env.VERSION}"
        }
      }
    }
    stage('Generate Production build') {
      agent {
        label 'master'
      }
      steps {
        withCredentials([string(credentialsId: 'ui-library-read-token', variable: 'PACKAGE_ACCESS_TOKEN')]) {
          sh 'CI=false npm i'
        }
        sh 'CI=false npm run build'
        sh "aws s3 cp --recursive s3://jenkins-server-configs/$ACTIVE_JOB/$ENVIRONMENT ."
        sh 'sh ./deployment/build_docker.sh'
      }
    }

    stage('docker deploy to ECS') {
        agent {
          label 'master'
        }
        steps {
          sh "aws s3 cp --recursive s3://jenkins-server-configs/$ACTIVE_JOB/$ENVIRONMENT ."
          withCredentials([string(credentialsId: 'docker_conn_string', variable: 'PW1'), string(credentialsId: 'invoke_argo_dev_token', variable: 'INVOKE_GIT_ACTION_TOKEN_DEV')]) {
          sh "bash deploy_to_k8s.sh"
          //step([$class: 'AWSCodeDeployPublisher', applicationName: "${ECS_APP_NAME}", credentials: 'awsAccessKey',awsAccessKey:"${access}", awsSecretKey:"${secret}", deploymentGroupAppspec: false, deploymentGroupName: "${ECS_DEPLOY_GROUP_NAME}", deploymentMethod: 'CodeDeployDefault.ECSAllAtOnce', excludes: '', iamRoleArn: '', includes: 'appspec.yaml', proxyHost: '', proxyPort: 0, region: 'ap-south-1', s3bucket: 'wh-ecs-test-generated-deploy', s3prefix: "${ECS_S3_PREFIX}", subdirectory: '', versionFileName: '', waitForCompletion: false])
          }
        }
    }
      stage('update latest docker image') {
      agent {
        label 'master'
      }
      steps {
          sh "aws s3 cp --recursive s3://jenkins-server-configs/$ACTIVE_JOB/$ENVIRONMENT ."
        withCredentials([string(credentialsId: 'docker_conn_string', variable: 'PW1')]) {
          sh 'python3 deployment/update_docker_image_version.py ${PW1} ${ACTIVE_JOB} ${ENVIRONMENT} ${DOCKER_IMAGE_TAG}'
        }
      }
      }
  }
}
