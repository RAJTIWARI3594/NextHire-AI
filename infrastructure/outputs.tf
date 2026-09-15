output "ecr_repository_url" {
  description = "URL of the Elastic Container Registry repository"
  value       = aws_ecr_repository.nexthire_app.repository_url
}

output "ecs_cluster_name" {
  description = "Name of the production ECS Cluster"
  value       = aws_ecs_cluster.production.name
}
