"use client";

import React, { useEffect, useState } from "react";
import { Cpu, RefreshCw, AlertCircle } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default function BackgroundJobsPage() {
  const [jobs, setJobs] = useState<Array<Record<string, unknown>>>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchJobs = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/jobs/worker", { cache: "no-store" });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Queue data unavailable.");
      setJobs(data.jobs || []);
    } catch (loadError: unknown) {
      setError((loadError as Error)?.message || "Queue data unavailable.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  return (
    <div className="mx-auto max-w-6xl space-y-6 p-4 sm:p-8">
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
        <div>
          <Badge variant="outline">Worker not configured</Badge>
          <h1 className="mt-2 text-2xl font-bold tracking-tight">
            Background Job Queue
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            This deployment has no durable queue provider or worker process.
            Queue execution controls are disabled so the dashboard cannot report
            fake completed email or AI jobs.
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={fetchJobs} disabled={loading}>
          <RefreshCw className={`mr-2 h-4 w-4 ${loading ? "animate-spin" : ""}`} />
          Refresh
        </Button>
      </div>

      {error && (
        <div role="alert" className="rounded-md border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">
          {error}
        </div>
      )}

      <Card className="space-y-3 border-amber-500/30 p-6">
        <div className="flex items-center gap-2">
          <AlertCircle className="h-5 w-5 text-amber-500" />
          <h2 className="text-sm font-semibold">Durable processing is unavailable</h2>
        </div>
        <p className="text-sm text-muted-foreground">
          Use a persistent queue and a separately deployed worker before
          enabling background emails, resume processing, AI tasks, report
          generation or cleanup workloads.
        </p>
      </Card>

      <Card className="space-y-3 border-border/60 p-6">
        <h2 className="flex items-center gap-2 text-sm font-bold">
          <Cpu className="h-4 w-4 text-primary" />
          Process-local queue snapshot
        </h2>
        {loading ? (
          <p className="text-sm text-muted-foreground">Loading queue state...</p>
        ) : jobs.length === 0 ? (
          <p className="py-6 text-center text-sm text-muted-foreground">
            No durable queue records are configured or available.
          </p>
        ) : (
          <p className="text-sm text-muted-foreground">{jobs.length} process-local records.</p>
        )}
      </Card>
    </div>
  );
}
