export interface UserProfile {
  id: string;
  email: string;
  fullName: string;
  avatarUrl?: string;
  role: "candidate" | "recruiter" | "admin";
  createdAt: string;
}

export interface Candidate {
  id: string;
  name: string;
  email: string;
  roleTitle: string;
  matchScore: number;
  status: "applied" | "screened" | "interviewed" | "hired" | "rejected";
  skills: string[];
  appliedAt: string;
}

export interface FeatureCardItem {
  id: string;
  title: string;
  description: string;
  iconName: string;
  badgeText?: string;
}

export type Theme = "light" | "dark" | "system";
