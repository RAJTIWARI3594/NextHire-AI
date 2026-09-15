"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  Video,
  Mic,
  MessageSquare,
  Sparkles,
  Play,
  History,
  Trophy,
  BarChart3,
  Building2,
  Clock,
  Globe,
  Briefcase,
  CheckCircle2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAuthStore } from "@/lib/store/use-auth-store";
import { useInterviewStore } from "@/lib/store/use-interview-store";
import { createInterviewSession } from "@/services/interview-service";
import type {
  InterviewType,
  DifficultyLevel,
  InterviewMode,
} from "@/types/interview";

export default function InterviewLobbyPage() {
  const router = useRouter();
  const { profile, user } = useAuthStore();
  const { setup, setSetup, startSession } = useInterviewStore();
  const [isStarting, setIsStarting] = useState(false);

  const interviewTypes: InterviewType[] = [
    "Technical",
    "HR",
    "Behavioral",
    "Coding",
    "Managerial",
  ];
  const difficulties: DifficultyLevel[] = [
    "Beginner",
    "Intermediate",
    "Advanced",
  ];

  const handleStartInterview = async () => {
    try {
      setIsStarting(true);
      const studentId = profile?.id || user?.id || "";
      const sessionId = await createInterviewSession(studentId, setup);
      await startSession(sessionId);
      router.push(`/dashboard/ai-interview/session/${sessionId}`);
    } catch (err) {
      console.error("Failed to start session:", err);
      // Fallback session ID for demo
      const fallbackId = `session-${Date.now()}`;
      await startSession(fallbackId);
      router.push(`/dashboard/ai-interview/session/${fallbackId}`);
    } finally {
      setIsStarting(false);
    }
  };

  return (
    <div className="mx-auto max-w-6xl space-y-8 p-4 sm:p-8">
      {/* Header Banner */}
      <div className="flex flex-col items-start justify-between gap-6 rounded-2xl border border-border/60 bg-gradient-to-r from-primary/5 via-card to-transparent p-6 shadow-xl md:flex-row md:items-center md:p-8">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Badge variant="accent">AI Voice & Text Interviewer</Badge>
            <Badge variant="success">Adaptive Evaluation Engine</Badge>
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight">
            Autonomous Mock Interview Platform 🎙️
          </h1>
          <p className="max-w-xl text-sm text-muted-foreground">
            Practice real-time technical & HR questions with instant 9-dimension
            scoring and detailed feedback.
          </p>
        </div>

        <div className="flex gap-3">
          <Link href="/dashboard/ai-interview/report/latest">
            <Button variant="outline" size="sm" className="gap-1.5">
              <Trophy className="h-4 w-4 text-amber-400" /> View Last Report
            </Button>
          </Link>
        </div>
      </div>

      {/* Setup Form & Parameters Grid */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
        {/* Setup Parameters Pane (7 cols) */}
        <Card className="space-y-6 border-border/60 p-6 shadow-sm sm:p-8 lg:col-span-7">
          <h2 className="flex items-center gap-2 text-base font-bold">
            <Sparkles className="h-4 w-4 text-primary" /> Configure Interview
            Session
          </h2>

          <div className="space-y-5 text-xs">
            {/* Mode Selection */}
            <div className="space-y-2">
              <label className="font-semibold uppercase text-muted-foreground">
                Interview Mode
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setSetup({ mode: "voice" })}
                  className={`flex items-center gap-3 rounded-xl border p-3 transition-all ${
                    setup.mode === "voice"
                      ? "border-primary bg-primary/10 font-bold text-primary"
                      : "bg-card text-muted-foreground hover:bg-muted"
                  }`}
                >
                  <Mic className="h-5 w-5 text-primary" />
                  <div className="text-left">
                    <p className="text-xs">Voice Interview</p>
                    <p className="text-[10px] font-normal text-muted-foreground">
                      Real-time Speech Synthesis
                    </p>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setSetup({ mode: "text" })}
                  className={`flex items-center gap-3 rounded-xl border p-3 transition-all ${
                    setup.mode === "text"
                      ? "border-primary bg-primary/10 font-bold text-primary"
                      : "bg-card text-muted-foreground hover:bg-muted"
                  }`}
                >
                  <MessageSquare className="h-5 w-5 text-primary" />
                  <div className="text-left">
                    <p className="text-xs">Text Chat Interview</p>
                    <p className="text-[10px] font-normal text-muted-foreground">
                      Live Transcript Stream
                    </p>
                  </div>
                </button>
              </div>
            </div>

            {/* Interview Type */}
            <div className="space-y-2">
              <label className="font-semibold uppercase text-muted-foreground">
                Interview Category
              </label>
              <div className="flex flex-wrap gap-2">
                {interviewTypes.map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setSetup({ interviewType: t })}
                    className={`rounded-lg border px-3 py-1.5 text-xs font-semibold transition-all ${
                      setup.interviewType === t
                        ? "border-primary bg-primary text-white"
                        : "bg-card text-muted-foreground hover:bg-muted"
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            {/* Difficulty Level */}
            <div className="space-y-2">
              <label className="font-semibold uppercase text-muted-foreground">
                Difficulty Level
              </label>
              <div className="grid grid-cols-3 gap-2">
                {difficulties.map((d) => (
                  <button
                    key={d}
                    type="button"
                    onClick={() => setSetup({ difficulty: d })}
                    className={`rounded-lg border px-2 py-1.5 text-center text-xs font-semibold transition-all ${
                      setup.difficulty === d
                        ? "border-primary bg-primary text-white"
                        : "bg-card text-muted-foreground hover:bg-muted"
                    }`}
                  >
                    {d}
                  </button>
                ))}
              </div>
            </div>

            {/* Role & Company */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-1">
                <label className="font-semibold uppercase text-muted-foreground">
                  Job Role
                </label>
                <Input
                  value={setup.jobRole}
                  onChange={(e) => setSetup({ jobRole: e.target.value })}
                  icon={<Briefcase className="h-4 w-4" />}
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold uppercase text-muted-foreground">
                  Target Company
                </label>
                <Input
                  value={setup.companyName}
                  onChange={(e) => setSetup({ companyName: e.target.value })}
                  icon={<Building2 className="h-4 w-4" />}
                />
              </div>
            </div>

            {/* Duration & Language */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-1">
                <label className="font-semibold uppercase text-muted-foreground">
                  Duration (Minutes)
                </label>
                <select
                  value={setup.durationMinutes}
                  onChange={(e) =>
                    setSetup({ durationMinutes: Number(e.target.value) })
                  }
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <option value={10}>10 Minutes (Quick Screening)</option>
                  <option value={20}>20 Minutes (Standard Technical)</option>
                  <option value={30}>30 Minutes (Deep Technical)</option>
                  <option value={45}>45 Minutes (System Architecture)</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="font-semibold uppercase text-muted-foreground">
                  Language
                </label>
                <select
                  value={setup.language}
                  onChange={(e) => setSetup({ language: e.target.value })}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <option value="English">English</option>
                  <option value="Hindi">Hindi (Bilingual)</option>
                </select>
              </div>
            </div>

            <Button
              variant="gradient"
              size="lg"
              isLoading={isStarting}
              onClick={handleStartInterview}
              className="mt-4 w-full gap-2 text-base font-semibold"
            >
              <Play className="h-5 w-5" /> Launch Live AI Session
            </Button>
          </div>
        </Card>

        {/* Analytics & Past History (5 cols) */}
        <div className="space-y-6 lg:col-span-5">
          <Card className="space-y-4 border-border/60 p-6">
            <h2 className="flex items-center gap-2 text-sm font-bold">
              <BarChart3 className="h-4 w-4 text-primary" /> Evaluation Metrics
              Engine
            </h2>

            <div className="space-y-2 text-xs">
              {[
                { name: "Technical Knowledge", score: 92 },
                { name: "Answer Relevance", score: 93 },
                { name: "Grammar & Fluency", score: 94 },
                { name: "Problem Solving", score: 89 },
                { name: "Confidence Indicator", score: 90 },
              ].map((m) => (
                <div key={m.name} className="space-y-1">
                  <div className="flex justify-between font-medium">
                    <span>{m.name}</span>
                    <span className="font-bold text-primary">
                      {m.score}/100
                    </span>
                  </div>
                  <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
                    <div
                      className="h-full rounded-full bg-primary"
                      style={{ width: `${m.score}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <Card className="space-y-3 border-border/60 p-6">
            <h2 className="flex items-center gap-2 text-sm font-bold">
              <History className="h-4 w-4 text-primary" /> Recent Completed
              Interviews
            </h2>

            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between rounded-lg border bg-muted/30 p-3">
                <div>
                  <p className="font-semibold">Technical Full Stack Track</p>
                  <p className="text-[10px] text-muted-foreground">
                    August 5, 2026 • 20 Mins
                  </p>
                </div>
                <Badge variant="accent">90/100 Score</Badge>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
