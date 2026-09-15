export type UserRole = "student" | "recruiter" | "admin";

export interface Profile {
  id: string;
  auth_user_id: string;
  role: UserRole;
  full_name: string;
  avatar_url?: string;
  bio?: string;
  phone?: string;
  created_at: string;
  updated_at: string;
}

export interface StudentProfile {
  profile_id: string;
  college: string;
  course: string;
  graduation_year: number;
  cgpa?: number;
  github_url?: string;
  linkedin_url?: string;
  portfolio_url?: string;
  ats_score?: number;
  coins_balance?: number;
}

export interface RecruiterProfile {
  profile_id: string;
  company_name: string;
  website?: string;
  designation: string;
  company_email: string;
  is_verified?: boolean;
}

export interface AdminProfile {
  profile_id: string;
  department?: string;
  access_level?: number;
}

export interface AuthState {
  user: any | null;
  profile: Profile | null;
  studentProfile: StudentProfile | null;
  recruiterProfile: RecruiterProfile | null;
  role: UserRole | null;
  isLoading: boolean;
}
