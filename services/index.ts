/**
 * NextHire AI - Services Layer
 *
 * This layer abstracts external API calls, DB interactions, and AI LLM SDKs:
 * - supabase-service.ts  (Database CRUD queries)
 * - ai-service.ts        (Gemini LLM / Candidate evaluation models)
 */

export * from "@/lib/supabase/client";
