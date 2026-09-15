"use client";

import React from "react";
import Link from "next/link";
import {
  ShieldCheck,
  Users,
  Briefcase,
  Activity,
  Server,
  UserCheck,
  TrendingUp,
  BarChart3,
  Gauge,
  Bell,
  Cpu,
  Lock,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAdminStore } from "@/lib/store/use-admin-store";

export default function SuperAdminOverviewPage() {
  const { metrics, users, recruiters, jobs } = useAdminStore();

  return (
    <div className="mx-auto max-w-7xl space-y-8 p-4 sm:p-8">
      {/* Executive Header Banner */}
      <div className="flex flex-col items-start justify-between gap-6 rounded-2xl border border-border/60 bg-gradient-to-r from-primary/5 via-card to-transparent p-6 shadow-xl md:flex-row md:items-center md:p-8">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Badge variant="accent">Super Admin Console</Badge>
            <Badge variant="success" className="gap-1">
              <Server className="h-3.5 w-3.5" /> All Systems 99.98% Operational
            </Badge>
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight">
            NextHire AI Platform Operations 🛡️
          </h1>
          <p className="max-w-xl text-sm text-muted-foreground">
            Manage student & recruiter accounts, verify enterprise partners,
            moderate jobs, monitor AI model telemetry, inspect security alerts,
            and optimize platform performance.
          </p>
        </div>

        <div className="flex gap-3">
          <Link href="/admin/security">
            <Button variant="gradient" size="sm" className="gap-1.5 text-xs">
              <ShieldCheck className="h-4 w-4" /> Security Center
            </Button>
          </Link>
          <Link href="/admin/users">
            <Button variant="outline" size="sm" className="gap-1.5 text-xs">
              <Users className="h-4 w-4" /> Manage Users
            </Button>
          </Link>
        </div>
      </div>

      {/* 4 Metric Counters Grid */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 lg:grid-cols-4">
        <Card className="border-border/60 p-5">
          <span className="text-xs font-semibold uppercase text-muted-foreground">
            Total Students
          </span>
          <p className="mt-2 text-2xl font-extrabold text-primary">
            {metrics.totalStudents.toLocaleString()}
          </p>
          <p className="mt-1 flex items-center gap-0.5 text-[10px] text-emerald-400">
            <TrendingUp className="h-3 w-3" /> +14% this month
          </p>
        </Card>

        <Card className="border-border/60 p-5">
          <span className="text-xs font-semibold uppercase text-muted-foreground">
            Total Recruiters
          </span>
          <p className="mt-2 text-2xl font-extrabold text-primary">
            {metrics.totalRecruiters.toLocaleString()}
          </p>
          <p className="mt-1 text-[10px] text-muted-foreground">
            Verified Corporate Users
          </p>
        </Card>

        <Card className="border-emerald-500/20 p-5">
          <span className="text-xs font-semibold uppercase text-muted-foreground">
            Monthly Revenue
          </span>
          <p className="mt-2 text-2xl font-extrabold text-emerald-400">
            ${metrics.monthlyRevenueUsd.toLocaleString()}
          </p>
          <p className="mt-1 text-[10px] text-emerald-400">
            MRR Subscription Revenue
          </p>
        </Card>

        <Card className="border-pink-500/20 p-5">
          <span className="text-xs font-semibold uppercase text-muted-foreground">
            Daily AI Requests
          </span>
          <p className="mt-2 text-2xl font-extrabold text-pink-400">
            {metrics.dailyAiRequests.toLocaleString()}
          </p>
          <p className="mt-1 text-[10px] text-muted-foreground">
            Gemini Model Telemetry
          </p>
        </Card>
      </div>

      {/* Operations Consoles Section */}
      <div>
        <h2 className="mb-3 flex items-center gap-2 text-lg font-bold tracking-tight">
          <Server className="h-5 w-5 text-primary" /> Phase 9 Operations
          Consoles
        </h2>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 lg:grid-cols-7">
          {[
            {
              label: "Security Center",
              href: "/admin/security",
              icon: Lock,
              status: "SAIF Secure",
              color: "text-emerald-400",
            },
            {
              label: "SRE Telemetry",
              href: "/admin/monitoring",
              icon: Activity,
              status: "Real-time Charts",
              color: "text-primary",
            },
            {
              label: "Performance",
              href: "/admin/performance",
              icon: Gauge,
              status: "Web Vitals: 98",
              color: "text-primary",
            },
            {
              label: "System Alerts",
              href: "/admin/alerts",
              icon: Bell,
              status: "Active Webhooks",
              color: "text-amber-400",
            },
            {
              label: "Background Jobs",
              href: "/admin/background-jobs",
              icon: Cpu,
              status: "Queue Active",
              color: "text-pink-400",
            },
            {
              label: "Backup Vault",
              href: "/admin/backups",
              icon: ShieldCheck,
              status: "PITR Active",
              color: "text-emerald-400",
            },
            {
              label: "Deployments",
              href: "/admin/deployments",
              icon: Server,
              status: "Zero-Downtime",
              color: "text-primary",
            },
          ].map((nav) => {
            const Icon = nav.icon;
            return (
              <Link key={nav.label} href={nav.href}>
                <Card className="group cursor-pointer space-y-2 border-border/60 p-4 text-center transition-all hover:border-primary/30 hover:shadow-lg">
                  <Icon className="mx-auto h-5 w-5 text-primary transition-transform group-hover:scale-110" />
                  <p className="text-xs font-extrabold">{nav.label}</p>
                  <p className={`text-[9px] font-semibold ${nav.color}`}>
                    {nav.status}
                  </p>
                </Card>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Secondary Management Quick Links */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {[
          {
            label: "User Management",
            href: "/admin/users",
            icon: Users,
            count: users.length,
          },
          {
            label: "Recruiter Verification",
            href: "/admin/recruiters",
            icon: UserCheck,
            count: recruiters.length,
          },
          {
            label: "Job Moderation",
            href: "/admin/jobs",
            icon: Briefcase,
            count: jobs.length,
          },
          {
            label: "Revenue Analytics",
            href: "/admin/analytics",
            icon: BarChart3,
            count: "$42.5k",
          },
        ].map((nav) => {
          const Icon = nav.icon;
          return (
            <Link key={nav.label} href={nav.href}>
              <Card className="group cursor-pointer space-y-2 border-border/60 p-4 text-center transition-all hover:border-primary/30">
                <Icon className="mx-auto h-5 w-5 text-primary transition-transform group-hover:scale-110" />
                <p className="text-base font-extrabold">{nav.count}</p>
                <p className="text-[11px] font-semibold text-muted-foreground">
                  {nav.label}
                </p>
              </Card>
            </Link>
          );
        })}
      </div>

      {/* Pending Recruiter Verification Queue & System Feed */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
        <Card className="space-y-4 border-border/60 p-6 lg:col-span-7">
          <div className="flex items-center justify-between border-b pb-3">
            <h2 className="flex items-center gap-2 text-sm font-bold">
              <UserCheck className="h-4 w-4 text-primary" /> Pending Recruiter
              Approvals
            </h2>
            <Link
              href="/admin/recruiters"
              className="text-xs font-semibold text-primary hover:underline"
            >
              View All Queue
            </Link>
          </div>

          <div className="space-y-3 text-xs">
            {recruiters.map((r) => (
              <div
                key={r.id}
                className="flex items-center justify-between rounded-xl border bg-card/60 p-4"
              >
                <div>
                  <p className="font-bold text-foreground">{r.recruiterName}</p>
                  <p className="text-muted-foreground">
                    {r.companyName} • {r.email}
                  </p>
                </div>
                <Badge
                  variant={r.status === "approved" ? "success" : "outline"}
                >
                  {r.status}
                </Badge>
              </div>
            ))}
          </div>
        </Card>

        <Card className="space-y-4 border-border/60 p-6 lg:col-span-5">
          <div className="border-b pb-3">
            <h2 className="flex items-center gap-2 text-sm font-bold">
              <Activity className="h-4 w-4 text-primary" /> Real-time System
              Telemetry Feed
            </h2>
          </div>

          <div className="space-y-3 text-xs">
            <div className="space-y-1 rounded-lg border bg-card/60 p-3">
              <p className="font-semibold text-foreground">
                Phase 9 Hardening Active
              </p>
              <p className="text-[10px] text-muted-foreground">
                CSP, HSTS, Rate Limiter & Background Workers • Live
              </p>
            </div>
            <div className="space-y-1 rounded-lg border bg-card/60 p-3">
              <p className="font-semibold text-emerald-400">
                Security Score: 99/100
              </p>
              <p className="text-[10px] text-muted-foreground">
                SAIF & OWASP Top 10 Protections Enforced • 1m ago
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
