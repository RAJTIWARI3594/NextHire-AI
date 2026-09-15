import { createClient } from "@/lib/supabase/client";
import type {
  CoverLetter,
  PortfolioSettings,
  ResumeAnalyticsData,
  AISuggestion,
  MarketplaceTemplate,
} from "@/types/career";

export async function generateAICoverLetter(payload: {
  jobTitle: string;
  companyName: string;
  jobDescription?: string;
  tone: "Professional" | "Friendly" | "Formal";
  candidateName: string;
}): Promise<string> {
  const { jobTitle, companyName, tone, candidateName } = payload;

  const greetings = {
    Professional: `Dear Hiring Team at ${companyName},`,
    Friendly: `Hello ${companyName} Team!`,
    Formal: `To the Hiring Committee of ${companyName},`,
  };

  const body = `${greetings[tone]}

I am thrilled to submit my application for the ${jobTitle} position at ${companyName}. With a strong background in full stack software engineering, Next.js 15, React 19, TypeScript, and Supabase PostgreSQL architecture, I have built production-ready applications engineered for speed, security, and scalability.

Throughout my recent projects—including building an autonomous AI hiring engine with real-time video evaluation and strict Row Level Security (RLS) policies—I have consistently delivered clean, maintainable code. My experience matches your technical requirements for scalable frontend architecture and database query optimization.

I am eager to bring my problem-solving mindset and technical expertise to ${companyName} to help scale your modern web ecosystem. Thank you for your time and consideration.

Sincerely,
${candidateName}`;

  return body;
}

export async function fetchUserCoverLetters(
  studentId: string
): Promise<CoverLetter[]> {
  const supabase = createClient();
  const { data } = await supabase
    .from("cover_letters")
    .select("*")
    .eq("student_id", studentId)
    .order("created_at", { ascending: false });

  return data || [];
}

export async function saveCoverLetter(coverLetter: CoverLetter): Promise<void> {
  const supabase = createClient();
  if (coverLetter.studentId) {
    await supabase.from("cover_letters").insert({
      student_id: coverLetter.studentId,
      job_title: coverLetter.jobTitle,
      company_name: coverLetter.companyName,
      job_description: coverLetter.jobDescription,
      tone: coverLetter.tone,
      content: coverLetter.content,
    });
  }
}

export async function fetchResumeAnalytics(): Promise<ResumeAnalyticsData> {
  return {
    totalViews: 142,
    recruiterViews: 38,
    downloadsCount: 18,
    publicClicks: 64,
    atsScoreHistory: [
      { date: "Jul 1", score: 72 },
      { date: "Jul 15", score: 78 },
      { date: "Jul 28", score: 82 },
      { date: "Aug 5", score: 88 },
    ],
    weeklyViews: [
      { day: "Mon", views: 12 },
      { day: "Tue", views: 18 },
      { day: "Wed", views: 24 },
      { day: "Thu", views: 30 },
      { day: "Fri", views: 22 },
      { day: "Sat", views: 15 },
      { day: "Sun", views: 21 },
    ],
  };
}

export async function fetchAISuggestions(): Promise<AISuggestion[]> {
  return [
    {
      id: "sug-1",
      category: "skill",
      title: "Add GraphQL & Prisma ORM",
      description:
        "High demand detected in 40% of Senior Full Stack Job Postings.",
      impact: "High",
    },
    {
      id: "sug-2",
      category: "certification",
      title: "AWS Certified Developer Associate",
      description:
        "Boosts recruiter profile visibility by +35% for Cloud Architect roles.",
      impact: "High",
    },
    {
      id: "sug-3",
      category: "project",
      title: "Build Real-Time WebRTC Video App",
      description:
        "Demonstrates advanced browser streaming and WebSockets knowledge.",
      impact: "Medium",
    },
    {
      id: "sug-4",
      category: "resume_tip",
      title: "Quantify Impact Metrics in Work Experience",
      description:
        "Use percentages (e.g. 'Improved load times by 45%') for higher ATS rankings.",
      impact: "High",
    },
  ];
}

export const MARKETPLACE_TEMPLATES: MarketplaceTemplate[] = [
  {
    id: "tmpl-1",
    title: "Classic Corporate ATS",
    category: "Software Engineer",
    isFavorite: true,
  },
  {
    id: "tmpl-2",
    title: "Modern Indigo Gradient",
    category: "Software Engineer",
    isFavorite: true,
  },
  { id: "tmpl-3", title: "Data Insights Clean", category: "Data Analyst" },
  { id: "tmpl-4", title: "Product & UI/UX Studio", category: "UI/UX Designer" },
  { id: "tmpl-5", title: "Growth & Brand Lead", category: "Marketing" },
  { id: "tmpl-6", title: "Executive Business Minimal", category: "Business" },
  { id: "tmpl-7", title: "Campus Graduate Fresher", category: "Fresher" },
  { id: "tmpl-[#8]", title: "Creative Developer Dark", category: "Creative" },
];
