export type UserAccountStatus = "active" | "suspended" | "pending";

export interface PlatformUser {
  id: string;
  fullName: string;
  email: string;
  role: "student" | "recruiter" | "admin";
  status: UserAccountStatus;
  joinedDate: string;
  lastLogin: string;
}

export interface RecruiterApproval {
  id: string;
  recruiterName: string;
  companyName: string;
  email: string;
  documentUrl?: string;
  status: "pending" | "approved" | "rejected";
  appliedDate: string;
}

export interface JobModerationItem {
  id: string;
  title: string;
  companyName: string;
  postedDate: string;
  status: "active" | "pending_approval" | "rejected" | "spam";
  reportsCount: number;
}

export interface AuditLogItem {
  id: string;
  adminName: string;
  actionType: string;
  targetResource: string;
  details: string;
  timestamp: string;
  ipAddress: string;
}

export interface AdminMetrics {
  totalStudents: number;
  totalRecruiters: number;
  totalCompanies: number;
  totalJobs: number;
  totalApplications: number;
  dailyAiSessions: number;
  monthlyRevenueUsd: number;
  serverHealth: "Healthy" | "Degraded" | "Down";
}
