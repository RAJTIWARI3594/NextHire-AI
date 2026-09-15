import { NextResponse } from "next/server";

const startTime = Date.now();

/**
 * GET /api/health
 * Lightweight liveness probe endpoint for Kubernetes / Docker / LB health checks.
 */
export async function GET() {
  const uptimeSeconds = Math.floor((Date.now() - startTime) / 1000);

  return NextResponse.json(
    {
      status: "healthy",
      timestamp: new Date().toISOString(),
      uptime: `${uptimeSeconds}s`,
    },
    {
      status: 200,
      headers: {
        "Cache-Control": "no-store, max-age=0",
      },
    }
  );
}
