export type JobQueueName =
  "email" | "notification" | "ai_task" | "report_generation" | "cleanup";
export type JobStatus = "pending" | "processing" | "completed" | "failed";

export interface BackgroundJob {
  id: string;
  queueName: JobQueueName;
  payload: Record<string, any>;
  status: JobStatus;
  attempts: number;
  maxAttempts: number;
  errorMessage?: string;
  scheduledAt: string;
  processedAt?: string;
  createdAt: string;
}

class BackgroundJobQueue {
  private jobsInMemory: BackgroundJob[] = [
    {
      id: "job-101",
      queueName: "email",
      payload: { to: "candidate@example.com", template: "welcome_onboarding" },
      status: "completed",
      attempts: 1,
      maxAttempts: 5,
      scheduledAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
      processedAt: new Date(Date.now() - 29 * 60 * 1000).toISOString(),
      createdAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
    },
    {
      id: "job-102",
      queueName: "ai_task",
      payload: { candidateId: "cand-44", action: "resume_parse_extract" },
      status: "completed",
      attempts: 1,
      maxAttempts: 5,
      scheduledAt: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
      processedAt: new Date(Date.now() - 14 * 60 * 1000).toISOString(),
      createdAt: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
    },
    {
      id: "job-103",
      queueName: "report_generation",
      payload: { recruiterId: "rec-89", format: "pdf_summary" },
      status: "pending",
      attempts: 0,
      maxAttempts: 3,
      scheduledAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
    },
  ];

  /**
   * Enqueue a new background job.
   */
  public enqueue(
    queueName: JobQueueName,
    payload: Record<string, any>,
    maxAttempts = 5
  ): BackgroundJob {
    const newJob: BackgroundJob = {
      id: `job_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      queueName,
      payload,
      status: "pending",
      attempts: 0,
      maxAttempts,
      scheduledAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
    };

    this.jobsInMemory.unshift(newJob);
    return newJob;
  }

  /**
   * List all queued background jobs with optional status filter.
   */
  public listJobs(filterStatus?: JobStatus): BackgroundJob[] {
    if (filterStatus) {
      return this.jobsInMemory.filter((j) => j.status === filterStatus);
    }
    return this.jobsInMemory;
  }

  /**
   * Process pending jobs in queue.
   */
  public async processQueue(): Promise<{
    processedCount: number;
    failedCount: number;
  }> {
    const pendingJobs = this.jobsInMemory.filter((j) => j.status === "pending");
    let processedCount = 0;
    let failedCount = 0;

    for (const job of pendingJobs) {
      job.status = "processing";
      job.attempts += 1;

      try {
        // Execute job action based on queue type
        await this.executeJobHandler(job);
        job.status = "completed";
        job.processedAt = new Date().toISOString();
        processedCount += 1;
      } catch (err: any) {
        job.errorMessage = err.message || "Execution error";

        if (job.attempts >= job.maxAttempts) {
          job.status = "failed";
          failedCount += 1;
        } else {
          // Re-queue with exponential backoff delay
          job.status = "pending";
          job.scheduledAt = new Date(
            Date.now() + Math.pow(2, job.attempts) * 1000
          ).toISOString();
        }
      }
    }

    return { processedCount, failedCount };
  }

  private async executeJobHandler(job: BackgroundJob): Promise<void> {
    // Simulated async task handler
    await new Promise((resolve) => setTimeout(resolve, 100));
  }

  /**
   * Retry a failed job manually.
   */
  public retryJob(jobId: string): BackgroundJob | null {
    const job = this.jobsInMemory.find((j) => j.id === jobId);
    if (job && job.status === "failed") {
      job.status = "pending";
      job.attempts = 0;
      job.errorMessage = undefined;
      job.scheduledAt = new Date().toISOString();
      return job;
    }
    return null;
  }

  /**
   * Purge completed jobs from queue storage.
   */
  public purgeCompleted(): number {
    const initialCount = this.jobsInMemory.length;
    this.jobsInMemory = this.jobsInMemory.filter(
      (j) => j.status !== "completed"
    );
    return initialCount - this.jobsInMemory.length;
  }
}

export const backgroundJobQueue = new BackgroundJobQueue();
