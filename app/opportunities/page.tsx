"use client";

import React, { useEffect, useMemo, useState } from "react";
import {
  BriefcaseBusiness,
  Building2,
  ExternalLink,
  MapPin,
  Search,
  ShieldCheck,
} from "lucide-react";
import { fetchExternalJobs } from "@/services/external-jobs-service";
import type { ExternalJobListing } from "@/types/external-jobs";

export default function PublicOpportunitiesPage() {
  const [jobs, setJobs] = useState<ExternalJobListing[]>([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    fetchExternalJobs()
      .then((items) => {
        if (active) setJobs(items);
      })
      .catch(() => {
        if (active) setError("Jobs could not be loaded right now. Please try again.");
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  const filteredJobs = useMemo(() => {
    const value = query.trim().toLowerCase();
    if (!value) return jobs;
    return jobs.filter((job) =>
      [
        job.title,
        job.companyName,
        job.location,
        job.experienceLevel,
        ...job.skills,
      ]
        .join(" ")
        .toLowerCase()
        .includes(value)
    );
  }, [jobs, query]);

  return (
    <main className="min-h-screen bg-[#080B12] text-foreground">
      <section className="border-b border-border/60 bg-gradient-to-br from-primary/10 via-background to-background">
        <div className="mx-auto max-w-6xl px-4 py-14 sm:px-8">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
            <ShieldCheck className="h-4 w-4" />
            Official employer links only
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight sm:text-5xl">
            Fresher jobs & graduate opportunities
          </h1>
          <p className="mt-4 max-w-2xl text-sm leading-6 text-muted-foreground">
            Explore verified employer career pages. When you select Apply, you
            leave NextHire and continue directly on the company’s website.
            NextHire does not collect or submit your application.
          </p>
          <div className="mt-7 max-w-2xl">
            <div className="flex items-center gap-3 rounded-xl border border-border bg-card px-4 py-3">
              <Search className="h-4 w-4 text-muted-foreground" />
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search role, company, location or skill"
                aria-label="Search jobs"
                className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
              />
            </div>
          </div>
          <div className="mt-4 flex flex-wrap gap-4 text-xs text-muted-foreground">
            <span>{jobs.length} listed opportunities</span>
            <span>•</span>
            <span>Applications handled by employers</span>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl space-y-4 px-4 py-10 sm:px-8">
        {loading ? (
          <div className="rounded-xl border border-border bg-card p-10 text-center text-sm text-muted-foreground">
            Loading current opportunities…
          </div>
        ) : error ? (
          <div role="alert" className="rounded-xl border border-destructive/30 bg-card p-8 text-center text-sm text-muted-foreground">
            {error}
          </div>
        ) : filteredJobs.length === 0 ? (
          <div className="rounded-xl border border-border bg-card p-10 text-center">
            <BriefcaseBusiness className="mx-auto h-8 w-8 text-muted-foreground" />
            <h2 className="mt-3 text-lg font-semibold">No matching jobs</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Try another keyword. New employer listings will appear here after verification.
            </p>
          </div>
        ) : (
          filteredJobs.map((job) => (
            <article
              key={job.id}
              className="rounded-2xl border border-border/70 bg-card p-5 shadow-sm transition-colors hover:border-primary/40 sm:p-6"
            >
              <div className="flex flex-col justify-between gap-5 sm:flex-row">
                <div className="min-w-0 space-y-3">
                  <div>
                    <div className="flex flex-wrap items-center gap-2 text-xs text-primary">
                      <span className="rounded-full bg-primary/10 px-2.5 py-1 font-semibold">
                        {job.experienceLevel}
                      </span>
                      <span>{job.employmentType}</span>
                    </div>
                    <h2 className="mt-3 text-lg font-bold">{job.title}</h2>
                    <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-muted-foreground">
                      <span className="inline-flex items-center gap-1.5">
                        <Building2 className="h-4 w-4" /> {job.companyName}
                      </span>
                      <span className="inline-flex items-center gap-1.5">
                        <MapPin className="h-4 w-4" /> {job.location}
                      </span>
                    </div>
                  </div>
                  <p className="max-w-3xl text-sm leading-6 text-muted-foreground">
                    {job.description}
                  </p>
                  {job.requirements.length > 0 && (
                    <div>
                      <h3 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                        Eligibility / requirements
                      </h3>
                      <ul className="mt-2 grid gap-1.5 text-sm text-muted-foreground sm:grid-cols-2">
                        {job.requirements.map((item) => (
                          <li key={item} className="flex gap-2">
                            <span className="text-primary">•</span>
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {job.skills.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {job.skills.map((skill) => (
                        <span
                          key={skill}
                          className="rounded-full border border-border px-2.5 py-1 text-[11px] text-muted-foreground"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  )}
                  <div className="text-xs text-muted-foreground">
                    Source:{" "}
                    <a
                      href={job.sourceUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-medium text-primary hover:underline"
                    >
                      {job.sourceName}
                    </a>
                    <span className="mx-2">•</span>
                    Pay: {job.salaryText}
                    {job.closingDate ? (
                      <>
                        <span className="mx-2">•</span>
                        Apply by {new Date(job.closingDate).toLocaleDateString("en-IN")}
                      </>
                    ) : null}
                  </div>
                </div>

                <div className="flex shrink-0 flex-col justify-center gap-2 sm:w-48">
                  <a
                    href={job.applyUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
                  >
                    Apply on company site <ExternalLink className="h-4 w-4" />
                  </a>
                  <p className="text-center text-[11px] text-muted-foreground">
                    Opens employer website in a new tab
                  </p>
                </div>
              </div>
            </article>
          ))
        )}
        <p className="pt-4 text-center text-xs text-muted-foreground">
          Listings are curated from employer career pages. Check the company page
          for the latest eligibility, availability and deadlines before applying.
        </p>
      </section>
    </main>
  );
}
