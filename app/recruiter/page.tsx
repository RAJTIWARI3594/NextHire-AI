"use client";

import React from "react";
import Link from "next/link";
import {
  Users,
  Trophy,
  Calendar,
  MessageSquare,
  FileCheck,
  BarChart3,
  Sparkles,
  ArrowRight,
  UserCheck,
  CheckCircle2,
  Clock,
  Building2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useRecruiterStore } from "@/lib/store/use-recruiter-store";

export default function RecruiterOverviewPage() {
  const { candidates, interviews, offers } = useRecruiterStore();

  return (
    <div className="mx-auto max-w-7xl space-y-8 p-4 sm:p-8">
      {/* Executive Header Banner */}
      <div className="flex flex-col items-start justify-between gap-6 rounded-2xl border border-indigo-500/30 bg-gradient-to-r from-indigo-950/40 via-card to-purple-950/30 p-6 shadow-xl md:flex-row md:items-center md:p-8">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Badge variant="accent">Enterprise Recruiter Portal</Badge>
            <Badge variant="success">AI Match Ranking Active</Badge>
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight">
            Hiring & Candidate Management Hub 🎯
          </h1>
          <p className="max-w-xl text-sm text-muted-foreground">
            Rank applicants with AI, schedule technical interviews, communicate
            with talent, and send offer letters.
          </p>
        </div>

        <div className="flex gap-3">
          <Link href="/recruiter/candidates">
            <Button variant="gradient" size="sm" className="gap-1.5">
              <Trophy className="h-4 w-4" /> AI Candidate Rankings
            </Button>
          </Link>
        </div>
      </div>

      {/* Quick Navigation Cards */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
        {[
          {
            label: "Ranked Candidates",
            href: "/recruiter/candidates",
            icon: UserCheck,
            count: candidates.length,
          },
          {
            label: "Interviews",
            href: "/recruiter/interviews",
            icon: Calendar,
            count: interviews.length,
          },
          {
            label: "Messages",
            href: "/recruiter/messages",
            icon: MessageSquare,
            count: 2,
          },
          {
            label: "Offers Sent",
            href: "/recruiter/offers",
            icon: FileCheck,
            count: offers.length,
          },
          {
            label: "Hiring Analytics",
            href: "/recruiter/analytics",
            icon: BarChart3,
            count: "88%",
          },
          {
            label: "Calendar",
            href: "/recruiter/calendar",
            icon: Clock,
            count: "Today",
          },
        ].map((nav) => {
          const Icon = nav.icon;
          return (
            <Link key={nav.label} href={nav.href}>
              <Card className="group cursor-pointer space-y-2 border-indigo-500/20 p-4 text-center transition-all hover:border-indigo-500/50">
                <Icon className="mx-auto h-5 w-5 text-indigo-500 transition-transform group-hover:scale-110" />
                <p className="text-base font-extrabold">{nav.count}</p>
                <p className="text-[11px] font-semibold text-muted-foreground">
                  {nav.label}
                </p>
              </Card>
            </Link>
          );
        })}
      </div>

      {/* Top AI Ranked Candidates Preview (7 cols) + Upcoming Interviews (5 cols) */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
        {/* Ranked Candidates */}
        <Card className="space-y-4 border-indigo-500/20 p-6 lg:col-span-7">
          <div className="flex items-center justify-between border-b pb-3">
            <h2 className="flex items-center gap-2 text-sm font-bold">
              <Sparkles className="h-4 w-4 text-indigo-500" /> Top AI Ranked
              Applicants
            </h2>
            <Link
              href="/recruiter/candidates"
              className="text-xs font-semibold text-indigo-400 hover:underline"
            >
              View All Candidate Rankings
            </Link>
          </div>

          <div className="space-y-3 text-xs">
            {candidates.map((c) => (
              <div
                key={c.id}
                className="space-y-2 rounded-xl border bg-card/60 p-4"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm font-bold text-foreground">
                      {c.studentName}
                    </p>
                    <p className="text-[11px] text-muted-foreground">
                      {c.jobTitle} • Applied {c.appliedDate}
                    </p>
                  </div>
                  <Badge
                    variant={c.overallScore >= 90 ? "accent" : "secondary"}
                  >
                    {c.overallScore}/100 Score
                  </Badge>
                </div>
                <p className="text-[11px] font-medium text-emerald-400">
                  {c.recommendation}
                </p>
              </div>
            ))}
          </div>
        </Card>

        {/* Scheduled Interviews */}
        <Card className="space-y-4 border-purple-500/20 p-6 lg:col-span-5">
          <div className="flex items-center justify-between border-b pb-3">
            <h2 className="flex items-center gap-2 text-sm font-bold">
              <Calendar className="h-4 w-4 text-purple-500" /> Scheduled
              Interviews
            </h2>
            <Link
              href="/recruiter/interviews"
              className="text-xs font-semibold text-purple-400 hover:underline"
            >
              Schedule New
            </Link>
          </div>

          <div className="space-y-3 text-xs">
            {interviews.map((i) => (
              <div
                key={i.id}
                className="space-y-1 rounded-xl border bg-card/60 p-4"
              >
                <div className="flex items-start justify-between">
                  <p className="font-bold text-foreground">{i.candidateName}</p>
                  <Badge variant="outline">{i.interviewType}</Badge>
                </div>
                <p className="text-[11px] text-muted-foreground">
                  {i.scheduledTime}
                </p>
                <p className="text-[11px] text-indigo-400">
                  Interviewer: {i.interviewerName}
                </p>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
