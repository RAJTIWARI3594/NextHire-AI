"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  FileText,
  Bot,
  Code2,
  Trophy,
  Briefcase,
  Sparkles,
  ArrowUpRight,
  Target,
  Clock,
  CheckCircle2,
  Bookmark,
  Bell,
  Coins,
  Zap,
  Flame,
  Award,
  Video,
} from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuthStore } from "@/lib/store/use-auth-store";
import { fetchStudentDashboardData } from "@/services/student-dashboard-service";
import { Skeleton } from "@/components/ui/skeleton";

export default function StudentDashboardPage() {
  const { user, profile } = useAuthStore();
  const [data, setData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      if (user?.id) {
        setIsLoading(true);
        const res = await fetchStudentDashboardData(user.id);
        setData(res);
        setIsLoading(false);
      }
    }
    loadData();
  }, [user?.id]);

  const studentName =
    profile?.full_name ||
    user?.user_metadata?.full_name ||
    (user?.email || "").split("@")[0] ||
    "Student";
  const metrics = data?.metrics || {
    profileCompletion: 85,
    atsScore: 88,
    totalApplications: 12,
    interviewInvitations: 3,
    codingStreak: 5,
    coinsEarned: 350,
    leaderboardRank: 14,
    savedJobsCount: 4,
    unreadNotificationsCount: 2,
  };

  return (
    <div className="mx-auto max-w-7xl space-y-8 p-4 sm:p-8">
      {/* Welcome Banner */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col items-start justify-between gap-6 rounded-xl border border-border/60 bg-card p-6 shadow-elevation-1 md:flex-row md:items-center md:p-8"
      >
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Badge variant="default">Student Workspace</Badge>
            <Badge variant="success">
              <Sparkles className="mr-1 h-3 w-3" /> ATS Score:{" "}
              {metrics.atsScore}/100
            </Badge>
          </div>
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
            Welcome back, {studentName}
          </h1>
          <p className="max-w-xl text-sm text-muted-foreground">
            Your ATS resume is optimized. 4 tech recruiters viewed your
            candidate profile this week.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <Link href="/dashboard/profile">
            <Button variant="outline" size="sm">
              Edit Profile
            </Button>
          </Link>
          <Link href="/dashboard/ai-interview">
            <Button size="sm" className="gap-1.5">
              <Bot className="h-4 w-4" /> Start AI Interview
            </Button>
          </Link>
        </div>
      </motion.div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
        <Card>
          <CardHeader className="p-4">
            <span className="text-[11px] font-medium uppercase text-muted-foreground">
              Profile Completion
            </span>
            <div className="mt-1.5 text-2xl font-bold text-primary">
              {metrics.profileCompletion}%
            </div>
            <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-muted">
              <div
                className="h-full rounded-full bg-primary transition-all"
                style={{ width: `${metrics.profileCompletion}%` }}
              />
            </div>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader className="p-4">
            <span className="text-[11px] font-medium uppercase text-muted-foreground">
              ATS Score
            </span>
            <div className="mt-1.5 text-2xl font-bold text-primary">
              {metrics.atsScore}/100
            </div>
            <p className="mt-1 text-[10px] font-medium text-emerald-500">
              Top 10% Match
            </p>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader className="p-4">
            <span className="text-[11px] font-medium uppercase text-muted-foreground">
              Applications
            </span>
            <div className="mt-1.5 text-2xl font-bold">
              {metrics.totalApplications}
            </div>
            <p className="mt-1 text-[10px] text-muted-foreground">
              Active Pipeline
            </p>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader className="p-4">
            <span className="text-[11px] font-medium uppercase text-muted-foreground">
              Interviews
            </span>
            <div className="mt-1.5 text-2xl font-bold text-emerald-500">
              {metrics.interviewInvitations}
            </div>
            <p className="mt-1 text-[10px] font-medium text-emerald-500">
              Invitations Active
            </p>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader className="p-4">
            <span className="flex items-center gap-1 text-[11px] font-medium uppercase text-muted-foreground">
              <Flame className="h-3 w-3 text-amber-500" /> Streak
            </span>
            <div className="mt-1.5 text-2xl font-bold text-amber-500">
              {metrics.codingStreak} Days
            </div>
            <p className="mt-1 text-[10px] text-muted-foreground">
              Keep it going!
            </p>
          </CardHeader>
        </Card>
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="mb-3 flex items-center gap-2 text-sm font-semibold tracking-tight">
          <Zap className="h-4 w-4 text-primary" /> Quick Actions
        </h2>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
          {[
            {
              href: "/dashboard/resume",
              icon: FileText,
              label: "Build Resume",
            },
            {
              href: "/dashboard/ai-interview",
              icon: Bot,
              label: "AI Interview",
            },
            { href: "/dashboard/coding", icon: Code2, label: "Practice Code" },
            {
              href: "/dashboard/jobs",
              icon: Briefcase,
              label: "Apply to Jobs",
            },
            {
              href: "/dashboard/applications",
              icon: CheckCircle2,
              label: "Applications",
            },
          ].map((action) => (
            <Link key={action.href} href={action.href}>
              <Card className="cursor-pointer p-4 text-center transition-colors hover:bg-muted/50">
                <action.icon className="mx-auto h-5 w-5 text-primary" />
                <p className="mt-2 text-xs font-medium">{action.label}</p>
              </Card>
            </Link>
          ))}
        </div>
      </div>

      {/* Career Progress & Activity */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Card className="space-y-5 p-6 lg:col-span-1">
          <div className="border-b border-border/40 pb-3">
            <h2 className="flex items-center gap-2 text-sm font-semibold">
              <Target className="h-4 w-4 text-primary" /> Placement Readiness
            </h2>
            <p className="text-xs text-muted-foreground">
              AI Career Track Indicators
            </p>
          </div>

          <div className="space-y-4">
            {[
              { label: "Resume Complete", value: "90%", width: "90%" },
              { label: "Profile Details", value: "85%", width: "85%" },
              { label: "Verified Skills", value: "75%", width: "75%" },
              { label: "Coding Challenges", value: "80%", width: "80%" },
              { label: "AI Interview Readiness", value: "92%", width: "92%" },
            ].map((item, i) => (
              <div key={item.label} className="space-y-1.5">
                <div className="flex justify-between text-xs font-medium">
                  <span>{item.label}</span>
                  <span className="text-primary">{item.value}</span>
                </div>
                <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: item.width }}
                    transition={{ duration: 0.8, delay: i * 0.1 }}
                    className="h-full rounded-full bg-primary"
                  />
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card className="space-y-5 p-6 lg:col-span-2">
          <div className="flex items-center justify-between border-b border-border/40 pb-3">
            <h2 className="flex items-center gap-2 text-sm font-semibold">
              <Clock className="h-4 w-4 text-primary" /> Recent Activity
            </h2>
            <Link
              href="/dashboard/notifications"
              className="text-xs text-primary hover:underline"
            >
              View All
            </Link>
          </div>

          <div className="space-y-3.5">
            {[
              {
                title: "Applied for Frontend Engineer at Vercel Partner Labs",
                time: "2 hours ago",
                icon: Briefcase,
              },
              {
                title:
                  "Completed AI Mock Interview: React 19 & Next.js Architecture (Score 8.8/10)",
                time: "Yesterday",
                icon: Bot,
              },
              {
                title: "Solved 3 Medium Coding Questions on Data Structures",
                time: "2 days ago",
                icon: Code2,
              },
              {
                title: "Earned 'ATS Resume Pro' Achievement Badge",
                time: "3 days ago",
                icon: Award,
              },
            ].map((activity) => {
              const Icon = activity.icon;
              return (
                <div
                  key={activity.title}
                  className="flex items-start gap-3 text-xs"
                >
                  <div className="mt-0.5 shrink-0 rounded-lg bg-primary/10 p-2 text-primary">
                    <Icon className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="font-medium text-foreground">
                      {activity.title}
                    </p>
                    <p className="mt-0.5 text-[11px] text-muted-foreground">
                      {activity.time}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      </div>
    </div>
  );
}
