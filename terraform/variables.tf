# Variables for Terraform Configuration

variable "aws_region" {
  description = "AWS region for resources"
  type        = string
  default     = "us-east-1"
}

variable "project_name" {
  description = "Project name for resource naming"
  type        = string
  default     = "online-education"
}

variable "environment" {
  description = "Environment name (dev, staging, prod)"
  type        = string
  default     = "dev"
}

variable "vpc_cidr" {
  description = "CIDR block for VPC"
  type        = string
  default     = "10.0.0.0/16"
}

variable "availability_zones" {
  description = "Availability zones"
  type        = list(string)
  default     = ["us-east-1a", "us-east-1b"]
}

variable "key_name" {
  description = "EC2 key pair name"
  type        = string
  default     = "online-education-key"
}

# Jenkins Server
variable "jenkins_ami" {
  description = "AMI ID for Jenkins server (Ubuntu 22.04)"
  type        = string
  default     = "ami-0c7217cdde317cfec" # Ubuntu 22.04 LTS in us-east-1
}

variable "jenkins_instance_type" {
  description = "Instance type for Jenkins server"
  type        = string
  default     = "t3.micro"  # Free Tier eligible (check your account status)
}

# Application Server
variable "app_ami" {
  description = "AMI ID for application server (Ubuntu 22.04)"
  type        = string
  default     = "ami-0c7217cdde317cfec" # Ubuntu 22.04 LTS in us-east-1
}

variable "app_instance_type" {
  description = "Instance type for application server"
  type        = string
  default     = "t3.micro"  # Free Tier eligible (check your account status)
}

# Database Configuration
variable "db_instance_class" {
  description = "RDS instance class"
  type        = string
  default     = "db.t3.micro"  # Free Tier: 750 hrs/month (single-AZ only)
}

variable "db_name" {
  description = "Database name"
  type        = string
  default     = "users"
}

variable "db_username" {
  description = "Database master username"
  type        = string
  default     = "admin"
  sensitive   = true
}

variable "db_password" {
  description = "Database master password"
  type        = string
  sensitive   = true
}
