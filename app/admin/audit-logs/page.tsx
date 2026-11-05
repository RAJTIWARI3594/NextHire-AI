"use client";

import React, { useEffect, useState } from "react";
import { Activity, RefreshCw, ShieldCheck } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { fetchAuditLogs } from "@/services/admin-service";
import type { AuditLogItem } from "@/types/admin";

export default function AuditLogsPage() {
  const [logs, setLogs] = useState<AuditLogItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadLogs = async () => {
    setLoading(true);
    setError(null);
    try {
      setLogs(await fetchAuditLogs());
    } catch (loadError: unknown) {
      setError((loadError as Error)?.message || "Audit logs could not be loaded.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLogs();
  }, []);

  return (
    <div className="mx-auto max-w-6xl space-y-6 p-4 sm:p-8">
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            Administrative Audit Logs
          </h1>
          <p className="text-sm text-muted-foreground">
            Recorded events from the platform audit_logs table. This page does
            not estimate server uptime or infrastructure health.
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={loadLogs} disabled={loading}>
          <RefreshCw className={`mr-2 h-4 w-4 ${loading ? "animate-spin" : ""}`} />
          Refresh
        </Button>
      </div>

      {error && (
        <div role="alert" className="rounded-md border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">
          {error}
        </div>
      )}

      <Card className="space-y-4 border-border/60 p-6">
        <div className="flex items-center justify-between border-b pb-3">
          <h2 className="flex items-center gap-2 text-sm font-bold">
            <ShieldCheck className="h-4 w-4 text-primary" />
            Audit event history
          </h2>
          <Badge variant="outline">{logs.length} records loaded</Badge>
        </div>

        {loading ? (
          <p className="py-8 text-center text-sm text-muted-foreground">
            Loading audit records...
          </p>
        ) : logs.length === 0 ? (
          <div className="space-y-2 py-8 text-center">
            <Activity className="mx-auto h-7 w-7 text-muted-foreground" />
            <p className="text-sm font-medium">No audit records found</p>
            <p className="text-xs text-muted-foreground">
              No events have been written to the audit log, or the log is not
              available to this administrator account.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {logs.map((log) => (
              <div key={log.id} className="space-y-2 rounded-lg border bg-card/60 p-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold">{log.actionType}</span>
                    <Badge variant="secondary">{log.targetResource}</Badge>
                  </div>
                  <span className="text-[11px] text-muted-foreground">
                    {log.timestamp}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground">
                  Actor: {log.adminName} · IP: {log.ipAddress}
                </p>
                {log.details !== "{}" && (
                  <pre className="overflow-x-auto whitespace-pre-wrap break-words rounded-md bg-muted/40 p-3 text-[10px] text-muted-foreground">
                    {log.details}
                  </pre>
                )}
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}
