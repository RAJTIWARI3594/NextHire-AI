"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  ShieldCheck,
  Users,
  Briefcase,
  Activity,
  Server,
  UserCheck,
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
import {
  fetchAdminMetrics,
  fetchRecruiterRequests,
} from "@/services/admin-service";

export default function SuperAdminOverviewPage() {
  const {
    metrics,
    users,
    recruiters,
    setMetrics,
    setRecruiters,
  } = useAdminStore();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    Promise.all([fetchAdminMetrics(), fetchRecruiterRequests()])
      .then(([nextMetrics, nextRecruiters]) => {
        if (!active) return;
        setMetrics(nextMetrics);
        setRecruiters(nextRecruiters);
      })
      .catch((loadError: unknown) => {
        if (active) {
          setError((loadError as Error)?.message || "Admin dashboard data could not be loaded.");
        }
      })
      .finally(() => {
        if (active) setIsLoading(false);
      });
    return () => {
      active = false;
    };
  }, [setMetrics, setRecruiters]);

  const pendingRecruiters = useMemo(
    () => recruiters.filter((recruiter) => recruiter.status === "pending"),
    [recruiters]
  );

  const consoles = [
    { label: "Security Center", href: "/admin/security", icon: Lock },
    { label: "Infrastructure", href: "/admin/monitoring", icon: Activity },
    { label: "Performance", href: "/admin/performance", icon: Gauge },
    { label: "System Alerts", href: "/admin/alerts", icon: Bell },
    { label: "Background Jobs", href: "/admin/background-jobs", icon: Cpu },
    { label: "Backup Vault", href: "/admin/backups", icon: ShieldCheck },
    { label: "Deployments", href: "/admin/deployments", icon: Server },
  ];

  return (
    <div className="mx-auto max-w-7xl space-y-8 p-4 sm:p-8">
      <div className="flex flex-col items-start justify-between gap-6 rounded-2xl border border-border/60 bg-gradient-to-r from-primary/5 via-card to-transparent p-6 shadow-xl md:flex-row md:items-center md:p-8">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Badge variant="accent">Admin Console</Badge>
            <Badge
              variant={!isLoading && !error ? "success" : "secondary"}
            >
              {isLoading ? "Loading database metrics" : error ? "Data unavailable" : "Database connected"}
            </Badge>
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight">
            NextHire AI Platform Operations
          </h1>
          <p className="max-w-xl text-sm text-muted-foreground">
            Manage registered users, verify recruiters, and review recorded
            platform activity. Only figures stored in the database are shown.
          </p>
          {error && (
            <p role="alert" className="text-sm text-destructive">{error}</p>
          )}
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

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <Card className="border-border/60 p-5">
          <span className="text-xs font-semibold uppercase text-muted-foreground">
            Total Students
          </span>
          <p className="mt-2 text-2xl font-extrabold text-primary">
            {isLoading ? "…" : metrics.totalStudents.toLocaleString()}
          </p>
          <p className="mt-1 text-[10px] text-muted-foreground">
            Registered student accounts
          </p>
        </Card>

        <Card className="border-border/60 p-5">
          <span className="text-xs font-semibold uppercase text-muted-foreground">
            Total Recruiters
          </span>
          <p className="mt-2 text-2xl font-extrabold text-primary">
            {isLoading ? "…" : metrics.totalRecruiters.toLocaleString()}
          </p>
          <p className="mt-1 text-[10px] text-muted-foreground">
            Registered recruiter accounts
          </p>
        </Card>

        <Card className="border-emerald-500/20 p-5">
          <span className="text-xs font-semibold uppercase text-muted-foreground">
            Recorded USD Payments
          </span>
          <p className="mt-2 text-2xl font-extrabold text-emerald-400">
            {isLoading ? "…" : `$${metrics.monthlyRevenueUsd.toLocaleString()}`}
          </p>
          <p className="mt-1 text-[10px] text-muted-foreground">
            Successful payments this month
          </p>
        </Card>

        <Card className="border-pink-500/20 p-5">
          <span className="text-xs font-semibold uppercase text-muted-foreground">
            Daily AI Sessions
          </span>
          <p className="mt-2 text-2xl font-extrabold text-pink-400">
            {isLoading ? "…" : metrics.dailyAiSessions.toLocaleString()}
          </p>
          <p className="mt-1 text-[10px] text-muted-foreground">
            Sessions recorded today
          </p>
        </Card>
      </div>

      <div>
        <h2 className="mb-3 flex items-center gap-2 text-lg font-bold tracking-tight">
          <Server className="h-5 w-5 text-primary" /> Admin Consoles
        </h2>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 lg:grid-cols-7">
          {consoles.map((nav) => {
            const Icon = nav.icon;
            return (
              <Link key={nav.label} href={nav.href}>
                <Card className="group cursor-pointer space-y-2 border-border/60 p-4 text-center transition-all hover:border-primary/30 hover:shadow-lg">
                  <Icon className="mx-auto h-5 w-5 text-primary transition-transform group-hover:scale-110" />
                  <p className="text-xs font-extrabold">{nav.label}</p>
                  <p className="text-[9px] font-semibold text-muted-foreground">
                    Open console
                  </p>
                </Card>
              </Link>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
        {[
          { label: "User Management", href: "/admin/users", icon: Users, count: users.length },
          { label: "Recruiter Verification", href: "/admin/recruiters", icon: UserCheck, count: pendingRecruiters.length },
          { label: "Job Listings", href: "/admin/jobs", icon: Briefcase, count: metrics.totalJobs },
          { label: "Revenue Analytics", href: "/admin/analytics", icon: BarChart3, count: `$${metrics.monthlyRevenueUsd.toLocaleString()}` },
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

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
        <Card className="space-y-4 border-border/60 p-6 lg:col-span-7">
          <div className="flex items-center justify-between border-b pb-3">
            <h2 className="flex items-center gap-2 text-sm font-bold">
              <UserCheck className="h-4 w-4 text-primary" /> Pending Recruiter Approvals
            </h2>
            <Link
              href="/admin/recruiters"
              className="text-xs font-semibold text-primary hover:underline"
            >
              View All Queue
            </Link>
          </div>
          {pendingRecruiters.length === 0 ? (
            <p className="py-6 text-center text-sm text-muted-foreground">
              No pending recruiter verification requests.
            </p>
          ) : (
            <div className="space-y-3 text-xs">
              {pendingRecruiters.map((recruiter) => (
                <div
                  key={recruiter.id}
                  className="flex items-center justify-between rounded-xl border bg-card/60 p-4"
                >
                  <div>
                    <p className="font-bold text-foreground">{recruiter.recruiterName}</p>
                    <p className="text-muted-foreground">
                      {recruiter.companyName} • {recruiter.email}
                    </p>
                  </div>
                  <Badge variant="outline">Pending</Badge>
                </div>
              ))}
            </div>
          )}
        </Card>

        <Card className="space-y-4 border-border/60 p-6 lg:col-span-5">
          <div className="border-b pb-3">
            <h2 className="flex items-center gap-2 text-sm font-bold">
              <Activity className="h-4 w-4 text-primary" /> Recorded Platform Data
            </h2>
          </div>
          <div className="space-y-3 text-xs">
            <div className="rounded-lg border bg-card/60 p-3">
              <p className="font-semibold">Companies</p>
              <p className="mt-1 text-lg font-bold">
                {isLoading ? "…" : metrics.totalCompanies.toLocaleString()}
              </p>
            </div>
            <div className="rounded-lg border bg-card/60 p-3">
              <p className="font-semibold">Job applications</p>
              <p className="mt-1 text-lg font-bold">
                {isLoading ? "…" : metrics.totalApplications.toLocaleString()}
              </p>
            </div>
            <p className="text-[10px] text-muted-foreground">
              Infrastructure uptime, CPU, memory and latency are not inferred
              from application database counters.
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
}
