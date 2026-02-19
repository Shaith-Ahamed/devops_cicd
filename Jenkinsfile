pipeline {
    agent any
    tools {
        jdk 'jdk17'
        maven 'maven3'
    }
    environment {
        GITHUB_CRED = 'GitHub-Token'
        DOCKERHUB_CRED = 'DockerHub-Token'
        SONAR_CLOUD_CRED = 'SonarCloud-Token'
        BACKEND_IMAGE = 'shaith/online-education-backend'
        FRONTEND_IMAGE = 'shaith/online-education-frontend'
        TRIVY_CACHE = '/tmp/trivy-cache'
        TRIVY_TIMEOUT = '30m'
        APP_SERVER_IP = '52.5.195.236'
    }

    stages {

        stage('clean workspace') {
            steps {
                deleteDir()
            }
        }

        stage('Code Checkout') {
            steps {
                git branch: 'main',
                    changelog: false,
                    poll: false,
                    url: 'https://github.com/Shaith-Ahamed/devops_cicd.git',
                    credentialsId: "${GITHUB_CRED}"
            }
        }

        stage('Backend: Clean & Compile') {
            steps {
                dir('backend') {  
                    sh "mvn clean compile"
                }
            }
        }

        stage('Backend: SonarCloud Analysis') {
            steps {
                dir('backend') { 
                    withCredentials([string(credentialsId: "${SONAR_CLOUD_CRED}", variable: 'SONAR_TOKEN')]) {
                        sh """
                            mvn sonar:sonar \
                              -Dsonar.projectKey=devops_cicd \
                              -Dsonar.organization=shaith-ahamed \
                              -Dsonar.host.url=https://sonarcloud.io \
                              -Dsonar.login=$SONAR_TOKEN \
                              -Dsonar.java.binaries=target/classes
                        """
                    }
                }
            }
        }

        stage('Backend: Package') {
            steps {
                dir('backend') {  
                    sh "mvn package -DskipTests"
                }
            }
        }

        stage('Backend: Docker Build & Push') {
            steps {
                dir('backend') {  
                    script {
                        def buildTag = "${BACKEND_IMAGE}:${BUILD_NUMBER}"
                        def latestTag = "${BACKEND_IMAGE}:latest"
                        sh "docker build -t ${buildTag} -f Dockerfile ."

                        sh """
                            docker run --rm \
                              -v /var/run/docker.sock:/var/run/docker.sock \
                              -v ${TRIVY_CACHE}:/root/.cache/ \
                              aquasec/trivy image \
                              --scanners vuln \
                              --severity HIGH,CRITICAL \
                              --format table \
                              --exit-code 0 \
                              --timeout ${TRIVY_TIMEOUT} \
                            //   --skip-java-db-update \
                            //   --skip-db-update \
                              ${buildTag} || echo 'Trivy scan warning - continuing pipeline'
                        """

                        withDockerRegistry(credentialsId: "${DOCKERHUB_CRED}", url: '') {
                            sh "docker tag ${buildTag} ${latestTag}"
                            sh "docker push ${buildTag}"
                            sh "docker push ${latestTag}"
                            env.BACKEND_BUILD_TAG = buildTag
                        }
                    }
                }
            }
        }

        stage('Frontend: Docker Build & Push') {
            steps { 
                dir('frontend') {  
                    script {
                        def buildTag = "${FRONTEND_IMAGE}:${BUILD_NUMBER}"
                        def latestTag = "${FRONTEND_IMAGE}:latest"
                        sh "docker build --build-arg VITE_API_BASE=http://${APP_SERVER_IP}:8081 -t ${buildTag} ."

                        sh """
                            docker run --rm \
                              -v /var/run/docker.sock:/var/run/docker.sock \
                              -v ${TRIVY_CACHE}:/root/.cache/ \
                              aquasec/trivy image \
                              --scanners vuln \
                              --severity HIGH,CRITICAL \
                              --format table \
                              --exit-code 0 \
                              --timeout ${TRIVY_TIMEOUT} \
                            //   --skip-java-db-update \
                            //   --skip-db-update \
                              ${buildTag} || echo 'Trivy scan warning - continuing pipeline'
                        """

                        withDockerRegistry(credentialsId: "${DOCKERHUB_CRED}", url: '') {
                            sh "docker tag ${buildTag} ${latestTag}"
                            sh "docker push ${buildTag}"
                            sh "docker push ${latestTag}"
                            env.FRONTEND_BUILD_TAG = buildTag
                        }
                    }
                }
            }
        }

        stage('Staging Deployment') {
            steps {
                script {
                    echo 'Deploying to application server...'
            
                    sshagent(['app-server-ssh-key']) {
                        sh """
                            ssh -o StrictHostKeyChecking=no ubuntu@${APP_SERVER_IP} '
                                cd ~/devops_cicd
                                git pull origin main
                                docker-compose down || true
                                docker pull ${BACKEND_IMAGE}:latest
                                docker pull ${FRONTEND_IMAGE}:latest
                                docker-compose up -d
                                docker ps
                            '
                        """
                    }
                }
            }
        }
    }

    post {
        always {
            echo 'Cleaning up workspace...'
            cleanWs()
        }
        success {
            echo 'Pipeline completed successfully!'
            echo "Backend Image: ${env.BACKEND_BUILD_TAG}"
            echo "Frontend Image: ${env.FRONTEND_BUILD_TAG}"
        }
        failure {
            echo 'Pipeline failed!'
        }
    }
}
