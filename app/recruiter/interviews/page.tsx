"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Calendar,
  Clock,
  User,
  Briefcase,
  Video,
  Plus,
  CheckCircle2,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useRecruiterStore } from "@/lib/store/use-recruiter-store";
import { scheduleInterview } from "@/services/recruiter-service";

export default function InterviewSchedulerPage() {
  const { interviews, addInterview, candidates } = useRecruiterStore();
  const [candidateName, setCandidateName] = useState(
    candidates[0]?.studentName || "Candidate"
  );
  const [interviewType, setInterviewType] = useState<
    "HR" | "Technical" | "Coding" | "Managerial" | "Final Round"
  >("Technical");
  const [scheduledTime, setScheduledTime] = useState("2026-08-06T10:00");
  const [interviewerName, setInterviewerName] = useState(
    "Sarah Connor (Tech Lead)"
  );
  const [isScheduled, setIsScheduled] = useState(false);

  const handleSchedule = async () => {
    const newInt = {
      id: `int-${Date.now()}`,
      jobId: "job-1",
      studentId: "stud-1",
      candidateName,
      jobTitle: "Senior Full Stack Engineer",
      interviewType,
      scheduledTime: new Date(scheduledTime).toLocaleString("en-US", {
        dateStyle: "medium",
        timeStyle: "short",
      }),
      durationMinutes: 45,
      interviewerName,
      status: "scheduled" as const,
    };

    await scheduleInterview(newInt);
    addInterview(newInt);
    setIsScheduled(true);
    setTimeout(() => setIsScheduled(false), 2500);
  };

  return (
    <div className="mx-auto max-w-6xl space-y-6 p-4 sm:p-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">
          Interview Scheduling Engine
        </h1>
        <p className="text-sm text-muted-foreground">
          Schedule HR, Technical, Coding, and Final round interview sessions
          with candidate notification dispatch.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
        {/* Schedule Form (5 cols) */}
        <Card className="space-y-4 border-indigo-500/20 p-6 shadow-sm lg:col-span-5">
          <h2 className="flex items-center gap-2 text-sm font-bold">
            <Plus className="h-4 w-4 text-indigo-500" /> Schedule New Interview
          </h2>

          <div className="space-y-3 text-xs">
            <div className="space-y-1">
              <label className="font-semibold uppercase text-muted-foreground">
                Candidate
              </label>
              <select
                value={candidateName}
                onChange={(e) => setCandidateName(e.target.value)}
                className="w-full rounded-md border border-input bg-background p-2.5 text-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                {candidates.map((c) => (
                  <option key={c.id} value={c.studentName}>
                    {c.studentName} ({c.overallScore}/100 Score)
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <label className="font-semibold uppercase text-muted-foreground">
                Interview Track
              </label>
              <div className="grid grid-cols-2 gap-2 pt-1">
                {(
                  [
                    "HR",
                    "Technical",
                    "Coding",
                    "Managerial",
                    "Final Round",
                  ] as const
                ).map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setInterviewType(t)}
                    className={`rounded-lg border px-2 py-1.5 text-left text-xs font-medium transition-all ${
                      interviewType === t
                        ? "border-indigo-500 bg-indigo-500 text-white"
                        : "bg-card hover:bg-muted"
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-1">
              <label className="font-semibold uppercase text-muted-foreground">
                Date & Time
              </label>
              <Input
                type="datetime-local"
                value={scheduledTime}
                onChange={(e) => setScheduledTime(e.target.value)}
              />
            </div>

            <div className="space-y-1">
              <label className="font-semibold uppercase text-muted-foreground">
                Interviewer Name
              </label>
              <Input
                value={interviewerName}
                onChange={(e) => setInterviewerName(e.target.value)}
                placeholder="e.g. Sarah Connor (Tech Lead)"
              />
            </div>

            <Button
              variant="gradient"
              onClick={handleSchedule}
              className="mt-2 w-full gap-2"
            >
              {isScheduled ? (
                <>
                  <CheckCircle2 className="h-4 w-4 text-emerald-300" />{" "}
                  Interview Scheduled!
                </>
              ) : (
                <>
                  <Calendar className="h-4 w-4" /> Send Interview Invite
                </>
              )}
            </Button>
          </div>
        </Card>

        {/* Scheduled Interviews List (7 cols) */}
        <Card className="space-y-4 border-indigo-500/20 p-6 shadow-sm lg:col-span-7">
          <h2 className="flex items-center gap-2 text-sm font-bold">
            <Video className="h-4 w-4 text-purple-500" /> Active Upcoming
            Interviews ({interviews.length})
          </h2>

          <div className="space-y-3 text-xs">
            {interviews.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between rounded-xl border bg-card/60 p-4"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-bold text-foreground">
                      {item.candidateName}
                    </p>
                    <Badge variant="accent">{item.interviewType}</Badge>
                  </div>
                  <p className="text-muted-foreground">{item.jobTitle}</p>
                  <p className="flex items-center gap-1 pt-1 text-[11px] text-indigo-400">
                    <Clock className="h-3.5 w-3.5" /> {item.scheduledTime} (
                    {item.durationMinutes} Mins)
                  </p>
                </div>

                <Badge variant="outline" className="capitalize">
                  {item.status}
                </Badge>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
