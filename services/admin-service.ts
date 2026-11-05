import { createClient } from "@/lib/supabase/client";
import type {
  PlatformUser,
  RecruiterApproval,
  AuditLogItem,
  AdminMetrics,
} from "@/types/admin";

export const EMPTY_ADMIN_METRICS: AdminMetrics = {
  totalStudents: 0,
  totalRecruiters: 0,
  totalCompanies: 0,
  totalJobs: 0,
  totalApplications: 0,
  dailyAiSessions: 0,
  monthlyRevenueUsd: 0,
  serverHealth: "Degraded",
};

export async function fetchAdminMetrics(): Promise<AdminMetrics> {
  const supabase = createClient();
  const now = new Date();
  const dayStart = new Date(now);
  dayStart.setHours(0, 0, 0, 0);
  const monthStart = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1));

  const [students, recruiters, companies, jobs, applications, aiSessions, payments] =
    await Promise.all([
      supabase.from("profiles").select("id", { count: "exact", head: true }).eq("role", "student"),
      supabase.from("profiles").select("id", { count: "exact", head: true }).eq("role", "recruiter"),
      supabase.from("companies").select("id", { count: "exact", head: true }),
      supabase.from("jobs").select("id", { count: "exact", head: true }),
      supabase.from("job_applications").select("id", { count: "exact", head: true }),
      supabase.from("ai_chat_history").select("id", { count: "exact", head: true }).gte("created_at", dayStart.toISOString()),
      supabase.from("payments").select("amount").eq("currency", "USD").in("status", ["success", "succeeded", "completed", "paid"]).gte("created_at", monthStart.toISOString()),
    ]);

  const responses = [students, recruiters, companies, jobs, applications, aiSessions, payments];
  const failed = responses.find((response) => response.error);
  if (failed?.error) throw failed.error;

  const monthlyRevenueUsd = (payments.data || []).reduce(
    (total, payment) => total + Number(payment.amount || 0),
    0
  );

  return {
    totalStudents: students.count || 0,
    totalRecruiters: recruiters.count || 0,
    totalCompanies: companies.count || 0,
    totalJobs: jobs.count || 0,
    totalApplications: applications.count || 0,
    dailyAiSessions: aiSessions.count || 0,
    monthlyRevenueUsd,
    serverHealth: "Healthy",
  };
}

export async function fetchAllUsers(): Promise<PlatformUser[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("profiles")
    .select("id, full_name, role, is_suspended, created_at")
    .order("created_at", { ascending: false });

  if (error) throw error;

  return (data || []).map((profile) => ({
    id: profile.id,
    fullName: profile.full_name || "Platform User",
    email: "Email not available",
    role: profile.role || "student",
    status: profile.is_suspended ? "suspended" : "active",
    joinedDate: profile.created_at
      ? new Date(profile.created_at).toLocaleDateString("en-IN", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        })
      : "Date unavailable",
    lastLogin: "Not tracked",
  }));
}

export async function toggleUserStatus(
  userId: string,
  currentStatus: string
): Promise<void> {
  const supabase = createClient();
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError) throw userError;
  if (!user) throw new Error("Administrator sign-in is required.");

  const { data: actor, error: actorError } = await supabase
    .from("profiles")
    .select("id, role")
    .eq("auth_user_id", user.id)
    .single();

  if (actorError) throw actorError;
  if (actor.role !== "admin") {
    throw new Error("Only administrators can suspend or reactivate accounts.");
  }
  if (actor.id === userId) {
    throw new Error("You cannot suspend your own administrator account.");
  }

  const { data, error } = await supabase
    .from("profiles")
    .update({ is_suspended: currentStatus !== "active" })
    .eq("id", userId)
    .select("id")
    .maybeSingle();

  if (error) throw error;
  if (!data) throw new Error("User not found or administrator access denied.");
}

export async function fetchRecruiterRequests(): Promise<RecruiterApproval[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("recruiter_profiles")
    .select(
      "profile_id, company_name, company_email, is_verified, created_at, profiles:profiles!recruiter_profiles_profile_id_fkey(full_name)"
    )
    .order("created_at", { ascending: false });

  if (error) throw error;

  return (data || []).map((row: any) => {
    const profile = Array.isArray(row.profiles) ? row.profiles[0] : row.profiles;
    return {
      id: row.profile_id,
      recruiterName: profile?.full_name || "Recruiter",
      companyName: row.company_name || "Company not provided",
      email: row.company_email || "Email not provided",
      status: row.is_verified ? ("approved" as const) : ("pending" as const),
      appliedDate: row.created_at
        ? new Date(row.created_at).toLocaleDateString("en-IN", {
            day: "2-digit",
            month: "short",
            year: "numeric",
          })
        : "Date unavailable",
    };
  });
}

export async function approveRecruiterRequest(
  approvalId: string
): Promise<void> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("recruiter_profiles")
    .update({ is_verified: true })
    .eq("profile_id", approvalId)
    .select("profile_id")
    .maybeSingle();

  if (error) throw error;
  if (!data) {
    throw new Error("Recruiter request not found or administrator access denied.");
  }
}

export async function fetchAuditLogs(): Promise<AuditLogItem[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("audit_logs")
    .select("id, actor_id, action, ip_address, details, created_at")
    .order("created_at", { ascending: false })
    .limit(100);

  if (error) throw error;
  const actorIds = [...new Set((data || []).map((row) => row.actor_id).filter(Boolean))];
  const actorNames = new Map<string, string>();

  if (actorIds.length) {
    const { data: actors, error: actorsError } = await supabase
      .from("profiles")
      .select("id, full_name")
      .in("id", actorIds);
    if (actorsError) throw actorsError;
    (actors || []).forEach((actor) => {
      actorNames.set(actor.id, actor.full_name || "Administrator");
    });
  }

  return (data || []).map((row) => {
    const metadata =
      row.details && typeof row.details === "object"
        ? (row.details as Record<string, unknown>)
        : {};
    return {
      id: row.id,
      adminName: (row.actor_id && actorNames.get(row.actor_id)) || "System",
      actionType: row.action,
      targetResource: String(metadata.resource || metadata.table || "Platform"),
      details: JSON.stringify(row.details || {}),
      timestamp: new Date(row.created_at).toLocaleString("en-IN"),
      ipAddress: row.ip_address || "Not recorded",
    };
  });
}
