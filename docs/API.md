# NextHire AI - Production REST API Specification

This document provides the complete API reference for NextHire AI services, authentication requirements, rate limiting tiers, request/response formats, and error codes.

---

## Base URL & Authentication

- **Production Base URL**: `https://nexthire.ai`
- **Authentication**: Bearer Token / Supabase SSR HttpOnly Session Cookies.
- **Correlation Headers**: Every response returns an `x-request-id` header for request tracing.

---

## Global Rate Limit Tiers

| API Tier         | Endpoint Prefix                            | Window | Limit            | Headers                                |
| :--------------- | :----------------------------------------- | :----- | :--------------- | :------------------------------------- |
| **Auth Login**   | `/api/auth/login`, `/login`                | 60s    | **5 Requests**   | `X-RateLimit-Remaining`, `Retry-After` |
| **Auth Signup**  | `/api/auth/signup`, `/signup`              | 60s    | **5 Requests**   | `X-RateLimit-Remaining`, `Retry-After` |
| **AI Services**  | `/api/ai/*`, `/api/chat`, `/api/interview` | 60s    | **20 Requests**  | `X-RateLimit-Remaining`, `Retry-After` |
| **Payments**     | `/api/payments/*`, `/api/subscriptions`    | 60s    | **10 Requests**  | `X-RateLimit-Remaining`, `Retry-After` |
| **File Uploads** | `/api/upload`, `/api/resume/upload`        | 60s    | **10 Requests**  | `X-RateLimit-Remaining`, `Retry-After` |
| **Default API**  | `/api/*`                                   | 60s    | **100 Requests** | `X-RateLimit-Remaining`, `Retry-After` |

---

## 1. SRE Telemetry & Health APIs

### `GET /api/health`

Checks overall platform operational readiness.

**Response `200 OK`**:

```json
{
  "status": "healthy",
  "environment": "production",
  "timestamp": "2026-08-05T22:50:00.000Z"
}
```

---

### `GET /api/metrics`

Scrapes Prometheus metrics or returns JSON telemetry snapshot.

**Query Parameters**:

- `format` (optional): `json` or `prometheus` (default: `prometheus`).

**Response `200 OK` (`format=json`)**:

```json
{
  "apiLatencyMs": 38,
  "dbQueryTimeMs": 9,
  "aiResponseTimeMs": 390,
  "errorRatePercent": 0.01,
  "activeUsers": 1480,
  "queuePendingJobs": 3,
  "memoryUsagePercent": 32,
  "cpuUsagePercent": 24,
  "storageUsagePercent": 14.5,
  "timestamp": "2026-08-05T22:50:00.000Z"
}
```

---

### `GET /api/monitoring/stats`

Telemetry feed for Admin SRE and Performance Dashboards.

**Response `200 OK`**:

```json
{
  "status": "operational",
  "version": "1.0.0-prod",
  "snapshot": { ... },
  "timeSeries": [
    {
      "time": "10m ago",
      "apiLatency": 42,
      "dbQueryTime": 12,
      "aiResponseTime": 380,
      "errorRate": 0.02,
      "activeUsers": 1420
    }
  ]
}
```

---

## 2. System Alerts API

### `GET /api/alerts`

Lists system incident alerts.

**Response `200 OK`**:

```json
{
  "success": true,
  "alerts": [
    {
      "id": "alt-001",
      "alertName": "AI Provider Latency Threshold",
      "category": "ai_provider",
      "severity": "warning",
      "message": "Gemini 1.5 Flash response duration exceeded 1.2s target latency.",
      "status": "active",
      "triggeredAt": "2026-08-05T22:35:00.000Z"
    }
  ]
}
```

### `POST /api/alerts`

Updates alert status or triggers diagnostic test alert.

**Request Body**:

```json
{
  "action": "update_status",
  "alertId": "alt-001",
  "status": "resolved"
}
```

---

## 3. Background Worker Queue API

### `GET /api/jobs/worker`

Lists queued jobs or triggers worker execution.

**Query Parameters**:

- `action` (optional): `process` (runs pending queue).
- `status` (optional): `pending` | `processing` | `completed` | `failed`.

### `POST /api/jobs/worker`

Enqueues a new background task or retries failed jobs.

**Request Body**:

```json
{
  "action": "enqueue",
  "queueName": "email",
  "payload": { "to": "user@example.com", "template": "welcome" }
}
```

---

## 4. Standardized Error Format

In case of error, NextHire AI returns sanitized production error payloads:

```json
{
  "success": false,
  "errorId": "err_1722891200000_a3f89",
  "message": "Rate limit exceeded. Please wait before retrying."
}
```
