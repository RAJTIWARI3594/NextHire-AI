"use client";

import React from "react";
import Link from "next/link";
import { ShieldCheck, Lock, UserCheck, Eye, AlertTriangle, ExternalLink } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function SecurityCenterPage() {
  const controls = [
    {
      title: "Row Level Security",
      detail: "All 52 public tables currently have RLS enabled.",
      status: "Enabled",
      icon: Lock,
    },
    {
      title: "Recruiter verification gate",
      detail: "Unverified recruiters cannot browse applicants or manage job listings.",
      status: "Enabled",
      icon: UserCheck,
    },
    {
      title: "Role and suspension guards",
      detail: "Database triggers protect privileged role and account suspension fields.",
      status: "Enabled",
      icon: ShieldCheck,
    },
    {
      title: "Candidate directory views",
      detail: "Recruiter views use security_invoker and expose only applicant display data.",
      status: "Enabled",
      icon: Eye,
    },
    {
      title: "Telemetry endpoint",
      detail: "Infrastructure metrics endpoint requires an authenticated, active admin profile.",
      status: "Protected",
      icon: Lock,
    },
  ];

  return (
    <div className="mx-auto max-w-6xl space-y-6 p-4 sm:p-8">
      <div>
        <Badge variant="accent">Security configuration</Badge>
        <h1 className="mt-2 text-2xl font-bold tracking-tight">
          Security Controls & Remediation
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          This page lists controls verified in the current database and
          application code. It does not display simulated threat events, fake
          IP blocks, or unsupported compliance certifications.
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        {controls.map((control) => {
          const Icon = control.icon;
          return (
            <Card key={control.title} className="flex gap-4 border-border/60 p-5">
              <Icon className="mt-1 h-5 w-5 shrink-0 text-emerald-500" />
              <div className="min-w-0 flex-1 space-y-1">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <h2 className="text-sm font-semibold">{control.title}</h2>
                  <Badge variant="success">{control.status}</Badge>
                </div>
                <p className="text-xs text-muted-foreground">{control.detail}</p>
              </div>
            </Card>
          );
        })}
      </div>

      <Card className="space-y-3 border-amber-500/30 p-5">
        <div className="flex items-center gap-2">
          <AlertTriangle className="h-5 w-5 text-amber-500" />
          <h2 className="text-sm font-bold">Action still required</h2>
          <Badge variant="outline">Supabase Auth</Badge>
        </div>
        <p className="text-sm text-muted-foreground">
          Supabase Auth leaked-password protection is currently disabled.
          Enable it in the Supabase Dashboard under Authentication → Sign In /
          Providers → Email → Password Security. The current project integration
          does not expose this Auth configuration control.
        </p>
        <Link
          href="https://supabase.com/dashboard/project/molfpghzccbssmjfktac/auth/providers"
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-1 text-sm font-semibold text-primary hover:underline"
        >
          Open Supabase Auth settings <ExternalLink className="h-3.5 w-3.5" />
        </Link>
      </Card>

      <p className="text-xs text-muted-foreground">
        CAPTCHA/Turnstile, persistent IP blocking, MFA enforcement, and
        centralized security-event alerting are not reported as active here
        because an operational integration was not verified.
      </p>
    </div>
  );
}
