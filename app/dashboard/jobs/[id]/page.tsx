"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  Building2,
  MapPin,
  DollarSign,
  Briefcase,
  Clock,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  FileText,
  Send,
  Bookmark,
  ArrowLeft,
  ShieldCheck,
  Check,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useAuthStore } from "@/lib/store/use-auth-store";
import { useJobsStore } from "@/lib/store/use-jobs-store";
import { submitJobApplication } from "@/services/jobs-service";

export default function JobDetailsPage() {
  const router = useRouter();
  const params = useParams();
  const { profile, user } = useAuthStore();
  const { addAppliedJob } = useJobsStore();

  const jobId = (params?.id as string) || "job-1";

  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);
  const [selectedResume, setSelectedResume] = useState(
    "Master Full Stack Resume (PDF)"
  );
  const [candidateMessage, setCandidateMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [appliedSuccess, setAppliedSuccess] = useState(false);

  const handleConfirmApply = async () => {
    setIsSubmitting(true);
    const studentId = profile?.id || user?.id || "";
    await submitJobApplication({
      jobId,
      studentId,
      message: candidateMessage,
    });
    addAppliedJob(jobId);
    setIsSubmitting(false);
    setAppliedSuccess(true);
    setTimeout(() => {
      setIsApplyModalOpen(false);
      router.push("/dashboard/applications");
    }, 1500);
  };

  return (
    <div className="mx-auto max-w-5xl space-y-6 p-4 sm:p-8">
      {/* Top Bar Navigation */}
      <div className="flex items-center gap-3">
        <Link href="/dashboard/jobs">
          <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <span className="text-xs text-muted-foreground">
          Back to Job Matches
        </span>
      </div>

      {/* Main Job Card Banner */}
      <Card className="space-y-6 border-border/60 bg-gradient-to-r from-primary/5 via-card to-transparent p-6 shadow-xl md:p-8">
        <div className="flex flex-col items-start justify-between gap-4 sm:flex-row">
          <div className="flex items-start gap-4">
            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl border-2 border-border/60 bg-primary/10 text-2xl font-extrabold text-primary">
              V
            </div>

            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-2xl font-extrabold tracking-tight">
                  Senior Full Stack Engineer (Next.js & Supabase)
                </h1>
                <Badge variant="accent" className="gap-1">
                  <Sparkles className="h-3.5 w-3.5" /> 98% Candidate Match
                </Badge>
              </div>

              <div className="flex flex-wrap items-center gap-3 pt-1 text-xs text-muted-foreground">
                <Link
                  href="/company/comp-1"
                  className="flex items-center gap-1 font-bold text-foreground hover:underline"
                >
                  <Building2 className="h-3.5 w-3.5 text-primary" /> Vercel
                  Partner Labs
                </Link>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <MapPin className="h-3.5 w-3.5" /> San Francisco, CA (Remote)
                </span>
                <span>•</span>
                <span className="flex items-center gap-1 font-bold text-emerald-400">
                  <DollarSign className="h-3.5 w-3.5" /> $120,000 - $150,000 /
                  yr
                </span>
              </div>
            </div>
          </div>

          <Button
            variant="gradient"
            size="lg"
            onClick={() => setIsApplyModalOpen(true)}
            className="shrink-0 gap-2"
          >
            <Send className="h-4 w-4" /> 1-Click Apply Now
          </Button>
        </div>
      </Card>

      {/* Grid: Description (7 cols) + AI Match Analysis Sidebar (5 cols) */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
        {/* Full Job Description Pane (7 cols) */}
        <div className="space-y-6 lg:col-span-7">
          <Card className="space-y-4 border-border/60 p-6">
            <h2 className="text-base font-bold">Job Overview</h2>
            <p className="text-xs leading-relaxed text-muted-foreground">
              We are seeking an experienced Senior Full Stack Engineer to lead
              our Next.js 15 App Router platform development. You will build
              high-performance frontend interfaces using React 19, Tailwind CSS,
              and Framer Motion, while managing Supabase PostgreSQL schemas with
              strict Row Level Security (RLS) policies.
            </p>

            <h3 className="pt-2 text-xs font-bold uppercase tracking-wider text-foreground">
              Key Responsibilities
            </h3>
            <ul className="space-y-2 text-xs text-muted-foreground">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />
                <span>
                  Architect and ship production-ready Next.js 15 App Router
                  features and Server Components.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />
                <span>
                  Design normalized Supabase PostgreSQL database tables and
                  enforce Row Level Security.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />
                <span>
                  Collaborate with AI product engineers to integrate Gemini
                  voice and text models.
                </span>
              </li>
            </ul>

            <h3 className="pt-2 text-xs font-bold uppercase tracking-wider text-foreground">
              Requirements
            </h3>
            <ul className="space-y-2 text-xs text-muted-foreground">
              <li className="flex items-start gap-2">
                <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                <span>
                  3+ years of professional experience with React 19, TypeScript,
                  and modern SSR frameworks.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                <span>
                  Deep understanding of SQL, PostgreSQL triggers, and RLS
                  security policies.
                </span>
              </li>
            </ul>
          </Card>
        </div>

        {/* AI Match Analysis Sidebar (5 cols) */}
        <div className="space-y-6 lg:col-span-5">
          <Card className="space-y-4 border-border/60 p-6">
            <h2 className="flex items-center gap-2 text-sm font-bold">
              <Sparkles className="h-4 w-4 text-primary" /> AI Resume Match
              Breakdown
            </h2>

            <div className="space-y-3 text-xs">
              <div className="flex items-center justify-between rounded-lg border bg-primary/10 p-3">
                <span className="font-semibold text-foreground">
                  ATS Score Match
                </span>
                <span className="text-base font-extrabold text-primary">
                  98 / 100
                </span>
              </div>

              <div className="space-y-1">
                <span className="font-semibold text-emerald-400">
                  Matching Required Skills:
                </span>
                <div className="flex flex-wrap gap-1 pt-1">
                  {[
                    "Next.js 15",
                    "React 19",
                    "TypeScript",
                    "PostgreSQL",
                    "Tailwind CSS",
                  ].map((s) => (
                    <Badge key={s} variant="outline" className="text-[10px]">
                      {s}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="space-y-1">
                <span className="font-semibold text-amber-400">
                  Recommended Additions:
                </span>
                <p className="text-[11px] leading-relaxed text-muted-foreground">
                  Mentioning Redis caching and Docker containerization could
                  increase your match to 100%.
                </p>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* 1-Click Application Modal */}
      {isApplyModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 p-4 backdrop-blur-sm">
          <Card className="w-full max-w-lg space-y-4 border-border/60 p-6 shadow-2xl">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="flex items-center gap-2 text-base font-bold">
                <Send className="h-4 w-4 text-primary" /> Submit Job Application
              </h3>
              <button
                onClick={() => setIsApplyModalOpen(false)}
                className="text-muted-foreground hover:text-foreground"
              >
                ×
              </button>
            </div>

            {appliedSuccess ? (
              <div className="space-y-2 py-8 text-center text-emerald-400">
                <Check className="mx-auto h-10 w-10 text-emerald-500" />
                <p className="text-base font-bold">
                  Application Submitted Successfully!
                </p>
                <p className="text-xs text-muted-foreground">
                  Redirecting to your Applications Tracker...
                </p>
              </div>
            ) : (
              <div className="space-y-4 text-xs">
                <div className="space-y-1">
                  <label className="font-semibold uppercase text-muted-foreground">
                    Select Resume
                  </label>
                  <select
                    value={selectedResume}
                    onChange={(e) => setSelectedResume(e.target.value)}
                    className="w-full rounded-md border border-input bg-background p-2.5 text-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    <option value="Master Full Stack Resume (PDF)">
                      Master Full Stack Resume (98% Match)
                    </option>
                    <option value="Frontend Specialist Resume (PDF)">
                      Frontend Specialist Resume (92% Match)
                    </option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-semibold uppercase text-muted-foreground">
                    Optional Note to Recruiter
                  </label>
                  <textarea
                    rows={3}
                    value={candidateMessage}
                    onChange={(e) => setCandidateMessage(e.target.value)}
                    placeholder="Introduce yourself or highlight key Next.js 15 experience..."
                    className="w-full rounded-md border border-input bg-background p-2.5 text-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  />
                </div>

                <Button
                  variant="gradient"
                  isLoading={isSubmitting}
                  onClick={handleConfirmApply}
                  className="w-full gap-2"
                >
                  <Send className="h-4 w-4" /> Confirm & Send Application
                </Button>
              </div>
            )}
          </Card>
        </div>
      )}
    </div>
  );
}
