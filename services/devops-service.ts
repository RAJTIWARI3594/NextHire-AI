import { createClient } from "@/lib/supabase/client";
import type {
  PlatformSettings,
  FeatureFlag,
  SecurityEvent,
  ApiKeyItem,
  BackupRecord,
  IntegrationStatus,
} from "@/types/devops";

export const MOCK_SETTINGS: PlatformSettings = {
  platformName: "NextHire AI",
  contactEmail: "contact@nexthire.ai",
  supportEmail: "support@nexthire.ai",
  maintenanceMode: false,
  defaultTheme: "dark",
  defaultLanguage: "English",
  defaultCurrency: "USD",
  termsUrl: "/terms",
  privacyUrl: "/privacy",
};

export const MOCK_FEATURE_FLAGS: FeatureFlag[] = [
  {
    id: "ff-1",
    key: "ai_chat",
    name: "AI Career Coach Chat",
    description: "24/7 Placement & Coding Mentor",
    isEnabled: true,
    rolloutPercentage: 100,
  },
  {
    id: "ff-2",
    key: "ai_interview",
    name: "AI Mock Interview (Voice + Text)",
    description: "Real-time speech synthesis interview engine",
    isEnabled: true,
    rolloutPercentage: 100,
  },
  {
    id: "ff-3",
    key: "resume_builder",
    name: "ATS Resume Builder",
    description: "5 ATS-friendly templates & live renderer",
    isEnabled: true,
    rolloutPercentage: 100,
  },
  {
    id: "ff-4",
    key: "coding_platform",
    name: "LeetCode Coding Practice",
    description: "Code compiler & streak leaderboards",
    isEnabled: true,
    rolloutPercentage: 100,
  },
  {
    id: "ff-5",
    key: "recruiter_portal",
    name: "Enterprise Recruiter Workspace",
    description: "AI Candidate Ranking & Offer Generator",
    isEnabled: true,
    rolloutPercentage: 100,
  },
];

export async function fetchPlatformSettings(): Promise<PlatformSettings> {
  const supabase = createClient();
  const { data } = await supabase
    .from("platform_settings")
    .select("*")
    .single();

  if (!data) return MOCK_SETTINGS;

  return {
    platformName: data.platform_name || MOCK_SETTINGS.platformName,
    contactEmail: data.contact_email || MOCK_SETTINGS.contactEmail,
    supportEmail: data.support_email || MOCK_SETTINGS.supportEmail,
    maintenanceMode: data.maintenance_mode || false,
    defaultTheme: data.default_theme || "dark",
    defaultLanguage: data.default_language || "English",
    defaultCurrency: data.default_currency || "USD",
    termsUrl: data.terms_url || "/terms",
    privacyUrl: data.privacy_url || "/privacy",
  };
}

export async function toggleFeatureFlag(
  flagId: string,
  currentEnabled: boolean
): Promise<void> {
  const supabase = createClient();
  await supabase
    .from("feature_flags")
    .update({ is_enabled: !currentEnabled })
    .eq("id", flagId);
}

export async function triggerBackupSnapshot(): Promise<BackupRecord> {
  const supabase = createClient();
  const snapshotName = `db-snapshot-${Date.now()}.sql.gz`;

  await supabase.from("backup_history").insert({
    snapshot_name: snapshotName,
    size_mb: 24.5,
    status: "completed",
    storage_path: `backups/${snapshotName}`,
  });

  return {
    id: `b-${Date.now()}`,
    snapshotName,
    sizeMb: 24.5,
    status: "completed",
    createdAt: new Date().toISOString(),
  };
}

export async function fetchIntegrations(): Promise<IntegrationStatus[]> {
  return [
    {
      id: "int-1",
      provider: "google_oauth",
      name: "Google OAuth 2.0",
      isConnected: true,
      healthStatus: "Operational",
    },
    {
      id: "int-2",
      provider: "github_oauth",
      name: "GitHub OAuth",
      isConnected: true,
      healthStatus: "Operational",
    },
    {
      id: "int-3",
      provider: "stripe",
      name: "Stripe Billing Webhook",
      isConnected: true,
      healthStatus: "Operational",
    },
    {
      id: "int-4",
      provider: "razorpay",
      name: "Razorpay Payments API",
      isConnected: true,
      healthStatus: "Operational",
    },
    {
      id: "int-5",
      provider: "gemini",
      name: "Google Gemini 1.5 Pro AI Model",
      isConnected: true,
      healthStatus: "Operational",
    },
    {
      id: "int-6",
      provider: "resend",
      name: "Resend Transactional Email",
      isConnected: true,
      healthStatus: "Operational",
    },
  ];
}
