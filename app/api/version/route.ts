import { NextResponse } from "next/server";
import { env } from "@/config/env";

/**
 * GET /api/version
 * Returns release metadata, commit SHA, build version, and environment.
 */
export async function GET() {
  return NextResponse.json(
    {
      name: env.NEXT_PUBLIC_APP_NAME,
      version: env.BUILD_VERSION,
      commit: env.BUILD_COMMIT,
      environment: env.NEXT_PUBLIC_APP_ENV,
      nodeVersion: process.version,
      timestamp: new Date().toISOString(),
    },
    {
      status: 200,
      headers: {
        "Cache-Control": "public, max-age=60",
      },
    }
  );
}
