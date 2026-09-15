"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  CheckCircle2,
  RefreshCw,
  Sparkles,
  User,
  FileText,
  Briefcase,
  GraduationCap,
  Code2,
  FolderGit2,
  Award,
  Globe,
  Plus,
  Trash2,
  Eye,
  Download,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useResumeStore } from "@/lib/store/use-resume-store";
import { TemplateRenderer } from "@/components/resume/templates/template-renderer";
import type { TemplateVariant } from "@/types/resume";

export default function ResumeBuilderPage() {
  const {
    resume,
    activeTemplate,
    saveStatus,
    activeTab,
    updatePersonalInfo,
    updateSummary,
    setTemplate,
    setActiveTab,
    addExperience,
    removeExperience,
    addSkill,
    removeSkill,
  } = useResumeStore();

  const [newSkillName, setNewSkillName] = useState("");

  const handleAddSkill = () => {
    if (newSkillName.trim()) {
      addSkill({
        id: `sk-${Date.now()}`,
        name: newSkillName.trim(),
        level: "Intermediate",
      });
      setNewSkillName("");
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-4rem)] flex-col">
      {/* Builder Top Bar */}
      <div className="sticky top-16 z-20 flex h-14 items-center justify-between border-b border-border/40 bg-card/60 px-4 backdrop-blur-md sm:px-8">
        <div className="flex items-center gap-3">
          <Link href="/dashboard/resume">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 rounded-full"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <h1 className="text-sm font-bold tracking-tight">{resume.title}</h1>

          {/* Auto Save Status */}
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            {saveStatus === "saving" ? (
              <span className="flex items-center gap-1 text-primary">
                <RefreshCw className="h-3 w-3 animate-spin" /> Saving...
              </span>
            ) : (
              <span className="flex items-center gap-1 text-emerald-400">
                <CheckCircle2 className="h-3.5 w-3.5" /> Saved
              </span>
            )}
          </div>
        </div>

        {/* Template Selector & Download */}
        <div className="flex items-center gap-3">
          <div className="hidden items-center gap-1 rounded-lg bg-muted/40 p-1 sm:flex">
            {(
              [
                "classic",
                "modern",
                "professional",
                "minimal",
                "creative",
              ] as TemplateVariant[]
            ).map((tmpl) => (
              <button
                key={tmpl}
                onClick={() => setTemplate(tmpl)}
                className={`rounded-md px-2 py-1 text-[11px] font-semibold capitalize transition-all ${
                  activeTemplate === tmpl
                    ? "bg-primary text-white shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {tmpl}
              </button>
            ))}
          </div>

          <Button variant="gradient" size="sm" className="gap-1.5 text-xs">
            <Download className="h-3.5 w-3.5" /> Export PDF
          </Button>
        </div>
      </div>

      {/* Split Screen Layout */}
      <div className="grid min-h-0 flex-1 grid-cols-1 lg:grid-cols-12">
        {/* Left Form Editor Pane (7 cols) */}
        <div className="max-h-[calc(100vh-7.5rem)] space-y-6 overflow-y-auto border-r border-border/40 p-4 sm:p-6 lg:col-span-7">
          {/* Section Navigation Tabs */}
          <div className="flex gap-1.5 overflow-x-auto border-b border-border/40 pb-3">
            {[
              { id: "personal", label: "Personal", icon: User },
              { id: "summary", label: "Summary", icon: FileText },
              { id: "experience", label: "Experience", icon: Briefcase },
              { id: "education", label: "Education", icon: GraduationCap },
              { id: "skills", label: "Skills", icon: Code2 },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <Button
                  key={tab.id}
                  variant={isActive ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setActiveTab(tab.id as any)}
                  className="gap-1.5 rounded-full text-xs"
                >
                  <Icon className="h-3.5 w-3.5" /> {tab.label}
                </Button>
              );
            })}
          </div>

          {/* Tab Form Views */}
          {activeTab === "personal" && (
            <div className="space-y-4">
              <h2 className="text-sm font-bold">Personal Details</h2>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-1">
                  <label className="text-xs font-semibold uppercase text-muted-foreground">
                    Full Name
                  </label>
                  <Input
                    value={resume.personalInfo.fullName}
                    onChange={(e) =>
                      updatePersonalInfo({ fullName: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold uppercase text-muted-foreground">
                    Job Title
                  </label>
                  <Input
                    value={resume.personalInfo.professionalTitle}
                    onChange={(e) =>
                      updatePersonalInfo({ professionalTitle: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold uppercase text-muted-foreground">
                    Email
                  </label>
                  <Input
                    value={resume.personalInfo.email}
                    onChange={(e) =>
                      updatePersonalInfo({ email: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold uppercase text-muted-foreground">
                    Phone
                  </label>
                  <Input
                    value={resume.personalInfo.phone}
                    onChange={(e) =>
                      updatePersonalInfo({ phone: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-1 sm:col-span-2">
                  <label className="text-xs font-semibold uppercase text-muted-foreground">
                    Location
                  </label>
                  <Input
                    value={resume.personalInfo.location}
                    onChange={(e) =>
                      updatePersonalInfo({ location: e.target.value })
                    }
                  />
                </div>
              </div>
            </div>
          )}

          {activeTab === "summary" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-bold">Professional Summary</h2>
                <span className="text-xs text-muted-foreground">
                  {resume.summary.length} / 500 chars
                </span>
              </div>
              <textarea
                rows={6}
                value={resume.summary}
                onChange={(e) => updateSummary(e.target.value)}
                placeholder="Write a concise overview of your background and core technical strengths..."
                className="w-full rounded-md border border-input bg-background p-3 text-xs ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              />
              <div className="flex items-center gap-2 rounded-lg bg-primary/10 p-3 text-xs font-medium text-primary">
                <Sparkles className="h-4 w-4 shrink-0" />
                <span>
                  AI Tip: Mention relevant frameworks like Next.js 15, React 19,
                  and Supabase RLS.
                </span>
              </div>
            </div>
          )}

          {activeTab === "experience" && (
            <div className="space-y-4">
              <h2 className="text-sm font-bold">Work Experience</h2>
              {resume.experience.map((exp) => (
                <Card
                  key={exp.id}
                  className="relative space-y-2 border-border/60 p-4"
                >
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => removeExperience(exp.id)}
                    className="absolute right-2 top-2 h-7 w-7 text-destructive"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                  <p className="text-xs font-bold">
                    {exp.role} at {exp.company}
                  </p>
                  <p className="text-[11px] text-muted-foreground">
                    {exp.description}
                  </p>
                </Card>
              ))}

              <Button
                variant="outline"
                onClick={() =>
                  addExperience({
                    id: `exp-${Date.now()}`,
                    company: "Tech Corp",
                    role: "Software Developer",
                    startDate: "2025-01",
                    endDate: "Present",
                    description:
                      "Built scalable web features using Next.js and TypeScript.",
                  })
                }
                className="w-full gap-2 text-xs"
              >
                <Plus className="h-4 w-4" /> Add Experience Entry
              </Button>
            </div>
          )}

          {activeTab === "skills" && (
            <div className="space-y-4">
              <h2 className="text-sm font-bold">Skills & Competencies</h2>

              <div className="flex gap-2">
                <Input
                  placeholder="Add skill (e.g. Next.js 15, PostgreSQL)..."
                  value={newSkillName}
                  onChange={(e) => setNewSkillName(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleAddSkill()}
                />
                <Button variant="default" onClick={handleAddSkill}>
                  Add
                </Button>
              </div>

              <div className="flex flex-wrap gap-2 pt-2">
                {resume.skills.map((skill) => (
                  <Badge
                    key={skill.id}
                    variant="accent"
                    className="gap-1 px-3 py-1"
                  >
                    <span>{skill.name}</span>
                    <button
                      onClick={() => removeSkill(skill.id)}
                      className="ml-1 text-muted-foreground hover:text-destructive"
                    >
                      ×
                    </button>
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Live ATS Template Preview Pane (5 cols) */}
        <div className="flex max-h-[calc(100vh-7.5rem)] items-start justify-center overflow-y-auto bg-muted/30 p-4 sm:p-6 lg:col-span-5">
          <div className="w-full max-w-xl transition-all">
            <TemplateRenderer data={resume} template={activeTemplate} />
          </div>
        </div>
      </div>
    </div>
  );
}
