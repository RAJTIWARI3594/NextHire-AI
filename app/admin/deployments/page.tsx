"use client";

import React from "react";
import Link from "next/link";
import { GitBranch, Rocket, ExternalLink, AlertTriangle } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function AdminDeploymentsPage() {
  return (
    <div className="mx-auto max-w-5xl space-y-6 p-4 sm:p-8">
      <div>
        <Badge variant="accent">Production Release</Badge>
        <h1 className="mt-2 text-2xl font-bold tracking-tight">
          Deployment & Release Status
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Live project and repository references. Historical releases are not
          fabricated in this page.
        </p>
      </div>

      <Card className="space-y-3 border-border/60 p-6">
        <div className="flex items-center gap-2">
          <Rocket className="h-5 w-5 text-primary" />
          <h2 className="text-sm font-bold">Current production URL</h2>
          <Badge variant="outline">Production</Badge>
        </div>
        <Link
          href="https://nexthire-ai-six.vercel.app"
          target="_blank"
          rel="noreferrer"
          className="text-sm font-semibold text-primary hover:underline"
        >
          https://nexthire-ai-six.vercel.app
        </Link>
      </Card>

      <Card className="space-y-3 border-border/60 p-6">
        <h2 className="flex items-center gap-2 text-sm font-bold">
          <GitBranch className="h-5 w-5 text-primary" />
          Source repository
        </h2>
        <Link
          href="https://github.com/RAJTIWARI3594/NextHire-AI"
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-1 text-sm font-semibold text-primary hover:underline"
        >
          GitHub: RAJTIWARI3594/NextHire-AI <ExternalLink className="h-3.5 w-3.5" />
        </Link>
        <Link
          href="https://github.com/RAJTIWARI3594/NextHire-AI/actions"
          target="_blank"
          rel="noreferrer"
          className="block text-sm font-semibold text-primary hover:underline"
        >
          View GitHub Actions runs
        </Link>
      </Card>

      <Card className="space-y-3 border-amber-500/30 p-6">
        <div className="flex items-center gap-2">
          <AlertTriangle className="h-5 w-5 text-amber-500" />
          <h2 className="text-sm font-bold">CI/CD credential blocker</h2>
          <Badge variant="outline">Not configured</Badge>
        </div>
        <p className="text-sm text-muted-foreground">
          GitHub Actions production deployment is blocked because the repository
          workflow does not have the VERCEL_TOKEN secret, and the database
          migration workflow does not have PROD_SUPABASE_DB_URL. The Vercel
          project connection may still be used directly; these missing GitHub
          secrets are not silently replaced here.
        </p>
      </Card>
    </div>
  );
}
