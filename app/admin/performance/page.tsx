"use client";

import React from "react";
import {
  Gauge,
  Zap,
  Database,
  Layers,
  CheckCircle2,
  AlertTriangle,
  FileCode,
  HardDrive,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default function PerformanceOptimizationPage() {
  const webVitals = [
    {
      name: "LCP (Largest Contentful Paint)",
      value: "0.8s",
      threshold: "Good (< 2.5s)",
      score: 98,
      status: "optimal",
    },
    {
      name: "FID / INP (Interaction to Next Paint)",
      value: "18ms",
      threshold: "Good (< 200ms)",
      score: 99,
      status: "optimal",
    },
    {
      name: "CLS (Cumulative Layout Shift)",
      value: "0.01",
      threshold: "Good (< 0.1)",
      score: 100,
      status: "optimal",
    },
    {
      name: "TTFB (Time to First Byte)",
      value: "42ms",
      threshold: "Good (< 800ms)",
      score: 97,
      status: "optimal",
    },
  ];

  const slowQueries = [
    {
      id: "q-1",
      query: "SELECT * FROM candidate_resumes WHERE parse_status = 'pending'",
      durationMs: 210,
      table: "candidate_resumes",
      time: "14 mins ago",
    },
    {
      id: "q-2",
      query: "SELECT count(*) FROM video_interviews GROUP BY company_id",
      durationMs: 185,
      table: "video_interviews",
      time: "1 hour ago",
    },
  ];

  return (
    <div className="mx-auto max-w-7xl space-y-8 p-4 sm:p-8">
      <div>
        <div className="flex items-center gap-2">
          <Badge variant="accent">Performance & Optimization</Badge>
          <Badge variant="success" className="gap-1">
            <Gauge className="h-3.5 w-3.5" /> Lighthouse Score: 98/100
          </Badge>
        </div>
        <h1 className="mt-1 text-3xl font-extrabold tracking-tight">
          Platform Performance & Query Optimization
        </h1>
        <p className="text-sm text-muted-foreground">
          Monitor Core Web Vitals, track CDN cache hit ratios, inspect bundle
          sizes, and optimize database slow queries.
        </p>
      </div>

      {/* Core Web Vitals Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {webVitals.map((v) => (
          <Card key={v.name} className="space-y-2 border-border/60 p-5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase text-muted-foreground">
                {v.name.split(" ")[0]}
              </span>
              <Badge variant="success" className="text-[10px]">
                {v.threshold}
              </Badge>
            </div>
            <p className="text-3xl font-extrabold text-foreground">{v.value}</p>
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-secondary">
              <div
                className="h-full rounded-full bg-emerald-500"
                style={{ width: `${v.score}%` }}
              />
            </div>
            <p className="text-[10px] font-medium text-emerald-400">{v.name}</p>
          </Card>
        ))}
      </div>

      {/* Cache & Bundle Analysis */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
        <Card className="space-y-4 border-border/60 p-6 lg:col-span-6">
          <div className="flex items-center justify-between border-b pb-3">
            <h2 className="flex items-center gap-2 text-sm font-bold">
              <Layers className="h-4 w-4 text-primary" /> Multi-Layer Cache Hit
              Ratios
            </h2>
            <Badge variant="accent">Vercel & Cloudflare Edge</Badge>
          </div>

          <div className="space-y-4 text-xs">
            <div className="space-y-1">
              <div className="flex justify-between">
                <span className="font-semibold">
                  Static Asset Cache (JS, CSS, WebP Fonts)
                </span>
                <span className="font-bold text-emerald-400">98.4% Hit</span>
              </div>
              <div className="h-2 w-full overflow-hidden rounded-full bg-secondary">
                <div
                  className="h-full rounded-full bg-emerald-500"
                  style={{ width: "98.4%" }}
                />
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex justify-between">
                <span className="font-semibold">
                  API Stale-While-Revalidate Query Cache
                </span>
                <span className="font-bold text-primary">91.2% Hit</span>
              </div>
              <div className="h-2 w-full overflow-hidden rounded-full bg-secondary">
                <div
                  className="h-full rounded-full bg-primary"
                  style={{ width: "91.2%" }}
                />
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex justify-between">
                <span className="font-semibold">
                  Supabase PgBouncer Query Cache
                </span>
                <span className="font-bold text-primary">94.8% Hit</span>
              </div>
              <div className="h-2 w-full overflow-hidden rounded-full bg-secondary">
                <div
                  className="h-full rounded-full bg-primary"
                  style={{ width: "94.8%" }}
                />
              </div>
            </div>
          </div>
        </Card>

        {/* Slow Query Inspector */}
        <Card className="space-y-4 border-amber-500/20 p-6 lg:col-span-6">
          <div className="flex items-center justify-between border-b pb-3">
            <h2 className="flex items-center gap-2 text-sm font-bold">
              <Database className="h-4 w-4 text-amber-500" /> Slow Query
              Detection Log (&gt; 150ms)
            </h2>
            <Badge variant="outline">pg_stat_statements</Badge>
          </div>

          <div className="space-y-3 text-xs">
            {slowQueries.map((q) => (
              <div
                key={q.id}
                className="space-y-1.5 rounded-lg border bg-card/60 p-3 font-mono"
              >
                <div className="flex items-start justify-between text-[11px]">
                  <span className="font-bold text-amber-400">
                    {q.durationMs}ms Execution
                  </span>
                  <span className="text-muted-foreground">{q.time}</span>
                </div>
                <p className="rounded border border-border/40 bg-background/80 p-2 text-[11px] text-foreground">
                  {q.query}
                </p>
                <div className="flex items-center justify-between pt-1 text-[10px] text-muted-foreground">
                  <span>Target Table: {q.table}</span>
                  <Badge variant="outline" className="text-[9px]">
                    Index Suggested
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
