"use client";

import React, { useEffect, useState } from "react";
import { AlertTriangle, Bell, CheckCircle2, RefreshCw, ShieldAlert } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

type SystemAlert = {
  id: string;
  alertName: string;
  category: string;
  severity: "info" | "warning" | "critical";
  message: string;
  status: "active" | "acknowledged" | "resolved";
  triggeredAt: string;
  resolvedAt?: string;
};

export default function SystemAlertsPage() {
  const [alerts, setAlerts] = useState<SystemAlert[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filterSeverity, setFilterSeverity] = useState("all");

  const fetchAlerts = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/alerts", { cache: "no-store" });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Alerts could not be loaded.");
      setAlerts(data.alerts || []);
    } catch (loadError: unknown) {
      setError((loadError as Error)?.message || "Alerts could not be loaded.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchAlerts(); }, []);

  const updateAlert = async (alertId: string, status: "acknowledged" | "resolved") => {
    setSaving(true);
    setError(null);
    try {
      const response = await fetch("/api/alerts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "update_status", alertId, status }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || data.error || "Alert update failed.");
      await fetchAlerts();
    } catch (actionError: unknown) {
      setError((actionError as Error)?.message || "Alert update failed.");
    } finally {
      setSaving(false);
    }
  };

  const triggerTest = async () => {
    setSaving(true);
    setError(null);
    try {
      const response = await fetch("/api/alerts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "trigger_test",
          alertName: "Manual administrator diagnostic",
          category: "server",
          severity: "info",
          message: "An administrator initiated a diagnostic test alert.",
        }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Test alert could not be created.");
      await fetchAlerts();
    } catch (actionError: unknown) {
      setError((actionError as Error)?.message || "Test alert could not be created.");
    } finally {
      setSaving(false);
    }
  };

  const filtered = alerts.filter(
    (alert) => filterSeverity === "all" || alert.severity === filterSeverity
  );

  return (
    <div className="mx-auto max-w-7xl space-y-6 p-4 sm:p-8">
      <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <Badge variant="outline">Process-local alert state</Badge>
          <h1 className="mt-2 text-2xl font-bold tracking-tight">
            System Alerts & Incident Response
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Alerts are in-memory and are lost when a serverless instance restarts.
            This page does not claim persistent incident history or an always-on dispatcher.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={triggerTest} disabled={saving}>
            <Bell className="mr-2 h-4 w-4" /> Test alert
          </Button>
          <Button variant="outline" size="sm" onClick={fetchAlerts} disabled={loading}>
            <RefreshCw className={`mr-2 h-4 w-4 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </Button>
        </div>
      </div>

      {error && <div role="alert" className="rounded-md border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">{error}</div>}

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {[
          ["All", alerts.length],
          ["Critical", alerts.filter((item) => item.severity === "critical").length],
          ["Warning", alerts.filter((item) => item.severity === "warning").length],
          ["Info", alerts.filter((item) => item.severity === "info").length],
        ].map(([label, count]) => (
          <button key={label} type="button" onClick={() => setFilterSeverity(String(label).toLowerCase())}>
            <Card className={`p-4 text-left ${filterSeverity === String(label).toLowerCase() ? "border-primary" : ""}`}>
              <p className="text-xs uppercase text-muted-foreground">{label}</p>
              <p className="mt-1 text-2xl font-extrabold">{count}</p>
            </Card>
          </button>
        ))}
      </div>

      <Card className="space-y-4 border-border/60 p-6">
        <div className="flex items-center justify-between border-b pb-3">
          <h2 className="flex items-center gap-2 text-sm font-bold">
            <ShieldAlert className="h-4 w-4 text-primary" /> Alert events
          </h2>
          <Badge variant="outline">{filtered.length} records</Badge>
        </div>
        {loading ? (
          <p className="py-8 text-center text-sm text-muted-foreground">Loading alerts...</p>
        ) : filtered.length === 0 ? (
          <div className="space-y-2 py-8 text-center">
            <AlertTriangle className="mx-auto h-7 w-7 text-muted-foreground" />
            <p className="text-sm font-medium">No matching alerts in this process</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map((alert) => (
              <div key={alert.id} className="space-y-3 rounded-xl border bg-card/60 p-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-semibold">{alert.alertName}</p>
                    <Badge variant={alert.severity === "critical" ? "destructive" : "outline"}>{alert.severity}</Badge>
                    <Badge variant="outline">{alert.category}</Badge>
                  </div>
                  <span className="text-[11px] text-muted-foreground">
                    {new Date(alert.triggeredAt).toLocaleString("en-IN")}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground">{alert.message}</p>
                <div className="flex items-center justify-between gap-3 border-t pt-3">
                  <Badge variant={alert.status === "resolved" ? "success" : "secondary"}>{alert.status}</Badge>
                  <div className="flex gap-2">
                    {alert.status === "active" && (
                      <Button size="sm" variant="outline" disabled={saving} onClick={() => updateAlert(alert.id, "acknowledged")}>
                        Acknowledge
                      </Button>
                    )}
                    {alert.status !== "resolved" && (
                      <Button size="sm" disabled={saving} onClick={() => updateAlert(alert.id, "resolved")}>
                        <CheckCircle2 className="mr-1 h-3.5 w-3.5" /> Resolve
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}
