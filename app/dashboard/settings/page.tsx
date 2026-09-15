"use client";

import React, { useState } from "react";
import {
  Settings,
  Shield,
  Bell,
  Lock,
  Moon,
  Sun,
  Trash2,
  CheckCircle2,
} from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/shared/theme-toggle";

export default function StudentSettingsPage() {
  const [emailNotifs, setEmailNotifs] = useState(true);
  const [privacyPublic, setPrivacyPublic] = useState(true);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = () => {
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2000);
  };

  return (
    <div className="mx-auto max-w-4xl space-y-6 p-4 sm:p-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">
          Student Settings & Preferences
        </h1>
        <p className="text-sm text-muted-foreground">
          Manage your account security, notification triggers, and recruiter
          visibility settings.
        </p>
      </div>

      {savedSuccess && (
        <div className="flex items-center gap-2 rounded-lg border border-emerald-500/20 bg-emerald-500/10 p-3 text-xs font-medium text-emerald-500">
          <CheckCircle2 className="h-4 w-4 shrink-0" />
          <span>Settings saved successfully!</span>
        </div>
      )}

      {/* Notification Preferences */}
      <Card className="space-y-4 border-border/60 p-6">
        <h2 className="flex items-center gap-2 text-base font-bold">
          <Bell className="h-4 w-4 text-primary" /> Notification Preferences
        </h2>

        <div className="space-y-3 text-xs">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-semibold text-foreground">
                Email Notifications
              </p>
              <p className="text-muted-foreground">
                Receive interview invites & recruiter messages via email
              </p>
            </div>
            <input
              type="checkbox"
              checked={emailNotifs}
              onChange={(e) => setEmailNotifs(e.target.checked)}
              className="h-4 w-4 rounded border-border text-primary focus:ring-primary"
            />
          </div>
        </div>
      </Card>

      {/* Privacy Settings */}
      <Card className="space-y-4 border-border/60 p-6">
        <h2 className="flex items-center gap-2 text-base font-bold">
          <Shield className="h-4 w-4 text-primary" /> Privacy & Recruiter
          Visibility
        </h2>

        <div className="space-y-3 text-xs">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-semibold text-foreground">
                Public Profile Discovery
              </p>
              <p className="text-muted-foreground">
                Allow verified recruiters to search and view your candidate ATS
                score
              </p>
            </div>
            <input
              type="checkbox"
              checked={privacyPublic}
              onChange={(e) => setPrivacyPublic(e.target.checked)}
              className="h-4 w-4 rounded border-border text-primary focus:ring-primary"
            />
          </div>
        </div>
      </Card>

      {/* Theme Settings */}
      <Card className="space-y-4 border-pink-500/20 p-6">
        <h2 className="flex items-center gap-2 text-base font-bold">
          <Sun className="h-4 w-4 text-pink-500" /> Theme & Appearance
        </h2>

        <div className="flex items-center justify-between text-xs">
          <div>
            <p className="font-semibold text-foreground">
              Dark / Light Interface
            </p>
            <p className="text-muted-foreground">
              Toggle between high contrast dark mode and light theme
            </p>
          </div>
          <ThemeToggle />
        </div>
      </Card>

      <div className="flex items-center justify-between pt-4">
        <Button variant="destructive" size="sm" className="gap-1.5 text-xs">
          <Trash2 className="h-4 w-4" /> Delete Account
        </Button>

        <Button variant="gradient" onClick={handleSave}>
          Save Preferences
        </Button>
      </div>
    </div>
  );
}
