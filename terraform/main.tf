# AWS Provider Configuration
terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
  required_version = ">= 1.0"
}

provider "aws" {
  region = var.aws_region
}

# VPC
resource "aws_vpc" "main" {
  cidr_block           = var.vpc_cidr
  enable_dns_hostnames = true
  enable_dns_support   = true

  tags = {
    Name        = "${var.project_name}-vpc"
    Environment = var.environment
  }
}

# Internet Gateway
resource "aws_internet_gateway" "main" {
  vpc_id = aws_vpc.main.id

  tags = {
    Name        = "${var.project_name}-igw"
    Environment = var.environment
  }
}

# Public Subnets
resource "aws_subnet" "public" {
  count                   = length(var.availability_zones)
  vpc_id                  = aws_vpc.main.id
  cidr_block              = cidrsubnet(var.vpc_cidr, 8, count.index)
  availability_zone       = var.availability_zones[count.index]
  map_public_ip_on_launch = true

  tags = {
    Name        = "${var.project_name}-public-subnet-${count.index + 1}"
    Environment = var.environment
  }
}

# Private Subnets
resource "aws_subnet" "private" {
  count             = length(var.availability_zones)
  vpc_id            = aws_vpc.main.id
  cidr_block        = cidrsubnet(var.vpc_cidr, 8, count.index + 10)
  availability_zone = var.availability_zones[count.index]

  tags = {
    Name        = "${var.project_name}-private-subnet-${count.index + 1}"
    Environment = var.environment
  }
}

# Route Table for Public Subnets
resource "aws_route_table" "public" {
  vpc_id = aws_vpc.main.id

  route {
    cidr_block = "0.0.0.0/0"
    gateway_id = aws_internet_gateway.main.id
  }

  tags = {
    Name        = "${var.project_name}-public-rt"
    Environment = var.environment
  }
}

# Route Table Associations for Public Subnets
resource "aws_route_table_association" "public" {
  count          = length(aws_subnet.public)
  subnet_id      = aws_subnet.public[count.index].id
  route_table_id = aws_route_table.public.id
}

# Security Group for Jenkins
resource "aws_security_group" "jenkins" {
  name        = "${var.project_name}-jenkins-sg"
  description = "Security group for Jenkins server"
  vpc_id      = aws_vpc.main.id

  ingress {
    description = "SSH"
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    description = "Jenkins Web UI"
    from_port   = 8080
    to_port     = 8080
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name        = "${var.project_name}-jenkins-sg"
    Environment = var.environment
  }
}

# Security Group for Application (Frontend/Backend)
resource "aws_security_group" "application" {
  name        = "${var.project_name}-app-sg"
  description = "Security group for application servers"
  vpc_id      = aws_vpc.main.id

  ingress {
    description = "SSH"
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    description = "Frontend"
    from_port   = 3000
    to_port     = 3000
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    description = "Backend"
    from_port   = 8081
    to_port     = 8081
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    description = "HTTP"
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name        = "${var.project_name}-app-sg"
    Environment = var.environment
  }
}

# Security Group for RDS (MySQL)
resource "aws_security_group" "rds" {
  name        = "${var.project_name}-rds-sg"
  description = "Security group for RDS MySQL"
  vpc_id      = aws_vpc.main.id

  ingress {
    description     = "MySQL from application"
    from_port       = 3306
    to_port         = 3306
    protocol        = "tcp"
    security_groups = [aws_security_group.application.id]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name        = "${var.project_name}-rds-sg"
    Environment = var.environment
  }
}

