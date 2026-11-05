import { createClient } from "@/lib/supabase/client";
import type {
  CandidateRanking,
  InterviewEvent,
  HiringAnalyticsData,
} from "@/types/recruiter";

type CandidateApplicationRow = {
  application_id: string;
  job_id: string;
  student_id: string;
  student_name: string;
  student_email: string;
  student_avatar: string | null;
  job_title: string;
  match_score: number | null;
  ats_score: number | null;
  applied_at: string;
  is_shortlisted: boolean;
};

const toRecommendation = (score: number): CandidateRanking["recommendation"] => {
  if (score >= 85) return "Highly Recommended";
  if (score >= 70) return "Recommended";
  if (score >= 50) return "Consider";
  return "Not Recommended";
};

export async function fetchRankedCandidates(): Promise<CandidateRanking[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("verified_recruiter_candidate_applications")
    .select("*")
    .order("applied_at", { ascending: false });

  if (error) throw error;

  return ((data || []) as CandidateApplicationRow[]).map((row) => {
    const matchScore = Number(row.match_score || 0);
    return {
      id: row.application_id,
      jobId: row.job_id,
      studentId: row.student_id,
      studentName: row.student_name || "Candidate",
      studentEmail: row.student_email || "",
      studentAvatar: row.student_avatar || undefined,
      jobTitle: row.job_title || "Job listing",
      overallScore: matchScore,
      atsScore: Number(row.ats_score || 0),
      skillsScore: 0,
      interviewScore: 0,
      recommendation: toRecommendation(matchScore),
      strengths: [],
      weaknesses: [],
      missingSkills: [],
      isShortlisted: Boolean(row.is_shortlisted),
      appliedDate: row.applied_at
        ? new Date(row.applied_at).toLocaleDateString("en-IN", {
            day: "2-digit",
            month: "short",
            year: "numeric",
          })
        : "Date unavailable",
    };
  });
}

export async function persistCandidateShortlist(
  applicationId: string,
  currentlyShortlisted: boolean
): Promise<void> {
  const supabase = createClient();
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError) throw userError;
  if (!user) throw new Error("Please sign in again to shortlist an applicant.");

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("id, role")
    .eq("auth_user_id", user.id)
    .single();

  if (profileError) throw profileError;
  if (profile.role !== "recruiter") {
    throw new Error("Only recruiter accounts can manage applicant shortlists.");
  }

  if (currentlyShortlisted) {
    const { error } = await supabase
      .from("candidate_shortlists")
      .delete()
      .eq("application_id", applicationId)
      .eq("recruiter_id", profile.id);
    if (error) throw error;
    return;
  }

  const { error } = await supabase.from("candidate_shortlists").insert({
    application_id: applicationId,
    recruiter_id: profile.id,
  });
  if (error) throw error;
}

type InterviewRow = {
  id: string;
  job_id: string;
  student_id: string;
  candidate_name: string;
  job_title: string;
  interview_type: InterviewEvent["interviewType"];
  scheduled_time: string;
  duration_minutes: number;
  interviewer_name: string;
  status: InterviewEvent["status"];
};

const mapInterview = (row: InterviewRow): InterviewEvent => ({
  id: row.id,
  jobId: row.job_id,
  studentId: row.student_id,
  candidateName: row.candidate_name || "Candidate",
  jobTitle: row.job_title || "Job listing",
  interviewType: row.interview_type,
  scheduledTime: new Date(row.scheduled_time).toLocaleString("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
  }),
  durationMinutes: row.duration_minutes,
  interviewerName: row.interviewer_name,
  status: row.status,
});

export async function fetchRecruiterInterviews(): Promise<InterviewEvent[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("verified_recruiter_interviews")
    .select("*")
    .order("scheduled_time", { ascending: true });

  if (error) throw error;
  return ((data || []) as InterviewRow[]).map(mapInterview);
}

type NewInterview = Omit<InterviewEvent, "id" | "status">;

export async function scheduleInterview(
  event: NewInterview
): Promise<InterviewEvent> {
  if (!event.jobId || !event.studentId) {
    throw new Error("Choose a real applicant before scheduling an interview.");
  }
  if (!Number.isFinite(Date.parse(event.scheduledTime))) {
    throw new Error("Enter a valid interview date and time.");
  }
  if (Date.parse(event.scheduledTime) <= Date.now()) {
    throw new Error("Interview time must be in the future.");
  }
  if (event.interviewerName.trim().length < 2) {
    throw new Error("Enter the interviewer's name.");
  }

  const supabase = createClient();
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError) throw userError;
  if (!user) throw new Error("Please sign in again to schedule an interview.");

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("id, role")
    .eq("auth_user_id", user.id)
    .single();

  if (profileError) throw profileError;
  if (profile.role !== "recruiter") {
    throw new Error("Only recruiter accounts can schedule interviews.");
  }

  const { data, error } = await supabase
    .from("interview_events")
    .insert({
      job_id: event.jobId,
      student_id: event.studentId,
      recruiter_id: profile.id,
      interview_type: event.interviewType,
      scheduled_time: event.scheduledTime,
      duration_minutes: event.durationMinutes,
      interviewer_name: event.interviewerName.trim(),
      status: "scheduled",
    })
    .select(
      "id, job_id, student_id, interview_type, scheduled_time, duration_minutes, interviewer_name, status"
    )
    .single();

  if (error) throw error;

  return {
    ...event,
    id: data.id,
    scheduledTime: new Date(data.scheduled_time).toLocaleString("en-IN", {
      dateStyle: "medium",
      timeStyle: "short",
    }),
    status: data.status,
  };
}

export async function fetchHiringAnalytics(): Promise<HiringAnalyticsData> {
  const supabase = createClient();
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError) throw userError;
  if (!user) throw new Error("Please sign in again to view hiring analytics.");

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("id, role")
    .eq("auth_user_id", user.id)
    .single();

  if (profileError) throw profileError;
  if (profile.role !== "recruiter") {
    throw new Error("Recruiter access is required to view hiring analytics.");
  }

  const { data: jobs, error: jobsError } = await supabase
    .from("jobs")
    .select("id")
    .eq("recruiter_id", profile.id);

  if (jobsError) throw jobsError;
  const jobIds = (jobs || []).map((job) => job.id);

  if (jobIds.length === 0) {
    return {
      avgHiringTimeDays: null,
      offerAcceptanceRate: null,
      interviewPassRate: null,
      totalApplicants: 0,
      topSource: "No applications yet",
      pipelineFunnel: [
        { stage: "Applied", count: 0 },
        { stage: "Screening", count: 0 },
        { stage: "Interviewing", count: 0 },
        { stage: "Offers", count: 0 },
        { stage: "Hired", count: 0 },
      ],
    };
  }

  const { data: applications, error: applicationsError } = await supabase
    .from("job_applications")
    .select("status")
    .in("job_id", jobIds);

  if (applicationsError) throw applicationsError;

  const statuses = (applications || []).map((application) => application.status);
  const count = (status: string) =>
    statuses.filter((value) => value === status).length;

  return {
    avgHiringTimeDays: null,
    offerAcceptanceRate: null,
    interviewPassRate: null,
    totalApplicants: statuses.length,
    topSource: "Application source attribution is not tracked yet",
    pipelineFunnel: [
      { stage: "Applied", count: count("applied") },
      { stage: "Screening", count: count("screening") },
      { stage: "Interviewing", count: count("interviewing") },
      { stage: "Offers", count: count("offered") },
      { stage: "Hired", count: count("hired") },
    ],
  };
}
