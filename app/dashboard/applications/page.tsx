"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  FileCheck,
  Building2,
  Clock,
  CheckCircle2,
  Calendar,
  Sparkles,
  ExternalLink,
  ChevronRight,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default function ApplicationsTrackerPage() {
  const [applications, setApplications] = useState([
    {
      id: "app-1",
      jobTitle: "Senior Full Stack Engineer",
      companyName: "Vercel Partner Labs",
      location: "San Francisco, CA (Remote)",
      appliedDate: "August 5, 2026",
      status: "under_review",
      matchScore: 98,
      steps: [
        { name: "Applied", completed: true, date: "Aug 5" },
        { name: "Under Review", completed: true, date: "Aug 5" },
        { name: "Shortlisted", completed: false },
        { name: "Interview Scheduled", completed: false },
        { name: "Final Decision", completed: false },
      ],
    },
    {
      id: "app-2",
      jobTitle: "AI Voice & LLM Solutions Engineer",
      companyName: "Nexus AI Intelligence",
      location: "New York, NY (Hybrid)",
      appliedDate: "August 1, 2026",
      status: "interview_scheduled",
      matchScore: 94,
      steps: [
        { name: "Applied", completed: true, date: "Aug 1" },
        { name: "Under Review", completed: true, date: "Aug 2" },
        { name: "Shortlisted", completed: true, date: "Aug 3" },
        {
          name: "Interview Scheduled",
          completed: true,
          date: "Aug 4 (10:00 AM PST)",
        },
        { name: "Final Decision", completed: false },
      ],
    },
  ]);

  return (
    <div className="mx-auto max-w-6xl space-y-6 p-4 sm:p-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">
          Job & Internship Applications Tracker
        </h1>
        <p className="text-sm text-muted-foreground">
          Track real-time hiring progress, interview invites, and recruiter
          feedback.
        </p>
      </div>

      <div className="space-y-6">
        {applications.map((app) => (
          <Card
            key={app.id}
            className="space-y-6 border-border/60 p-6 shadow-sm"
          >
            <div className="flex flex-col items-start justify-between gap-4 border-b border-border/40 pb-4 sm:flex-row">
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="text-base font-bold">{app.jobTitle}</h3>
                  <Badge variant="accent" className="gap-1">
                    <Sparkles className="h-3 w-3" /> {app.matchScore}% Match
                  </Badge>
                </div>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  {app.companyName} • {app.location} • Applied {app.appliedDate}
                </p>
              </div>

              <Badge
                variant={
                  app.status === "interview_scheduled" ? "success" : "secondary"
                }
              >
                {app.status === "interview_scheduled"
                  ? "Interview Scheduled 🎉"
                  : "Under Review"}
              </Badge>
            </div>

            {/* Stepper Timeline Visualizer */}
            <div className="space-y-2">
              <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                Application Pipeline Progress
              </p>
              <div className="grid grid-cols-2 gap-2 pt-1 sm:grid-cols-5">
                {app.steps.map((step, idx) => (
                  <div
                    key={step.name}
                    className={`space-y-1 rounded-xl border p-3 text-left transition-all ${
                      step.completed
                        ? "border-primary bg-primary/10 text-foreground"
                        : "border-border/40 bg-card/40 text-muted-foreground"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-extrabold text-primary">
                        Step {idx + 1}
                      </span>
                      {step.completed && (
                        <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
                      )}
                    </div>
                    <p className="truncate text-xs font-bold">{step.name}</p>
                    {step.date && (
                      <p className="text-[10px] text-muted-foreground">
                        {step.date}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
