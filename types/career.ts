export interface CoverLetter {
  id?: string;
  studentId?: string;
  jobTitle: string;
  companyName: string;
  jobDescription?: string;
  tone: "Professional" | "Friendly" | "Formal";
  content: string;
  createdAt?: string;
}

export interface PortfolioSettings {
  id?: string;
  studentId?: string;
  username: string;
  theme: "modern_indigo" | "emerald_dark" | "sunset_amber" | "cyber_purple";
  primaryColor: string;
  fontFamily: string;
  isPublished: boolean;
}

export interface ResumeAnalyticsData {
  totalViews: number;
  recruiterViews: number;
  downloadsCount: number;
  publicClicks: number;
  atsScoreHistory: { date: string; score: number }[];
  weeklyViews: { day: string; views: number }[];
}

export interface PublicProfile {
  username: string;
  isPublic: boolean;
  qrCodeUrl?: string;
}

export interface AISuggestion {
  id: string;
  category: "skill" | "certification" | "project" | "resume_tip" | "role";
  title: string;
  description: string;
  impact: "High" | "Medium" | "Low";
}

export interface MarketplaceTemplate {
  id: string;
  title: string;
  category:
    | "Software Engineer"
    | "Data Analyst"
    | "UI/UX Designer"
    | "Marketing"
    | "Business"
    | "Fresher"
    | "Experienced"
    | "Creative";
  previewUrl?: string;
  isFavorite?: boolean;
}
