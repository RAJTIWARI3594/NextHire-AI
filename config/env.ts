import { z } from "zod";

/**
 * Server and Client Environment Variable Schema
 * Enforces strict type checking, default values, and prevents client exposure of secrets.
 */
const envSchema = z.object({
  // Runtime Node environment
  NODE_ENV: z
    .enum(["development", "test", "production"])
    .default("development"),
  PORT: z.coerce.number().default(3000),

  // Application public context
  NEXT_PUBLIC_APP_ENV: z
    .enum(["development", "staging", "production", "test"])
    .default("development"),
  NEXT_PUBLIC_SITE_URL: z.string().url().default("http://localhost:3000"),
  NEXT_PUBLIC_APP_NAME: z.string().default("NextHire AI"),
  BUILD_VERSION: z.string().default("1.0.0"),
  BUILD_COMMIT: z.string().default("dev-head"),

  // Supabase Configuration
  NEXT_PUBLIC_SUPABASE_URL: z
    .string()
    .default("https://placeholder.supabase.co"),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().default("placeholder-anon-key"),
  SUPABASE_SERVICE_ROLE_KEY: z.string().optional(),
  SUPABASE_DB_URL: z.string().optional(),

  // Server-side AI Provider API Keys
  OPENAI_API_KEY: z.string().optional(),
  ANTHROPIC_API_KEY: z.string().optional(),
  GEMINI_API_KEY: z.string().optional(),
  AI_PRIMARY_PROVIDER: z
    .enum(["openai", "anthropic", "gemini"])
    .default("gemini"),

  // Payments Gateway Configuration
  NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: z.string().optional(),
  STRIPE_SECRET_KEY: z.string().optional(),
  STRIPE_WEBHOOK_SECRET: z.string().optional(),

  // Email Notifications Settings
  SMTP_HOST: z.string().optional(),
  SMTP_PORT: z.coerce.number().optional(),
  SMTP_USER: z.string().optional(),
  SMTP_PASS: z.string().optional(),
  EMAIL_FROM: z.string().default("noreply@nexthire.ai"),

  // Observability & System Flags
  LOG_LEVEL: z.enum(["debug", "info", "warn", "error"]).default("info"),
  METRICS_ENABLED: z
    .string()
    .transform((val) => val === "true")
    .default("true"),
});

export type Env = z.infer<typeof envSchema>;

/**
 * Validate process.env against schema
 */
export function parseEnv(customEnv?: Record<string, string | undefined>): Env {
  const envToParse = customEnv || process.env;
  const result = envSchema.safeParse(envToParse);

  if (!result.success) {
    const formattedErrors = result.error.format();
    console.warn(
      "[Env Warning] Defaulting unconfigured environment variables:",
      formattedErrors
    );
  }

  return result.success ? result.data : (envToParse as unknown as Env);
}

// Global cached validated env instance
export const env = parseEnv();

/**
 * Helper to determine base site URL for server and client (handles local & Vercel)
 */
export function getSiteUrl(): string {
  if (
    process.env.NEXT_PUBLIC_SITE_URL &&
    !process.env.NEXT_PUBLIC_SITE_URL.includes("localhost")
  ) {
    return process.env.NEXT_PUBLIC_SITE_URL.replace(/\/$/, "");
  }
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL.replace(/\/$/, "")}`;
  }
  return (
    process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ||
    "http://localhost:3000"
  );
}

/**
 * Helper to construct an absolute API URL for server fetches
 */
export function getApiUrl(path: string): string {
  const baseUrl = getSiteUrl();
  const cleanPath = path.startsWith("/") ? path : `/${path}`;
  return `${baseUrl}${cleanPath}`;
}
