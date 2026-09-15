"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Share2,
  Globe,
  QrCode,
  Copy,
  ExternalLink,
  CheckCircle2,
  ShieldCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function PublicProfileManagerPage() {
  const [username, setUsername] = useState("rajtiwari");
  const [isPublic, setIsPublic] = useState(true);
  const [copied, setCopied] = useState(false);

  const publicUrl = `nexthire.ai/p/${username}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(`https://${publicUrl}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="mx-auto max-w-5xl space-y-6 p-4 sm:p-8">
      <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            Public Resume Profile Manager
          </h1>
          <p className="text-sm text-muted-foreground">
            Share your verified ATS resume with recruiters, hiring managers, and
            social networks.
          </p>
        </div>

        <Link href={`/p/${username}`} target="_blank">
          <Button variant="gradient" className="gap-2">
            <ExternalLink className="h-4 w-4" /> View Public Page
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Settings */}
        <Card className="space-y-4 border-border/60 p-6 lg:col-span-2">
          <h2 className="flex items-center gap-2 text-sm font-bold">
            <Globe className="h-4 w-4 text-primary" /> Profile Link & Visibility
          </h2>

          <div className="space-y-4 text-xs">
            <div className="flex items-center justify-between rounded-lg border bg-muted/30 p-3">
              <div>
                <p className="font-semibold text-foreground">
                  Public Candidate Visibility
                </p>
                <p className="text-muted-foreground">
                  Allow recruiters to discover your resume profile online
                </p>
              </div>
              <input
                type="checkbox"
                checked={isPublic}
                onChange={(e) => setIsPublic(e.target.checked)}
                className="h-4 w-4 cursor-pointer rounded border-border text-primary focus:ring-primary"
              />
            </div>

            <div className="space-y-1">
              <label className="font-semibold uppercase text-muted-foreground">
                Custom Profile Username
              </label>
              <div className="flex gap-2">
                <Input
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
                <Button
                  variant="outline"
                  onClick={handleCopy}
                  className="shrink-0 gap-1.5"
                >
                  {copied ? (
                    <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                  {copied ? "Copied" : "Copy URL"}
                </Button>
              </div>
              <p className="pt-1 text-[11px] text-muted-foreground">
                Your Public URL:{" "}
                <span className="font-mono text-primary">
                  https://{publicUrl}
                </span>
              </p>
            </div>
          </div>
        </Card>

        {/* QR Code Widget Box */}
        <Card className="space-y-4 border-border/60 p-6 text-center lg:col-span-1">
          <h2 className="flex items-center justify-center gap-2 text-sm font-bold">
            <QrCode className="h-4 w-4 text-primary" /> QR Code Share
          </h2>

          <div className="mx-auto flex h-36 w-36 items-center justify-center rounded-xl border-2 border-border/60 bg-white p-4 text-slate-900 shadow-md">
            <QrCode className="h-28 w-28 text-slate-900" />
          </div>

          <p className="text-xs text-muted-foreground">
            Scan to instantly view verified ATS resume profile on mobile
            devices.
          </p>
        </Card>
      </div>
    </div>
  );
}
