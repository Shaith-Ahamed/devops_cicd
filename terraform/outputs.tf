# Outputs for Infrastructure Resources

output "vpc_id" {
  description = "VPC ID"
  value       = aws_vpc.main.id
}

output "public_subnet_ids" {
  description = "Public subnet IDs"
  value       = aws_subnet.public[*].id
}

output "private_subnet_ids" {
  description = "Private subnet IDs"
  value       = aws_subnet.private[*].id
}

output "application_server_public_ip" {
  description = "Application server Elastic IP"
  value       = aws_eip.app_server.public_ip
}

output "frontend_url" {
  description = "Frontend application URL"
  value       = "http://${aws_eip.app_server.public_ip}:3000"
}

output "backend_url" {
  description = "Backend API URL"
  value       = "http://${aws_eip.app_server.public_ip}:8081"
}

output "rds_endpoint" {
  description = "RDS MySQL endpoint"
  value       = aws_db_instance.mysql.endpoint
  sensitive   = true
}

output "rds_database_name" {
  description = "RDS database name"
  value       = aws_db_instance.mysql.db_name
}

output "ssh_command_app" {
  description = "SSH command for application server"
  value       = "ssh -i ~/.ssh/appKey ubuntu@${aws_eip.app_server.public_ip}"
}
