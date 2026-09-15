"use client";

import React from "react";
import {
  BarChart3,
  DollarSign,
  TrendingUp,
  Sparkles,
  Activity,
  Users,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function PlatformAnalyticsPage() {
  return (
    <div className="mx-auto max-w-6xl space-y-6 p-4 sm:p-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">
          Platform Revenue & Telemetry Analytics
        </h1>
        <p className="text-sm text-muted-foreground">
          Track Monthly Recurring Revenue (MRR), Gemini model API request
          volumes, and user growth.
        </p>
      </div>

      {/* Revenue & Telemetry Cards */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <Card className="border-emerald-500/20 p-5">
          <span className="text-xs font-semibold uppercase text-muted-foreground">
            Monthly MRR
          </span>
          <p className="mt-2 text-2xl font-extrabold text-emerald-400">
            42,500
          </p>
          <p className="mt-1 flex items-center gap-0.5 text-[10px] text-emerald-400">
            <TrendingUp className="h-3 w-3" /> +18% MRR growth
          </p>
        </Card>

        <Card className="border-border/60 p-5">
          <span className="text-xs font-semibold uppercase text-muted-foreground">
            Pro Recruiters
          </span>
          <p className="mt-2 text-2xl font-extrabold text-primary">85 Active</p>
          <p className="mt-1 text-[10px] text-muted-foreground">
            499 / mo subscription tier
          </p>
        </Card>

        <Card className="border-pink-500/20 p-5">
          <span className="text-xs font-semibold uppercase text-muted-foreground">
            Gemini AI Requests
          </span>
          <p className="mt-2 text-2xl font-extrabold text-pink-400">
            18.5k / day
          </p>
          <p className="mt-1 text-[10px] text-pink-400">
            Sub-100ms latency average
          </p>
        </Card>

        <Card className="border-border/60 p-5">
          <span className="text-xs font-semibold uppercase text-muted-foreground">
            Student Retention
          </span>
          <p className="mt-2 text-2xl font-extrabold text-primary">92%</p>
          <p className="mt-1 text-[10px] text-muted-foreground">
            30-day active retention
          </p>
        </Card>
      </div>

      {/* Revenue Breakdown */}
      <Card className="space-y-4 border-border/60 p-6">
        <div className="flex items-center justify-between border-b pb-3">
          <h2 className="flex items-center gap-2 text-base font-bold">
            <BarChart3 className="h-4 w-4 text-primary" /> Revenue Stream
            Breakdown
          </h2>
          <Badge variant="accent">Aug 2026 Snapshot</Badge>
        </div>

        <div className="space-y-3 text-xs">
          <div className="flex items-center justify-between rounded-lg border bg-card/60 p-3">
            <div>
              <p className="font-bold text-foreground">
                Pro Recruiter Enterprise Subscriptions ($499/mo)
              </p>
              <p className="text-[10px] text-muted-foreground">
                85 active enterprise recruiter accounts
              </p>
            </div>
            <span className="text-sm font-extrabold text-emerald-400">
              42,415 / mo
            </span>
          </div>

          <div className="flex items-center justify-between rounded-lg border bg-card/60 p-3">
            <div>
              <p className="font-bold text-foreground">
                Featured Job Placement Add-ons ($99/job)
              </p>
              <p className="text-[10px] text-muted-foreground">
                12 active featured listings
              </p>
            </div>
            <span className="text-sm font-extrabold text-primary">
              1,188 / mo
            </span>
          </div>
        </div>
      </Card>
    </div>
  );
}
