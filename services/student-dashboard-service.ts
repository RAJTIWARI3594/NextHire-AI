import { createClient } from "@/lib/supabase/client";

export interface StudentMetrics {
  profileCompletion: number;
  atsScore: number;
  totalApplications: number;
  interviewInvitations: number;
  codingStreak: number;
  coinsEarned: number;
  leaderboardRank: number;
  savedJobsCount: number;
  unreadNotificationsCount: number;
}

export interface StudentProfileUpdatePayload {
  full_name?: string;
  college?: string;
  course?: string;
  graduation_year?: number;
  cgpa?: number;
  github_url?: string;
  linkedin_url?: string;
  portfolio_url?: string;
}

export async function fetchStudentDashboardData(authUserId: string) {
  const supabase = createClient();

  // 1. Fetch Profile
  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("auth_user_id", authUserId)
    .maybeSingle();

  if (!profile) return null;

  // 2. Fetch Student Profile details
  const { data: studentProfile } = await supabase
    .from("student_profiles")
    .select("*")
    .eq("profile_id", profile.id)
    .maybeSingle();

  // 3. Fetch Applications count
  const { count: totalApps } = await supabase
    .from("job_applications")
    .select("*", { count: "exact", head: true })
    .eq("student_id", profile.id);

  // 4. Fetch Interview Invitations count
  const { count: totalInterviews } = await supabase
    .from("job_applications")
    .select("*", { count: "exact", head: true })
    .eq("student_id", profile.id)
    .eq("status", "interviewing");

  // 5. Fetch Saved Jobs count
  const { count: savedJobsCount } = await supabase
    .from("saved_jobs")
    .select("*", { count: "exact", head: true })
    .eq("student_id", profile.id);

  // 6. Fetch Unread Notifications count
  const { count: unreadNotifs } = await supabase
    .from("notifications")
    .select("*", { count: "exact", head: true })
    .eq("recipient_id", profile.id)
    .eq("is_read", false);

  // 7. Calculate Profile Completion %
  let completion = 40;
  if (profile.avatar_url) completion += 10;
  if (studentProfile?.college) completion += 15;
  if (studentProfile?.course) completion += 15;
  if (studentProfile?.github_url) completion += 10;
  if (studentProfile?.linkedin_url) completion += 10;

  const metrics: StudentMetrics = {
    profileCompletion: Math.min(completion, 100),
    atsScore: studentProfile?.ats_score || 88,
    totalApplications: totalApps || 0,
    interviewInvitations: totalInterviews || 0,
    codingStreak: 5, // Active 5-day streak
    coinsEarned: studentProfile?.coins_balance || 350,
    leaderboardRank: 14,
    savedJobsCount: savedJobsCount || 0,
    unreadNotificationsCount: unreadNotifs || 0,
  };

  return { profile, studentProfile, metrics };
}

export async function updateStudentProfileData(
  profileId: string,
  data: StudentProfileUpdatePayload
) {
  const supabase = createClient();

  if (data.full_name) {
    await supabase
      .from("profiles")
      .update({
        full_name: data.full_name,
        updated_at: new Date().toISOString(),
      })
      .eq("id", profileId);
  }

  const { error } = await supabase.from("student_profiles").upsert({
    profile_id: profileId,
    college: data.college,
    course: data.course,
    graduation_year: data.graduation_year,
    cgpa: data.cgpa,
    github_url: data.github_url,
    linkedin_url: data.linkedin_url,
    portfolio_url: data.portfolio_url,
    updated_at: new Date().toISOString(),
  });

  if (error) throw error;
}

export async function fetchRecommendedJobs() {
  const supabase = createClient();
  const { data } = await supabase
    .from("jobs")
    .select("*, company:companies(name, logo_url)")
    .eq("is_active", true)
    .limit(6);

  return data || [];
}

export async function fetchStudentApplications(studentId: string) {
  const supabase = createClient();
  const { data } = await supabase
    .from("job_applications")
    .select(
      "*, job:jobs(title, location, salary_min, salary_max, company:companies(name, logo_url))"
    )
    .eq("student_id", studentId)
    .order("created_at", { ascending: false });

  return data || [];
}

export async function fetchStudentNotifications(studentId: string) {
  const supabase = createClient();
  const { data } = await supabase
    .from("notifications")
    .select("*")
    .eq("recipient_id", studentId)
    .order("created_at", { ascending: false });

  return data || [];
}

export async function markNotificationAsRead(notificationId: string) {
  const supabase = createClient();
  await supabase
    .from("notifications")
    .update({ is_read: true })
    .eq("id", notificationId);
}

export async function deleteNotification(notificationId: string) {
  const supabase = createClient();
  await supabase.from("notifications").delete().eq("id", notificationId);
}
