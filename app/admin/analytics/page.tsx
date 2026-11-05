"use client";

import React, { useEffect, useState } from "react";
import {
  BarChart3,
  DollarSign,
  Users,
  Briefcase,
  Sparkles,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { fetchAdminMetrics } from "@/services/admin-service";
import type { AdminMetrics } from "@/types/admin";

export default function PlatformAnalyticsPage() {
  const [metrics, setMetrics] = useState<AdminMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    fetchAdminMetrics()
      .then((data) => {
        if (active) setMetrics(data);
      })
      .catch((loadError: unknown) => {
        if (active) {
          setError((loadError as Error)?.message || "Platform analytics could not be loaded.");
        }
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  const cards = [
    {
      label: "Successful USD Payments",
      value: metrics ? `$${metrics.monthlyRevenueUsd.toLocaleString()}` : "—",
      note: "Recorded this calendar month",
      icon: DollarSign,
    },
    {
      label: "Registered Recruiters",
      value: metrics ? metrics.totalRecruiters.toLocaleString() : "—",
      note: "Database profile count",
      icon: Users,
    },
    {
      label: "Job Listings",
      value: metrics ? metrics.totalJobs.toLocaleString() : "—",
      note: "Internal platform listings",
      icon: Briefcase,
    },
    {
      label: "AI Chat Sessions",
      value: metrics ? metrics.dailyAiSessions.toLocaleString() : "—",
      note: "Sessions recorded today",
      icon: Sparkles,
    },
  ];

  return (
    <div className="mx-auto max-w-6xl space-y-6 p-4 sm:p-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">
          Platform Revenue & Usage Analytics
        </h1>
        <p className="text-sm text-muted-foreground">
          Actual payment, account, job and AI session records. Untracked metrics
          are not estimated.
        </p>
      </div>

      {error && (
        <div role="alert" className="rounded-md border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">
          {error}
        </div>
      )}

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {cards.map((item) => {
          const Icon = item.icon;
          return (
            <Card key={item.label} className="space-y-2 border-border/60 p-5">
              <Icon className="h-5 w-5 text-primary" />
              <span className="text-xs font-semibold uppercase text-muted-foreground">
                {item.label}
              </span>
              <p className="text-2xl font-extrabold text-primary">
                {loading ? "…" : item.value}
              </p>
              <p className="text-[10px] text-muted-foreground">{item.note}</p>
            </Card>
          );
        })}
      </div>

      <Card className="space-y-4 border-border/60 p-6">
        <div className="flex items-center justify-between border-b pb-3">
          <h2 className="flex items-center gap-2 text-base font-bold">
            <BarChart3 className="h-4 w-4 text-primary" />
            Payment records
          </h2>
          <Badge variant="outline">Live database data</Badge>
        </div>
        {loading ? (
          <p className="text-sm text-muted-foreground">Loading payment records...</p>
        ) : metrics?.monthlyRevenueUsd === 0 ? (
          <p className="rounded-lg border bg-muted/30 p-6 text-center text-sm text-muted-foreground">
            No successful USD payment records have been recorded this month.
            Subscription billing and payment gateway processing are not configured.
          </p>
        ) : (
          <p className="text-sm text-muted-foreground">
            Successful USD payments recorded this month total{" "}
            <strong>${metrics?.monthlyRevenueUsd.toLocaleString()}</strong>.
          </p>
        )}
      </Card>
    </div>
  );
}
