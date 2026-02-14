

SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
cd "$SCRIPT_DIR" || { echo "Failed to change to script directory!"; exit 1; }

echo " Provisioning infrastructure with Terraform..."
cd terraform || { echo "Terraform directory not found!"; exit 1; }
terraform init
terraform apply -auto-approve
terraform output -json > output.json
cd ..

echo " Stopping old containers and cleaning up..."
sudo docker-compose down --volumes --remove-orphans

echo "Building and starting Docker containers..."
sudo docker-compose up --build -d

echo "Currently running containers:"
sudo docker ps

echo "Deployment complete!"
