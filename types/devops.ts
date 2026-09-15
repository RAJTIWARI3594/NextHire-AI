export interface PlatformSettings {
  platformName: string;
  contactEmail: string;
  supportEmail: string;
  maintenanceMode: boolean;
  defaultTheme: "dark" | "light";
  defaultLanguage: string;
  defaultCurrency: string;
  termsUrl: string;
  privacyUrl: string;
}

export interface FeatureFlag {
  id: string;
  key: string;
  name: string;
  description: string;
  isEnabled: boolean;
  rolloutPercentage: number;
}

export interface SecurityEvent {
  id: string;
  eventType: string;
  severity: "low" | "medium" | "high" | "critical";
  ipAddress: string;
  details: string;
  timestamp: string;
}

export interface ApiKeyItem {
  id: string;
  provider: string;
  keyName: string;
  maskedKey: string;
  lastUsed: string;
  isActive: boolean;
}

export interface MonitoringMetrics {
  serverUptimePercent: number;
  dbPoolLoadPercent: number;
  memoryUsagePercent: number;
  edgeLatencyMs: number;
  cdnStatus: "Operational" | "Degraded";
}

export interface BackupRecord {
  id: string;
  snapshotName: string;
  sizeMb: number;
  status: "completed" | "failed" | "in_progress";
  createdAt: string;
}

export interface IntegrationStatus {
  id: string;
  provider: string;
  name: string;
  isConnected: boolean;
  healthStatus: "Operational" | "Degraded" | "Offline";
}
