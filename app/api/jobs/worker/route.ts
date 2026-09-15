import { NextRequest, NextResponse } from "next/server";
import { backgroundJobQueue, type JobQueueName } from "@/lib/jobs/queue";
import { createSecureErrorResponse } from "@/lib/security/api-security";

export const dynamic = "force-dynamic";

/**
 * GET /api/jobs/worker - Process pending background jobs or list jobs
 * POST /api/jobs/worker - Enqueue new background job or perform admin actions
 */
export async function GET(request: NextRequest) {
  try {
    const status = request.nextUrl.searchParams.get("status") as any;
    const action = request.nextUrl.searchParams.get("action");

    if (action === "process") {
      const result = await backgroundJobQueue.processQueue();
      return NextResponse.json({ success: true, processed: result });
    }

    const jobs = backgroundJobQueue.listJobs(status || undefined);
    return NextResponse.json({ success: true, jobs });
  } catch (error) {
    return createSecureErrorResponse(
      error,
      "Failed to inspect background job queue."
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, queueName, payload, jobId } = body;

    if (action === "enqueue" && queueName) {
      const job = backgroundJobQueue.enqueue(
        queueName as JobQueueName,
        payload || {}
      );
      return NextResponse.json({ success: true, job });
    }

    if (action === "retry" && jobId) {
      const retried = backgroundJobQueue.retryJob(jobId);
      if (!retried) {
        return NextResponse.json(
          { success: false, message: "Job not found or not in failed state" },
          { status: 400 }
        );
      }
      return NextResponse.json({ success: true, job: retried });
    }

    if (action === "purge_completed") {
      const count = backgroundJobQueue.purgeCompleted();
      return NextResponse.json({ success: true, purgedCount: count });
    }

    return NextResponse.json(
      { success: false, message: "Invalid background job action" },
      { status: 400 }
    );
  } catch (error) {
    return createSecureErrorResponse(
      error,
      "Failed to execute background job action."
    );
  }
}
