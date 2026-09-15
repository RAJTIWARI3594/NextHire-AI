# NextHire AI - System Architecture Document

High-level architecture, infrastructure topology, security controls, and operational observability.

---

## 🏛️ Architecture Overview

```
                          ┌──────────────────────────┐
                          │    CDN / DNS (Route53)   │
                          └────────────┬─────────────┘
                                       │
                          ┌────────────▼─────────────┐
                          │ Nginx Reverse Proxy / SSL│
                          └────────────┬─────────────┘
                                       │
           ┌───────────────────────────┴───────────────────────────┐
           │                                                       │
┌──────────▼──────────┐                                 ┌──────────▼──────────┐
│  Next.js 15 App     │                                 │ Prometheus / Grafana│
│  Standalone Runner  │                                 │ Observability Stack │
└──────────┬──────────┘                                 └─────────────────────┘
           │
 ┌─────────┼─────────────────────────┬─────────────────────────┐
 │         │                         │                         │
┌▼─────────▼─────────┐    ┌──────────▼──────────┐   ┌──────────▼──────────┐
│ Supabase Database  │    │ Multi-AI Engine     │   │ Stripe Gateway      │
│ & Storage Buckets  │    │ (OpenAI/Claude/Gem) │   │ Payment Processing  │
└────────────────────┘    └─────────────────────┘   └─────────────────────┘
```

---

## 🛡️ Key System Subsystems

1. **Standalone Production Container**: Multi-stage Docker image built on Alpine Node 20.
2. **Environment & Secrets Guard**: Zod runtime parsing (`config/env.ts`) guarantees that client bundles never leak server secrets.
3. **Structured JSON Logger & Error Boundary**: Unified correlation context (`x-request-id`) across all API interactions.
4. **SRE Metrics Exporter**: Prometheus `/api/metrics` scraping endpoint tracking memory, request latency, and throughput.
