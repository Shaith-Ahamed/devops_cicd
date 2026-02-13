


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
                        
                        // Trivy scan
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
                              ${buildTag}
                        """
                        
                        // Docker push
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
                        sh "docker build -t ${buildTag} ."

                        // Trivy scan
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
                              ${buildTag}
                        """

                        // Docker push
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

        stage('Terraform Infrastructure') {
            steps {
                script {
                    echo 'Provisioning infrastructure with Terraform...'
                    
                    dir('terraform') {
                        // Initialize Terraform
                        sh 'terraform init'
                        
                        // Validate configuration
                        sh 'terraform validate'
                        
                        // Plan infrastructure changes
                        sh 'terraform plan -out=tfplan'
                        
                        // Apply infrastructure changes
                        sh 'terraform apply -auto-approve tfplan'
                        
                        // Export outputs
                        sh 'terraform output -json > ../output.json'
                    }
                    
                    // Read the instance IPs from output
                    def outputs = readJSON file: 'output.json'
                    env.APP_PUBLIC_IP = outputs.app_public_ip.value[0]
                    env.JENKINS_PUBLIC_IP = outputs.jenkins_public_ip.value
                    env.RDS_ENDPOINT = outputs.rds_endpoint.value
                    
                    echo "Application Server IP: ${env.APP_PUBLIC_IP}"
                    echo "Jenkins Server IP: ${env.JENKINS_PUBLIC_IP}"
                    echo "RDS Endpoint: ${env.RDS_ENDPOINT}"
                }
            }
        }

        stage('Staging Deployment') {
            steps {
                script {
                    echo 'Deploying to application server...'
            
                    sshagent(['app-server-ssh-key']) {
                        sh """
                            ssh -o StrictHostKeyChecking=no ubuntu@${env.APP_PUBLIC_IP} '
                                cd ~/devops_cicd || cd ~/online-education-cicd
                                git pull origin main
                                docker compose down --remove-orphans || true
                                docker compose pull || true
                                docker compose up -d --build
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
