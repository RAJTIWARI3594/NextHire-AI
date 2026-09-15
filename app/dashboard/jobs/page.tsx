"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  Search,
  Filter,
  Briefcase,
  MapPin,
  DollarSign,
  Clock,
  Sparkles,
  Bookmark,
  Building2,
  CheckCircle2,
  ArrowRight,
  ExternalLink,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useJobsStore } from "@/lib/store/use-jobs-store";
import { fetchJobs } from "@/services/jobs-service";
import type { JobListing } from "@/types/jobs";

export default function JobsPortalPage() {
  const {
    filters,
    setSearchQuery,
    setWorkMode,
    resetFilters,
    savedJobIds,
    toggleSaveJob,
  } = useJobsStore();
  const [jobs, setJobs] = useState<JobListing[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      setLoading(true);
      const res = await fetchJobs(filters);
      setJobs(res);
      setLoading(false);
    }

    const timer = setTimeout(load, 300);
    return () => clearTimeout(timer);
  }, [filters]);

  return (
    <div className="mx-auto max-w-7xl space-y-6 p-4 sm:p-8">
      {/* Search Header Banner */}
      <div className="space-y-4 rounded-2xl border border-border/60 bg-gradient-to-r from-primary/5 via-card to-transparent p-6 shadow-xl md:p-8">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="space-y-1">
            <Badge variant="accent" className="gap-1">
              <Sparkles className="h-3.5 w-3.5" /> AI Candidate Job Matching
              Active
            </Badge>
            <h1 className="text-3xl font-extrabold tracking-tight">
              Explore High-Match Roles
            </h1>
            <p className="text-sm text-muted-foreground">
              Discover software engineering, AI, and data roles matched to your
              ATS resume.
            </p>
          </div>
        </div>

        {/* Search Bar */}
        <div className="flex max-w-3xl gap-2">
          <Input
            placeholder="Search by job title, company, or tech stack (e.g. Next.js 15, Supabase, Python)..."
            icon={<Search className="h-4 w-4" />}
            value={filters.searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 bg-background/80"
          />
        </div>
      </div>

      {/* Main Jobs Layout: Filter Sidebar (3 cols) + Jobs Cards (9 cols) */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
        {/* Filter Sidebar (3 cols) */}
        <Card className="h-fit space-y-5 border-border/60 p-5 lg:col-span-3">
          <div className="flex items-center justify-between border-b pb-3">
            <h2 className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-muted-foreground">
              <Filter className="h-4 w-4 text-primary" /> Filter Roles
            </h2>
            <button
              onClick={resetFilters}
              className="text-[11px] font-semibold text-primary hover:underline"
            >
              Reset
            </button>
          </div>

          {/* Work Mode */}
          <div className="space-y-2 text-xs">
            <label className="font-semibold uppercase text-muted-foreground">
              Work Location
            </label>
            <div className="space-y-1">
              {["All", "Remote", "Hybrid", "On-site"].map((mode) => (
                <button
                  key={mode}
                  onClick={() => setWorkMode(mode)}
                  className={`w-full rounded-lg p-2 text-left font-medium transition-all ${
                    filters.workMode === mode
                      ? "border border-border/60 bg-primary/10 font-bold text-primary"
                      : "text-muted-foreground hover:bg-muted"
                  }`}
                >
                  {mode}
                </button>
              ))}
            </div>
          </div>
        </Card>

        {/* Jobs List Grid (9 cols) */}
        <div className="space-y-4 lg:col-span-9">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>Showing {jobs.length} open opportunities</span>
            <span>Sorted by AI Match Score</span>
          </div>

          {loading ? (
            <div className="py-20 text-center text-xs text-muted-foreground">
              Loading job matches...
            </div>
          ) : (
            <div className="space-y-4">
              {jobs.map((job) => {
                const isSaved = savedJobIds.includes(job.id);
                return (
                  <Card
                    key={job.id}
                    className="group space-y-4 border-border/60 p-6 shadow-sm transition-all hover:border-primary/30"
                  >
                    <div className="flex flex-col items-start justify-between gap-4 sm:flex-row">
                      <div className="flex items-start gap-4">
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border bg-primary/10 text-lg font-extrabold text-primary">
                          {job.companyName.charAt(0)}
                        </div>

                        <div className="space-y-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <h3 className="text-base font-bold transition-colors group-hover:text-primary">
                              {job.title}
                            </h3>
                            <Badge
                              variant="accent"
                              className="gap-1 text-[11px]"
                            >
                              <Sparkles className="h-3 w-3" /> {job.matchScore}%
                              Match
                            </Badge>
                          </div>

                          <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                            <Link
                              href={`/company/${job.companyId}`}
                              className="flex items-center gap-1 font-semibold text-foreground hover:underline"
                            >
                              <Building2 className="h-3.5 w-3.5 text-primary" />{" "}
                              {job.companyName}
                            </Link>
                            <span>•</span>
                            <span className="flex items-center gap-1">
                              <MapPin className="h-3.5 w-3.5" /> {job.location}{" "}
                              ({job.workMode})
                            </span>
                            <span>•</span>
                            <span className="flex items-center gap-1 font-semibold text-emerald-400">
                              <DollarSign className="h-3.5 w-3.5" /> $
                              {job.salaryMin.toLocaleString()} - $
                              {job.salaryMax.toLocaleString()} / yr
                            </span>
                          </div>
                        </div>
                      </div>

                      <button
                        onClick={() => toggleSaveJob(job.id)}
                        className={`rounded-lg border p-2 transition-colors ${
                          isSaved
                            ? "border-amber-500 bg-amber-500/10 text-amber-400"
                            : "text-muted-foreground hover:text-foreground"
                        }`}
                      >
                        <Bookmark
                          className={`h-4 w-4 ${isSaved ? "fill-amber-400" : ""}`}
                        />
                      </button>
                    </div>

                    <div className="flex flex-wrap gap-1.5 border-t border-border/40 pt-2">
                      {job.skillsRequired.map((skill) => (
                        <Badge
                          key={skill}
                          variant="outline"
                          className="text-[11px]"
                        >
                          {skill}
                        </Badge>
                      ))}
                    </div>

                    <div className="flex items-center justify-between pt-2">
                      <div className="flex items-center gap-4 text-[11px] text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Users className="h-3.5 w-3.5" /> {job.applicantCount}{" "}
                          Applicants
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-3.5 w-3.5" /> Posted{" "}
                          {job.postedDate}
                        </span>
                      </div>

                      <Link href={`/dashboard/jobs/${job.id}`}>
                        <Button
                          variant="gradient"
                          size="sm"
                          className="gap-1.5 text-xs"
                        >
                          View Details & Apply{" "}
                          <ArrowRight className="h-3.5 w-3.5" />
                        </Button>
                      </Link>
                    </div>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
