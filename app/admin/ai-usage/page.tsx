"use client";

import React, { useEffect, useState } from "react";
import { Sparkles, Activity, Cpu, AlertCircle } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { fetchAIUsageMetrics } from "@/services/saas-service";
import type { AIUsageMetrics } from "@/types/saas";

export default function AIUsageDashboardPage() {
  const [metrics, setMetrics] = useState<AIUsageMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    fetchAIUsageMetrics()
      .then((data) => { if (active) setMetrics(data); })
      .catch((loadError: unknown) => {
        if (active) setError((loadError as Error)?.message || "AI usage could not be loaded.");
      })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, []);

  const metricsList = [
    { label: "AI chat sessions today", value: metrics ? metrics.totalRequestsToday.toLocaleString() : "—" },
    { label: "Tokens consumed", value: metrics?.totalTokensUsed == null ? "Not tracked" : metrics.totalTokensUsed.toLocaleString() },
    { label: "AI provider cost", value: metrics?.totalCostUsd == null ? "Not tracked" : `$${metrics.totalCostUsd.toFixed(2)} USD` },
    { label: "Cost per user", value: metrics?.costPerUserUsd == null ? "Not tracked" : `$${metrics.costPerUserUsd.toFixed(4)} USD` },
  ];

  return (
    <div className="mx-auto max-w-6xl space-y-6 p-4 sm:p-8">
      <div>
        <Badge variant="outline">Database session counts only</Badge>
        <h1 className="mt-2 text-2xl font-bold tracking-tight">AI Usage & Cost Telemetry</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          AI chat rows are counted from the database. Token totals, provider model,
          feature-level usage, and billing cost are not stored in the current schema.
        </p>
      </div>
      {error && <div role="alert" className="rounded-md border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">{error}</div>}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {metricsList.map((metric) => (
          <Card key={metric.label} className="space-y-2 border-border/60 p-5">
            <Sparkles className="h-5 w-5 text-primary" />
            <span className="text-xs font-semibold uppercase text-muted-foreground">{metric.label}</span>
            <p className="text-2xl font-extrabold text-primary">{loading ? "…" : metric.value}</p>
          </Card>
        ))}
      </div>
      <Card className="space-y-3 border-border/60 p-6">
        <h2 className="flex items-center gap-2 text-sm font-bold"><Cpu className="h-4 w-4 text-primary" /> Feature breakdown</h2>
        {loading ? (
          <p className="text-sm text-muted-foreground">Loading recorded AI sessions...</p>
        ) : (
          <div className="flex items-start gap-3 rounded-lg border bg-muted/30 p-4">
            <AlertCircle className="mt-0.5 h-4 w-4 text-amber-500" />
            <p className="text-xs text-muted-foreground">
              No feature attribution or token metering is present in the stored AI chat schema.
              No feature split or dollar cost is estimated.
            </p>
          </div>
        )}
        <p className="flex items-center gap-2 text-[11px] text-muted-foreground">
          <Activity className="h-3.5 w-3.5" /> Source: ai_chat_history rows created today.
        </p>
      </Card>
    </div>
  );
}