# EC2 Instance for Jenkins
resource "aws_instance" "jenkins" {
  ami                    = var.jenkins_ami
  instance_type          = var.jenkins_instance_type
  subnet_id              = aws_subnet.public[0].id
  vpc_security_group_ids = [aws_security_group.jenkins.id]
  key_name               = var.key_name

  user_data = <<-EOF
              #!/bin/bash
              sudo apt-get update -y
              sudo apt-get install -y openjdk-17-jdk docker.io docker-compose
              sudo systemctl start docker
              sudo systemctl enable docker
              
              # Create Docker network for Jenkins and SonarQube
              sudo docker network create jenkins-network || true
              
              # Run SonarQube in Docker
              sudo docker run -d \
                --name sonarqube \
                --network jenkins-network \
                --restart unless-stopped \
                -p 9000:9000 \
                -e SONAR_ES_BOOTSTRAP_CHECKS_DISABLE=true \
                sonarqube:lts-community
              
              # Run Jenkins in Docker with Docker socket mounted
              sudo docker run -d \
                --name jenkins \
                --network jenkins-network \
                --restart unless-stopped \
                -p 8080:8080 -p 50000:50000 \
                -v jenkins_home:/var/jenkins_home \
                -v /var/run/docker.sock:/var/run/docker.sock \
                -u root \
                jenkins/jenkins:lts
              
              # Wait for Jenkins to start
              sleep 30
              
              # Install Docker CLI and Trivy inside Jenkins container
              sudo docker exec -u root jenkins bash -c "
                apt-get update && \
                apt-get install -y apt-transport-https ca-certificates curl gnupg lsb-release && \
                curl -fsSL https://download.docker.com/linux/debian/gpg | gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg && \
                echo 'deb [arch=amd64 signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/debian bullseye stable' > /etc/apt/sources.list.d/docker.list && \
                apt-get update && \
                apt-get install -y docker-ce-cli docker-compose-plugin && \
                chmod 666 /var/run/docker.sock && \
                wget -qO - https://aquasecurity.github.io/trivy-repo/deb/public.key | apt-key add - && \
                echo 'deb https://aquasecurity.github.io/trivy-repo/deb bullseye main' > /etc/apt/sources.list.d/trivy.list && \
                apt-get update && \
                apt-get install -y trivy
              "
              EOF

  root_block_device {
    volume_size = 30  # Free Tier: 30GB EBS storage
    volume_type = "gp2"  # Free Tier uses gp2
  }

  tags = {
    Name        = "${var.project_name}-jenkins-server"
    Environment = var.environment
  }
}

# EC2 Instance for Application
resource "aws_instance" "application" {
  ami                    = var.app_ami
  instance_type          = var.app_instance_type
  subnet_id              = aws_subnet.public[0].id
  vpc_security_group_ids = [aws_security_group.application.id]
  key_name               = var.key_name

  user_data = <<-EOF
              #!/bin/bash
              sudo apt-get update -y
              sudo apt-get install -y docker.io docker-compose
              sudo usermod -aG docker ubuntu
              sudo systemctl start docker
              sudo systemctl enable docker
              EOF

  root_block_device {
    volume_size = 30  # Free Tier: 30GB EBS storage
    volume_type = "gp2"  # Free Tier uses gp2
  }

  tags = {
    Name        = "${var.project_name}-app-server"
    Environment = var.environment
  }
}

# RDS Subnet Group
resource "aws_db_subnet_group" "main" {
  name       = "${var.project_name}-db-subnet-group"
  subnet_ids = aws_subnet.private[*].id

  tags = {
    Name        = "${var.project_name}-db-subnet-group"
    Environment = var.environment
  }
}

# RDS MySQL Instance (Free Tier Configuration)
resource "aws_db_instance" "mysql" {
  identifier             = "${var.project_name}-mysql"
  engine                 = "mysql"
  engine_version         = "8.0.35"  # Free Tier compatible version
  instance_class         = var.db_instance_class
  allocated_storage      = 20  # Free Tier: 20GB
  storage_type           = "gp2"  # Free Tier uses gp2, not gp3
  db_name                = var.db_name
  username               = var.db_username
  password               = var.db_password
  db_subnet_group_name   = aws_db_subnet_group.main.name
  vpc_security_group_ids = [aws_security_group.rds.id]
  skip_final_snapshot    = true
  publicly_accessible    = false
  multi_az               = false  # Free Tier is single-AZ only
  backup_retention_period = 0  # Disable automated backups for Free Tier

  tags = {
    Name        = "${var.project_name}-mysql"
    Environment = var.environment
  }
}
