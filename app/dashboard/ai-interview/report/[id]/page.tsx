"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import {
  Trophy,
  Award,
  CheckCircle2,
  AlertTriangle,
  Download,
  RotateCcw,
  Sparkles,
  ArrowRight,
  BarChart3,
  Lightbulb,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useInterviewStore } from "@/lib/store/use-interview-store";

export default function InterviewReportPage() {
  const { report, loadReport } = useInterviewStore();

  useEffect(() => {
    loadReport("latest");
  }, [loadReport]);

  const scores = report?.scores || {
    communication: 88,
    confidence: 90,
    technicalKnowledge: 92,
    problemSolving: 89,
    grammar: 94,
    fluency: 91,
    answerRelevance: 93,
    leadership: 86,
    overallPerformance: 90,
  };

  return (
    <div className="mx-auto max-w-6xl space-y-8 p-4 sm:p-8">
      {/* Header Banner */}
      <div className="flex flex-col items-start justify-between gap-6 rounded-2xl border border-border/60 bg-gradient-to-r from-primary/5 via-card to-transparent p-6 shadow-xl md:flex-row md:items-center md:p-8">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Badge variant="accent">AI Assessment Report</Badge>
            <Badge variant="success" className="gap-1">
              <Trophy className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />{" "}
              Overall Score: {scores.overallPerformance}/100
            </Badge>
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight">
            Interview Performance Feedback
          </h1>
          <p className="max-w-xl text-sm text-muted-foreground">
            {report?.jobRole || "Senior Full Stack Engineer"} @{" "}
            {report?.companyName || "Vercel Partner Labs"} •{" "}
            {report?.date || "August 5, 2026"}
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <Link href="/dashboard/ai-interview">
            <Button variant="outline" size="sm" className="gap-1.5">
              <RotateCcw className="h-4 w-4" /> Retake Interview
            </Button>
          </Link>
          <Button variant="gradient" size="sm" className="gap-1.5">
            <Download className="h-4 w-4" /> Export PDF Report
          </Button>
        </div>
      </div>

      {/* 9-Dimension Score Cards Grid */}
      <div className="space-y-4">
        <h2 className="flex items-center gap-2 text-base font-bold">
          <BarChart3 className="h-4 w-4 text-primary" /> 9-Dimension AI
          Competency Breakdown
        </h2>

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
          {[
            { title: "Technical Depth", score: scores.technicalKnowledge },
            { title: "Answer Relevance", score: scores.answerRelevance },
            { title: "Grammar & Structure", score: scores.grammar },
            { title: "Fluency & Speech", score: scores.fluency },
            { title: "Confidence Level", score: scores.confidence },
            { title: "Problem Solving", score: scores.problemSolving },
            { title: "Communication", score: scores.communication },
            { title: "Leadership Potential", score: scores.leadership },
            {
              title: "Overall Score",
              score: scores.overallPerformance,
              highlight: true,
            },
          ].map((sc) => (
            <Card
              key={sc.title}
              className={`p-4 ${sc.highlight ? "border-primary bg-primary/10" : "border-border/60"}`}
            >
              <p className="text-[11px] font-semibold uppercase text-muted-foreground">
                {sc.title}
              </p>
              <p
                className={`mt-1 text-2xl font-extrabold ${sc.highlight ? "text-primary" : "text-foreground"}`}
              >
                {sc.score}/100
              </p>
              <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-muted">
                <div
                  className="h-full rounded-full bg-primary"
                  style={{ width: `${sc.score}%` }}
                />
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Strengths & Improvement Plan */}
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
        {/* Strengths */}
        <Card className="space-y-4 border-emerald-500/20 p-6">
          <h3 className="flex items-center gap-2 text-base font-bold text-emerald-400">
            <CheckCircle2 className="h-5 w-5" /> Verified Strengths
          </h3>
          <ul className="space-y-2 text-xs text-muted-foreground">
            {(
              report?.strengths || [
                "Exceptional explanation of Next.js 15 Server Components and Supabase RLS security policies.",
                "Clear, confident articulation of asynchronous state management and performance tuning.",
                "Strong problem-solving methodology demonstrated during debugging questions.",
              ]
            ).map((str, i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="font-bold text-emerald-500">•</span>
                <span>{str}</span>
              </li>
            ))}
          </ul>
        </Card>

        {/* Improvement Plan */}
        <Card className="space-y-4 border-amber-500/20 p-6">
          <h3 className="flex items-center gap-2 text-base font-bold text-amber-400">
            <Lightbulb className="h-5 w-5" /> Suggested Improvement Plan
          </h3>
          <ul className="space-y-2 text-xs text-muted-foreground">
            {(
              report?.improvementPlan || [
                "Review PostgreSQL connection pooler (pgBouncer) configuration options.",
                "Practice mock sessions on WebSockets & WebRTC streaming architecture.",
              ]
            ).map((imp, i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="font-bold text-amber-500">•</span>
                <span>{imp}</span>
              </li>
            ))}
          </ul>
        </Card>
      </div>
    </div>
  );
}
