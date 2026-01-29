#!/bin/bash

# --- Deploy script for devops_cicd ---

# 1️⃣ Go to project directory
cd ~/devops_cicd || { echo "Directory ~/devops_cicd not found!"; exit 1; }

echo "✅ Pulling latest code from GitHub..."
git fetch origin
git reset --hard origin/main

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
