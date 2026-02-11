// pipeline {
//     agent any
//     tools {
//         jdk 'jdk17'
//         maven 'maven3'
//     }
//     environment {
//         GITHUB_CRED = 'GitHub-Token'
//         DOCKERHUB_CRED = 'DockerHub-Token'
//         SONAR_CRED = 'SonarQube-Token'
//         BACKEND_IMAGE = 'shaith/online-education-backend'
//         FRONTEND_IMAGE = 'shaith/online-education-frontend'
//         TRIVY_CACHE = '/tmp/trivy-cache'
//         TRIVY_TIMEOUT = '30m'  // Increased timeout
//     }
//     stages {
//         stage('Code Checkout') {
//             steps {
//                 git branch: 'main',
//                     changelog: false,
//                     poll: false,
//                     url: 'https://github.com/Shaith-Ahamed/devops_cicd.git',
//                     credentialsId: "${GITHUB_CRED}"
//             }
//         }

//         stage('Backend: Clean & Compile') {
//             steps {
//                 dir('backend') {  
//                     sh "mvn clean compile"
//                 }
//             }
//         }

//         stage('Backend: SonarQube Analysis') {
//             steps {
//                 dir('backend') { 
//                     withCredentials([string(credentialsId: "${SONAR_CRED}", variable: 'SONAR_TOKEN')]) {
//                         sh '''
//                             mvn sonar:sonar \
//                                 -Dsonar.host.url=http://sonarqube:9000 \
//                                 -Dsonar.token=$SONAR_TOKEN \
//                                 -Dsonar.java.binaries=target/classes
//                         '''
//                     }
//                 }
//             }
//         }

//         stage('Backend: Package') {
//             steps {
//                 dir('backend') {  
//                     sh "mvn package -DskipTests"
//                 }
//             }
//         }

//         stage('Backend: Docker Build') {
//             steps {
//                 dir('backend') {  
//                     script {
//                         sh "docker build -t ${BACKEND_IMAGE}:${BUILD_NUMBER} -f Dockerfile ."
//                     }
//                 }
//             }
//         }

//         stage('Backend: Trivy Scan') {
//             steps {
//                 script {
//                     sh """
//                         docker run --rm \
//                             -v /var/run/docker.sock:/var/run/docker.sock \
//                             -v ${TRIVY_CACHE}:/root/.cache/ \
//                             aquasec/trivy image \
//                             --scanners vuln \
//                             --severity HIGH,CRITICAL \
//                             --format table \
//                             --exit-code 0 \
//                             --timeout ${TRIVY_TIMEOUT} \
//                             ${BACKEND_IMAGE}:${BUILD_NUMBER}
//                     """
//                 }
//             }
//         }

//         stage('Backend: Docker Push') {
//             steps {
//                 script {
//                     withDockerRegistry(credentialsId: "${DOCKERHUB_CRED}", url: '') {
//                         def buildTag = "${BACKEND_IMAGE}:${BUILD_NUMBER}"
//                         def latestTag = "${BACKEND_IMAGE}:latest"
//                         sh "docker tag ${BACKEND_IMAGE}:${BUILD_NUMBER} ${latestTag}"
//                         sh "docker push ${buildTag}"
//                         sh "docker push ${latestTag}"
//                         env.BACKEND_BUILD_TAG = buildTag
//                     }
//                 }
//             }
//         }

//         stage('Frontend: Docker Build') {
//             steps { 
//                 dir('frontend') {  
//                     script {
//                         sh "docker build -t ${FRONTEND_IMAGE}:${BUILD_NUMBER} ."
//                     }
//                 }
//             }
//         }

//         stage('Frontend: Trivy Scan') {
//             steps {
//                 script {
//                     sh """
//                         docker run --rm \
//                             -v /var/run/docker.sock:/var/run/docker.sock \
//                             -v ${TRIVY_CACHE}:/root/.cache/ \
//                             aquasec/trivy image \
//                             --scanners vuln \
//                             --severity HIGH,CRITICAL \
//                             --format table \
//                             --exit-code 0 \
//                             --timeout ${TRIVY_TIMEOUT} \
//                             ${FRONTEND_IMAGE}:${BUILD_NUMBER}
//                     """
//                 }
//             }
//         }

//         stage('Frontend: Docker Push') {
//             steps { 
//                 script {
//                     withDockerRegistry(credentialsId: "${DOCKERHUB_CRED}", url: '') {
//                         def buildTag = "${FRONTEND_IMAGE}:${BUILD_NUMBER}"
//                         def latestTag = "${FRONTEND_IMAGE}:latest"
//                         sh "docker tag ${FRONTEND_IMAGE}:${BUILD_NUMBER} ${latestTag}"
//                         sh "docker push ${buildTag}"
//                         sh "docker push ${latestTag}"
//                         env.FRONTEND_BUILD_TAG = buildTag
//                     }
//                 }
//             }
//         }

//         stage('Staging Deployment') {
//             steps {
//                 sh 'docker compose down || true'
//                 sh 'docker compose pull'
//                 sh 'docker compose up -d'
//             }
//         }
//     }

//     post {
//         always {
//             echo 'Cleaning up workspace...'
//             cleanWs()
//         }
//         success {
//             echo 'Pipeline completed successfully!'
//             echo "Backend Image: ${env.BACKEND_BUILD_TAG}"
//             echo "Frontend Image: ${env.FRONTEND_BUILD_TAG}"
//         }
//         failure {
//             echo 'Pipeline failed!'
//         }
//     }
// }





