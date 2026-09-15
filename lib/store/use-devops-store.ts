import { create } from "zustand";
import type {
  PlatformSettings,
  FeatureFlag,
  SecurityEvent,
  ApiKeyItem,
  BackupRecord,
  IntegrationStatus,
} from "@/types/devops";
import { MOCK_SETTINGS, MOCK_FEATURE_FLAGS } from "@/services/devops-service";

interface DevOpsStore {
  settings: PlatformSettings;
  flags: FeatureFlag[];
  apiKeys: ApiKeyItem[];
  backups: BackupRecord[];
  integrations: IntegrationStatus[];

  updateSettings: (settings: Partial<PlatformSettings>) => void;
  toggleFlag: (id: string) => void;
  addBackup: (backup: BackupRecord) => void;
  rotateApiKey: (id: string) => void;
}

export const useDevOpsStore = create<DevOpsStore>((set) => ({
  settings: MOCK_SETTINGS,
  flags: MOCK_FEATURE_FLAGS,
  apiKeys: [
    {
      id: "k-1",
      provider: "Gemini",
      keyName: "Google Gemini 1.5 Pro Key",
      maskedKey: "AIzaSyD...98xK",
      lastUsed: "Just now",
      isActive: true,
    },
    {
      id: "k-2",
      provider: "Stripe",
      keyName: "Stripe Live Secret Key",
      maskedKey: "sk_live_51...Mt2P",
      lastUsed: "2 mins ago",
      isActive: true,
    },
    {
      id: "k-3",
      provider: "Razorpay",
      keyName: "Razorpay Key Secret",
      maskedKey: "rzp_live_...41xZ",
      lastUsed: "1 hour ago",
      isActive: true,
    },
  ],
  backups: [
    {
      id: "b-1",
      snapshotName: "db-master-snapshot-20260805.sql.gz",
      sizeMb: 24.5,
      status: "completed",
      createdAt: "Aug 5, 2026 • 04:00 AM",
    },
  ],
  integrations: [
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
  ],

  updateSettings: (newSettings) =>
    set((state) => ({ settings: { ...state.settings, ...newSettings } })),

  toggleFlag: (id) =>
    set((state) => ({
      flags: state.flags.map((f) =>
        f.id === id ? { ...f, isEnabled: !f.isEnabled } : f
      ),
    })),

  addBackup: (backup) =>
    set((state) => ({ backups: [backup, ...state.backups] })),

  rotateApiKey: (id) =>
    set((state) => ({
      apiKeys: state.apiKeys.map((k) =>
        k.id === id ? { ...k, maskedKey: "AIzaSyD...Rotated" } : k
      ),
    })),
}));
