"use client";

import React, { useEffect, useState } from "react";
import {
  Sparkles,
  Activity,
  DollarSign,
  Cpu,
  BarChart3,
  AlertCircle,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { fetchAIUsageMetrics } from "@/services/saas-service";
import type { AIUsageMetrics } from "@/types/saas";

export default function AIUsageDashboardPage() {
  const [metrics, setMetrics] = useState<AIUsageMetrics | null>(null);

  useEffect(() => {
    async function load() {
      const res = await fetchAIUsageMetrics();
      setMetrics(res);
    }
    load();
  }, []);

  return (
    <div className="mx-auto max-w-6xl space-y-6 p-4 sm:p-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">
          AI Model Token & Cost Telemetry Dashboard
        </h1>
        <p className="text-sm text-muted-foreground">
          Track Gemini 1.5 model API requests, token consumption per feature,
          and compute cost per candidate.
        </p>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <Card className="border-pink-500/20 p-5">
          <span className="text-xs font-semibold uppercase text-muted-foreground">
            Daily Requests
          </span>
          <p className="mt-2 text-2xl font-extrabold text-pink-400">18,500</p>
          <p className="mt-1 text-[10px] text-muted-foreground">
            Gemini 1.5 Pro
          </p>
        </Card>

        <Card className="border-border/60 p-5">
          <span className="text-xs font-semibold uppercase text-muted-foreground">
            Tokens Consumed
          </span>
          <p className="mt-2 text-2xl font-extrabold text-primary">4.25M</p>
          <p className="mt-1 text-[10px] text-muted-foreground">
            Prompt + Completion
          </p>
        </Card>

        <Card className="border-emerald-500/20 p-5">
          <span className="text-xs font-semibold uppercase text-muted-foreground">
            Daily API Cost
          </span>
          <p className="mt-2 text-2xl font-extrabold text-emerald-400">
            $14.85
          </p>
          <p className="mt-1 text-[10px] text-emerald-400">
            Optimized prompt caching
          </p>
        </Card>

        <Card className="border-border/60 p-5">
          <span className="text-xs font-semibold uppercase text-muted-foreground">
            Cost Per Student
          </span>
          <p className="mt-2 text-2xl font-extrabold text-primary">$0.0010</p>
          <p className="mt-1 text-[10px] text-muted-foreground">
            Highly scalable margin
          </p>
        </Card>
      </div>

      {/* Feature Token Usage Breakdown */}
      <Card className="space-y-4 border-border/60 p-6">
        <div className="flex items-center justify-between border-b pb-3">
          <h2 className="flex items-center gap-2 text-sm font-bold">
            <Cpu className="h-4 w-4 text-primary" /> Token Consumption by AI
            Feature
          </h2>
          <Badge variant="accent">Gemini 1.5 Telemetry</Badge>
        </div>

        <div className="space-y-3 text-xs">
          {(
            metrics?.featureBreakdown || [
              { feature: "AI Career Coach", count: 8200, cost: 6.45 },
              { feature: "AI Resume Review", count: 4500, cost: 3.8 },
              { feature: "AI Mock Interview", count: 3800, cost: 3.1 },
              { feature: "AI Cover Letter", count: 2000, cost: 1.5 },
            ]
          ).map((item) => (
            <div
              key={item.feature}
              className="flex items-center justify-between rounded-xl border bg-card/60 p-4"
            >
              <div>
                <p className="font-bold text-foreground">{item.feature}</p>
                <p className="text-[10px] text-muted-foreground">
                  {item.count.toLocaleString()} AI Invocation Calls
                </p>
              </div>
              <div className="text-right">
                <span className="text-sm font-extrabold text-emerald-400">
                  ${item.cost.toFixed(2)} USD
                </span>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
