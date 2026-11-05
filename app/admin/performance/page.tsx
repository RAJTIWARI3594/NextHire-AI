"use client";

import React from "react";
import Link from "next/link";
import { Gauge, Activity, Database, Layers, ExternalLink, AlertCircle } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function PerformanceOptimizationPage() {
  const items = [
    {
      title: "Process telemetry",
      detail: "API, database and AI timings are only shown when instrumented samples exist.",
      status: "Partial",
    },
    {
      title: "Core Web Vitals",
      detail: "LCP, INP, CLS and TTFB are not currently collected into this admin dashboard.",
      status: "Not connected",
    },
    {
      title: "CDN cache and edge metrics",
      detail: "Cache hit ratios and edge request analytics are not pulled into this application.",
      status: "Not connected",
    },
    {
      title: "Database query history",
      detail: "Slow-query history is not exposed from pg_stat_statements in this application.",
      status: "Not connected",
    },
  ];

  return (
    <div className="mx-auto max-w-6xl space-y-6 p-4 sm:p-8">
      <div>
        <Badge variant="accent">Performance & Optimization</Badge>
        <h1 className="mt-2 text-2xl font-bold tracking-tight">
          Performance Measurement
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          No Lighthouse scores, CDN ratios, or query durations are fabricated.
          The available process snapshot is shown in Infrastructure Monitoring.
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        {items.map((item) => (
          <Card key={item.title} className="space-y-2 border-border/60 p-5">
            <div className="flex items-center justify-between gap-2">
              <h2 className="text-sm font-semibold">{item.title}</h2>
              <Badge variant={item.status === "Partial" ? "secondary" : "outline"}>
                {item.status}
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground">{item.detail}</p>
          </Card>
        ))}
      </div>

      <Card className="flex items-start gap-3 border-border/60 p-5">
        <Activity className="mt-0.5 h-5 w-5 text-primary" />
        <div className="space-y-1">
          <h2 className="text-sm font-semibold">Available process snapshot</h2>
          <p className="text-xs text-muted-foreground">
            The current monitoring endpoint is admin-only and labels uninstrumented
            values as unavailable. Its metrics are process-local, not global
            multi-instance measurements.
          </p>
          <Link href="/admin/monitoring" className="inline-flex items-center gap-1 text-sm font-semibold text-primary hover:underline">
            Open Infrastructure Monitoring <ExternalLink className="h-3.5 w-3.5" />
          </Link>
        </div>
      </Card>

      <Card className="flex items-start gap-3 border-amber-500/30 p-5">
        <AlertCircle className="mt-0.5 h-5 w-5 text-amber-500" />
        <div className="space-y-1">
          <h2 className="text-sm font-semibold">Database advisor note</h2>
          <p className="text-xs text-muted-foreground">
            Supabase currently reports unused indexes as informational notices.
            Low application traffic can explain this; do not remove indexes
            without query-plan evidence.
          </p>
        </div>
      </Card>
    </div>
  );
}
