import { NextRequest, NextResponse } from "next/server";
import { metrics } from "@/lib/metrics";
import { metricsCollector } from "@/lib/monitoring/metrics-collector";

export const dynamic = "force-dynamic";

/**
 * GET /api/metrics
 * Exposes Prometheus metrics text scrape & telemetry JSON for observability platforms.
 */
export async function GET(request: NextRequest) {
  const accept = request.headers.get("accept") || "";
  const format = request.nextUrl.searchParams.get("format");

  if (format === "json" || accept.includes("application/json")) {
    const snapshot = metricsCollector.getSnapshot();
    return NextResponse.json(snapshot, {
      status: 200,
      headers: {
        "Cache-Control": "no-store, max-age=0",
      },
    });
  }

  const prometheusBody = metrics.getPrometheusFormat();

  return new NextResponse(prometheusBody, {
    status: 200,
    headers: {
      "Content-Type": "text/plain; version=0.0.4; charset=utf-8",
      "Cache-Control": "no-store, max-age=0",
    },
  });
}
