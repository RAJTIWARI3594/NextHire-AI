"use client";

import React, { useState } from "react";
import {
  Settings,
  Save,
  CheckCircle2,
  Shield,
  Globe,
  Lock,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useDevOpsStore } from "@/lib/store/use-devops-store";

export default function PlatformSettingsPage() {
  const { settings, updateSettings } = useDevOpsStore();
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="mx-auto max-w-5xl space-y-6 p-4 sm:p-8">
      <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            Centralized Platform Settings
          </h1>
          <p className="text-sm text-muted-foreground">
            Configure platform branding, support emails, maintenance mode, and
            security defaults.
          </p>
        </div>

        <Button variant="gradient" onClick={handleSave} className="gap-2">
          {saved ? (
            <CheckCircle2 className="h-4 w-4 text-emerald-300" />
          ) : (
            <Save className="h-4 w-4" />
          )}
          {saved ? "Saved Instantly!" : "Save Settings"}
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
        {/* Settings Form (7 cols) */}
        <Card className="space-y-4 border-border/60 p-6 shadow-sm lg:col-span-7">
          <h2 className="flex items-center gap-2 text-sm font-bold">
            <Settings className="h-4 w-4 text-primary" /> General System
            Configuration
          </h2>

          <div className="space-y-4 text-xs">
            <div className="space-y-1">
              <label className="font-semibold uppercase text-muted-foreground">
                Platform Name
              </label>
              <Input
                value={settings.platformName}
                onChange={(e) =>
                  updateSettings({ platformName: e.target.value })
                }
              />
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-1">
                <label className="font-semibold uppercase text-muted-foreground">
                  Contact Email
                </label>
                <Input
                  value={settings.contactEmail}
                  onChange={(e) =>
                    updateSettings({ contactEmail: e.target.value })
                  }
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold uppercase text-muted-foreground">
                  Support Email
                </label>
                <Input
                  value={settings.supportEmail}
                  onChange={(e) =>
                    updateSettings({ supportEmail: e.target.value })
                  }
                />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-1">
                <label className="font-semibold uppercase text-muted-foreground">
                  Default Language
                </label>
                <Input
                  value={settings.defaultLanguage}
                  onChange={(e) =>
                    updateSettings({ defaultLanguage: e.target.value })
                  }
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold uppercase text-muted-foreground">
                  Default Currency
                </label>
                <Input
                  value={settings.defaultCurrency}
                  onChange={(e) =>
                    updateSettings({ defaultCurrency: e.target.value })
                  }
                />
              </div>
            </div>
          </div>
        </Card>

        {/* System Controls & Maintenance Mode (5 cols) */}
        <Card className="space-y-4 border-border/60 p-6 shadow-sm lg:col-span-5">
          <h2 className="flex items-center gap-2 text-sm font-bold">
            <Lock className="h-4 w-4 text-primary" /> Platform Security &
            Maintenance
          </h2>

          <div className="space-y-4 text-xs">
            <div className="flex items-center justify-between rounded-lg border bg-muted/30 p-3">
              <div>
                <p className="font-semibold text-foreground">
                  Maintenance Mode
                </p>
                <p className="text-muted-foreground">
                  Restrict platform access to Super Admins only
                </p>
              </div>
              <input
                type="checkbox"
                checked={settings.maintenanceMode}
                onChange={(e) =>
                  updateSettings({ maintenanceMode: e.target.checked })
                }
                className="h-4 w-4 cursor-pointer rounded border-border text-primary focus:ring-primary"
              />
            </div>

            <div className="space-y-1 rounded-lg border bg-primary/10 p-3 text-primary">
              <p className="flex items-center gap-1.5 font-bold">
                <Shield className="h-4 w-4" /> Live Hot-Reload Active
              </p>
              <p className="text-[11px] text-muted-foreground">
                Settings update in real-time without requiring application
                rebuild or downtime.
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
