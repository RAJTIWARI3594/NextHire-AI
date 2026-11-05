import { createClient, isSupabaseConfigured } from "@/lib/supabase/client";
import {
  isSafeEmployerUrl,
  type ExternalJobListing,
} from "@/types/external-jobs";

type ExternalJobRow = {
  id: string;
  title: string;
  company_name: string;
  location: string;
  work_mode: string;
  employment_type: string;
  experience_level: string;
  salary_text: string;
  description: string;
  requirements: string[] | null;
  skills: string[] | null;
  source_name: string;
  source_url: string;
  apply_url: string;
  closing_date: string | null;
  verified_at: string;
};

export async function fetchExternalJobs(): Promise<ExternalJobListing[]> {
  if (!isSupabaseConfigured()) return [];

  const { data, error } = await createClient()
    .from("external_jobs")
    .select(
      "id,title,company_name,location,work_mode,employment_type,experience_level,salary_text,description,requirements,skills,source_name,source_url,apply_url,closing_date,verified_at"
    )
    .eq("is_active", true)
    .order("verified_at", { ascending: false });

  if (error) throw error;

  return ((data || []) as ExternalJobRow[])
    .filter(
      (job) =>
        isSafeEmployerUrl(job.apply_url) &&
        isSafeEmployerUrl(job.source_url)
    )
    .map((job) => ({
      id: job.id,
      title: job.title,
      companyName: job.company_name,
      location: job.location,
      workMode: job.work_mode,
      employmentType: job.employment_type,
      experienceLevel: job.experience_level,
      salaryText: job.salary_text,
      description: job.description,
      requirements: job.requirements || [],
      skills: job.skills || [],
      sourceName: job.source_name,
      sourceUrl: job.source_url,
      applyUrl: job.apply_url,
      closingDate: job.closing_date,
      verifiedAt: job.verified_at,
    }));
}
