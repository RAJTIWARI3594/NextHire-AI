# NextHire AI - Environment Variables & Secrets Management

This document governs secret management, client vs server variable isolation, and multi-environment setups.

---

## 🔑 Secret Classification & Client Safety Rule

> [!CAUTION]
> **Client vs Server Key Isolation**:
> Any variable prefixed with `NEXT_PUBLIC_` will be bundled into client JavaScript.
> **NEVER** expose service role keys, database passwords, or private AI keys with `NEXT_PUBLIC_`.

| Environment Variable            | Visibility                | Description                        |
| :------------------------------ | :------------------------ | :--------------------------------- |
| `NEXT_PUBLIC_SUPABASE_URL`      | Public (Client & Server)  | Supabase API URL                   |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Public (Client & Server)  | Supabase Public Anon Key           |
| `SUPABASE_SERVICE_ROLE_KEY`     | **Server-Only (Private)** | Supabase Admin Service Key         |
| `SUPABASE_DB_URL`               | **Server-Only (Private)** | Postgres Connection String         |
| `OPENAI_API_KEY`                | **Server-Only (Private)** | OpenAI API Secret Key              |
| `ANTHROPIC_API_KEY`             | **Server-Only (Private)** | Anthropic Claude API Key           |
| `GEMINI_API_KEY`                | **Server-Only (Private)** | Google Gemini API Key              |
| `STRIPE_SECRET_KEY`             | **Server-Only (Private)** | Stripe Payment Gateway Secret      |
| `STRIPE_WEBHOOK_SECRET`         | **Server-Only (Private)** | Webhook Signature Verification Key |

---

## 🧪 Environment Boot Validation

Environment schema validation is enforced by `config/env.ts`.

If required variables are missing at startup in production:

```
❌ FATAL: Invalid Environment Configuration detected during startup:
{
  "NEXT_PUBLIC_SUPABASE_URL": {
    "_errors": ["NEXT_PUBLIC_SUPABASE_URL is required"]
  }
}
Error: Invalid Environment Configuration. Terminating application process.
```
