"use client";

import React, { useState } from "react";
import {
  FileCheck,
  Plus,
  Download,
  CheckCircle2,
  DollarSign,
  Calendar,
  MapPin,
  Building2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useRecruiterStore } from "@/lib/store/use-recruiter-store";
import type { OfferStatus } from "@/types/recruiter";

export default function OfferManagementPage() {
  const { offers, addOffer, candidates } = useRecruiterStore();
  const [candidateName, setCandidateName] = useState(
    candidates[0]?.studentName || "Candidate"
  );
  const [jobTitle, setJobTitle] = useState("Senior Full Stack Engineer");
  const [salaryPackage, setSalaryPackage] = useState(145000);
  const [joiningDate, setJoiningDate] = useState("2026-09-01");
  const [location, setLocation] = useState("San Francisco, CA (Remote)");
  const [isCreated, setIsCreated] = useState(false);

  const handleCreateOffer = () => {
    const newOff = {
      id: `off-${Date.now()}`,
      jobId: "job-1",
      studentId: "stud-1",
      candidateName,
      jobTitle,
      salaryPackage,
      joiningDate,
      location,
      status: "Sent" as OfferStatus,
      createdAt: "Just now",
    };
    addOffer(newOff);
    setIsCreated(true);
    setTimeout(() => setIsCreated(false), 2500);
  };

  return (
    <div className="mx-auto max-w-6xl space-y-6 p-4 sm:p-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">
          Offer Letter Management Platform
        </h1>
        <p className="text-sm text-muted-foreground">
          Generate official job offer packages, track acceptance status, and
          issue candidate documents.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
        {/* Offer Form (5 cols) */}
        <Card className="space-y-4 border-indigo-500/20 p-6 shadow-sm lg:col-span-5">
          <h2 className="flex items-center gap-2 text-sm font-bold">
            <Plus className="h-4 w-4 text-indigo-500" /> Generate Job Offer
            Package
          </h2>

          <div className="space-y-3 text-xs">
            <div className="space-y-1">
              <label className="font-semibold uppercase text-muted-foreground">
                Candidate
              </label>
              <select
                value={candidateName}
                onChange={(e) => setCandidateName(e.target.value)}
                className="w-full rounded-md border border-input bg-background p-2.5 text-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                {candidates.map((c) => (
                  <option key={c.id} value={c.studentName}>
                    {c.studentName} ({c.recommendation})
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <label className="font-semibold uppercase text-muted-foreground">
                Offer Job Title
              </label>
              <Input
                value={jobTitle}
                onChange={(e) => setJobTitle(e.target.value)}
              />
            </div>

            <div className="space-y-1">
              <label className="font-semibold uppercase text-muted-foreground">
                Annual Compensation ($ USD)
              </label>
              <Input
                type="number"
                value={salaryPackage}
                onChange={(e) => setSalaryPackage(Number(e.target.value))}
                icon={<DollarSign className="h-4 w-4" />}
              />
            </div>

            <div className="space-y-1">
              <label className="font-semibold uppercase text-muted-foreground">
                Target Joining Date
              </label>
              <Input
                type="date"
                value={joiningDate}
                onChange={(e) => setJoiningDate(e.target.value)}
              />
            </div>

            <div className="space-y-1">
              <label className="font-semibold uppercase text-muted-foreground">
                Work Location
              </label>
              <Input
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
            </div>

            <Button
              variant="gradient"
              onClick={handleCreateOffer}
              className="mt-2 w-full gap-2"
            >
              {isCreated ? (
                <>
                  <CheckCircle2 className="h-4 w-4 text-emerald-300" /> Offer
                  Sent to Candidate!
                </>
              ) : (
                <>
                  <FileCheck className="h-4 w-4" /> Issue Official Offer Package
                </>
              )}
            </Button>
          </div>
        </Card>

        {/* Issued Offers List (7 cols) */}
        <Card className="space-y-4 border-indigo-500/20 p-6 shadow-sm lg:col-span-7">
          <h2 className="flex items-center gap-2 text-sm font-bold">
            <FileCheck className="h-4 w-4 text-emerald-500" /> Active Job Offers
            ({offers.length})
          </h2>

          <div className="space-y-3 text-xs">
            {offers.map((off) => (
              <div
                key={off.id}
                className="flex items-center justify-between rounded-xl border bg-card/60 p-4"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-bold text-foreground">
                      {off.candidateName}
                    </p>
                    <Badge
                      variant={off.status === "Sent" ? "accent" : "success"}
                    >
                      {off.status}
                    </Badge>
                  </div>
                  <p className="text-muted-foreground">
                    {off.jobTitle} • {off.location}
                  </p>
                  <p className="pt-1 text-[11px] font-extrabold text-emerald-400">
                    ${off.salaryPackage.toLocaleString()} / yr • Joining{" "}
                    {off.joiningDate}
                  </p>
                </div>

                <Button variant="outline" size="sm" className="gap-1.5 text-xs">
                  <Download className="h-3.5 w-3.5" /> Offer PDF
                </Button>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
