"use client";

import React, { useCallback, useEffect, useState } from "react";
import { Briefcase, ShieldAlert, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAdminStore } from "@/lib/store/use-admin-store";
import {
  fetchAdminJobs,
  toggleAdminJobStatus,
} from "@/services/admin-service";

export default function JobModerationPage() {
  const { jobs, setJobs, toggleJobStatus } = useAdminStore();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadJobs = useCallback(async () => {
    setError(null);
    setIsLoading(true);
    try {
      setJobs(await fetchAdminJobs());
    } catch (loadError: unknown) {
      setError((loadError as Error)?.message || "Job listings could not be loaded.");
    } finally {
      setIsLoading(false);
    }
  }, [setJobs]);

  useEffect(() => {
    loadJobs();
  }, [loadJobs]);

  const handleToggle = async (id: string, currentStatus: string) => {
    setError(null);
    setIsSaving(true);
    try {
      await toggleAdminJobStatus(id, currentStatus);
      toggleJobStatus(id);
    } catch (toggleError: unknown) {
      setError((toggleError as Error)?.message || "Job status could not be changed.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="mx-auto max-w-6xl space-y-6 p-4 sm:p-8">
      <div className="flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            Job & Internship Moderation
          </h1>
          <p className="text-sm text-muted-foreground">
            Live internal job listings. Pause or reactivate listings using
            database-backed administrator permissions.
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={loadJobs} disabled={isLoading}>
          <RefreshCw className={`mr-2 h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
          Refresh
        </Button>
      </div>

      {error && (
        <div role="alert" className="rounded-md border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">
          {error}
        </div>
      )}

      <Card className="space-y-4 border-border/60 p-6">
        <div className="flex items-center justify-between border-b pb-3">
          <h2 className="flex items-center gap-2 text-sm font-bold">
            <Briefcase className="h-4 w-4 text-primary" />
            Platform job listings
          </h2>
          <Badge variant="outline">{jobs.length} records</Badge>
        </div>

        {isLoading ? (
          <p className="py-8 text-center text-sm text-muted-foreground">
            Loading job listings...
          </p>
        ) : jobs.length === 0 ? (
          <div className="space-y-2 py-8 text-center">
            <Briefcase className="mx-auto h-8 w-8 text-muted-foreground" />
            <p className="text-sm font-semibold">No internal job listings yet</p>
            <p className="text-xs text-muted-foreground">
              Approved recruiters’ internal listings will appear here. External
              job-board listings are managed separately.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {jobs.map((job) => (
              <div
                key={job.id}
                className="flex flex-col items-start justify-between gap-4 rounded-xl border bg-card/60 p-4 sm:flex-row sm:items-center"
              >
                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="text-sm font-bold">{job.title}</h3>
                    <Badge variant={job.status === "active" ? "success" : "secondary"}>
                      {job.status}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {job.companyName} · Posted {job.postedDate} · {job.reportsCount} reports
                  </p>
                </div>

                <Button
                  size="sm"
                  variant={job.status === "active" ? "destructive" : "outline"}
                  disabled={isSaving}
                  onClick={() => handleToggle(job.id, job.status)}
                  className="gap-2 text-xs"
                >
                  <ShieldAlert className="h-3.5 w-3.5" />
                  {job.status === "active" ? "Pause listing" : "Reactivate listing"}
                </Button>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}
