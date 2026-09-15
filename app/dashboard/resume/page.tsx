"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  FileText,
  Plus,
  Edit3,
  Copy,
  Trash2,
  Download,
  Sparkles,
  CheckCircle2,
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
import { useResumeStore } from "@/lib/store/use-resume-store";
import { defaultResumeData } from "@/services/resume-service";

export default function ResumeDashboardPage() {
  const { setResume } = useResumeStore();
  const [resumes, setResumes] = useState([
    {
      id: "master-demo-1",
      title: "Master Technical Resume",
      template: "modern",
      atsScore: 88,
      updatedAt: "Aug 5, 2026",
    },
    {
      id: "master-demo-2",
      title: "Full Stack Engineer Resume",
      template: "classic",
      atsScore: 92,
      updatedAt: "Aug 1, 2026",
    },
  ]);

  const handleDuplicate = (id: string) => {
    const target = resumes.find((r) => r.id === id);
    if (target) {
      const copy = {
        ...target,
        id: `resume-${Date.now()}`,
        title: `${target.title} (Copy)`,
        updatedAt: "Just now",
      };
      setResumes([...resumes, copy]);
    }
  };

  const handleDelete = (id: string) => {
    setResumes(resumes.filter((r) => r.id !== id));
  };

  return (
    <div className="mx-auto max-w-6xl space-y-6 p-4 sm:p-8">
      <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            ATS Resume Manager
          </h1>
          <p className="text-sm text-muted-foreground">
            Create, customize, and export ATS-friendly resumes for job
            applications.
          </p>
        </div>

        <Link href="/dashboard/resume/builder/master-demo-1">
          <Button variant="gradient" className="gap-2">
            <Plus className="h-4 w-4" /> Create New Resume
          </Button>
        </Link>
      </div>

      {/* Resumes Grid */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {resumes.map((r) => (
          <Card
            key={r.id}
            className="group flex flex-col justify-between space-y-4 border-border/60 p-6 shadow-sm transition-all hover:border-primary/30"
          >
            <div className="space-y-2">
              <div className="flex items-start justify-between">
                <div className="rounded-xl bg-primary/10 p-3 text-primary transition-colors group-hover:bg-primary group-hover:text-white">
                  <FileText className="h-6 w-6" />
                </div>
                <Badge variant="accent" className="gap-1">
                  <Sparkles className="h-3 w-3" /> {r.atsScore}/100 ATS
                </Badge>
              </div>

              <h3 className="pt-2 text-base font-bold">{r.title}</h3>
              <p className="text-xs text-muted-foreground">
                Template:{" "}
                <span className="font-semibold capitalize text-foreground">
                  {r.template}
                </span>{" "}
                • Updated {r.updatedAt}
              </p>
            </div>

            <div className="flex items-center justify-between border-t border-border/40 pt-4">
              <div className="flex gap-1">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleDuplicate(r.id)}
                  title="Duplicate Resume"
                  className="h-8 w-8 text-muted-foreground hover:text-foreground"
                >
                  <Copy className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleDelete(r.id)}
                  title="Delete Resume"
                  className="h-8 w-8 text-muted-foreground hover:text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>

              <Link href={`/dashboard/resume/builder/${r.id}`}>
                <Button variant="default" size="sm" className="gap-1.5 text-xs">
                  <Edit3 className="h-3.5 w-3.5" /> Edit Resume
                </Button>
              </Link>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
