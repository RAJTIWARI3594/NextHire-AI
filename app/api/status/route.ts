import { NextResponse } from "next/server";
import { env } from "@/config/env";
import { createClient } from "@supabase/supabase-js";

export const dynamic = "force-dynamic";

interface ComponentStatus {
  status: "operational" | "degraded" | "down";
  latencyMs?: number;
  message?: string;
}

/**
 * GET /api/status
 * Deep readiness probe checking Database, AI Provider key readiness, and Storage bucket access.
 */
export async function GET() {
  const startTime = Date.now();
  const checks: Record<string, ComponentStatus> = {};

  // 1. Check Database status (Supabase query)
  try {
    const dbStart = Date.now();
    const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (
      !supabaseUrl ||
      !supabaseAnonKey ||
      supabaseUrl.includes("placeholder")
    ) {
      checks.database = {
        status: "degraded",
        message: "Supabase URL or Key not configured",
      };
    } else {
      const client = createClient(supabaseUrl, supabaseAnonKey);
      const { error } = await client
        .from("_healthcheck")
        .select("count", { count: "exact", head: true })
        .limit(1);

      const dbLatency = Date.now() - dbStart;
      if (error && error.code !== "PGRST116" && error.code !== "42P01") {
        checks.database = {
          status: "degraded",
          latencyMs: dbLatency,
          message: error.message,
        };
      } else {
        checks.database = {
          status: "operational",
          latencyMs: dbLatency,
        };
      }
    }
  } catch (err: unknown) {
    checks.database = {
      status: "down",
      message:
        err instanceof Error ? err.message : "Database connection failed",
    };
  }

  // 2. Check AI Provider availability & API configuration
  try {
    const aiStart = Date.now();
    const primaryProvider = env.AI_PRIMARY_PROVIDER || "openai";
    const openaiKey = env.OPENAI_API_KEY;
    const anthropicKey = env.ANTHROPIC_API_KEY;
    const geminiKey = env.GEMINI_API_KEY;

    const keyAvailable =
      (primaryProvider === "openai" && Boolean(openaiKey)) ||
      (primaryProvider === "anthropic" && Boolean(anthropicKey)) ||
      (primaryProvider === "gemini" && Boolean(geminiKey));

    checks.ai_provider = {
      status: keyAvailable ? "operational" : "degraded",
      latencyMs: Date.now() - aiStart,
      message: keyAvailable
        ? `Primary provider [${primaryProvider}] configured`
        : `Primary provider [${primaryProvider}] missing API Key`,
    };
  } catch (err: unknown) {
    checks.ai_provider = {
      status: "down",
      message: err instanceof Error ? err.message : "AI provider check failed",
    };
  }

  // 3. Check Storage bucket status
  try {
    const storageStart = Date.now();
    const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (
      supabaseUrl &&
      supabaseAnonKey &&
      !supabaseUrl.includes("placeholder")
    ) {
      const client = createClient(supabaseUrl, supabaseAnonKey);
      const { data, error } = await client.storage.listBuckets();

      checks.storage = {
        status: error ? "degraded" : "operational",
        latencyMs: Date.now() - storageStart,
        message: error
          ? error.message
          : `Buckets accessible (${data?.length || 0} buckets found)`,
      };
    } else {
      checks.storage = {
        status: "degraded",
        message: "Storage credentials missing",
      };
    }
  } catch (err: unknown) {
    checks.storage = {
      status: "down",
      message: err instanceof Error ? err.message : "Storage check failed",
    };
  }

  const isHealthy = Object.values(checks).every(
    (c) => c.status === "operational"
  );
  const isDegraded = Object.values(checks).some(
    (c) => c.status === "degraded" || c.status === "down"
  );

  const overallStatus = isHealthy
    ? "healthy"
    : isDegraded
      ? "degraded"
      : "unhealthy";
  const statusCode = isHealthy ? 200 : isDegraded ? 200 : 503;

  return NextResponse.json(
    {
      status: overallStatus,
      timestamp: new Date().toISOString(),
      executionTimeMs: Date.now() - startTime,
      environment: env.NEXT_PUBLIC_APP_ENV,
      services: checks,
    },
    {
      status: statusCode,
      headers: {
        "Cache-Control": "no-store, max-age=0",
      },
    }
  );
}
