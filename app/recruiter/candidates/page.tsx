"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  Trophy,
  CheckCircle2,
  UserCheck,
  Calendar,
  Search,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useRecruiterStore } from "@/lib/store/use-recruiter-store";
import {
  fetchRankedCandidates,
  persistCandidateShortlist,
} from "@/services/recruiter-service";

export default function CandidateRankingPage() {
  const {
    candidates,
    setCandidates,
    toggleShortlist,
    setSelectedCandidateId,
  } = useRecruiterStore();
  const [searchQuery, setSearchQuery] = useState("");
  const [filterRecommendation, setFilterRecommendation] = useState("All");
  const [isLoading, setIsLoading] = useState(true);
  const [busyCandidateId, setBusyCandidateId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    fetchRankedCandidates()
      .then((items) => {
        if (active) setCandidates(items);
      })
      .catch((loadError: unknown) => {
        if (active) {
          setError(
            (loadError as Error)?.message || "Applicant list could not be loaded."
          );
        }
      })
      .finally(() => {
        if (active) setIsLoading(false);
      });
    return () => {
      active = false;
    };
  }, [setCandidates]);

  const filtered = candidates.filter((candidate) => {
    const query = searchQuery.toLowerCase();
    const matchesSearch =
      candidate.studentName.toLowerCase().includes(query) ||
      candidate.jobTitle.toLowerCase().includes(query);
    const matchesRecommendation =
      filterRecommendation === "All" ||
      candidate.recommendation === filterRecommendation;
    return matchesSearch && matchesRecommendation;
  });

  const handleShortlist = async (
    candidateId: string,
    currentlyShortlisted: boolean
  ) => {
    setError(null);
    setBusyCandidateId(candidateId);
    try {
      await persistCandidateShortlist(candidateId, currentlyShortlisted);
      toggleShortlist(candidateId);
    } catch (saveError: unknown) {
      setError((saveError as Error)?.message || "Shortlist could not be updated.");
    } finally {
      setBusyCandidateId(null);
    }
  };

  return (
    <div className="mx-auto max-w-7xl space-y-6 p-4 sm:p-8">
      <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            Applicant Review & Shortlisting
          </h1>
          <p className="text-sm text-muted-foreground">
            Applications submitted to your verified job listings. Scores appear
            only when assessment data is available.
          </p>
        </div>
        <Link href="/recruiter/interviews">
          <Button variant="gradient" className="gap-2">
            <Calendar className="h-4 w-4" /> Schedule Interview
          </Button>
        </Link>
      </div>

      {error && (
        <div
          role="alert"
          className="rounded-lg border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive"
        >
          {error}
        </div>
      )}

      <div className="flex flex-col gap-3 sm:flex-row">
        <Input
          placeholder="Search candidate by name or job title..."
          icon={<Search className="h-4 w-4" />}
          value={searchQuery}
          onChange={(event) => setSearchQuery(event.target.value)}
          className="flex-1"
        />
        <div className="flex gap-2 overflow-x-auto border-b border-border/40 pb-2">
          {[
            "All",
            "Highly Recommended",
            "Recommended",
            "Consider",
            "Not Recommended",
          ].map((recommendation) => (
            <Button
              key={recommendation}
              variant={
                filterRecommendation === recommendation ? "default" : "ghost"
              }
              size="sm"
              onClick={() => setFilterRecommendation(recommendation)}
              className="whitespace-nowrap rounded-full text-xs"
            >
              {recommendation}
            </Button>
          ))}
        </div>
      </div>

      {isLoading ? (
        <Card className="p-10 text-center text-sm text-muted-foreground">
          Loading applications...
        </Card>
      ) : filtered.length === 0 ? (
        <Card className="p-10 text-center">
          <UserCheck className="mx-auto h-8 w-8 text-muted-foreground" />
          <h2 className="mt-3 text-lg font-semibold">
            {candidates.length === 0
              ? "No applications yet"
              : "No matching applicants"}
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            {candidates.length === 0
              ? "Applicants will appear here after students apply to one of your verified job listings."
              : "Try a different search or recommendation filter."}
          </p>
        </Card>
      ) : (
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
                      <Trophy className="h-3.5 w-3.5 text-amber-400" />
                      {candidate.overallScore > 0
                        ? `Match ${candidate.overallScore}/100`
                        : "Match pending"}
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
                    {candidate.jobTitle} • Applied{" "}
                    {candidate.appliedDate}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    variant={candidate.isShortlisted ? "default" : "outline"}
                    size="sm"
                    disabled={busyCandidateId !== null}
                    onClick={() =>
                      handleShortlist(candidate.id, candidate.isShortlisted)
                    }
                    className="gap-1.5 text-xs"
                  >
                    <UserCheck className="h-4 w-4" />
                    {busyCandidateId === candidate.id
                      ? "Saving..."
                      : candidate.isShortlisted
                        ? "Shortlisted"
                        : "Shortlist"}
                  </Button>
                  <Link
                    href="/recruiter/interviews"
                    onClick={() => setSelectedCandidateId(candidate.id)}
                  >
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

              <div className="grid grid-cols-3 gap-3 border-t border-border/40 pt-3 text-xs">
                <div className="rounded-lg border bg-card/60 p-2.5">
                  <span className="text-[10px] font-semibold uppercase text-muted-foreground">
                    ATS Resume Match
                  </span>
                  <p className="mt-0.5 text-sm font-extrabold text-indigo-400">
                    {candidate.atsScore > 0
                      ? `${candidate.atsScore}/100`
                      : "Not scored"}
                  </p>
                </div>
                <div className="rounded-lg border bg-card/60 p-2.5">
                  <span className="text-[10px] font-semibold uppercase text-muted-foreground">
                    Skill Assessment
                  </span>
                  <p className="mt-0.5 text-sm font-extrabold text-purple-400">
                    Not assessed
                  </p>
                </div>
                <div className="rounded-lg border bg-card/60 p-2.5">
                  <span className="text-[10px] font-semibold uppercase text-muted-foreground">
                    Interview Assessment
                  </span>
                  <p className="mt-0.5 text-sm font-extrabold text-emerald-400">
                    Not assessed
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 border-t border-border/40 pt-3 text-xs sm:grid-cols-2">
                <div className="space-y-1">
                  <p className="font-semibold text-emerald-400">
                    Assessment notes
                  </p>
                  {candidate.strengths.length > 0 ? (
                    <ul className="space-y-1 text-[11px] text-muted-foreground">
                      {candidate.strengths.map((strength) => (
                        <li key={strength} className="flex items-start gap-1.5">
                          <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-emerald-500" />
                          <span>{strength}</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-[11px] text-muted-foreground">
                      No assessment notes have been recorded.
                    </p>
                  )}
                </div>
                <div className="space-y-1">
                  <p className="font-semibold text-amber-400">Missing skills</p>
                  {candidate.missingSkills.length > 0 ? (
                    <div className="flex flex-wrap gap-1 pt-0.5">
                      {candidate.missingSkills.map((skill) => (
                        <Badge
                          key={skill}
                          variant="outline"
                          className="text-[10px]"
                        >
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  ) : (
                    <p className="text-[11px] text-muted-foreground">
                      No skill-gap assessment is available.
                    </p>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
