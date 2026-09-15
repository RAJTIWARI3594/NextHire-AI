"use client";

import React from "react";
import {
  BarChart3,
  Eye,
  Download,
  MousePointer,
  Users,
  Sparkles,
  TrendingUp,
} from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function ResumeAnalyticsPage() {
  return (
    <div className="mx-auto max-w-6xl space-y-6 p-4 sm:p-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">
          Resume & Profile Performance Analytics
        </h1>
        <p className="text-sm text-muted-foreground">
          Track recruiter engagement, profile views, ATS score trends, and
          document downloads.
        </p>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <Card className="border-border/60 p-5">
          <div className="flex items-start justify-between">
            <span className="text-xs font-semibold uppercase text-muted-foreground">
              Total Views
            </span>
            <Eye className="h-4 w-4 text-primary" />
          </div>
          <p className="mt-2 text-2xl font-extrabold">142</p>
          <p className="mt-1 flex items-center gap-0.5 text-[10px] text-emerald-400">
            <TrendingUp className="h-3 w-3" /> +18% this week
          </p>
        </Card>

        <Card className="border-border/60 p-5">
          <div className="flex items-start justify-between">
            <span className="text-xs font-semibold uppercase text-muted-foreground">
              Recruiter Views
            </span>
            <Users className="h-4 w-4 text-primary" />
          </div>
          <p className="mt-2 text-2xl font-extrabold text-primary">38</p>
          <p className="mt-1 text-[10px] text-primary">
            Verified Tech Recruiters
          </p>
        </Card>

        <Card className="border-pink-500/20 p-5">
          <div className="flex items-start justify-between">
            <span className="text-xs font-semibold uppercase text-muted-foreground">
              PDF Downloads
            </span>
            <Download className="h-4 w-4 text-pink-500" />
          </div>
          <p className="mt-2 text-2xl font-extrabold">18</p>
          <p className="mt-1 text-[10px] text-muted-foreground">
            Exported Files
          </p>
        </Card>

        <Card className="border-emerald-500/20 p-5">
          <div className="flex items-start justify-between">
            <span className="text-xs font-semibold uppercase text-muted-foreground">
              Public Link Clicks
            </span>
            <MousePointer className="h-4 w-4 text-emerald-500" />
          </div>
          <p className="mt-2 text-2xl font-extrabold text-emerald-400">64</p>
          <p className="mt-1 text-[10px] text-emerald-400">
            From Portfolio & LinkedIn
          </p>
        </Card>
      </div>

      {/* Weekly View Trends Visualization */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <Card className="space-y-4 border-border/60 p-6 lg:col-span-2">
          <div className="flex items-center justify-between border-b pb-3">
            <h2 className="flex items-center gap-2 text-base font-bold">
              <BarChart3 className="h-4 w-4 text-primary" /> Weekly View Trends
            </h2>
            <Badge variant="accent">Last 7 Days</Badge>
          </div>

          <div className="flex h-44 items-end justify-between gap-2 border-b border-border/40 px-2 pb-2 pt-6">
            {[
              { day: "Mon", count: 12, height: "40%" },
              { day: "Tue", count: 18, height: "60%" },
              { day: "Wed", count: 24, height: "75%" },
              { day: "Thu", count: 30, height: "95%" },
              { day: "Fri", count: 22, height: "70%" },
              { day: "Sat", count: 15, height: "50%" },
              { day: "Sun", count: 21, height: "65%" },
            ].map((bar) => (
              <div
                key={bar.day}
                className="flex h-full flex-1 flex-col items-center justify-end gap-2"
              >
                <span className="text-[10px] font-bold text-primary">
                  {bar.count}
                </span>
                <div
                  className="w-full max-w-[28px] rounded-t-md bg-gradient-to-t from-primary to-primary/80 transition-all hover:opacity-80"
                  style={{ height: bar.height }}
                />
                <span className="text-[10px] font-semibold text-muted-foreground">
                  {bar.day}
                </span>
              </div>
            ))}
          </div>
        </Card>

        {/* ATS Score Improvement History */}
        <Card className="space-y-4 border-border/60 p-6">
          <div className="border-b pb-3">
            <h2 className="flex items-center gap-2 text-base font-bold">
              <Sparkles className="h-4 w-4 text-primary" /> ATS Score History
            </h2>
          </div>

          <div className="space-y-3 text-xs">
            {[
              {
                date: "Aug 5, 2026",
                score: 88,
                status: "Current",
                color: "text-emerald-400",
              },
              {
                date: "Jul 28, 2026",
                score: 82,
                status: "Improved",
                color: "text-primary",
              },
              {
                date: "Jul 15, 2026",
                score: 78,
                status: "Improved",
                color: "text-primary",
              },
              {
                date: "Jul 1, 2026",
                score: 72,
                status: "Initial",
                color: "text-muted-foreground",
              },
            ].map((item) => (
              <div
                key={item.date}
                className="flex items-center justify-between rounded-lg border bg-card/60 p-2.5"
              >
                <div>
                  <p className="font-semibold">{item.date}</p>
                  <p className="text-[10px] text-muted-foreground">
                    {item.status}
                  </p>
                </div>
                <span className={`text-base font-extrabold ${item.color}`}>
                  {item.score}/100
                </span>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
