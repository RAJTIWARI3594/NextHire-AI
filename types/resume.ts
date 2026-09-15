export type TemplateVariant =
  "classic" | "modern" | "professional" | "minimal" | "creative";

export interface PersonalInfo {
  fullName: string;
  professionalTitle: string;
  email: string;
  phone: string;
  location: string;
  portfolioUrl?: string;
  linkedinUrl?: string;
  githubUrl?: string;
  photoUrl?: string;
}

export interface EducationItem {
  id: string;
  institution: string;
  degree: string;
  fieldOfStudy?: string;
  grade?: string;
  startDate: string;
  endDate?: string;
}

export interface ExperienceItem {
  id: string;
  company: string;
  role: string;
  location?: string;
  startDate: string;
  endDate?: string;
  isCurrent?: boolean;
  description: string;
  technologies?: string[];
}

export interface SkillItem {
  id: string;
  name: string;
  category?: string;
  level?: "Beginner" | "Intermediate" | "Advanced" | "Expert";
}

export interface ProjectItem {
  id: string;
  title: string;
  description: string;
  technologies?: string[];
  githubUrl?: string;
  liveUrl?: string;
}

export interface CertificationItem {
  id: string;
  title: string;
  issuingOrganization: string;
  issueDate?: string;
  credentialUrl?: string;
}

export interface LanguageItem {
  id: string;
  language: string;
  fluency: "Native" | "Fluent" | "Professional" | "Intermediate";
}

export interface ResumeData {
  id?: string;
  studentId?: string;
  title: string;
  template: TemplateVariant;
  atsScore?: number;
  personalInfo: PersonalInfo;
  summary: string;
  education: EducationItem[];
  experience: ExperienceItem[];
  skills: SkillItem[];
  projects: ProjectItem[];
  certifications: CertificationItem[];
  languages: LanguageItem[];
  updatedAt?: string;
}
