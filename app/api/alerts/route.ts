import { NextRequest, NextResponse } from "next/server";
import { alertEngine } from "@/lib/monitoring/alerting";
import { createSecureErrorResponse } from "@/lib/security/api-security";

export const dynamic = "force-dynamic";

/**
 * GET /api/alerts - List active/all system alerts
 * POST /api/alerts - Trigger a test system alert or update alert status
 */
export async function GET() {
  try {
    const alerts = alertEngine.getAlerts();
    return NextResponse.json({ success: true, alerts });
  } catch (error) {
    return createSecureErrorResponse(
      error,
      "Failed to retrieve system alerts."
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, alertId, status, alertName, category, severity, message } =
      body;

    if (action === "update_status" && alertId && status) {
      const updated = alertEngine.updateAlertStatus(alertId, status);
      if (!updated) {
        return NextResponse.json(
          { success: false, message: "Alert not found" },
          { status: 404 }
        );
      }
      return NextResponse.json({ success: true, alert: updated });
    }

    if (action === "trigger_test") {
      const newAlert = await alertEngine.triggerAlert(
        alertName || "Manual SRE Health Test Alert",
        category || "server",
        severity || "warning",
        message ||
          "Super Admin triggered a manual diagnostic alert from the Alerts Console."
      );
      return NextResponse.json({ success: true, alert: newAlert });
    }

    return NextResponse.json(
      { success: false, message: "Invalid action" },
      { status: 400 }
    );
  } catch (error) {
    return createSecureErrorResponse(error, "Failed to process alert action.");
  }
}
