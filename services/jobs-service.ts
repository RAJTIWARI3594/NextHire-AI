import { createClient } from "@/lib/supabase/client";
import type {
  JobListing,
  CompanyProfile,
  JobMatchAnalysis,
  JobFilterState,
} from "@/types/jobs";

export const MOCK_JOBS_FULL: JobListing[] = [
  {
    id: "job-1",
    title: "Senior Full Stack Engineer (Next.js & Supabase)",
    companyId: "comp-1",
    companyName: "Vercel Partner Labs",
    companyLogo:
      "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=100&auto=format&fit=crop&q=60",
    location: "San Francisco, CA",
    workMode: "Remote",
    jobType: "Full Time",
    salaryMin: 120000,
    salaryMax: 150000,
    currency: "USD",
    experienceMinYears: 3,
    skillsRequired: [
      "Next.js 15",
      "React 19",
      "TypeScript",
      "PostgreSQL",
      "Tailwind CSS",
    ],
    matchScore: 98,
    postedDate: "2 hours ago",
    deadline: "Aug 30, 2026",
    applicantCount: 48,
    easyApply: true,
    description:
      "We are seeking an experienced Full Stack Engineer to lead ourNext.js 15 application development. You will architect high-performance frontend interfaces, manage Supabase PostgreSQL database schemas with RLS security policies, and optimize serverless API endpoints.",
    responsibilities: [
      "Architect and ship production-ready Next.js 15 App Router features.",
      "Design normalized Supabase PostgreSQL database tables and enforce Row Level Security.",
      "Collaborate with AI product engineers to integrate Gemini voice and text models.",
    ],
    requirements: [
      "3+ years of professional experience with React, TypeScript, and modern SSR frameworks.",
      "Deep understanding of SQL, PostgreSQL triggers, and RLS security policies.",
      "Proven track record of building responsive, accessible web applications.",
    ],
  },
  {
    id: "job-2",
    title: "AI Voice & LLM Solutions Engineer",
    companyId: "comp-2",
    companyName: "Nexus AI Intelligence",
    companyLogo:
      "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=100&auto=format&fit=crop&q=60",
    location: "New York, NY",
    workMode: "Hybrid",
    jobType: "Full Time",
    salaryMin: 135000,
    salaryMax: 165000,
    currency: "USD",
    experienceMinYears: 2,
    skillsRequired: ["Python", "PyTorch", "LLMs", "FastAPI", "WebSockets"],
    matchScore: 94,
    postedDate: "5 hours ago",
    deadline: "Sep 15, 2026",
    applicantCount: 34,
    easyApply: true,
    description:
      "Join Nexus AI to build low-latency voice synthesis and text-to-speech agents. You will optimize streaming inference pipelines and connect LLM models with real-time browser WebSockets.",
    responsibilities: [
      "Build real-time WebSockets streaming pipelines for audio speech synthesis.",
      "Fine-tune LLM embeddings for enterprise RAG retrieval.",
    ],
    requirements: [
      "Proficiency in Python, PyTorch, and vector database indexing.",
      "Experience with WebSockets or WebRTC audio streaming.",
    ],
  },
  {
    id: "job-3",
    title: "Frontend Developer (React & Tailwind)",
    companyId: "comp-3",
    companyName: "HyperScale Tech",
    location: "Remote",
    workMode: "Remote",
    jobType: "Full Time",
    salaryMin: 90000,
    salaryMax: 115000,
    currency: "USD",
    experienceMinYears: 1,
    skillsRequired: ["React", "TypeScript", "Tailwind CSS", "Zustand"],
    matchScore: 91,
    postedDate: "1 day ago",
    deadline: "Sep 1, 2026",
    applicantCount: 72,
    easyApply: true,
    description:
      "Design pixel-perfect UI component libraries using React 19, Tailwind CSS, and Framer Motion.",
    responsibilities: [
      "Develop responsive UI components using Tailwind CSS.",
      "Manage state using Zustand and React Query.",
    ],
    requirements: ["Strong eye for design, typography, and micro-animations."],
  },
];

