import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { metricsCollector } from "@/lib/monitoring/metrics-collector";

export const dynamic = "force-dynamic";

export async function GET() {
  const supabase = await createClient();
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json({ error: "Authentication required." }, { status: 401 });
  }

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("role, is_suspended")
    .eq("auth_user_id", user.id)
    .maybeSingle();

  if (profileError) {
    return NextResponse.json(
      { error: "Unable to verify administrator permissions." },
      { status: 503 }
    );
  }

  if (profile?.role !== "admin" || profile.is_suspended === true) {
    return NextResponse.json({ error: "Administrator access required." }, { status: 403 });
  }

  const snapshot = metricsCollector.getSnapshot();
  const timeSeries = [
    {
      time: new Date(snapshot.timestamp).toLocaleTimeString("en-IN"),
      apiLatency: snapshot.apiLatencyMs,
      dbQueryTime: snapshot.dbQueryTimeMs,
      aiResponseTime: snapshot.aiResponseTimeMs,
      errorRate: snapshot.errorRatePercent,
      activeUsers: snapshot.activeUsers,
    },
  ];

  return NextResponse.json(
    {
      snapshot,
      timeSeries,
      status: "observed",
      note: "Metrics are process-local. Active users, queue depth, CPU, and storage are not instrumented.",
    },
    { headers: { "Cache-Control": "no-store, max-age=0" } }
  );
}
