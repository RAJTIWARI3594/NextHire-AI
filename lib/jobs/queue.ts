export type JobQueueName =
  | "email"
  | "notification"
  | "ai_task"
  | "report_generation"
  | "cleanup";
export type JobStatus = "pending" | "processing" | "completed" | "failed";

export interface BackgroundJob {
  id: string;
  queueName: JobQueueName;
  payload: Record<string, unknown>;
  status: JobStatus;
  attempts: number;
  maxAttempts: number;
  errorMessage?: string;
  scheduledAt: string;
  processedAt?: string;
  createdAt: string;
}

/**
 * Process-local queue placeholder.
 *
 * A durable provider/worker is not configured. This class intentionally starts
 * empty and does not claim to execute email, AI, report, or cleanup workloads.
 */
class BackgroundJobQueue {
  private jobsInMemory: BackgroundJob[] = [];

  public listJobs(filterStatus?: JobStatus): BackgroundJob[] {
    if (filterStatus) {
      return this.jobsInMemory.filter((job) => job.status === filterStatus);
    }
    return [...this.jobsInMemory];
  }

  public enqueue(
    queueName: JobQueueName,
    payload: Record<string, unknown>,
    maxAttempts = 5
  ): BackgroundJob {
    const job: BackgroundJob = {
      id: `job_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
      queueName,
      payload,
      status: "pending",
      attempts: 0,
      maxAttempts,
      scheduledAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
    };
    this.jobsInMemory.unshift(job);
    return job;
  }

  public async processQueue(): Promise<{ processedCount: number; failedCount: number }> {
    throw new Error("A durable background worker is not configured.");
  }

  public retryJob(_jobId: string): BackgroundJob | null {
    return null;
  }

  public purgeCompleted(): number {
    return 0;
  }
}

export const backgroundJobQueue = new BackgroundJobQueue();
