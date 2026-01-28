# Fix Jenkins Docker Access

## Problem
Jenkins running in Docker container cannot execute `docker` commands because Docker socket is not mounted.

Error: `/var/jenkins_home/workspace/devops/backend@tmp/durable-a052f296/script.sh.copy: 1: docker: not found`

## Solution

SSH into your Jenkins server and run these commands:

### Step 1: Check Current Jenkins Setup

```bash
# SSH to Jenkins server
ssh -i online-education-key.pem ubuntu@<jenkins-ip>

# Check if Jenkins is running as container
sudo docker ps | grep jenkins

# Check if Jenkins is running as service
sudo systemctl status jenkins
```

### Step 2: Fix for Jenkins Running as Service (Native Install)

If Jenkins is installed natively (systemctl shows it's running):

```bash
# Add Jenkins user to docker group
sudo usermod -aG docker jenkins

# Restart Jenkins to apply changes
sudo systemctl restart jenkins

# Verify docker group membership
sudo -u jenkins groups

# Test docker access as jenkins user
sudo -u jenkins docker ps
```

### Step 3: Fix for Jenkins Running in Docker Container

If Jenkins is running as a Docker container:

```bash
# Stop and remove current Jenkins container
sudo docker stop jenkins
sudo docker rm jenkins

# Run Jenkins with Docker socket mounted
sudo docker run -d \
  --name jenkins \
  --restart unless-stopped \
  --network jenkins-network \
  -p 8080:8080 -p 50000:50000 \
  -v jenkins_home:/var/jenkins_home \
  -v /var/run/docker.sock:/var/run/docker.sock \
  -u root \
  jenkins/jenkins:lts

# Install Docker CLI inside Jenkins container
sudo docker exec -u root jenkins bash -c "
  apt-get update && \
  apt-get install -y apt-transport-https ca-certificates curl gnupg lsb-release && \
  curl -fsSL https://download.docker.com/linux/debian/gpg | gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg && \
  echo 'deb [arch=amd64 signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/debian bullseye stable' > /etc/apt/sources.list.d/docker.list && \
  apt-get update && \
  apt-get install -y docker-ce-cli docker-compose-plugin && \
  chmod 666 /var/run/docker.sock
"

# Install Trivy inside Jenkins container
sudo docker exec -u root jenkins bash -c "
  wget -qO - https://aquasecurity.github.io/trivy-repo/deb/public.key | apt-key add - && \
  echo 'deb https://aquasecurity.github.io/trivy-repo/deb bullseye main' > /etc/apt/sources.list.d/trivy.list && \
  apt-get update && \
  apt-get install -y trivy
"

# Get new Jenkins admin password
sudo docker exec jenkins cat /var/jenkins_home/secrets/initialAdminPassword
```

### Step 4: Update Terraform for Permanent Fix

Update `terraform/main.tf` to run Jenkins in Docker from the start:

```bash
# This ensures Jenkins always has Docker access on deployment
```

### Step 5: Verify Fix

```bash
# Test docker command from Jenkins container
sudo docker exec jenkins docker ps

# Test docker-compose command
sudo docker exec jenkins docker compose version

# Test trivy command
sudo docker exec jenkins trivy --version
```

### Step 6: Configure Jenkins Credentials Again

After restarting Jenkins, you may need to reconfigure:

1. Open `http://<jenkins-ip>:8080`
2. Get admin password: `sudo docker exec jenkins cat /var/jenkins_home/secrets/initialAdminPassword`
3. Complete setup wizard
4. Install plugins: Docker Pipeline, Git
5. Add credentials:
   - GitHub-Token
   - DockerHub-Token
   - SonarQube-Token

### Step 7: Run Your Pipeline

Go to your pipeline and click "Build Now". It should now work!

## Quick One-Liner Fix (If Jenkins is Native)

```bash
sudo usermod -aG docker jenkins && sudo systemctl restart jenkins
```

## Quick One-Liner Fix (If Jenkins is in Docker)

```bash
sudo docker exec -u root jenkins bash -c "apt-get update && apt-get install -y docker.io && chmod 666 /var/run/docker.sock"
```

## Expected Result

After applying the fix, your Jenkins pipeline should successfully execute:
- ✅ `docker build` commands
- ✅ `docker push` commands
- ✅ `docker compose` commands
- ✅ `trivy` scan commands

## Alternative: Use Jenkins Agents

Instead of running Docker in Jenkins master, you can use dedicated build agents:

1. Create separate EC2 instance for builds
2. Install Docker on that instance
3. Configure as Jenkins agent
4. Run builds on agent, not master

This is more secure but requires additional setup.
