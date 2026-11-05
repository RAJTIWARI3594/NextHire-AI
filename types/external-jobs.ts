export interface ExternalJobListing {
  id: string;
  title: string;
  companyName: string;
  location: string;
  workMode: string;
  employmentType: string;
  experienceLevel: string;
  salaryText: string;
  description: string;
  requirements: string[];
  skills: string[];
  sourceName: string;
  sourceUrl: string;
  applyUrl: string;
  closingDate: string | null;
  verifiedAt: string;
}

export function isSafeEmployerUrl(value: string): boolean {
  try {
    const url = new URL(value);
    return (
      url.protocol === "https:" &&
      Boolean(url.hostname) &&
      !["localhost", "127.0.0.1", "::1"].includes(url.hostname)
    );
  } catch {
    return false;
  }
}
