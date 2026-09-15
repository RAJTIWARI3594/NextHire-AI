"use client";

import React, { useState } from "react";
import {
  Briefcase,
  Check,
  X,
  ShieldAlert,
  Sparkles,
  Building2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAdminStore } from "@/lib/store/use-admin-store";

export default function JobModerationPage() {
  const { jobs, approveJob } = useAdminStore();
  const [featuredIds, setFeaturedIds] = useState<string[]>([]);

  const handleToggleFeatured = (id: string) => {
    if (featuredIds.includes(id)) {
      setFeaturedIds(featuredIds.filter((item) => item !== id));
    } else {
      setFeaturedIds([...featuredIds, id]);
    }
  };

  return (
    <div className="mx-auto max-w-6xl space-y-6 p-4 sm:p-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">
          Job & Internship Moderation Queue
        </h1>
        <p className="text-sm text-muted-foreground">
          Review posted job listings, mark featured roles, and remove spam or
          misleading postings.
        </p>
      </div>

      <div className="space-y-4">
        {jobs.map((job) => {
          const isFeatured = featuredIds.includes(job.id);
          return (
            <Card
              key={job.id}
              className="space-y-4 border-border/60 p-6 shadow-sm"
            >
              <div className="flex flex-col items-start justify-between gap-4 sm:flex-row">
                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="text-base font-bold">{job.title}</h3>
                    <Badge
                      variant={
                        job.status === "active" ? "success" : "secondary"
                      }
                    >
                      {job.status}
                    </Badge>
                    {isFeatured && (
                      <Badge variant="accent">Featured Placement</Badge>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {job.companyName} • Posted {job.postedDate} •{" "}
                    {job.reportsCount} Reports
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    variant={isFeatured ? "default" : "outline"}
                    size="sm"
                    onClick={() => handleToggleFeatured(job.id)}
                    className="gap-1.5 text-xs"
                  >
                    <Sparkles className="h-3.5 w-3.5" />
                    {isFeatured ? "Featured Role" : "Feature Job"}
                  </Button>
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
