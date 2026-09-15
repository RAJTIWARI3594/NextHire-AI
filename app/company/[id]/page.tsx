import React from "react";
import Link from "next/link";
import {
  Building2,
  Globe,
  MapPin,
  Users,
  Sparkles,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { fetchCompanyProfile } from "@/services/jobs-service";

export default async function PublicCompanyPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const company = await fetchCompanyProfile(id);

  return (
    <div className="mx-auto min-h-screen max-w-5xl space-y-8 bg-background px-4 py-12 text-foreground sm:px-8">
      {/* Header Banner */}
      <div className="flex flex-col items-start justify-between gap-6 rounded-2xl border border-border/60 bg-gradient-to-r from-primary/5 via-card to-transparent p-8 shadow-xl sm:flex-row sm:items-center">
        <div className="flex items-center gap-5">
          <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl border-2 border-border/60 bg-primary/10 text-3xl font-extrabold text-primary">
            {company.name.charAt(0)}
          </div>

          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-3xl font-extrabold tracking-tight">
                {company.name}
              </h1>
              <Badge variant="accent" className="gap-1">
                <ShieldCheck className="h-3.5 w-3.5" /> Verified Enterprise
                Partner
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground">
              {company.industry} • {company.headquarters} •{" "}
              {company.companySize}
            </p>
          </div>
        </div>

        {company.website && (
          <a href={company.website} target="_blank" rel="noreferrer">
            <Button variant="outline" size="sm" className="gap-1.5 text-xs">
              <Globe className="h-4 w-4" /> Visit Website
            </Button>
          </a>
        )}
      </div>

      {/* Grid: Corporate Overview & Perks */}
      <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
        <Card className="space-y-4 border-border/60 p-6 md:col-span-2">
          <h2 className="text-base font-bold">About {company.name}</h2>
          <p className="text-xs leading-relaxed text-muted-foreground">
            {company.description}
          </p>

          <h3 className="pt-2 text-xs font-bold uppercase tracking-wider text-foreground">
            Employee Perks & Benefits
          </h3>
          <div className="grid grid-cols-1 gap-2 text-xs text-muted-foreground sm:grid-cols-2">
            {(company.benefits || []).map((b) => (
              <div key={b} className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-500" />
                <span>{b}</span>
              </div>
            ))}
          </div>
        </Card>

        {/* Quick Stats Sidebar */}
        <Card className="space-y-4 border-border/60 p-6">
          <h2 className="text-base font-bold">Company Info</h2>
          <div className="space-y-3 text-xs">
            <div>
              <p className="text-[10px] font-semibold uppercase text-muted-foreground">
                Industry
              </p>
              <p className="font-semibold text-foreground">
                {company.industry}
              </p>
            </div>
            <div>
              <p className="text-[10px] font-semibold uppercase text-muted-foreground">
                Company Size
              </p>
              <p className="font-semibold text-foreground">
                {company.companySize}
              </p>
            </div>
            <div>
              <p className="text-[10px] font-semibold uppercase text-muted-foreground">
                Headquarters
              </p>
              <p className="font-semibold text-foreground">
                {company.headquarters}
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Active Open Positions */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold tracking-tight">
            Active Open Positions ({company.activeJobsCount})
          </h2>
        </div>

        <Card className="space-y-4 border-border/60 p-6">
          <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
            <div>
              <h3 className="text-base font-bold">
                Senior Full Stack Engineer (Next.js & Supabase)
              </h3>
              <p className="mt-0.5 text-xs text-muted-foreground">
                San Francisco, CA (Remote) • $120,000 - $150,000 / yr
              </p>
            </div>
            <Link href="/dashboard/jobs/job-1">
              <Button variant="gradient" size="sm" className="gap-1.5 text-xs">
                Apply Position <ArrowRight className="h-3.5 w-3.5" />
              </Button>
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
}
