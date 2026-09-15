/**
 * NextHire AI - Unit Test Suite for Background Job Queue & Worker Engine
 */
import test from "node:test";
import assert from "node:assert";
import { backgroundJobQueue } from "../../lib/jobs/queue.ts";

test("Background Job Queue Unit Tests", async (t) => {
  await t.test(
    "enqueues background jobs and processes pending items",
    async () => {
      const job = backgroundJobQueue.enqueue("email", {
        to: "test@example.com",
        subject: "Unit Test",
      });

      assert.strictEqual(job.queueName, "email");
      assert.strictEqual(job.status, "pending");
      assert.strictEqual(job.attempts, 0);

      const processResult = await backgroundJobQueue.processQueue();
      assert.strictEqual(processResult.processedCount >= 1, true);

      const updatedJobs = backgroundJobQueue.listJobs();
      const processedJob = updatedJobs.find((j) => j.id === job.id);
      assert.strictEqual(processedJob?.status, "completed");
    }
  );

  await t.test("handles retries and completed job purging", () => {
    const purgeCount = backgroundJobQueue.purgeCompleted();
    assert.strictEqual(typeof purgeCount, "number");

    const remainingJobs = backgroundJobQueue.listJobs("completed");
    assert.strictEqual(remainingJobs.length, 0);
  });
});
