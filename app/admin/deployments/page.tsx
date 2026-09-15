"use client";

import React, { useState } from "react";
import {
  GitBranch,
  Rocket,
  RefreshCw,
  Layers,
  CheckCircle2,
  RotateCcw,
  Cpu,
  Wifi,
  Server,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default function AdminDeploymentsPage() {
  const [deployments] = useState([
    {
      id: "dep-101",
      tag: "v1.0.42",
      branch: "main",
      commit: "a3f8902",
      status: "production",
      env: "Production (Vercel)",
      time: "12 mins ago",
      author: "DevOps Bot",
    },
    {
      id: "dep-100",
      tag: "v1.0.41",
      branch: "staging",
      commit: "8f21bc9",
      status: "superseded",
      env: "Staging",
      time: "2 hours ago",
      author: "CI/CD Pipeline",
    },
    {
      id: "dep-099",
      tag: "v1.0.40",
      branch: "main",
      commit: "5d011a4",
      status: "superseded",
      env: "Production",
      time: "1 day ago",
      author: "DevOps Bot",
    },
  ]);

  return (
    <div className="mx-auto max-w-7xl space-y-8 p-4 sm:p-8">
      <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <div className="flex items-center gap-2">
            <Badge variant="accent">Production Infrastructure</Badge>
            <Badge variant="success" className="gap-1">
              <Rocket className="h-3.5 w-3.5" /> Zero-Downtime Pipeline Active
            </Badge>
          </div>
          <h1 className="mt-1 text-3xl font-extrabold tracking-tight">
            Deployments & Auto-Scaling Console
          </h1>
          <p className="text-sm text-muted-foreground">
            Inspect live production releases, GitHub Actions CI/CD status,
            Vercel deployments, and auto-scaling node policies.
          </p>
        </div>

        <Button variant="outline" size="sm" className="gap-1.5 text-xs">
          <RefreshCw className="h-3.5 w-3.5" /> Refresh Deployment State
        </Button>
      </div>

      {/* Auto-Scaling Policy Summary Grid */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <Card className="border-border/60 p-5">
          <span className="text-xs font-semibold uppercase text-muted-foreground">
            API Gateway Scaling
          </span>
          <p className="mt-1 text-2xl font-extrabold text-primary">
            2 - 20 Nodes
          </p>
          <p className="text-[10px] text-muted-foreground">
            Target: 70% CPU / 500 RPS
          </p>
        </Card>

        <Card className="border-border/60 p-5">
          <span className="text-xs font-semibold uppercase text-muted-foreground">
            AI Concurrency Pool
          </span>
          <p className="mt-1 text-2xl font-extrabold text-primary">
            50 Max / Node
          </p>
          <p className="text-[10px] text-muted-foreground">
            Gemini 1.5 Streaming Pool
          </p>
        </Card>

        <Card className="border-emerald-500/20 p-5">
          <span className="text-xs font-semibold uppercase text-muted-foreground">
            DB Connection Pool
          </span>
          <p className="mt-1 text-2xl font-extrabold text-emerald-400">
            100 Pooled
          </p>
          <p className="text-[10px] text-muted-foreground">
            PgBouncer Transaction Mode
          </p>
        </Card>

        <Card className="border-pink-500/20 p-5">
          <span className="text-xs font-semibold uppercase text-muted-foreground">
            Worker Replicas
          </span>
          <p className="mt-1 text-2xl font-extrabold text-pink-400">
            2 - 10 Replicas
          </p>
          <p className="text-[10px] text-muted-foreground">
            Auto-scales at Queue &gt; 50
          </p>
        </Card>
      </div>

      {/* Deployment History Table */}
      <Card className="space-y-4 border-border/60 p-6">
        <div className="flex items-center justify-between border-b pb-3">
          <h2 className="flex items-center gap-2 text-sm font-bold">
            <GitBranch className="h-4 w-4 text-primary" /> Recent Releases &
            Deployment History
          </h2>
          <Badge variant="outline" className="font-mono text-[10px]">
            GitHub Actions CI/CD
          </Badge>
        </div>

        <div className="space-y-3 text-xs">
          {deployments.map((dep) => (
            <div
              key={dep.id}
              className="flex flex-col items-start justify-between gap-4 rounded-xl border bg-card/60 p-4 sm:flex-row sm:items-center"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-foreground">
                    {dep.tag}
                  </span>
                  <Badge
                    variant={
                      dep.status === "production" ? "success" : "secondary"
                    }
                  >
                    {dep.env}
                  </Badge>
                  <span className="font-mono text-[10px] text-muted-foreground">
                    [{dep.branch}:{dep.commit}]
                  </span>
                </div>
                <p className="text-[11px] text-muted-foreground">
                  Deployed by {dep.author} • {dep.time}
                </p>
              </div>

              <div className="flex gap-2">
                {dep.status !== "production" && (
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-7 gap-1 text-[10px] text-amber-400"
                  >
                    <RotateCcw className="h-3 w-3" /> Rollback to {dep.tag}
                  </Button>
                )}
                {dep.status === "production" && (
                  <Badge variant="accent" className="font-mono text-[10px]">
                    Current Live Release
                  </Badge>
                )}
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
