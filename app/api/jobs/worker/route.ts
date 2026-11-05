import { NextRequest, NextResponse } from "next/server";
import { backgroundJobQueue } from "@/lib/jobs/queue";
import { requireActiveAdmin } from "@/lib/security/admin-auth";
import { createSecureErrorResponse } from "@/lib/security/api-security";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const access = await requireActiveAdmin();
  if (!access.ok) return access.response;

  try {
    const status = request.nextUrl.searchParams.get("status");
    if (status && !["pending", "processing", "completed", "failed"].includes(status)) {
      return NextResponse.json({ error: "Invalid job status filter." }, { status: 400 });
    }
    return NextResponse.json(
      {
        success: true,
        jobs: backgroundJobQueue.listJobs(status as never),
        persistence: "process-local",
        durableWorkerConfigured: false,
      },
      { headers: { "Cache-Control": "no-store, max-age=0" } }
    );
  } catch (error) {
    return createSecureErrorResponse(error, "Failed to inspect background job queue.");
  }
}

export async function POST(_request: NextRequest) {
  const access = await requireActiveAdmin();
  if (!access.ok) return access.response;

  return NextResponse.json(
    {
      success: false,
      error: "Durable background processing is not configured. No job was enqueued, processed, retried, or deleted.",
    },
    { status: 501 }
  );
}
