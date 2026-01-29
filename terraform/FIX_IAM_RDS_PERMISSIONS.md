# IAM Policy for Terraform RDS Access

## Problem
Your IAM user `terra-user` doesn't have permission to create RDS resources.

## Solution: Add RDS Permissions

### Option 1: Attach Managed Policy (Recommended)
In AWS Console:
1. Go to **IAM → Users → terra-user**
2. **Add permissions → Attach policies directly**
3. Search for and attach: `AmazonRDSFullAccess`

### Option 2: Custom Policy (More Secure)
Create a custom policy with these permissions:

```json
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Action": [
                "rds:CreateDBSubnetGroup",
                "rds:DeleteDBSubnetGroup",
                "rds:DescribeDBSubnetGroups",
                "rds:CreateDBInstance",
                "rds:DeleteDBInstance",
                "rds:DescribeDBInstances",
                "rds:ModifyDBInstance",
                "rds:StartDBInstance",
                "rds:StopDBInstance"
            ],
            "Resource": "*"
        },
        {
            "Effect": "Allow",
            "Action": [
                "ec2:DescribeInstances",
                "ec2:DescribeImages",
                "ec2:DescribeKeyPairs",
                "ec2:DescribeSecurityGroups",
                "ec2:DescribeSubnets",
                "ec2:DescribeVpcs"
            ],
            "Resource": "*"
        }
    ]
}
```

### Option 3: Use Administrator Access (Not Recommended for Production)
Attach `AdministratorAccess` policy (temporary solution only).

## After Adding Permissions

Run Terraform again:
```bash
terraform apply
```

## Check Free Tier Status

Verify your account is still Free Tier eligible:
```bash
aws ec2 describe-instance-types \
  --filters "Name=free-tier-eligible,Values=true" \
  --query "InstanceTypes[*].InstanceType" \
  --output text
```

This should show: `t2.micro t3.micro`

If it doesn't show these, your Free Tier has expired.