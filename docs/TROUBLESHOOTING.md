# NextHire AI - Troubleshooting Guide

Common issues, diagnostics, root cause resolutions, and SRE procedures.

---

## 🔍 Issue 1: Server fails to start (`Invalid Environment Configuration`)

### Symptom

Application crashes immediately upon startup with error output:
`❌ FATAL: Invalid Environment Configuration detected during startup`

### Root Cause

Missing or invalid environment variables in `.env.local` or container environment.

### Solution

1. Run pre-flight check:
   ```bash
   npm run env:check
   ```
2. Ensure mandatory variables `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` are provided.

---

## 🔍 Issue 2: Docker Build Fails on `npm ci` or Standalone Output

### Symptom

Docker build errors during Next.js standalone build phase.

### Solution

1. Ensure `next.config.mjs` has `output: 'standalone'` set.
2. Verify lockfile synchronization:
   ```bash
   npm install --package-lock-only
   ```

---

## 🔍 Issue 3: Supabase Database Connection Timeout or 503

### Symptom

`/api/status` returns degraded status for `database`.

### Solution

1. Verify Supabase DB URL and Anon key in `.env`.
2. Test network connectivity from container to Supabase endpoint.
