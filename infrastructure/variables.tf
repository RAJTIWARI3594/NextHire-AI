variable "aws_region" {
  description = "Target AWS cloud deployment region"
  type        = string
  default     = "us-east-1"
}

variable "environment" {
  description = "Target environment lifecycle"
  type        = string
  default     = "production"
}

variable "app_name" {
  description = "Application stack identifier"
  type        = string
  default     = "nexthire-ai"
}
