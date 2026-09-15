"use client";

import React, { useState } from "react";
import {
  Calendar as CalendarIcon,
  Clock,
  Video,
  FileCheck,
  Sparkles,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default function RecruiterCalendarPage() {
  const [viewMode, setViewMode] = useState<"month" | "week" | "day">("week");

  const events = [
    {
      time: "10:00 AM PST",
      title: "Technical Interview - Candidate A",
      type: "interview",
      interviewer: "Sarah Connor",
    },
    {
      time: "02:00 PM PST",
      title: "Offer Expiration - Marcus Vance",
      type: "offer",
      interviewer: "Recruiter Ops",
    },
  ];

  return (
    <div className="mx-auto max-w-6xl space-y-6 p-4 sm:p-8">
      <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            Recruiter Master Schedule & Calendar
          </h1>
          <p className="text-sm text-muted-foreground">
            View scheduled interview sessions, candidate follow-ups, and offer
            expiration dates.
          </p>
        </div>

        <div className="flex gap-1 rounded-lg bg-muted p-1">
          {(["month", "week", "day"] as const).map((mode) => (
            <button
              key={mode}
              onClick={() => setViewMode(mode)}
              className={`rounded-md px-3 py-1 text-xs font-semibold capitalize transition-all ${
                viewMode === mode
                  ? "bg-indigo-500 text-white shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {mode} View
            </button>
          ))}
        </div>
      </div>

      <Card className="space-y-4 border-indigo-500/20 p-6">
        <div className="flex items-center justify-between border-b pb-3">
          <h2 className="flex items-center gap-2 text-sm font-bold">
            <CalendarIcon className="h-4 w-4 text-indigo-500" /> Today&apos;s
            Schedule (August 6, 2026)
          </h2>
          <Badge variant="accent">2 Scheduled Events</Badge>
        </div>

        <div className="space-y-3 text-xs">
          {events.map((evt, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between rounded-xl border bg-card/60 p-4"
            >
              <div className="flex items-start gap-3">
                <div className="rounded-lg bg-indigo-500/10 p-2 text-indigo-500">
                  {evt.type === "interview" ? (
                    <Video className="h-4 w-4" />
                  ) : (
                    <FileCheck className="h-4 w-4" />
                  )}
                </div>
                <div>
                  <p className="text-sm font-bold text-foreground">
                    {evt.title}
                  </p>
                  <p className="text-muted-foreground">
                    Lead: {evt.interviewer}
                  </p>
                </div>
              </div>

              <div className="text-right">
                <span className="font-mono font-bold text-indigo-400">
                  {evt.time}
                </span>
                <Badge variant="outline" className="ml-2 capitalize">
                  {evt.type}
                </Badge>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
