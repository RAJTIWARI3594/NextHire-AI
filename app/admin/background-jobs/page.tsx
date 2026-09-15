"use client";

import React, { useState, useEffect } from "react";
import {
  Cpu,
  RefreshCw,
  Play,
  RotateCcw,
  Trash2,
  Plus,
  CheckCircle2,
  Clock,
  AlertCircle,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default function BackgroundJobsPage() {
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterQueue, setFilterQueue] = useState<string>("all");

  const fetchJobs = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/jobs/worker");
      const data = await res.json();
      if (data.jobs) setJobs(data.jobs);
    } catch (err) {
      console.error("Failed to fetch background jobs", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const handleProcessQueue = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/jobs/worker?action=process");
      await res.json();
      fetchJobs();
    } catch (err) {
      console.error("Failed to process queue", err);
    }
  };

  const handleRetryJob = async (jobId: string) => {
    try {
      await fetch("/api/jobs/worker", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "retry", jobId }),
      });
      fetchJobs();
    } catch (err) {
      console.error("Failed to retry job", err);
    }
  };

  const handlePurgeCompleted = async () => {
    try {
      await fetch("/api/jobs/worker", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "purge_completed" }),
      });
      fetchJobs();
    } catch (err) {
      console.error("Failed to purge completed jobs", err);
    }
  };

  const handleEnqueueTest = async (queueName: string) => {
    try {
      await fetch("/api/jobs/worker", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "enqueue",
          queueName,
          payload: {
            timestamp: new Date().toISOString(),
            testMessage: "Manual trigger from Admin",
          },
        }),
      });
      fetchJobs();
    } catch (err) {
      console.error("Failed to enqueue job", err);
    }
  };

  const filteredJobs = jobs.filter(
    (j) => filterQueue === "all" || j.queueName === filterQueue
  );

  return (
    <div className="mx-auto max-w-7xl space-y-8 p-4 sm:p-8">
      <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <div className="flex items-center gap-2">
            <Badge variant="accent">Asynchronous Infrastructure</Badge>
            <Badge variant="success" className="gap-1">
              <Cpu className="h-3.5 w-3.5" /> Worker Queue Active
            </Badge>
          </div>
          <h1 className="mt-1 text-3xl font-extrabold tracking-tight">
            Background Job Queues & Worker Manager
          </h1>
          <p className="text-sm text-muted-foreground">
            Monitor async job execution, view task throughput, retry failed
            jobs, trigger worker runs, and purge completed jobs.
          </p>
        </div>

        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handlePurgeCompleted}
            className="gap-1.5 text-xs"
          >
            <Trash2 className="h-3.5 w-3.5" /> Purge Completed
          </Button>
          <Button
            variant="gradient"
            size="sm"
            onClick={handleProcessQueue}
            disabled={loading}
            className="gap-1.5 text-xs"
          >
            <Play className="h-3.5 w-3.5" /> Process Queue Worker
          </Button>
        </div>
      </div>

      {/* Queue Type Badges */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-5">
        {[
          "email",
          "notification",
          "ai_task",
          "report_generation",
          "cleanup",
        ].map((queue) => (
          <Card
            key={queue}
            className={`cursor-pointer border p-4 transition-all ${filterQueue === queue ? "border-primary bg-primary/10" : "border-border"}`}
            onClick={() =>
              setFilterQueue(filterQueue === queue ? "all" : queue)
            }
          >
            <span className="text-[11px] font-semibold uppercase text-muted-foreground">
              {queue.replace("_", " ")}
            </span>
            <p className="mt-1 text-2xl font-extrabold">
              {jobs.filter((j) => j.queueName === queue).length}
            </p>
            <Button
              variant="ghost"
              size="sm"
              className="mt-2 h-6 w-full text-[10px] text-primary"
              onClick={(e) => {
                e.stopPropagation();
                handleEnqueueTest(queue);
              }}
            >
              + Enqueue Test
            </Button>
          </Card>
        ))}
      </div>

      {/* Job Table & Logs */}
      <Card className="space-y-4 border-border/60 p-6">
        <div className="flex items-center justify-between border-b pb-3">
          <h2 className="flex items-center gap-2 text-sm font-bold">
            <Cpu className="h-4 w-4 text-primary" /> Background Job Inspector
          </h2>
          <Button
            variant="ghost"
            size="sm"
            onClick={fetchJobs}
            disabled={loading}
            className="h-7 gap-1 text-xs"
          >
            <RefreshCw className={`h-3 w-3 ${loading ? "animate-spin" : ""}`} />{" "}
            Refresh
          </Button>
        </div>

        <div className="space-y-3 text-xs">
          {filteredJobs.length === 0 ? (
            <p className="py-8 text-center text-muted-foreground">
              No background jobs found in queue.
            </p>
          ) : (
            filteredJobs.map((job) => (
              <div
                key={job.id}
                className="space-y-2 rounded-xl border bg-card/60 p-4"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-foreground">
                      {job.id}
                    </span>
                    <Badge variant="outline" className="text-[9px] uppercase">
                      {job.queueName}
                    </Badge>
                    <Badge
                      variant={
                        job.status === "completed"
                          ? "success"
                          : job.status === "failed"
                            ? "destructive"
                            : job.status === "processing"
                              ? "accent"
                              : "secondary"
                      }
                    >
                      {job.status}
                    </Badge>
                  </div>
                  <span className="font-mono text-[10px] text-muted-foreground">
                    Attempts: {job.attempts} / {job.maxAttempts}
                  </span>
                </div>

                <div className="rounded border border-border/40 bg-background/80 p-2 font-mono text-[10px] text-muted-foreground">
                  Payload: {JSON.stringify(job.payload)}
                </div>

                {job.errorMessage && (
                  <p className="font-mono text-[10px] text-red-400">
                    Error: {job.errorMessage}
                  </p>
                )}

                <div className="flex items-center justify-between border-t border-border/40 pt-1 text-[10px] text-muted-foreground">
                  <span>
                    Scheduled: {new Date(job.scheduledAt).toLocaleTimeString()}
                  </span>
                  {job.status === "failed" && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRetryJob(job.id)}
                      className="h-6 text-[10px] text-amber-400 hover:text-amber-300"
                    >
                      <RotateCcw className="mr-1 h-3 w-3" /> Retry Job
                    </Button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </Card>
    </div>
  );
}
