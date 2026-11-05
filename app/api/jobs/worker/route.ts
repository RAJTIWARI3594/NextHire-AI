import { NextRequest, NextResponse } from "next/server";
import { backgroundJobQueue, type JobQueueName } from "@/lib/jobs/queue";
import { requireActiveAdmin } from "@/lib/security/admin-auth";
import { createSecureErrorResponse } from "@/lib/security/api-security";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const access = await requireActiveAdmin();
  if (!access.ok) return access.response;

  try {
    const status = request.nextUrl.searchParams.get("status");
    const action = request.nextUrl.searchParams.get("action");

    if (action === "process") {
      const processed = await backgroundJobQueue.processQueue();
      return NextResponse.json({ success: true, processed });
    }

    const jobs = backgroundJobQueue.listJobs(status || undefined);
    return NextResponse.json({
      success: true,
      jobs,
      persistence: "process-local",
      note: "Queue records and processing state are not durable across serverless instances.",
    }, { headers: { "Cache-Control": "no-store, max-age=0" } });
  } catch (error) {
    return createSecureErrorResponse(error, "Failed to inspect background job queue.");
  }
}

export async function POST(request: NextRequest) {
  const access = await requireActiveAdmin();
  if (!access.ok) return access.response;

  try {
    const body = await request.json();
    const { action, queueName, payload, jobId } = body || {};
    const allowedQueues: JobQueueName[] = [
      "email",
      "notifications",
      "resume-processing",
      "ai-processing",
      "analytics",
    ];
    if (action === "enqueue") {
      if (typeof queueName !== "string" || !allowedQueues.includes(queueName as JobQueueName)) {
        return NextResponse.json({ success: false, message: "Invalid queue name." }, { status: 400 });
      }
      const job = backgroundJobQueue.enqueue(queueName as JobQueueName, payload || {});
      return NextResponse.json({ success: true, job, persistence: "process-local" });
    }

    if (action === "retry") {
      if (typeof jobId !== "string") {
        return NextResponse.json({ success: false, message: "A job ID is required." }, { status: 400 });
      }
      const retried = backgroundJobQueue.retryJob(jobId);
      if (!retried) {
        return NextResponse.json({ success: false, message: "Job not found or not in failed state." }, { status: 404 });
      }
      return NextResponse.json({ success: true, job: retried, persistence: "process-local" });
    }

    if (action === "purge_completed") {
      const count = backgroundJobQueue.purgeCompleted();
      return NextResponse.json({ success: true, purgedCount: count, persistence: "process-local" });
    }

    return NextResponse.json(
      { success: false, message: "Invalid background job action." },
      { status: 400 }
    );
  } catch (error) {
    return createSecureErrorResponse(error, "Failed to execute background job action.");
  }
}
