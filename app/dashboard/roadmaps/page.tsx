"use client";

import React, { useState } from "react";
import {
  Map,
  Sparkles,
  CheckCircle2,
  BookOpen,
  Layers,
  ArrowRight,
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

const roadmapsList = [
  {
    role: "Full Stack Engineer (Next.js & Supabase)",
    duration: "8 Weeks",
    weeks: [
      {
        week: 1,
        title: "Next.js 15 App Router & Server Components",
        topics: [
          "Server vs Client Components",
          "Route Handlers",
          "Turbopack",
          "Data Fetching",
        ],
        project: "Personal Portfolio & Blog Engine",
      },
      {
        week: 2,
        title: "TypeScript & Zod Schema Validation",
        topics: [
          "Generics",
          "Type Narrowing",
          "Zod Validation",
          "Form Integration",
        ],
        project: "Type-Safe Multi-Step Form",
      },
      {
        week: 3,
        title: "Supabase PostgreSQL RLS & Auth",
        topics: [
          "Row Level Security Policies",
          "Supabase SSR SDK",
          "Foreign Keys",
          "Postgres Triggers",
        ],
        project: "Secure SaaS Auth System",
      },
      {
        week: 4,
        title: "AI LLM Model Integration & Video Agents",
        topics: [
          "Gemini API",
          "OpenAI Streaming",
          "WebRTC",
          "Vector Embeddings",
        ],
        project: "Autonomous AI Recruiting Platform",
      },
    ],
  },
  {
    role: "AI & Machine Learning Engineer",
    duration: "10 Weeks",
    weeks: [
      {
        week: 1,
        title: "Python Deep Learning Foundations",
        topics: ["PyTorch", "NumPy", "Tensors", "Neural Networks"],
        project: "Image Classifier Model",
      },
      {
        week: 2,
        title: "LLM Fine-Tuning & RAG Pipelines",
        topics: ["Hugging Face", "LangChain", "Vector Databases", "Embeddings"],
        project: "Document QA Assistant",
      },
    ],
  },
];

export default function LearningRoadmapsPage() {
  const [selectedRole, setSelectedRole] = useState(0);

  const currentRoadmap = roadmapsList[selectedRole];

  return (
    <div className="mx-auto max-w-5xl space-y-6 p-4 sm:p-8">
      <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            AI Customized Learning Roadmaps
          </h1>
          <p className="text-sm text-muted-foreground">
            Structured week-by-week skill learning paths designed for
            high-paying tech roles.
          </p>
        </div>

        <Button variant="gradient" className="gap-2">
          <Sparkles className="h-4 w-4" /> Generate New Track
        </Button>
      </div>

      {/* Role Track Selectors */}
      <div className="flex gap-3 overflow-x-auto pb-2">
        {roadmapsList.map((r, idx) => (
          <button
            key={r.role}
            onClick={() => setSelectedRole(idx)}
            className={`shrink-0 rounded-xl border p-4 text-left transition-all ${
              selectedRole === idx
                ? "border-primary bg-primary/10 font-bold text-foreground shadow-sm"
                : "bg-card text-muted-foreground hover:bg-muted"
            }`}
          >
            <p className="text-xs font-semibold text-primary">{r.duration}</p>
            <p className="text-sm">{r.role}</p>
          </button>
        ))}
      </div>

      {/* Roadmap Detail View */}
      <Card className="space-y-6 border-border/60 p-6">
        <div className="flex items-center justify-between border-b pb-4">
          <div>
            <h2 className="text-xl font-bold">{currentRoadmap.role}</h2>
            <p className="text-xs text-muted-foreground">
              Estimated Duration: {currentRoadmap.duration}
            </p>
          </div>
          <Badge variant="accent">AI Generated Roadmap</Badge>
        </div>

        <div className="space-y-6">
          {currentRoadmap.weeks.map((w) => (
            <div
              key={w.week}
              className="relative space-y-2 border-l-2 border-primary pl-6"
            >
              <div className="absolute -left-2.5 top-0 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-white">
                {w.week}
              </div>

              <div className="flex items-start justify-between">
                <h3 className="text-sm font-bold">
                  Week {w.week}: {w.title}
                </h3>
                <Badge variant="outline">Milestone {w.week}</Badge>
              </div>

              <div className="flex flex-wrap gap-1.5 pt-1">
                {w.topics.map((t) => (
                  <span
                    key={t}
                    className="rounded-md bg-muted px-2 py-0.5 text-[11px] font-medium"
                  >
                    {t}
                  </span>
                ))}
              </div>

              <div className="mt-2 flex items-center justify-between rounded-lg bg-primary/10 p-3 text-xs font-medium text-primary">
                <span>Project Milestone: {w.project}</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
