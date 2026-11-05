"use client";

import React, { useEffect, useState } from "react";
import { BarChart3, Clock, CheckCircle2, Users } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { fetchHiringAnalytics } from "@/services/recruiter-service";
import type { HiringAnalyticsData } from "@/types/recruiter";

export default function RecruiterAnalyticsPage() {
  const [analytics, setAnalytics] = useState<HiringAnalyticsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    fetchHiringAnalytics()
      .then((data) => {
        if (active) setAnalytics(data);
      })
      .catch((loadError: unknown) => {
        if (active) {
          setError(
            (loadError as Error)?.message || "Analytics could not be loaded."
          );
        }
      })
      .finally(() => {
        if (active) setIsLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  const metrics = [
    {
      label: "Average Time to Hire",
      value:
        analytics?.avgHiringTimeDays == null
          ? "Not tracked"
          : `${analytics.avgHiringTimeDays} days`,
      description: "Requires completed hiring-date records",
      icon: Clock,
      tone: "text-indigo-400",
    },
    {
      label: "Offer Acceptance",
      value:
        analytics?.offerAcceptanceRate == null
          ? "Not tracked"
          : `${analytics.offerAcceptanceRate}%`,
      description: "Offer response tracking is not enabled",
      icon: CheckCircle2,
      tone: "text-emerald-400",
    },
    {
      label: "Interview Pass Rate",
      value:
        analytics?.interviewPassRate == null
          ? "Not tracked"
          : `${analytics.interviewPassRate}%`,
      description: "Interview scoring is not enabled",
      icon: Users,
      tone: "text-purple-400",
    },
    {
      label: "Total Applicants",
      value: analytics ? String(analytics.totalApplicants) : "—",
      description: "Applications to your job listings",
      icon: BarChart3,
      tone: "text-amber-400",
    },
  ];

  return (
    <div className="mx-auto max-w-6xl space-y-6 p-4 sm:p-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">
          Recruitment & Pipeline Analytics
        </h1>
        <p className="text-sm text-muted-foreground">
          Live counts from your own job applications. Metrics that are not
          stored are labelled rather than estimated.
        </p>
      </div>

      {error && (
        <div
          role="alert"
          className="rounded-md border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive"
        >
          {error}
        </div>
      )}

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {metrics.map((metric) => {
          const Icon = metric.icon;
          return (
            <Card key={metric.label} className="space-y-2 border-border/70 p-5">
              <span className="text-xs font-semibold uppercase text-muted-foreground">
                {metric.label}
              </span>
              <p className={`mt-2 text-xl font-extrabold ${metric.tone}`}>
                {isLoading ? "…" : metric.value}
              </p>
              <p className="text-[10px] text-muted-foreground">
                <Icon className="mr-1 inline h-3 w-3" />
                {metric.description}
              </p>
            </Card>
          );
        })}
      </div>

      <Card className="space-y-4 border-border/70 p-6">
        <div className="flex items-center justify-between border-b pb-3">
          <div>
            <h2 className="flex items-center gap-2 text-base font-bold">
              <BarChart3 className="h-4 w-4 text-indigo-500" />
              Application Pipeline
            </h2>
            <p className="mt-1 text-xs text-muted-foreground">
              Counts reflect actual application statuses.
            </p>
          </div>
          <Badge variant="outline">Live database data</Badge>
        </div>

        {isLoading ? (
          <p className="text-sm text-muted-foreground">Loading pipeline...</p>
        ) : analytics?.pipelineFunnel.every((stage) => stage.count === 0) ? (
          <p className="rounded-lg border bg-muted/30 p-6 text-center text-sm text-muted-foreground">
            No application data is available for this recruiter yet.
          </p>
        ) : (
          <div className="space-y-4 text-xs">
            {analytics?.pipelineFunnel.map((item, index) => {
              const percent =
                analytics.totalApplicants > 0
                  ? Math.min(
                      100,
                      (item.count / analytics.totalApplicants) * 100
                    )
                  : 0;
              const colors = [
                "bg-indigo-600",
                "bg-purple-600",
                "bg-pink-600",
                "bg-amber-500",
                "bg-emerald-500",
              ];
              return (
                <div key={item.stage} className="space-y-1">
                  <div className="flex justify-between gap-3 font-semibold">
                    <span>{item.stage}</span>
                    <span className="text-indigo-400">
                      {item.count} ({percent.toFixed(1)}%)
                    </span>
                  </div>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                    <div
                      className={`h-full rounded-full ${colors[index] || colors[0]}`}
                      style={{ width: `${percent}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </Card>
    </div>
  );
}
