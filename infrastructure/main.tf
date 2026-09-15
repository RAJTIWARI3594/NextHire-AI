terraform {
  required_version = ">= 1.5.0"
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
  backend "s3" {
    bucket         = "nexthire-tf-state-prod"
    key            = "production/terraform.tfstate"
    region         = "us-east-1"
    encrypt        = true
    dynamodb_table = "nexthire-tf-locks"
  }
}

provider "aws" {
  region = var.aws_region

  default_tags {
    tags = {
      Project     = "NextHire-AI"
      Environment = var.environment
      ManagedBy   = "Terraform"
    }
  }
}

# Container Registry for Application Images
resource "aws_ecr_repository" "nexthire_app" {
  name                 = "nexthire-ai-app"
  image_tag_mutability = "MUTABLE"

  image_scanning_configuration {
    scan_on_push = true
  }
}

# ECS Cluster for Scalable Production Execution
resource "aws_ecs_cluster" "production" {
  name = "nexthire-production-cluster"

  setting {
    name  = "containerInsights"
    value = "enabled"
  }
}
