"use client";

import React, { useEffect, useState } from "react";
import {
  Activity,
  Server,
  ShieldCheck,
  Clock,
  Terminal,
  AlertTriangle,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { fetchAuditLogs } from "@/services/admin-service";
import type { AuditLogItem } from "@/types/admin";

export default function AuditLogsPage() {
  const [logs, setLogs] = useState<AuditLogItem[]>([]);

  useEffect(() => {
    async function load() {
      const res = await fetchAuditLogs();
      setLogs(res);
    }
    load();
  }, []);

  return (
    <div className="mx-auto max-w-6xl space-y-6 p-4 sm:p-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">
          System Audit Logs & Platform Server Status
        </h1>
        <p className="text-sm text-muted-foreground">
          Real-time security audit trails, administrative actions, and
          infrastructure telemetry.
        </p>
      </div>

      {/* Infrastructure Telemetry Cards */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <Card className="border-emerald-500/20 p-5">
          <span className="text-xs font-semibold uppercase text-muted-foreground">
            Server Uptime
          </span>
          <p className="mt-2 text-2xl font-extrabold text-emerald-400">
            99.98%
          </p>
          <p className="mt-1 text-[10px] text-emerald-400">Healthy Status</p>
        </Card>

        <Card className="border-border/60 p-5">
          <span className="text-xs font-semibold uppercase text-muted-foreground">
            DB Pool Load
          </span>
          <p className="mt-2 text-2xl font-extrabold text-primary">14%</p>
          <p className="mt-1 text-[10px] text-muted-foreground">
            12 / 100 Connections
          </p>
        </Card>

        <Card className="border-border/60 p-5">
          <span className="text-xs font-semibold uppercase text-muted-foreground">
            Edge Latency
          </span>
          <p className="mt-2 text-2xl font-extrabold text-primary">24ms</p>
          <p className="mt-1 text-[10px] text-muted-foreground">
            Global Edge Network
          </p>
        </Card>

        <Card className="border-amber-500/20 p-5">
          <span className="text-xs font-semibold uppercase text-muted-foreground">
            Security Alerts
          </span>
          <p className="mt-2 text-2xl font-extrabold text-amber-400">0</p>
          <p className="mt-1 text-[10px] text-emerald-400">
            0 Active Incidents
          </p>
        </Card>
      </div>

      {/* Audit Logs List */}
      <Card className="space-y-4 border-border/60 p-6">
        <div className="flex items-center justify-between border-b pb-3">
          <h2 className="flex items-center gap-2 text-sm font-bold">
            <Activity className="h-4 w-4 text-primary" /> Security Audit Log
            Feed
          </h2>
          <Badge variant="accent">Live Stream</Badge>
        </div>

        <div className="space-y-3 text-xs">
          {logs.map((log) => (
            <div
              key={log.id}
              className="space-y-1 rounded-xl border bg-card/60 p-4"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  <p className="font-bold text-foreground">{log.actionType}</p>
                  <Badge variant="outline">{log.targetResource}</Badge>
                </div>
                <span className="font-mono text-[10px] text-muted-foreground">
                  {log.timestamp}
                </span>
              </div>
              <p className="text-[11px] text-muted-foreground">{log.details}</p>
              <p className="pt-1 font-mono text-[10px] text-primary">
                Admin: {log.adminName} • IP: {log.ipAddress}
              </p>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
