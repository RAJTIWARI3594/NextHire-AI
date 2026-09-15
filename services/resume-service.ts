import { createClient } from "@/lib/supabase/client";
import type { ResumeData } from "@/types/resume";

export const emptyResumeData: ResumeData = {
  title: "My Resume",
  template: "modern",
  atsScore: 0,
  personalInfo: {
    fullName: "",
    professionalTitle: "",
    email: "",
    phone: "",
    location: "",
    portfolioUrl: "",
    linkedinUrl: "",
    githubUrl: "",
  },
  summary: "",
  education: [],
  experience: [],
  skills: [],
  projects: [],
  certifications: [],
  languages: [],
};

export const defaultResumeData: ResumeData = { ...emptyResumeData };

export async function fetchUserResumes(
  studentId: string
): Promise<ResumeData[]> {
  const supabase = createClient();
  const { data } = await supabase
    .from("resumes")
    .select("*")
    .eq("student_id", studentId)
    .order("updated_at", { ascending: false });

  if (!data || data.length === 0) {
    return [{ ...defaultResumeData, id: "master-demo-1" }];
  }

  return data.map((r) => ({
    id: r.id,
    studentId: r.student_id,
    title: r.title || "My Resume",
    template: "modern",
    atsScore: r.ats_score || 0,
    personalInfo: {
      fullName: r.full_name || "",
      professionalTitle: r.professional_title || "",
      email: r.email || "",
      phone: r.phone || "",
      location: r.location || "",
      portfolioUrl: r.portfolio_url || "",
      linkedinUrl: r.linkedin_url || "",
      githubUrl: r.github_url || "",
    },
    summary: r.summary || "",
    education: r.education || [],
    experience: r.experience || [],
    skills: r.skills || [],
    projects: r.projects || [],
    certifications: r.certifications || [],
    languages: r.languages || [],
    updatedAt: r.updated_at,
  }));
}

export async function saveResume(resume: ResumeData): Promise<string> {
  const supabase = createClient();
  if (resume.id && !resume.id.startsWith("master-demo")) {
    await supabase
      .from("resumes")
      .update({
        title: resume.title,
        ats_score: resume.atsScore || 0,
        summary: resume.summary,
        full_name: resume.personalInfo.fullName,
        professional_title: resume.personalInfo.professionalTitle,
        email: resume.personalInfo.email,
        phone: resume.personalInfo.phone,
        location: resume.personalInfo.location,
        portfolio_url: resume.personalInfo.portfolioUrl,
        linkedin_url: resume.personalInfo.linkedinUrl,
        github_url: resume.personalInfo.githubUrl,
        education: resume.education,
        experience: resume.experience,
        skills: resume.skills,
        projects: resume.projects,
        certifications: resume.certifications,
        languages: resume.languages,
        updated_at: new Date().toISOString(),
      })
      .eq("id", resume.id);
    return resume.id;
  }
  const { data, error } = await supabase
    .from("resumes")
    .insert({
      student_id: resume.studentId,
      title: resume.title || "My Resume",
      ats_score: resume.atsScore || 0,
      summary: resume.summary,
      full_name: resume.personalInfo.fullName,
      professional_title: resume.personalInfo.professionalTitle,
      email: resume.personalInfo.email,
      phone: resume.personalInfo.phone,
      location: resume.personalInfo.location,
      portfolio_url: resume.personalInfo.portfolioUrl,
      linkedin_url: resume.personalInfo.linkedinUrl,
      github_url: resume.personalInfo.githubUrl,
      education: resume.education,
      experience: resume.experience,
      skills: resume.skills,
      projects: resume.projects,
      certifications: resume.certifications,
      languages: resume.languages,
    })
    .select("id")
    .single();

  if (error) throw error;
  return data?.id || resume.id || "";
}
