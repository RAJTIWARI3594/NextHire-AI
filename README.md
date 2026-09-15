# 🚀 NextHire AI - Enterprise AI Hiring & Interview Platform

NextHire AI is an enterprise-grade AI-powered recruitment, automated video interview evaluation, ATS resume scoring, interactive coding challenge, and candidate sourcing platform built with Next.js 15, Supabase, Tailwind CSS, TypeScript, and Google Gemini multi-model AI integrations.

---

## 🌟 Key Platform Features

### 🎓 Student & Candidate Portal

- **ATS Resume Builder & Score**: Real-time keyword optimization, ATS compatibility score, and formatting feedback.
- **AI Career Coach & Chat**: Gemini-powered career guidance, interview prep tips, and custom cover letter generation.
- **AI Mock Video Interview**: Interactive mock interview session with automated speech-to-text analysis and feedback.
- **Interactive Coding Platform**: In-browser code editor with syntax highlighting, execution test runner, and time complexity score.
- **Job Application Tracker**: One-click application tracking, status updates, and offer letter management.

### 🏢 Corporate Recruiter Portal

- **Job Posting & Moderation**: Multi-location job post wizard, compensation ranges, and custom screening questions.
- **AI Candidate Ranking**: Automated resume parsing, candidate scoring match matrix, and candidate ranking.
- **Interview Scheduler & Offer Management**: Automated calendar sync, offer letter generator, and candidate messaging.

### 🛡️ Super Admin & SRE Operations Consoles

1. **[Security Center](app/admin/security/page.tsx)**: Threat feed, IP firewall blocklist manager, active device session inspector, Turnstile CAPTCHA controls.
2. **[SRE Telemetry](app/admin/monitoring/page.tsx)**: Interactive Recharts for API response latency, DB execution time, AI model latency, and active users.
3. **[Performance Optimization](app/admin/performance/page.tsx)**: Core Web Vitals (LCP: 0.8s, FID: 18ms, TTFB: 42ms), cache hit ratios, and slow query detector.
4. **[System Alerts Center](app/admin/alerts/page.tsx)**: Real-time incident timeline, severity filters, status toggles, and Slack webhook dispatchers.
5. **[Background Jobs Manager](app/admin/background-jobs/page.tsx)**: Worker queue throughput, retry failed tasks, manual queue worker trigger.
6. **[Backup Vault Console](app/admin/backups/page.tsx)**: Backup history, SHA-256 integrity verification, and PITR restore triggers.
7. **[Deployments & Scaling](app/admin/deployments/page.tsx)**: Live release tracking (`v1.0.x`), GitHub Actions CI/CD status, and auto-scaling rules.

---

## 🏗 System Architecture & Directory Structure

```
.
├── app/                # Next.js 15 App Router pages & API endpoints
│   ├── admin/          # 7 Super Admin Operations Consoles
│   ├── api/            # Security, metrics, alerts, worker & telemetry APIs
│   ├── dashboard/      # Student candidate dashboard
│   ├── recruiter/      # Corporate recruiter portal
│   ├── sitemap.ts      # Dynamic sitemap generator
│   └── robots.ts       # Dynamic robots.txt crawler rules
├── __tests__/          # Automated Unit & Integration Test Suites
├── config/             # Runtime environment validation & scaling-policy.json
├── docs/               # Architecture, API spec, DR plan, SRE runbook, QA checklist
├── e2e/                # Playwright End-to-End browser test suite
├── lib/
│   ├── email/          # Transactional email service & HTML templates
│   ├── jobs/           # Distributed background job queues & workers
│   ├── monitoring/     # Metrics collector, JSON logger & alert engine
│   ├── performance/    # Cache control headers & in-memory LRU cache
│   ├── security/       # Rate limiting, bot protection, XSS & file validation
│   └── seo/            # Metadata builder & JSON-LD structured data generator
├── scripts/            # Migration runner, backup CLI & health check scripts
├── supabase/           # PostgreSQL migrations, seed data & schema files
└── vercel.json         # Vercel deployment configuration
```

---

## ⚡ Quick Start

### 1. Prerequisites

- **Node.js**: `v20.x` or higher
- **npm**: `v10.x` or higher

### 2. Environment Setup

Copy the environment template:

```bash
cp .env.example .env.local
```

Validate environment variables:

```bash
npm run env:check
```

### 3. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🧪 Testing & Code Quality Commands

| Command                          | Purpose                                                      |
| :------------------------------- | :----------------------------------------------------------- |
| `npm test`                       | Runs unit & integration test suites (`node --test`)          |
| `npm run type-check`             | Compiles TypeScript without emitting output (`tsc --noEmit`) |
| `npm run lint`                   | Runs ESLint across application code                          |
| `npm run validate`               | Runs type-check, linting, and formatting checks in sequence  |
| `npm run env:check`              | Validates environment variables                              |
| `node scripts/migrate.js`        | Validates SQL migrations and checks SHA-256 hashes           |
| `node scripts/backup-restore.js` | Triggers daily/weekly/monthly backups                        |
| `node scripts/verify-backups.js` | Verifies backup snapshot integrity                           |

---

## 📚 System Documentation

- 📄 [Production REST API Specification](docs/API.md)
- 🚨 [Disaster Recovery (DR) Plan](docs/disaster_recovery_plan.md)
- 🛠️ [SRE Operations Runbook](docs/operations_runbook.md)
- 📋 [Pre-Launch Verification & QA Report](docs/production_launch_checklist.md)
- 🧪 [Testing & Benchmarking Guide](docs/testing_and_benchmarking.md)
- 📊 [QA & Code Audit Report](docs/qa_and_code_audit_report.md)
