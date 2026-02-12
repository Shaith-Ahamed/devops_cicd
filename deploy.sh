#!/bin/bash

# --- Deploy script for devops_cicd ---

# 1️⃣ Get script directory and navigate there
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
cd "$SCRIPT_DIR" || { echo "Failed to change to script directory!"; exit 1; }

# echo "✅ Pulling latest code from GitHub..."
# git fetch origin
# git reset --hard origin/main

# 1.5️⃣ Run Terraform to provision infrastructure
echo "🚀 Provisioning infrastructure with Terraform..."
cd terraform || { echo "Terraform directory not found!"; exit 1; }
terraform init
terraform apply -auto-approve
terraform output -json > output.json
cd ..

# 2️⃣ Stop and remove old containers, volumes, and orphan containers
echo "🛑 Stopping old containers and cleaning up..."
sudo docker-compose down --volumes --remove-orphans

# 3️⃣ Build and start containers
echo "🔨 Building and starting Docker containers..."
sudo docker-compose up --build -d

# 4️⃣ Show running containers
echo "📦 Currently running containers:"
sudo docker ps

echo "🎉 Deployment complete!"
