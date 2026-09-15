"use client";

import React from "react";
import {
  BarChart3,
  Clock,
  CheckCircle2,
  Users,
  TrendingUp,
  Sparkles,
  Trophy,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function RecruiterAnalyticsPage() {
  return (
    <div className="mx-auto max-w-6xl space-y-6 p-4 sm:p-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">
          Recruitment & Pipeline Analytics
        </h1>
        <p className="text-sm text-muted-foreground">
          Track hiring velocity, AI candidate ranking precision, and offer
          acceptance rates.
        </p>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <Card className="border-indigo-500/20 p-5">
          <span className="text-xs font-semibold uppercase text-muted-foreground">
            Avg Time to Hire
          </span>
          <p className="mt-2 text-2xl font-extrabold text-indigo-400">
            14 Days
          </p>
          <p className="mt-1 flex items-center gap-0.5 text-[10px] text-emerald-400">
            <TrendingUp className="h-3 w-3" /> 35% faster with AI
          </p>
        </Card>

        <Card className="border-emerald-500/20 p-5">
          <span className="text-xs font-semibold uppercase text-muted-foreground">
            Offer Acceptance
          </span>
          <p className="mt-2 text-2xl font-extrabold text-emerald-400">88%</p>
          <p className="mt-1 text-[10px] text-muted-foreground">
            High offer conversion
          </p>
        </Card>

        <Card className="border-purple-500/20 p-5">
          <span className="text-xs font-semibold uppercase text-muted-foreground">
            Interview Pass Rate
          </span>
          <p className="mt-2 text-2xl font-extrabold text-purple-400">74%</p>
          <p className="mt-1 text-[10px] text-muted-foreground">
            Pre-screened candidates
          </p>
        </Card>

        <Card className="border-amber-500/20 p-5">
          <span className="text-xs font-semibold uppercase text-muted-foreground">
            Total Pipeline
          </span>
          <p className="mt-2 text-2xl font-extrabold text-amber-400">184</p>
          <p className="mt-1 text-[10px] text-muted-foreground">
            Active Applicants
          </p>
        </Card>
      </div>

      {/* Recruitment Funnel Breakdown */}
      <Card className="space-y-4 border-indigo-500/20 p-6">
        <div className="flex items-center justify-between border-b pb-3">
          <h2 className="flex items-center gap-2 text-base font-bold">
            <BarChart3 className="h-4 w-4 text-indigo-500" /> Candidate Pipeline
            Conversion Funnel
          </h2>
          <Badge variant="accent">AI Match Screening Active</Badge>
        </div>

        <div className="space-y-4 text-xs">
          {[
            {
              stage: "Total Applicants",
              count: 184,
              percent: "100%",
              color: "bg-indigo-600",
            },
            {
              stage: "AI Ranked (Top 20%)",
              count: 36,
              percent: "20%",
              color: "bg-purple-600",
            },
            {
              stage: "Interview Scheduled",
              count: 18,
              percent: "10%",
              color: "bg-pink-600",
            },
            {
              stage: "Offer Sent",
              count: 8,
              percent: "4.3%",
              color: "bg-amber-500",
            },
            {
              stage: "Hired Talent",
              count: 7,
              percent: "3.8%",
              color: "bg-emerald-500",
            },
          ].map((item) => (
            <div key={item.stage} className="space-y-1">
              <div className="flex justify-between font-semibold">
                <span>{item.stage}</span>
                <span className="text-indigo-400">
                  {item.count} Candidates ({item.percent})
                </span>
              </div>
              <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                <div
                  className={`h-full ${item.color} rounded-full`}
                  style={{ width: item.percent }}
                />
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
