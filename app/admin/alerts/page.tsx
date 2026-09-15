"use client";

import React, { useState, useEffect } from "react";
import {
  AlertTriangle,
  Bell,
  CheckCircle2,
  ShieldAlert,
  RefreshCw,
  Send,
  Radio,
  Info,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default function SystemAlertsPage() {
  const [alerts, setAlerts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterSeverity, setFilterSeverity] = useState<string>("all");
  const [webhookUrl, setWebhookUrl] = useState(
    "https://hooks.slack.com/services/T00/B00/XXXXXX"
  );

  const fetchAlerts = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/alerts");
      const data = await res.json();
      if (data.alerts) setAlerts(data.alerts);
    } catch (err) {
      console.error("Failed to fetch alerts", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAlerts();
  }, []);

  const handleUpdateStatus = async (
    alertId: string,
    status: "acknowledged" | "resolved"
  ) => {
    try {
      const res = await fetch("/api/alerts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "update_status", alertId, status }),
      });
      const data = await res.json();
      if (data.success) fetchAlerts();
    } catch (err) {
      console.error("Failed to update alert status", err);
    }
  };

  const handleTriggerTestAlert = async () => {
    try {
      const res = await fetch("/api/alerts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "trigger_test",
          alertName: "Manual SRE Diagnostic Test Alert",
          category: "server",
          severity: "warning",
          message:
            "Triggered from the Super Admin Alerts Console for diagnostic verification.",
        }),
      });
      const data = await res.json();
      if (data.success) fetchAlerts();
    } catch (err) {
      console.error("Failed to trigger test alert", err);
    }
  };

  const filteredAlerts = alerts.filter((a) => {
    if (filterSeverity === "all") return true;
    return a.severity === filterSeverity;
  });

  return (
    <div className="mx-auto max-w-7xl space-y-8 p-4 sm:p-8">
      <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <div className="flex items-center gap-2">
            <Badge variant="accent">System Alerting Engine</Badge>
            <Badge variant="success" className="gap-1">
              <Radio className="h-3.5 w-3.5 animate-pulse" /> Dispatcher Active
            </Badge>
          </div>
          <h1 className="mt-1 text-3xl font-extrabold tracking-tight">
            System Alerts & Incident Response
          </h1>
          <p className="text-sm text-muted-foreground">
            Configure incident trigger thresholds, monitor active system alerts,
            manage webhooks, and trigger diagnostic health tests.
          </p>
        </div>

        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleTriggerTestAlert}
            className="gap-1.5 text-xs"
          >
            <Bell className="h-3.5 w-3.5" /> Trigger Test Alert
          </Button>
          <Button
            variant="gradient"
            size="sm"
            onClick={fetchAlerts}
            disabled={loading}
            className="gap-1.5 text-xs"
          >
            <RefreshCw
              className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`}
            />{" "}
            Refresh
          </Button>
        </div>
      </div>

      {/* Severity Filter Counters */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <Card
          className={`cursor-pointer border p-4 transition-all ${filterSeverity === "all" ? "border-primary bg-primary/10" : "border-border"}`}
          onClick={() => setFilterSeverity("all")}
        >
          <span className="text-xs font-semibold uppercase text-muted-foreground">
            All Alerts
          </span>
          <p className="mt-1 text-2xl font-extrabold">{alerts.length}</p>
        </Card>

        <Card
          className={`cursor-pointer border p-4 transition-all ${filterSeverity === "critical" ? "border-red-500 bg-red-500/10" : "border-border"}`}
          onClick={() => setFilterSeverity("critical")}
        >
          <span className="text-xs font-semibold uppercase text-red-400">
            Critical
          </span>
          <p className="mt-1 text-2xl font-extrabold text-red-400">
            {alerts.filter((a) => a.severity === "critical").length}
          </p>
        </Card>

        <Card
          className={`cursor-pointer border p-4 transition-all ${filterSeverity === "warning" ? "border-amber-500 bg-amber-500/10" : "border-border"}`}
          onClick={() => setFilterSeverity("warning")}
        >
          <span className="text-xs font-semibold uppercase text-amber-400">
            Warnings
          </span>
          <p className="mt-1 text-2xl font-extrabold text-amber-400">
            {alerts.filter((a) => a.severity === "warning").length}
          </p>
        </Card>

        <Card
          className={`cursor-pointer border p-4 transition-all ${filterSeverity === "info" ? "border-primary bg-primary/10" : "border-border"}`}
          onClick={() => setFilterSeverity("info")}
        >
          <span className="text-xs font-semibold uppercase text-primary">
            Info Logs
          </span>
          <p className="mt-1 text-2xl font-extrabold text-primary">
            {alerts.filter((a) => a.severity === "info").length}
          </p>
        </Card>
      </div>

      {/* Main Alert List & Webhook Setup */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
        {/* Alerts Timeline (8 cols) */}
        <Card className="space-y-4 border-border/60 p-6 lg:col-span-8">
          <div className="flex items-center justify-between border-b pb-3">
            <h2 className="flex items-center gap-2 text-sm font-bold">
              <ShieldAlert className="h-4 w-4 text-primary" /> Active Alert
              Stream & Incident Timeline
            </h2>
            <Badge variant="outline" className="font-mono text-[10px]">
              Filter: {filterSeverity.toUpperCase()}
            </Badge>
          </div>

          <div className="space-y-3 text-xs">
            {filteredAlerts.length === 0 ? (
              <p className="py-8 text-center text-muted-foreground">
                No alerts matching the selected filter.
              </p>
            ) : (
              filteredAlerts.map((alert) => (
                <div
                  key={alert.id}
                  className="space-y-2 rounded-xl border bg-card/60 p-4"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      <p className="font-bold text-foreground">
                        {alert.alertName}
                      </p>
                      <Badge
                        variant={
                          alert.severity === "critical"
                            ? "destructive"
                            : alert.severity === "warning"
                              ? "secondary"
                              : "outline"
                        }
                      >
                        {alert.severity}
                      </Badge>
                      <Badge variant="outline" className="text-[9px] uppercase">
                        {alert.category}
                      </Badge>
                    </div>
                    <span className="font-mono text-[10px] text-muted-foreground">
                      {new Date(alert.triggeredAt).toLocaleTimeString()}
                    </span>
                  </div>

                  <p className="text-[11px] text-muted-foreground">
                    {alert.message}
                  </p>

                  <div className="flex items-center justify-between border-t pt-2 text-[10px]">
                    <span
                      className={`font-semibold ${alert.status === "active" ? "text-red-400" : alert.status === "acknowledged" ? "text-amber-400" : "text-emerald-400"}`}
                    >
                      Status: {alert.status.toUpperCase()}
                    </span>

                    <div className="flex gap-1.5">
                      {alert.status === "active" && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            handleUpdateStatus(alert.id, "acknowledged")
                          }
                          className="h-6 text-[10px]"
                        >
                          Acknowledge
                        </Button>
                      )}
                      {alert.status !== "resolved" && (
                        <Button
                          variant="default"
                          size="sm"
                          onClick={() =>
                            handleUpdateStatus(alert.id, "resolved")
                          }
                          className="h-6 text-[10px]"
                        >
                          Mark Resolved
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </Card>

        {/* Webhook Configuration (4 cols) */}
        <Card className="space-y-4 border-border/60 p-6 lg:col-span-4">
          <div className="border-b pb-3">
            <h2 className="flex items-center gap-2 text-sm font-bold">
              <Send className="h-4 w-4 text-primary" /> Alert Dispatch Webhooks
            </h2>
          </div>

          <div className="space-y-3 text-xs">
            <p className="text-[11px] text-muted-foreground">
              Automatically push high & critical severity alerts to your
              team&apos;s Slack or Discord channel.
            </p>

            <div className="space-y-1">
              <label className="text-[11px] font-semibold">
                Slack Webhook URL
              </label>
              <input
                type="text"
                value={webhookUrl}
                onChange={(e) => setWebhookUrl(e.target.value)}
                className="w-full rounded-lg border bg-background px-3 py-2 font-mono text-xs focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>

            <Button size="sm" className="w-full gap-1.5 text-xs">
              <Send className="h-3.5 w-3.5" /> Save Webhook Config
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