export async function fetchJobs(
  filters?: JobFilterState
): Promise<JobListing[]> {
  const supabase = createClient();
  const { data } = await supabase
    .from("jobs")
    .select("*, company:companies(name, logo_url)")
    .eq("is_active", true);

  if (!data || data.length === 0) {
    let result = MOCK_JOBS_FULL;
    if (filters?.searchQuery) {
      const q = filters.searchQuery.toLowerCase();
      result = result.filter(
        (j) =>
          j.title.toLowerCase().includes(q) ||
          j.companyName.toLowerCase().includes(q) ||
          j.skillsRequired.some((s) => s.toLowerCase().includes(q))
      );
    }
    if (filters?.workMode && filters.workMode !== "All") {
      result = result.filter((j) => j.workMode === filters.workMode);
    }
    return result;
  }

  return data.map((j) => ({
    id: j.id,
    title: j.title,
    companyId: j.company_id || "comp-1",
    companyName: j.company?.name || "Vercel Partner Labs",
    companyLogo: j.company?.logo_url,
    location: j.location,
    workMode: "Remote",
    jobType: "Full Time",
    salaryMin: Number(j.salary_min) || 120000,
    salaryMax: Number(j.salary_max) || 150000,
    currency: j.currency || "USD",
    experienceMinYears: 2,
    skillsRequired: j.requirements || ["Next.js", "React", "TypeScript"],
    matchScore: 95,
    postedDate: "Recent",
    deadline: "Open",
    applicantCount: j.applications_count || 12,
    easyApply: true,
    description: j.description,
    responsibilities: j.responsibilities || [],
    requirements: j.requirements || [],
  }));
}

export async function calculateAIJobMatch(
  jobId: string,
  candidateSkills: string[]
): Promise<JobMatchAnalysis> {
  return {
    matchScore: 98,
    matchingSkills: [
      "Next.js 15",
      "React 19",
      "TypeScript",
      "PostgreSQL",
      "Tailwind CSS",
    ],
    missingSkills: ["Docker Containerization", "Redis Caching"],
    resumeSuggestions: [
      "Add quantifiable metric: 'Reduced initial bundle size by 40%'.",
      "Include Supabase RLS policy creation in experience section.",
    ],
    learningRecommendations: [
      "Complete Redis Caching module on NextHire Learning Track.",
    ],
  };
}

export async function submitJobApplication(payload: {
  jobId: string;
  studentId: string;
  resumeUrl?: string;
  coverLetter?: string;
  message?: string;
}): Promise<void> {
  const supabase = createClient();
  const { error } = await supabase.from("job_applications").insert({
    job_id: payload.jobId,
    student_id: payload.studentId,
    resume_url: payload.resumeUrl || "master-resume.pdf",
    cover_letter: payload.coverLetter,
    status: "applied",
    match_score: 98,
  });

  if (error && !error.message.includes("duplicate")) throw error;
}

export async function fetchCompanyProfile(
  companyId: string
): Promise<CompanyProfile> {
  return {
    id: companyId,
    name: "Vercel Partner Labs",
    logoUrl:
      "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=100&auto=format&fit=crop&q=60",
    website: "https://vercel.com",
    description:
      "Vercel Partner Labs accelerates modern web ecosystem development with cutting-edge Next.js 15, Turbopack, and edge deployment architectures.",
    industry: "Cloud Software & AI Infrastructure",
    companySize: "500 - 1,000 Employees",
    headquarters: "San Francisco, CA",
    benefits: [
      "Full Remote Flexibility",
      "Competitive Salary & Stock Options",
      "$3,000 Annual Learning Budget",
      "Comprehensive Health & Wellness",
    ],
    activeJobsCount: 4,
  };
}
