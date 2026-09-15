# NextHire AI - Installation Guide

This document covers system dependencies, local setup, database provisioning, and verification steps for setting up NextHire AI.

---

## 1. Environment Requirements

- **Node.js**: `v20.x` LTS recommended (`node -v`)
- **NPM**: `v10.x` (`npm -v`)
- **Git**: `2.x` (`git --version`)
- **Docker**: `24.x` or higher (optional for containerized deployment)

---

## 2. Installation Steps

### Step 1: Clone Repository

```bash
git clone https://github.com/nexthire-ai/nexthire.git
cd nexthire
```

### Step 2: Install Node Dependencies

```bash
npm ci
```

### Step 3: Configure Environment Variables

Copy `.env.example` to `.env.local`:

```bash
cp .env.example .env.local
```

Fill in required keys:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `OPENAI_API_KEY`

Validate setup:

```bash
npm run env:check
```

### Step 4: Database Ingestion & Supabase Migration

Apply database schemas and migrations located in `supabase/migrations/`:

```bash
npx supabase db push
```

### Step 5: Start Local Application Server

```bash
npm run dev
```

Navigate to [http://localhost:3000](http://localhost:3000).
