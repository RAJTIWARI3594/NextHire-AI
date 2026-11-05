"use client";

import React from "react";
import Link from "next/link";
import { Database, ExternalLink, ShieldCheck, AlertTriangle } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function AdminBackupsDisasterRecoveryPage() {
  return (
    <div className="mx-auto max-w-5xl space-y-6 p-4 sm:p-8">
      <div>
        <Badge variant="accent">Data Protection</Badge>
        <h1 className="mt-2 text-2xl font-bold tracking-tight">
          Database Backup & Recovery
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Backup history is not connected to the application dashboard. No
          backup file, checksum, or recovery point is marked as verified here
          unless Supabase reports it.
        </p>
      </div>

      <Card className="space-y-3 border-amber-500/30 p-6">
        <div className="flex items-center gap-2">
          <AlertTriangle className="h-5 w-5 text-amber-500" />
          <h2 className="text-sm font-bold">Backup status not verified</h2>
          <Badge variant="outline">Manual check required</Badge>
        </div>
        <p className="text-sm text-muted-foreground">
          Database backups and point-in-time recovery settings must be checked
          in Supabase. This interface cannot create or restore a backup.
        </p>
        <Link
          href="https://supabase.com/dashboard/project/molfpghzccbssmjfktac/settings/database"
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-1 text-sm font-semibold text-primary hover:underline"
        >
          Open Supabase database settings <ExternalLink className="h-3.5 w-3.5" />
        </Link>
      </Card>

      <Card className="flex items-start gap-3 border-border/60 p-5">
        <ShieldCheck className="mt-0.5 h-5 w-5 text-primary" />
        <div className="space-y-1">
          <h2 className="text-sm font-semibold">Before restoring a backup</h2>
          <p className="text-xs text-muted-foreground">
            Verify the snapshot date and project, confirm a separate recovery
            plan, and test restores in a non-production environment first.
            A restore can overwrite current production data.
          </p>
        </div>
      </Card>

      <p className="text-xs text-muted-foreground">
        The previous sample backup rows and local-only “verify” buttons have
        been removed because they did not operate on real backup artifacts.
      </p>
    </div>
  );
}
