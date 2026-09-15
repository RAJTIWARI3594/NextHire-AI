import { createServerClient } from "@supabase/ssr";

export type AlertCategory =
  | "server"
  | "cpu"
  | "memory"
  | "database"
  | "payment"
  | "ai_provider"
  | "error_spike";

export type AlertSeverity = "info" | "warning" | "critical";

export interface SystemAlert {
  id?: string;
  alertName: string;
  category: AlertCategory;
  severity: AlertSeverity;
  message: string;
  status: "active" | "acknowledged" | "resolved";
  triggeredAt: string;
  resolvedAt?: string;
}

class AlertEngine {
  private inMemoryAlerts: SystemAlert[] = [
    {
      id: "alt-001",
      alertName: "AI Provider Latency Threshold",
      category: "ai_provider",
      severity: "warning",
      message:
        "Gemini 1.5 Flash response duration exceeded 1.2s target latency.",
      status: "active",
      triggeredAt: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
    },
    {
      id: "alt-002",
      alertName: "Database Connection Spike",
      category: "database",
      severity: "info",
      message: "PgBouncer connection pool utilized 82% of max limit.",
      status: "resolved",
      triggeredAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      resolvedAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
    },
  ];

  /**
   * Dispatch a system alert event.
   */
  public async triggerAlert(
    alertName: string,
    category: AlertCategory,
    severity: AlertSeverity,
    message: string
  ): Promise<SystemAlert> {
    const alert: SystemAlert = {
      id: `alt_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      alertName,
      category,
      severity,
      message,
      status: "active",
      triggeredAt: new Date().toISOString(),
    };

    this.inMemoryAlerts.unshift(alert);
    if (this.inMemoryAlerts.length > 100) this.inMemoryAlerts.pop();

    // Dispatch webhook notification if configured
    await this.dispatchWebhook(alert);

    return alert;
  }

  /**
   * Dispatches alerts to Slack / Discord / Webhook integration endpoints.
   */
  private async dispatchWebhook(alert: SystemAlert): Promise<void> {
    const webhookUrl =
      process.env.SLACK_ALERT_WEBHOOK_URL || process.env.ALERT_WEBHOOK_URL;
    if (!webhookUrl) return;

    try {
      await fetch(webhookUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text: `🚨 *NextHire Alert [${alert.severity.toUpperCase()}]*: *${alert.alertName}*\n${alert.message}`,
        }),
      });
    } catch (err) {
      console.error("Alert webhook notification failed:", err);
    }
  }

  /**
   * List recent system alerts.
   */
  public getAlerts(): SystemAlert[] {
    return this.inMemoryAlerts;
  }

  /**
   * Update status of an alert (acknowledged/resolved).
   */
  public updateAlertStatus(
    alertId: string,
    status: "acknowledged" | "resolved"
  ): SystemAlert | null {
    const alert = this.inMemoryAlerts.find((a) => a.id === alertId);
    if (alert) {
      alert.status = status;
      if (status === "resolved") {
        alert.resolvedAt = new Date().toISOString();
      }
      return alert;
    }
    return null;
  }
}

export const alertEngine = new AlertEngine();
