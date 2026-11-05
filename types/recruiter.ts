export type RecommendationTier =
  "Highly Recommended" | "Recommended" | "Consider" | "Not Recommended";
export type OfferStatus =
  "Draft" | "Sent" | "Accepted" | "Rejected" | "Expired";

export interface CandidateRanking {
  id: string;
  jobId: string;
  studentId: string;
  studentName: string;
  studentEmail: string;
  studentAvatar?: string;
  jobTitle: string;
  overallScore: number;
  atsScore: number;
  skillsScore: number;
  interviewScore: number;
  recommendation: RecommendationTier;
  strengths: string[];
  weaknesses: string[];
  missingSkills: string[];
  isShortlisted: boolean;
  notes?: string;
  appliedDate: string;
}

export interface InterviewEvent {
  id: string;
  jobId: string;
  studentId: string;
  candidateName: string;
  jobTitle: string;
  interviewType: "HR" | "Technical" | "Coding" | "Managerial" | "Final Round";
  scheduledTime: string;
  durationMinutes: number;
  interviewerName: string;
  status: "scheduled" | "completed" | "cancelled" | "rescheduled";
}

export interface RecruiterMessage {
  id: string;
  recruiterId: string;
  studentId: string;
  senderRole: "recruiter" | "student";
  content: string;
  attachmentUrl?: string;
  isRead: boolean;
  createdAt: string;
}

export interface OfferLetter {
  id: string;
  jobId: string;
  studentId: string;
  candidateName: string;
  jobTitle: string;
  salaryPackage: number;
  joiningDate: string;
  location: string;
  status: OfferStatus;
  pdfUrl?: string;
  createdAt: string;
}

export interface HiringAnalyticsData {
  avgHiringTimeDays: number | null;
  offerAcceptanceRate: number | null;
  interviewPassRate: number | null;
  totalApplicants: number;
  topSource: string;
  pipelineFunnel: { stage: string; count: number }[];
}
