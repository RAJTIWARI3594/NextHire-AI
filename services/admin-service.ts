import { createClient } from "@/lib/supabase/client";
import type {
  PlatformUser,
  RecruiterApproval,
  JobModerationItem,
  AuditLogItem,
  AdminMetrics,
} from "@/types/admin";

export const MOCK_ADMIN_METRICS: AdminMetrics = {
  totalStudents: 14250,
  totalRecruiters: 890,
  totalCompanies: 410,
  totalJobs: 1240,
  totalApplications: 48900,
  dailyAiRequests: 18500,
  monthlyRevenueUsd: 42500,
  serverHealth: "Healthy",
};

export const MOCK_USERS_LIST: PlatformUser[] = [
  {
    id: "u-1",
    fullName: "Aarav Sharma",
    email: "aarav@student.nexthire.ai",
    role: "student",
    status: "active",
    joinedDate: "Aug 1, 2026",
    lastLogin: "Just now",
  },
  {
    id: "u-2",
    fullName: "Sarah Connor",
    email: "sarah@vercel.com",
    role: "recruiter",
    status: "active",
    joinedDate: "Jul 15, 2026",
    lastLogin: "2 hours ago",
  },
  {
    id: "u-3",
    fullName: "Marcus Vance",
    email: "marcus@nexusai.com",
    role: "recruiter",
    status: "pending",
    joinedDate: "Aug 4, 2026",
    lastLogin: "Yesterday",
  },
];

export async function fetchAdminMetrics(): Promise<AdminMetrics> {
  const supabase = createClient();
  const { count: studentCount } = await supabase
    .from("profiles")
    .select("*", { count: "exact", head: true })
    .eq("role", "student");
  const { count: recruiterCount } = await supabase
    .from("profiles")
    .select("*", { count: "exact", head: true })
    .eq("role", "recruiter");
  const { count: jobsCount } = await supabase
    .from("jobs")
    .select("*", { count: "exact", head: true });

  return {
    ...MOCK_ADMIN_METRICS,
    totalStudents: studentCount || MOCK_ADMIN_METRICS.totalStudents,
    totalRecruiters: recruiterCount || MOCK_ADMIN_METRICS.totalRecruiters,
    totalJobs: jobsCount || MOCK_ADMIN_METRICS.totalJobs,
  };
}

export async function fetchAllUsers(): Promise<PlatformUser[]> {
  const supabase = createClient();
  const { data } = await supabase.from("profiles").select("*");

  if (!data || data.length === 0) return MOCK_USERS_LIST;

  return data.map((u) => ({
    id: u.id,
    fullName: u.full_name || "Platform User",
    email: u.email || "user@nexthire.ai",
    role: u.role || "student",
    status: "active",
    joinedDate: "Aug 2026",
    lastLogin: "Recent",
  }));
}

export async function toggleUserStatus(
  userId: string,
  currentStatus: string
): Promise<void> {
  const nextStatus = currentStatus === "active" ? "suspended" : "active";
  const supabase = createClient();
  await supabase
    .from("profiles")
    .update({ is_suspended: nextStatus === "suspended" })
    .eq("id", userId);
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
  return [
    {
      id: "log-1",
      adminName: "Super Admin (You)",
      actionType: "Recruiter Verification",
      targetResource: "Nexus AI Intelligence",
      details:
        "Approved corporate recruiter credentials and granted job posting access.",
      timestamp: "Aug 5, 2026 • 04:12 PM",
      ipAddress: "192.168.1.104",
    },
    {
      id: "log-2",
      adminName: "System Automation",
      actionType: "Spam Moderation",
      targetResource: "Job Listing #892",
      details: "Auto-flagged suspicious external payment link.",
      timestamp: "Aug 5, 2026 • 02:30 PM",
      ipAddress: "127.0.0.1",
    },
  ];
}
