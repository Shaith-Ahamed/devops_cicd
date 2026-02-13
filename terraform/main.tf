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

# Key Pair
resource "aws_key_pair" "tester_key" {
  key_name   = "tester-key"
  public_key = file("~/.ssh/appKey.pub")
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
    description = "SSH"
    from_port   = 22
    to_port     = 22
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

# EC2 Instance for Application
resource "aws_instance" "application" {
  ami                    = var.app_ami
  instance_type          = var.app_instance_type
  subnet_id              = aws_subnet.public[0].id
  vpc_security_group_ids = [aws_security_group.application.id]
  key_name               = aws_key_pair.tester_key.key_name

  user_data = <<-EOF
              #!/bin/bash
              sudo apt-get update -y
              sudo apt-get install -y docker.io docker-compose git
              sudo usermod -aG docker ubuntu
              sudo systemctl start docker
              sudo systemctl enable docker
              
              # Wait for Docker to be ready
              sleep 10
              
              # Clone the repository
              cd /home/ubuntu
              git clone https://github.com/Shaith-Ahamed/devops_cicd.git
              cd devops_cicd
              
              # Generate docker-compose.yml from template with actual values
              export APP_PUBLIC_IP=$(curl -s http://169.254.169.254/latest/meta-data/public-ipv4)
              export RDS_ENDPOINT="${aws_db_instance.mysql.endpoint}"
              export DB_PASSWORD="${var.db_password}"
              
              envsubst < docker-compose.yml.tpl > docker-compose.yml
              
              # Start the application with docker-compose
              sudo docker-compose up -d
              
              # Set ownership
              sudo chown -R ubuntu:ubuntu /home/ubuntu/devops_cicd
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

# Elastic IP for Application Server (static IP that doesn't change on restart)
resource "aws_eip" "app_server" {
  instance = aws_instance.application.id
  domain   = "vpc"

  tags = {
    Name        = "${var.project_name}-app-eip"
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
  engine_version         = "8.4.7"  # Updated to 8.4.7 as requested
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
