# NextHire AI - Site Reliability Engineering (SRE) Operations Runbook

This runbook contains operational procedures for managing production deployments, monitoring system health, handling incidents, and conducting scheduled maintenance.

---

## 1. Production Service Architecture

- **Frontend Edge Gateway**: Vercel Edge Network (`iad1`, `sfo1`, `fra1`).
- **Database Engine**: Supabase Managed PostgreSQL with PgBouncer connection pooling (`transaction` mode).
- **Storage Engine**: Supabase Storage Buckets (`resumes`, `avatars`, `interview_recordings`).
- **AI Model Engine**: Google Gemini 1.5 Flash via Serverless Edge API functions.
- **Async Workers**: Node.js Background Job Workers (`email`, `notification`, `ai_task`, `report_generation`, `cleanup`).

---

## 2. Health & Telemetry Endpoints

- **System Health Status**: `GET https://nexthire.ai/api/health`
- **Prometheus Metrics Scraper**: `GET https://nexthire.ai/api/metrics`
- **JSON Telemetry Snapshot**: `GET https://nexthire.ai/api/metrics?format=json`
- **Admin Stats Stream**: `GET https://nexthire.ai/api/monitoring/stats`

---

## 3. Routine Operations & Maintenance Tasks

### Running Database Migrations

```bash
# Validate and apply pending SQL migrations
node scripts/migrate.js
```

### Triggering Manual Database & Storage Backup

```bash
# Daily Backup
node scripts/backup-restore.js --daily

# Weekly Backup
node scripts/backup-restore.js --weekly
```

### Verifying Backup Integrity

```bash
node scripts/verify-backups.js
```

---

## 4. On-Call Escalation Matrix

| Role                  | Contact / Channel         | Primary Responsibility                                |
| :-------------------- | :------------------------ | :---------------------------------------------------- |
| **Primary SRE**       | PagerDuty / `@sre-oncall` | 24/7 Incident triage, failover execution              |
| **Security Engineer** | `@security-team`          | Threat response, IP blocklist, vulnerability patches  |
| **Database Lead**     | `@db-ops`                 | Connection pool tuning, slow query optimization, PITR |
| **DevOps Lead**       | `@devops`                 | Vercel & Supabase deployment infrastructure           |
