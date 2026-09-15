# NextHire AI - Production Deployment Guide

This guide details deployment options for NextHire AI across Docker, Kubernetes, AWS ECS, and Vercel/Cloud platforms.

---

## 🐳 Option 1: Docker Container Deployment

### Build Multi-Stage Docker Image

```bash
docker build -t nexthire-ai:latest -f Dockerfile .
```

### Launch Production Container Stack

```bash
docker-compose -f docker-compose.yml up -d
```

This launches:

- **NextHire Standalone App Server** (`port 3000`)
- **Nginx Reverse Proxy** (`ports 80 / 443`)
- **Prometheus Metrics Collector** (`port 9090`)
- **Grafana Monitoring Dashboard** (`port 3001`)

---

## ☁️ Option 2: AWS Elastic Container Service (ECS / Fargate)

1. **Deploy Terraform Infrastructure**:
   ```bash
   cd infrastructure
   terraform init
   terraform plan -out=tfplan
   terraform apply tfplan
   ```
2. **Push Container to AWS ECR**:
   ```bash
   aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin <ECR_URL>
   docker tag nexthire-ai:latest <ECR_URL>:latest
   docker push <ECR_URL>:latest
   ```

---

## 🩺 Production Verification

Check health and status endpoints:

- Liveness Probe: `GET https://your-domain.com/api/health`
- Readiness Probe: `GET https://your-domain.com/api/status`
- Version & Commit: `GET https://your-domain.com/api/version`
