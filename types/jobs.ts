export type JobWorkMode = "Remote" | "Hybrid" | "On-site";
export type JobTypeCategory =
  "Full Time" | "Part Time" | "Internship" | "Contract";

export interface CompanyProfile {
  id: string;
  name: string;
  logoUrl?: string;
  website?: string;
  description: string;
  industry: string;
  companySize: string;
  headquarters: string;
  benefits?: string[];
  activeJobsCount?: number;
}

export interface JobListing {
  id: string;
  title: string;
  companyId: string;
  companyName: string;
  companyLogo?: string;
  location: string;
  workMode: JobWorkMode;
  jobType: JobTypeCategory;
  salaryMin: number;
  salaryMax: number;
  currency: string;
  experienceMinYears: number;
  skillsRequired: string[];
  matchScore: number;
  postedDate: string;
  deadline: string;
  applicantCount: number;
  easyApply: boolean;
  description: string;
  responsibilities: string[];
  requirements: string[];
}

export interface InternshipListing extends JobListing {
  durationMonths: number;
  stipendMonthly: number;
  ppoAvailable: boolean;
}

export interface JobMatchAnalysis {
  matchScore: number;
  matchingSkills: string[];
  missingSkills: string[];
  resumeSuggestions: string[];
  learningRecommendations: string[];
}

export interface JobFilterState {
  searchQuery: string;
  workMode: string;
  jobType: string;
  minSalary: number;
  experienceYears: string;
}
