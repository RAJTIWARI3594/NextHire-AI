"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Trophy,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  UserCheck,
  Calendar,
  MessageSquare,
  Search,
  Filter,
  ArrowRight,
  ShieldCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useRecruiterStore } from "@/lib/store/use-recruiter-store";
import type { RecommendationTier } from "@/types/recruiter";

export default function CandidateRankingPage() {
  const { candidates, toggleShortlist, setSelectedCandidateId } =
    useRecruiterStore();
  const [searchQuery, setSearchQuery] = useState("");
  const [filterRecommendation, setFilterRecommendation] =
    useState<string>("All");

  const filtered = candidates.filter((c) => {
    const matchesSearch =
      c.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.jobTitle.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRec =
      filterRecommendation === "All" ||
      c.recommendation === filterRecommendation;
    return matchesSearch && matchesRec;
  });

  return (
    <div className="mx-auto max-w-7xl space-y-6 p-4 sm:p-8">
      <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            AI Candidate Ranking & Shortlisting
          </h1>
          <p className="text-sm text-muted-foreground">
            Rank applicants automatically using 12 candidate telemetry
            dimensions.
          </p>
        </div>

        <Link href="/recruiter/interviews">
          <Button variant="gradient" className="gap-2">
            <Calendar className="h-4 w-4" /> Schedule Interview
          </Button>
        </Link>
      </div>

      {/* Controls & Filter Bar */}
      <div className="flex flex-col gap-3 sm:flex-row">
        <Input
          placeholder="Search candidate by name or job title..."
          icon={<Search className="h-4 w-4" />}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="flex-1"
        />

        <div className="flex gap-2 overflow-x-auto border-b border-border/40 pb-2">
          {["All", "Highly Recommended", "Recommended", "Consider"].map(
            (rec) => (
              <Button
                key={rec}
                variant={filterRecommendation === rec ? "default" : "ghost"}
                size="sm"
                onClick={() => setFilterRecommendation(rec)}
                className="whitespace-nowrap rounded-full text-xs"
              >
                {rec}
              </Button>
            )
          )}
        </div>
      </div>

      {/* Candidates Ranking Grid */}
      <div className="space-y-4">
        {filtered.map((candidate) => (
          <Card
            key={candidate.id}
            className="space-y-4 border-indigo-500/20 p-6 shadow-sm transition-all hover:border-indigo-500/50"
          >
            <div className="flex flex-col items-start justify-between gap-4 sm:flex-row">
              <div className="space-y-1">
                <div className="flex flex-wrap items-center gap-3">
                  <h3 className="text-lg font-extrabold text-foreground">
                    {candidate.studentName}
                  </h3>
                  <Badge
                    variant={
                      candidate.overallScore >= 90 ? "accent" : "secondary"
                    }
                    className="gap-1"
                  >
                    <Trophy className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />{" "}
                    {candidate.overallScore}/100 AI Score
                  </Badge>
                  <Badge
                    variant={
                      candidate.recommendation === "Highly Recommended"
                        ? "success"
                        : "outline"
                    }
                  >
                    {candidate.recommendation}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground">
                  {candidate.jobTitle} • {candidate.studentEmail} • Applied{" "}
                  {candidate.appliedDate}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant={candidate.isShortlisted ? "default" : "outline"}
                  size="sm"
                  onClick={() => toggleShortlist(candidate.id)}
                  className="gap-1.5 text-xs"
                >
                  <UserCheck className="h-4 w-4" />
                  {candidate.isShortlisted
                    ? "Shortlisted"
                    : "Shortlist Candidate"}
                </Button>

                <Link href="/recruiter/interviews">
                  <Button
                    variant="gradient"
                    size="sm"
                    className="gap-1 text-xs"
                  >
                    Schedule <ArrowRight className="h-3.5 w-3.5" />
                  </Button>
                </Link>
              </div>
            </div>

            {/* Score Component Breakdown Pills */}
            <div className="grid grid-cols-3 gap-3 border-t border-border/40 pt-2 text-xs">
              <div className="rounded-lg border bg-card/60 p-2.5">
                <span className="text-[10px] font-semibold uppercase text-muted-foreground">
                  ATS Resume Match
                </span>
                <p className="mt-0.5 text-sm font-extrabold text-indigo-400">
                  {candidate.atsScore}/100
                </p>
              </div>
              <div className="rounded-lg border bg-card/60 p-2.5">
                <span className="text-[10px] font-semibold uppercase text-muted-foreground">
                  Skill Verification
                </span>
                <p className="mt-0.5 text-sm font-extrabold text-purple-400">
                  {candidate.skillsScore}/100
                </p>
              </div>
              <div className="rounded-lg border bg-card/60 p-2.5">
                <span className="text-[10px] font-semibold uppercase text-muted-foreground">
                  AI Interview Score
                </span>
                <p className="mt-0.5 text-sm font-extrabold text-emerald-400">
                  {candidate.interviewScore}/100
                </p>
              </div>
            </div>

            {/* Strengths & Missing Skills */}
            <div className="grid grid-cols-1 gap-4 text-xs sm:grid-cols-2">
              <div className="space-y-1">
                <p className="font-semibold text-emerald-400">
                  Verified Strengths:
                </p>
                <ul className="space-y-1 text-[11px] text-muted-foreground">
                  {candidate.strengths.map((str, idx) => (
                    <li key={idx} className="flex items-start gap-1.5">
                      <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-emerald-500" />
                      <span>{str}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="space-y-1">
                <p className="font-semibold text-amber-400">
                  Missing Skill Gaps:
                </p>
                <div className="flex flex-wrap gap-1 pt-0.5">
                  {candidate.missingSkills.map((sk) => (
                    <Badge key={sk} variant="outline" className="text-[10px]">
                      {sk}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
