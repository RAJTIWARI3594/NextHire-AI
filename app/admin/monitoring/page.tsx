"use client";

import React, { useEffect, useState } from "react";
import {
  Server,
  Activity,
  Cpu,
  Database,
  HardDrive,
  Wifi,
  RefreshCw,
  Zap,
  Users,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

type Telemetry = {
  apiLatencyMs: number;
  dbQueryTimeMs: number;
  aiResponseTimeMs: number;
  errorRatePercent: number;
  activeUsers: number;
  queuePendingJobs: number;
  memoryUsagePercent: number;
  cpuUsagePercent: number;
  storageUsagePercent: number;
  requestsObserved: number;
  apiSamples: number;
  dbSamples: number;
  aiSamples: number;
  timestamp: string;
};

export default function InfrastructureMonitoringPage() {
  const [snapshot, setSnapshot] = useState<Telemetry | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTelemetry = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/monitoring/stats", {
        cache: "no-store",
      });
      if (!response.ok) {
        const body = await response.json().catch(() => ({}));
        throw new Error(body.error || "Telemetry could not be loaded.");
      }
      const data = await response.json();
      setSnapshot(data.snapshot as Telemetry);
    } catch (loadError: unknown) {
      setError((loadError as Error)?.message || "Telemetry could not be loaded.");
      setSnapshot(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTelemetry();
  }, []);

  const metrics = snapshot
    ? [
        {
          label: "API Latency",
          value: snapshot.apiSamples ? `${snapshot.apiLatencyMs} ms` : "No samples",
          icon: Wifi,
          note: `${snapshot.apiSamples} process-local samples`,
        },
        {
          label: "DB Query Time",
          value: snapshot.dbSamples ? `${snapshot.dbQueryTimeMs} ms` : "No samples",
          icon: Database,
          note: `${snapshot.dbSamples} instrumented samples`,
        },
        {
          label: "AI Response Time",
          value: snapshot.aiSamples ? `${snapshot.aiResponseTimeMs} ms` : "No samples",
          icon: Zap,
          note: `${snapshot.aiSamples} instrumented samples`,
        },
        {
          label: "Server Memory",
          value: `${snapshot.memoryUsagePercent}%`,
          icon: Cpu,
          note: "Current process heap usage",
        },
        {
          label: "Active Users",
          value: "Not tracked",
          icon: Users,
          note: "Session counting is not configured",
        },
        {
          label: "Storage / CPU",
          value: "Not tracked",
          icon: HardDrive,
          note: "Requires infrastructure-level telemetry",
        },
      ]
    : [];

  return (
    <div className="mx-auto max-w-7xl space-y-8 p-4 sm:p-8">
      <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <div className="flex items-center gap-2">
            <Badge variant="accent">Infrastructure Monitoring</Badge>
            <Badge variant={snapshot ? "success" : "secondary"}>
              {snapshot ? "Process snapshot loaded" : "Telemetry unavailable"}
            </Badge>
          </div>
          <h1 className="mt-1 text-3xl font-extrabold tracking-tight">
            Infrastructure Metrics
          </h1>
          <p className="text-sm text-muted-foreground">
            Process-local samples are shown only when observed. Metrics without
            instrumentation are labelled as unavailable.
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={fetchTelemetry}
          disabled={loading}
          className="gap-2 text-xs"
        >
          <RefreshCw className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`} />
          Refresh Metrics
        </Button>
      </div>

      {error && (
        <div role="alert" className="rounded-md border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">
          {error}
        </div>
      )}

      {loading ? (
        <Card className="p-8 text-center text-sm text-muted-foreground">
          Loading telemetry...
        </Card>
      ) : snapshot ? (
        <>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
            {metrics.map((metric) => {
              const Icon = metric.icon;
              return (
                <Card key={metric.label} className="space-y-2 border-border/60 p-4 text-center">
                  <Icon className="mx-auto h-5 w-5 text-primary" />
                  <p className="text-xl font-extrabold text-primary">{metric.value}</p>
                  <p className="text-[11px] font-semibold">{metric.label}</p>
                  <p className="text-[9px] text-muted-foreground">{metric.note}</p>
                </Card>
              );
            })}
          </div>
          <Card className="space-y-2 border-border/60 p-6">
            <h2 className="flex items-center gap-2 text-sm font-bold">
              <Activity className="h-4 w-4 text-primary" />
              Snapshot metadata
            </h2>
            <p className="text-xs text-muted-foreground">
              {snapshot.requestsObserved} API requests observed in this process.
            </p>
            <p className="text-xs text-muted-foreground">
              Last sampled: {new Date(snapshot.timestamp).toLocaleString("en-IN")}
            </p>
            <p className="text-xs text-muted-foreground">
              Serverless instances are isolated; this snapshot is not a global
              fleet metric or historical time series.
            </p>
          </Card>
        </>
      ) : (
        <Card className="p-8 text-center text-sm text-muted-foreground">
          No infrastructure telemetry is available.
        </Card>
      )}
    </div>
  );
}
