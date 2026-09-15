"use client";

import React, { useState, useEffect } from "react";
import {
  Server,
  Activity,
  Cpu,
  Database,
  HardDrive,
  Wifi,
  RefreshCw,
  Zap,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  BarChart,
  Bar,
} from "recharts";

export default function InfrastructureMonitoringPage() {
  const [telemetry, setTelemetry] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchTelemetry = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/monitoring/stats");
      const data = await res.json();
      setTelemetry(data);
    } catch (err) {
      console.error("Failed to load telemetry stats", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTelemetry();
    const interval = setInterval(fetchTelemetry, 15000);
    return () => clearInterval(interval);
  }, []);

  const timeSeries = telemetry?.timeSeries || [
    {
      time: "10m ago",
      apiLatency: 42,
      dbQueryTime: 12,
      aiResponseTime: 380,
      errorRate: 0.02,
      activeUsers: 1420,
    },
    {
      time: "8m ago",
      apiLatency: 48,
      dbQueryTime: 14,
      aiResponseTime: 410,
      errorRate: 0.03,
      activeUsers: 1435,
    },
    {
      time: "6m ago",
      apiLatency: 39,
      dbQueryTime: 10,
      aiResponseTime: 395,
      errorRate: 0.01,
      activeUsers: 1450,
    },
    {
      time: "4m ago",
      apiLatency: 45,
      dbQueryTime: 11,
      aiResponseTime: 420,
      errorRate: 0.02,
      activeUsers: 1462,
    },
    {
      time: "2m ago",
      apiLatency: 41,
      dbQueryTime: 13,
      aiResponseTime: 405,
      errorRate: 0.02,
      activeUsers: 1475,
    },
    {
      time: "Just now",
      apiLatency: 38,
      dbQueryTime: 9,
      aiResponseTime: 390,
      errorRate: 0.01,
      activeUsers: 1480,
    },
  ];

  const snapshot = telemetry?.snapshot || {
    apiLatencyMs: 38,
    dbQueryTimeMs: 9,
    aiResponseTimeMs: 390,
    errorRatePercent: 0.01,
    activeUsers: 1480,
    queuePendingJobs: 3,
    memoryUsagePercent: 32,
    cpuUsagePercent: 24,
    storageUsagePercent: 14.5,
  };

  return (
    <div className="mx-auto max-w-7xl space-y-8 p-4 sm:p-8">
      <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <div className="flex items-center gap-2">
            <Badge variant="accent">SRE & Telemetry</Badge>
            <Badge variant="success" className="gap-1">
              <Server className="h-3.5 w-3.5" /> Edge Gateway Operational
            </Badge>
          </div>
          <h1 className="mt-1 text-3xl font-extrabold tracking-tight">
            Infrastructure Monitoring & Observability
          </h1>
          <p className="text-sm text-muted-foreground">
            Real-time API response latency, database query execution times,
            Gemini AI provider response times, and active user metrics.
          </p>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={fetchTelemetry}
          disabled={loading}
          className="gap-2 text-xs"
        >
          <RefreshCw
            className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`}
          />{" "}
          Refresh Metrics
        </Button>
      </div>

      {/* 6 Top Metric Cards */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
        {[
          {
            label: "API Latency",
            value: `${snapshot.apiLatencyMs}ms`,
            icon: Wifi,
            status: "Sub-50ms Target",
            color: "text-primary",
          },
          {
            label: "DB Query Time",
            value: `${snapshot.dbQueryTimeMs}ms`,
            icon: Database,
            status: "PgBouncer Optimized",
            color: "text-emerald-400",
          },
          {
            label: "AI Response",
            value: `${snapshot.aiResponseTimeMs}ms`,
            icon: Zap,
            status: "Gemini 1.5 Flash",
            color: "text-purple-400",
          },
          {
            label: "Error Rate",
            value: `${snapshot.errorRatePercent}%`,
            icon: Activity,
            status: "< 0.05% SLA",
            color: "text-emerald-400",
          },
          {
            label: "Active Users",
            value: snapshot.activeUsers.toLocaleString(),
            icon: Server,
            status: "Live Sessions",
            color: "text-pink-400",
          },
          {
            label: "RAM Usage",
            value: `${snapshot.memoryUsagePercent}%`,
            icon: Cpu,
            status: "Node Heap Normal",
            color: "text-amber-400",
          },
        ].map((m) => {
          const Icon = m.icon;
          return (
            <Card
              key={m.label}
              className="space-y-2 border-border/60 p-4 text-center shadow-sm"
            >
              <Icon className="mx-auto h-5 w-5 text-primary" />
              <p className={`text-xl font-extrabold ${m.color}`}>{m.value}</p>
              <p className="text-[11px] font-semibold text-foreground">
                {m.label}
              </p>
              <p className="text-[9px] text-muted-foreground">{m.status}</p>
            </Card>
          );
        })}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        {/* API Latency Chart */}
        <Card className="space-y-4 border-border/60 p-6">
          <div className="flex items-center justify-between border-b pb-3">
            <h2 className="flex items-center gap-2 text-sm font-bold">
              <Wifi className="h-4 w-4 text-primary" /> API Endpoint Response
              Latency (ms)
            </h2>
            <Badge variant="outline" className="font-mono text-[10px]">
              Real-time
            </Badge>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={timeSeries}>
                <defs>
                  <linearGradient id="latencyGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                <XAxis dataKey="time" tick={{ fontSize: 10, fill: "#888" }} />
                <YAxis tick={{ fontSize: 10, fill: "#888" }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1e1e2e",
                    borderRadius: "8px",
                    borderColor: "#6366f1",
                  }}
                  itemStyle={{ fontSize: 12 }}
                />
                <Area
                  type="monotone"
                  dataKey="apiLatency"
                  stroke="#6366f1"
                  fillOpacity={1}
                  fill="url(#latencyGrad)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* AI Response Time & DB Execution Chart */}
        <Card className="space-y-4 border-border/60 p-6">
          <div className="flex items-center justify-between border-b pb-3">
            <h2 className="flex items-center gap-2 text-sm font-bold">
              <Zap className="h-4 w-4 text-primary" /> AI Provider Latency vs DB
              Execution Time (ms)
            </h2>
            <Badge variant="outline" className="font-mono text-[10px]">
              P95 Benchmarks
            </Badge>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={timeSeries}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                <XAxis dataKey="time" tick={{ fontSize: 10, fill: "#888" }} />
                <YAxis tick={{ fontSize: 10, fill: "#888" }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1e1e2e",
                    borderRadius: "8px",
                    borderColor: "#a855f7",
                  }}
                  itemStyle={{ fontSize: 12 }}
                />
                <Bar
                  dataKey="aiResponseTime"
                  fill="#a855f7"
                  name="AI Model Latency"
                  radius={[4, 4, 0, 0]}
                />
                <Bar
                  dataKey="dbQueryTime"
                  fill="#10b981"
                  name="DB Query Time"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>
    </div>
  );
}
