# Jenkins Post-Deployment Setup

After Terraform creates the infrastructure, follow these steps to configure Jenkins properly.

## 1. Access Jenkins

```bash
# SSH into Jenkins server
ssh -i online-education-key.pem ubuntu@<jenkins-ip>

# Get initial admin password
sudo cat /var/lib/jenkins/secrets/initialAdminPassword
```

Open browser: `http://<jenkins-ip>:8080`

## 2. Verify SonarQube is Running

```bash
# Check SonarQube container
sudo docker ps | grep sonarqube

# Check SonarQube is accessible
curl http://localhost:9000
```

SonarQube default credentials:
- Username: `admin`
- Password: `admin` (you'll be prompted to change it)

## 3. Connect Jenkins to Docker Network

If Jenkins is NOT running in Docker (default installation):

```bash
# Jenkins needs to access SonarQube container
# Option 1: Use host network (already configured)
# SonarQube is exposed on port 9000

# Option 2: If you want to run Jenkins in Docker too:
sudo systemctl stop jenkins
sudo systemctl disable jenkins

# Create Jenkins container
sudo docker run -d \
  --name jenkins \
  --network jenkins-network \
  -p 8080:8080 -p 50000:50000 \
  -v jenkins_home:/var/jenkins_home \
  -v /var/run/docker.sock:/var/run/docker.sock \
  jenkins/jenkins:lts

# Get admin password
sudo docker exec jenkins cat /var/jenkins_home/secrets/initialAdminPassword
```

## 4. Configure SonarQube Token

### In SonarQube:
1. Login to SonarQube at `http://<jenkins-ip>:9000`
2. Go to **My Account → Security → Generate Tokens**
3. Name: `jenkins`
4. Type: `Global Analysis Token`
5. Copy the token

### In Jenkins:
1. Go to **Manage Jenkins → Credentials → Global**
2. **Add Credentials**:
   - Kind: `Secret text`
   - Secret: `<paste-sonarqube-token>`
   - ID: `SonarQube-Token`
   - Description: `SonarQube Authentication Token`

## 5. Add Other Credentials

### GitHub Token:
1. **Add Credentials**:
   - Kind: `Secret text`
   - Secret: `<your-github-personal-access-token>`
   - ID: `GitHub-Token`

### DockerHub Token:
1. **Add Credentials**:
   - Kind: `Username with password`
   - Username: `shaith`
   - Password: `<your-dockerhub-password>`
   - ID: `DockerHub-Token`

## 6. Install Jenkins Plugins

Go to **Manage Jenkins → Plugins → Available Plugins**

Install:
- Docker Pipeline
- SonarQube Scanner
- Git

## 7. Configure SonarQube Server in Jenkins

Go to **Manage Jenkins → System → SonarQube servers**

Add SonarQube:
- Name: `SonarQube`
- Server URL: `http://sonarqube:9000` (if Jenkins in Docker)
- Server URL: `http://localhost:9000` (if Jenkins native)
- Server authentication token: Select `SonarQube-Token`

## 8. Verify Setup

```bash
# Test SonarQube connection from Jenkins server
curl http://localhost:9000/api/system/status

# Should return: {"status":"UP"}
```

## 9. Create Jenkins Pipeline

1. **New Item** → Name: `online-education-cicd` → Pipeline
2. **Pipeline**:
   - Definition: `Pipeline script from SCM`
   - SCM: `Git`
   - Repository URL: `https://github.com/Shaith-Ahamed/online-education-cicd.git`
   - Credentials: `GitHub-Token`
   - Branch: `*/main`
   - Script Path: `Jenkinsfile`
3. **Save**

## 10. Test Pipeline

Click **Build Now**

Monitor the build and check:
- ✅ Code checkout
- ✅ Maven compile
- ✅ SonarQube analysis
- ✅ Docker build
- ✅ Trivy scan
- ✅ DockerHub push

## Troubleshooting

### SonarQube Connection Refused
```bash
# Check SonarQube logs
sudo docker logs sonarqube

# Restart SonarQube
sudo docker restart sonarqube

# Check from Jenkins
sudo docker exec jenkins curl http://sonarqube:9000
```

### Docker Permission Denied
```bash
# Add Jenkins user to docker group
sudo usermod -aG docker jenkins
sudo systemctl restart jenkins
```

### Maven Build Fails (Low Memory)
```bash
# Add swap memory on t2.micro
sudo fallocate -l 2G /swapfile
sudo chmod 600 /swapfile
sudo mkswap /swapfile
sudo swapon /swapfile
echo '/swapfile none swap sw 0 0' | sudo tee -a /etc/fstab
```

### SonarQube Won't Start (Low Memory)
```bash
# SonarQube needs ~2GB RAM
# On t2.micro (1GB RAM), add more swap
sudo fallocate -l 4G /swapfile
sudo chmod 600 /swapfile
sudo mkswap /swapfile
sudo swapon /swapfile

# Or use external SonarQube cloud
# https://sonarcloud.io (free for public repos)
```

## Architecture Diagram

```
┌─────────────────────────────────────┐
│   Jenkins EC2 (t2.micro)            │
│                                     │
│   ┌─────────────────────────────┐  │
│   │  Jenkins (port 8080)        │  │
│   │  - Pulls code from GitHub   │  │
│   │  - Runs Maven builds        │  │
│   │  - Executes Docker commands │  │
│   └──────────┬──────────────────┘  │
│              │                      │
│   ┌──────────▼──────────────────┐  │
│   │  SonarQube Container        │  │
│   │  (port 9000)                │  │
│   │  - Code quality analysis    │  │
│   └─────────────────────────────┘  │
│                                     │
│   Docker Network: jenkins-network   │
└─────────────────────────────────────┘
            │
            │ Pushes images
            ▼
    DockerHub (shaith/online-education-*)
            │
            │ Pulls images
            ▼
┌─────────────────────────────────────┐
│   Application EC2 (t2.micro)        │
│   - Frontend (port 3000)            │
│   - Backend (port 8081)             │
│   - MySQL (docker container)        │
└─────────────────────────────────────┘
```

## Next Steps

Once setup is complete:
1. Push code to GitHub
2. Jenkins webhook triggers build automatically
3. Or manually click **Build Now**
4. Monitor pipeline execution
5. Access deployed application
