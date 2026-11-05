import { NextRequest, NextResponse } from "next/server";
import { alertEngine } from "@/lib/monitoring/alerting";
import { requireActiveAdmin } from "@/lib/security/admin-auth";
import { createSecureErrorResponse } from "@/lib/security/api-security";

export const dynamic = "force-dynamic";

export async function GET() {
  const access = await requireActiveAdmin();
  if (!access.ok) return access.response;

  try {
    return NextResponse.json(
      {
        success: true,
        alerts: alertEngine.getAlerts(),
        persistence: "process-local",
        note: "Alerts are not persisted across serverless instances or deployments.",
      },
      { headers: { "Cache-Control": "no-store, max-age=0" } }
    );
  } catch (error) {
    return createSecureErrorResponse(error, "Failed to retrieve system alerts.");
  }
}

export async function POST(request: NextRequest) {
  const access = await requireActiveAdmin();
  if (!access.ok) return access.response;

  try {
    const body = await request.json();
    const { action, alertId, status, alertName, category, severity, message } =
      body || {};

    if (action === "update_status") {
      if (
        typeof alertId !== "string" ||
        !["acknowledged", "resolved"].includes(status)
      ) {
        return NextResponse.json(
          { success: false, message: "Invalid alert status update." },
          { status: 400 }
        );
      }
      const updated = alertEngine.updateAlertStatus(alertId, status);
      if (!updated) {
        return NextResponse.json(
          { success: false, message: "Alert not found in this process." },
          { status: 404 }
        );
      }
      return NextResponse.json({ success: true, alert: updated });
    }

    if (action === "trigger_test") {
      const allowedCategories = [
        "server",
        "cpu",
        "memory",
        "database",
        "payment",
        "ai_provider",
        "error_spike",
      ];
      const allowedSeverities = ["info", "warning", "critical"];
      if (
        (category !== undefined && !allowedCategories.includes(category)) ||
        (severity !== undefined && !allowedSeverities.includes(severity)) ||
        (alertName !== undefined &&
          (typeof alertName !== "string" || alertName.length > 120)) ||
        (message !== undefined &&
          (typeof message !== "string" || message.length > 1000))
      ) {
        return NextResponse.json(
          { success: false, message: "Invalid test alert fields." },
          { status: 400 }
        );
      }

      const newAlert = await alertEngine.triggerAlert(
        alertName || "Manual diagnostic alert",
        category || "server",
        severity || "warning",
        message || "An administrator triggered a manual diagnostic test."
      );
      return NextResponse.json({
        success: true,
        alert: newAlert,
        persistence: "process-local",
      });
    }

    return NextResponse.json(
      { success: false, message: "Invalid alert action." },
      { status: 400 }
    );
  } catch (error) {
    return createSecureErrorResponse(error, "Failed to process alert action.");
  }
}
