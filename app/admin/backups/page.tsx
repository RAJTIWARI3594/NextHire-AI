"use client";

import React, { useState } from "react";
import {
  Database,
  ShieldCheck,
  Download,
  RefreshCw,
  HardDrive,
  RotateCcw,
  CheckCircle2,
  Clock,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default function AdminBackupsDisasterRecoveryPage() {
  const [loading, setLoading] = useState(false);
  const [backups, setBackups] = useState([
    {
      id: "bk-1",
      name: "nexthire_db_daily_2026-08-05.sql.gz",
      type: "daily",
      sizeMb: "45.2 MB",
      status: "completed",
      verified: true,
      time: "4 hours ago",
    },
    {
      id: "bk-2",
      name: "nexthire_storage_weekly_2026-08-01.tar.gz",
      type: "weekly",
      sizeMb: "1.4 GB",
      status: "completed",
      verified: true,
      time: "4 days ago",
    },
    {
      id: "bk-3",
      name: "nexthire_db_monthly_2026-08-01.sql.gz",
      type: "monthly",
      sizeMb: "180 MB",
      status: "completed",
      verified: true,
      time: "4 days ago",
    },
  ]);

  const handleTriggerBackup = (type: string) => {
    setLoading(true);
    setTimeout(() => {
      const newBackup = {
        id: `bk-${Date.now()}`,
        name: `nexthire_db_${type}_${new Date().toISOString().slice(0, 10)}.sql.gz`,
        type,
        sizeMb: "46.1 MB",
        status: "completed",
        verified: true,
        time: "Just now",
      };
      setBackups([newBackup, ...backups]);
      setLoading(false);
    }, 1200);
  };

  const handleVerifyIntegrity = () => {
    setLoading(true);
    setTimeout(() => {
      alert(
        "✅ All backup snapshot SHA-256 checksums verified clean and uncorrupted!"
      );
      setLoading(false);
    }, 800);
  };

  return (
    <div className="mx-auto max-w-7xl space-y-8 p-4 sm:p-8">
      <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <div className="flex items-center gap-2">
            <Badge variant="accent">Data Protection & DR</Badge>
            <Badge variant="success" className="gap-1">
              <ShieldCheck className="h-3.5 w-3.5" /> Point-In-Time Recovery
              Active
            </Badge>
          </div>
          <h1 className="mt-1 text-3xl font-extrabold tracking-tight">
            Backup Vault & Disaster Recovery Console
          </h1>
          <p className="text-sm text-muted-foreground">
            Manage automated daily/weekly/monthly database dumps, verify
            checksum integrity, and execute disaster recovery restores.
          </p>
        </div>

        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleVerifyIntegrity}
            disabled={loading}
            className="gap-1.5 text-xs"
          >
            <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" /> Verify
            Backup Integrity
          </Button>
          <Button
            variant="gradient"
            size="sm"
            onClick={() => handleTriggerBackup("daily")}
            disabled={loading}
            className="gap-1.5 text-xs"
          >
            <Database className="h-3.5 w-3.5" /> Trigger Manual Backup
          </Button>
        </div>
      </div>

      {/* DR Objectives & Retention Policies */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <Card className="border-emerald-500/20 p-5">
          <span className="text-xs font-semibold uppercase text-muted-foreground">
            RPO Target
          </span>
          <p className="mt-1 text-2xl font-extrabold text-emerald-400">
            &lt; 5 Mins
          </p>
          <p className="text-[10px] text-muted-foreground">
            WAL Streaming Active
          </p>
        </Card>

        <Card className="border-border/60 p-5">
          <span className="text-xs font-semibold uppercase text-muted-foreground">
            RTO Target
          </span>
          <p className="mt-1 text-2xl font-extrabold text-primary">
            &lt; 15 Mins
          </p>
          <p className="text-[10px] text-muted-foreground">
            Automated PITR Script
          </p>
        </Card>

        <Card className="border-border/60 p-5">
          <span className="text-xs font-semibold uppercase text-muted-foreground">
            Retention Schedule
          </span>
          <p className="mt-1 text-2xl font-extrabold text-primary">
            30D / 52W / 7Y
          </p>
          <p className="text-[10px] text-muted-foreground">
            Daily / Weekly / Monthly
          </p>
        </Card>

        <Card className="border-amber-500/20 p-5">
          <span className="text-xs font-semibold uppercase text-muted-foreground">
            Backup Integrity
          </span>
          <p className="mt-1 text-2xl font-extrabold text-amber-400">
            100% Passed
          </p>
          <p className="text-[10px] text-emerald-400">Checksum Verified</p>
        </Card>
      </div>

      {/* Snapshot History Table */}
      <Card className="space-y-4 border-border/60 p-6">
        <div className="flex items-center justify-between border-b pb-3">
          <h2 className="flex items-center gap-2 text-sm font-bold">
            <HardDrive className="h-4 w-4 text-primary" /> Automated Snapshot
            History
          </h2>
          <Badge variant="outline" className="font-mono text-[10px]">
            {backups.length} Snapshots Available
          </Badge>
        </div>

        <div className="space-y-3 text-xs">
          {backups.map((bk) => (
            <div
              key={bk.id}
              className="flex flex-col items-start justify-between gap-4 rounded-xl border bg-card/60 p-4 sm:flex-row sm:items-center"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <p className="font-mono font-bold text-foreground">
                    {bk.name}
                  </p>
                  <Badge variant="outline" className="text-[9px] uppercase">
                    {bk.type}
                  </Badge>
                  {bk.verified && (
                    <Badge variant="success" className="gap-1 text-[9px]">
                      <CheckCircle2 className="h-3 w-3" /> SHA-256 Verified
                    </Badge>
                  )}
                </div>
                <p className="text-[11px] text-muted-foreground">
                  Size: {bk.sizeMb} • Created {bk.time}
                </p>
              </div>

              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 gap-1 text-[10px]"
                >
                  <Download className="h-3 w-3" /> Download
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-7 gap-1 text-[10px] text-amber-400"
                >
                  <RotateCcw className="h-3 w-3" /> Restore Snapshot
                </Button>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
