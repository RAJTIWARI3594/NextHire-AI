import { createClient } from "@/lib/supabase/client";
import type {
  CandidateRanking,
  InterviewEvent,
  RecruiterMessage,
  OfferLetter,
  HiringAnalyticsData,
} from "@/types/recruiter";

export const MOCK_RANKED_CANDIDATES: CandidateRanking[] = [
  {
    id: "rank-1",
    jobId: "job-1",
    studentId: "stud-1",
    studentName: "Aarav Sharma",
    studentEmail: "aarav@student.nexthire.ai",
    jobTitle: "Senior Full Stack Engineer",
    overallScore: 96,
    atsScore: 98,
    skillsScore: 95,
    interviewScore: 94,
    recommendation: "Highly Recommended",
    strengths: [
      "Built production Next.js 15 App Router & Supabase PostgreSQL architecture.",
      "98% ATS keyword match for modern Web SDKs & RLS security policies.",
      "High AI Interview Confidence & Problem-Solving score.",
    ],
    weaknesses: ["Minimal experience with legacy Kubernetes clusters."],
    missingSkills: ["Docker Containerization"],
    isShortlisted: true,
    appliedDate: "Aug 5, 2026",
  },
  {
    id: "rank-2",
    jobId: "job-1",
    studentId: "stud-2",
    studentName: "Sarah Jenkins",
    studentEmail: "sarah.j@mit.edu",
    jobTitle: "Senior Full Stack Engineer",
    overallScore: 89,
    atsScore: 91,
    skillsScore: 88,
    interviewScore: 88,
    recommendation: "Recommended",
    strengths: ["Strong React 19 component library authoring experience."],
    weaknesses: ["Less familiarity with serverless edge handlers."],
    missingSkills: ["Redis Caching"],
    isShortlisted: false,
    appliedDate: "Aug 4, 2026",
  },
  {
    id: "rank-3",
    jobId: "job-2",
    studentId: "stud-3",
    studentName: "Marcus Vance",
    studentEmail: "marcus.vance@berkeley.edu",
    jobTitle: "AI Voice Solutions Engineer",
    overallScore: 92,
    atsScore: 94,
    skillsScore: 93,
    interviewScore: 90,
    recommendation: "Highly Recommended",
    strengths: ["Deep PyTorch & WebSockets streaming audio experience."],
    weaknesses: ["Could improve frontend UI integration speed."],
    missingSkills: ["GraphQL"],
    isShortlisted: true,
    appliedDate: "Aug 3, 2026",
  },
];

export async function fetchRankedCandidates(): Promise<CandidateRanking[]> {
  const supabase = createClient();
  const { data } = await supabase.from("candidate_rankings").select("*");

  if (!data || data.length === 0) {
    return MOCK_RANKED_CANDIDATES;
  }

  const profiles = await Promise.all(
    data.map(async (c) => {
      const { data: p } = await supabase
        .from("profiles")
        .select("full_name, email")
        .eq("id", c.student_id)
        .maybeSingle();
      return p;
    })
  );

  return data.map((c, i) => {
    const p = profiles[i];
    return {
      id: c.id,
      jobId: c.job_id,
      studentId: c.student_id,
      studentName: p?.full_name || "Candidate",
      studentEmail: p?.email || "",
      jobTitle: "Job Listing",
      overallScore: c.overall_score,
      atsScore: c.ats_score,
      skillsScore: c.skills_score,
      interviewScore: c.interview_score,
      recommendation: c.recommendation,
      strengths: c.strengths || [],
      weaknesses: c.weaknesses || [],
      missingSkills: c.missing_skills || [],
      isShortlisted: c.is_shortlisted,
      appliedDate: "Recent",
    };
  });
}

export async function toggleCandidateShortlist(
  candidateId: string,
  currentShortlisted: boolean
): Promise<void> {
  const supabase = createClient();
  await supabase
    .from("candidate_rankings")
    .update({ is_shortlisted: !currentShortlisted })
    .eq("id", candidateId);
}

export async function scheduleInterview(
  event: Partial<InterviewEvent>
): Promise<void> {
  const supabase = createClient();
  await supabase.from("interview_events").insert({
    job_id: event.jobId || "job-1",
    student_id: event.studentId || "stud-1",
    recruiter_id: "rec-1",
    interview_type: event.interviewType || "Technical",
    scheduled_time: event.scheduledTime || new Date().toISOString(),
    duration_minutes: event.durationMinutes || 45,
    interviewer_name: event.interviewerName || "Hiring Lead",
    status: "scheduled",
  });
}

export async function fetchHiringAnalytics(): Promise<HiringAnalyticsData> {
  return {
    avgHiringTimeDays: 14,
    offerAcceptanceRate: 88,
    interviewPassRate: 74,
    totalApplicants: 184,
    topSource: "NextHire AI Talent Matching",
    pipelineFunnel: [
      { stage: "Applied", count: 184 },
      { stage: "AI Ranked (Top 20%)", count: 36 },
      { stage: "Interview Scheduled", count: 18 },
      { stage: "Offer Sent", count: 8 },
      { stage: "Hired", count: 7 },
    ],
  };
}
