# Terraform Infrastructure for Online Education Platform

This Terraform configuration provisions AWS infrastructure for the online education CI/CD platform.

## Infrastructure Components

### Network
- **VPC** with public and private subnets across 2 availability zones
- **Internet Gateway** for public internet access
- **Route tables** for public subnets

### Compute
- **Jenkins Server** (EC2 t3.medium)
  - Pre-installed: Jenkins, Docker, Trivy, Maven, Java 17
  - Accessible on port 8080
  
- **Application Server** (EC2 t3.medium)
  - Pre-installed: Docker, Docker Compose
  - Runs frontend (port 3000) and backend (port 8081)

### Database
- **RDS MySQL 8.0** (db.t3.micro)
  - Private subnet deployment
  - Automatic backups enabled

### Security Groups
- Jenkins SG: Ports 22 (SSH), 8080 (Jenkins)
- Application SG: Ports 22 (SSH), 80 (HTTP), 3000 (Frontend), 8081 (Backend)
- RDS SG: Port 3306 (MySQL) - accessible only from application servers

## Prerequisites

1. **AWS Account** with appropriate permissions
2. **AWS CLI** configured with credentials
3. **Terraform** installed (version >= 1.0)
4. **EC2 Key Pair** created in AWS (for SSH access)

## Setup Instructions

### 1. Configure AWS Credentials
```bash
aws configure
```

### 2. Create EC2 Key Pair
```bash
# In AWS Console or CLI
aws ec2 create-key-pair --key-name online-education-key --query 'KeyMaterial' --output text > online-education-key.pem
chmod 400 online-education-key.pem
```

### 3. Configure Variables
```bash
cd terraform
cp terraform.tfvars.example terraform.tfvars
# Edit terraform.tfvars with your values
```

**Important:** Update `db_password` with a strong password!

### 4. Initialize Terraform
```bash
terraform init
```

### 5. Preview Infrastructure
```bash
terraform plan
```

### 6. Deploy Infrastructure
```bash
terraform apply
```

Type `yes` when prompted.

## Outputs

After deployment, Terraform will display:
- Jenkins Server URL
- Application Server IPs
- Frontend/Backend URLs
- RDS endpoint
- SSH commands

Example:
```
jenkins_server_url = "http://54.123.45.67:8080"
frontend_url = "http://54.123.45.68:3000"
backend_url = "http://54.123.45.68:8081"
```

## Post-Deployment Steps

### 1. Access Jenkins
```bash
# SSH into Jenkins server
ssh -i online-education-key.pem ubuntu@<jenkins-ip>

# Get initial admin password
sudo cat /var/lib/jenkins/secrets/initialAdminPassword
```

Access Jenkins at `http://<jenkins-ip>:8080`

### 2. Configure Application Server
```bash
# SSH into application server
ssh -i online-education-key.pem ubuntu@<app-ip>

# Clone your repository
git clone https://github.com/Shaith-Ahamed/online-education-cicd.git
cd online-education-cicd

# Update docker-compose.yml with RDS endpoint
# Replace db service with RDS endpoint from Terraform output

# Run application
docker compose up -d
```

### 3. Update Backend Configuration
Update `docker-compose.yml` to use RDS:
```yaml
environment:
  SPRING_DATASOURCE_URL: jdbc:mysql://<rds-endpoint>:3306/users?useSSL=false
  SPRING_DATASOURCE_USERNAME: admin
  SPRING_DATASOURCE_PASSWORD: <your-password>
```

## Cost Estimation

Approximate monthly costs (us-east-1):
- EC2 t3.medium (2 instances): ~$60
- RDS db.t3.micro: ~$15
- Data transfer & storage: ~$10
- **Total: ~$85/month**

## Cleanup

To destroy all resources:
```bash
terraform destroy
```

Type `yes` when prompted.

## Security Best Practices

1. **Never commit `terraform.tfvars`** - contains sensitive data
2. Use **AWS Secrets Manager** for production passwords
3. Restrict **Security Group rules** to specific IPs in production
4. Enable **MFA** on AWS account
5. Use **IAM roles** instead of access keys where possible
6. Enable **AWS CloudTrail** for audit logging

## Customization

### Change Region
Update `aws_region` in `terraform.tfvars`:
```hcl
aws_region = "us-west-2"
```

Also update AMI IDs for the new region.

### Scale Up Instances
Update instance types in `terraform.tfvars`:
```hcl
jenkins_instance_type = "t3.large"
app_instance_type = "t3.large"
```

### Add More Availability Zones
```hcl
availability_zones = ["us-east-1a", "us-east-1b", "us-east-1c"]
```

## Troubleshooting

### Terraform Init Fails
```bash
rm -rf .terraform
terraform init
```

### Can't SSH to Instances
- Check security group rules
- Verify key pair permissions: `chmod 400 <key>.pem`
- Ensure public IP is assigned

### RDS Connection Issues
- Verify security group allows traffic from application SG
- Check RDS is in private subnet
- Use RDS endpoint from Terraform output

## Support

For issues, contact the DevOps team or create an issue in the repository.