// pipeline {
//     agent any

//     stages {
//         stage('Checkout') {
//             steps {
//                 echo "Checking out repository..."
//                 git branch: 'main',
//                     url: 'https://github.com/Shaith-Ahamed/devops_cicd.git'
//             }
//         }

//         stage('Staging Deployment') {
//             agent {
//                 docker {
//                     image 'docker:24.0.7-dind'
//                     args '-v /var/run/docker.sock:/var/run/docker.sock'
//                 }
//             }
//             steps {
//                 dir("${WORKSPACE}") {
//                     echo "Stopping any running containers..."
//                     sh 'docker compose down || true'

//                     echo "Pulling latest images..."
//                     sh '''
//                     docker compose pull || {
//                         echo "Pull failed, retrying..."
//                         sleep 5
//                         docker compose pull
//                     }
//                     '''

//                     echo "Starting containers..."
//                     sh 'docker compose up -d'

//                     echo "Currently running containers:"
//                     sh 'docker ps'
//                 }
//             }
//         }
//     }
// }



pipeline {
    agent any
    tools {
        jdk 'jdk17'
        maven 'maven3'
    }
    environment {
        GITHUB_CRED = 'GitHub-Token'
        DOCKERHUB_CRED = 'DockerHub-Token'
        SONAR_CLOUD_CRED = 'SonarCloud-Token'  // Changed to SonarCloud
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

        // stage('Backend: Clean & Compile') {
        //     steps {
        //         dir('backend') {  
        //             sh "mvn clean compile"
        //         }
        //     }
        // }

        // stage('Backend: SonarCloud Analysis') {
        //     steps {
        //         dir('backend') { 
        //             withCredentials([string(credentialsId: "${SONAR_CLOUD_CRED}", variable: 'SONAR_TOKEN')]) {
        //                 sh """
        //                     mvn sonar:sonar \
        //                       -Dsonar.projectKey=devops_cicd \
        //                       -Dsonar.organization=shaith-ahamed \
        //                       -Dsonar.host.url=https://sonarcloud.io \
        //                       -Dsonar.login=$SONAR_TOKEN \
        //                       -Dsonar.java.binaries=target/classes
        //                 """
        //             }
        //         }
        //     }
        // }

        // stage('Backend: Package') {
        //     steps {
        //         dir('backend') {  
        //             sh "mvn package -DskipTests"
        //         }
        //     }
        // }

        // stage('Backend: Docker Build & Push') {
        //     steps {
        //         dir('backend') {  
        //             script {
        //                 def buildTag = "${BACKEND_IMAGE}:${BUILD_NUMBER}"
        //                 def latestTag = "${BACKEND_IMAGE}:latest"
        //                 sh "docker build -t ${buildTag} -f Dockerfile ."
                        
        //                 // Trivy scan
        //                 sh """
        //                     docker run --rm \
        //                       -v /var/run/docker.sock:/var/run/docker.sock \
        //                       -v ${TRIVY_CACHE}:/root/.cache/ \
        //                       aquasec/trivy image \
        //                       --scanners vuln \
        //                       --severity HIGH,CRITICAL \
        //                       --format table \
        //                       --exit-code 0 \
        //                       --timeout ${TRIVY_TIMEOUT} \
        //                       ${buildTag}
        //                 """
                        
        //                 // Docker push
        //                 withDockerRegistry(credentialsId: "${DOCKERHUB_CRED}", url: '') {
        //                     sh "docker tag ${buildTag} ${latestTag}"
        //                     sh "docker push ${buildTag}"
        //                     sh "docker push ${latestTag}"
        //                     env.BACKEND_BUILD_TAG = buildTag
        //                 }
        //             }
        //         }
        //     }
        // }

        // stage('Frontend: Docker Build & Push') {
        //     steps { 
        //         dir('frontend') {  
        //             script {
        //                 def buildTag = "${FRONTEND_IMAGE}:${BUILD_NUMBER}"
        //                 def latestTag = "${FRONTEND_IMAGE}:latest"
        //                 sh "docker build -t ${buildTag} ."

        //                 // Trivy scan
        //                 sh """
        //                     docker run --rm \
        //                       -v /var/run/docker.sock:/var/run/docker.sock \
        //                       -v ${TRIVY_CACHE}:/root/.cache/ \
        //                       aquasec/trivy image \
        //                       --scanners vuln \
        //                       --severity HIGH,CRITICAL \
        //                       --format table \
        //                       --exit-code 0 \
        //                       --timeout ${TRIVY_TIMEOUT} \
        //                       ${buildTag}
        //                 """

        //                 // Docker push
        //                 withDockerRegistry(credentialsId: "${DOCKERHUB_CRED}", url: '') {
        //                     sh "docker tag ${buildTag} ${latestTag}"
        //                     sh "docker push ${buildTag}"
        //                     sh "docker push ${latestTag}"
        //                     env.FRONTEND_BUILD_TAG = buildTag
        //                 }
        //             }
        //         }
        //     }
        // }

        stage('Staging Deployment') {
            steps {
                dir("${env.WORKSPACE}"){
                    sh '/usr/local/bin/docker-compose down --remove-orphans || true'
                    sh '/usr/local/bin/docker-compose pull'
                    sh '/usr/local/bin/docker-compose up -d'

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
