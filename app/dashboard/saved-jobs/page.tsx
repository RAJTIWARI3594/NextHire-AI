"use client";

import React from "react";
import { Bookmark, Briefcase } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function SavedJobsPage() {
  return (
    <div className="mx-auto max-w-4xl space-y-6 p-4 sm:p-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Saved Jobs</h1>
        <p className="text-sm text-muted-foreground">
          Your bookmarked positions ready for application.
        </p>
      </div>

      <Card className="flex items-center justify-between border-border/60 p-6">
        <div>
          <h3 className="text-base font-bold">Senior Full Stack Engineer</h3>
          <p className="text-xs text-muted-foreground">
            Vercel Partner Labs • Remote
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="gradient" size="sm">
            Apply Now
          </Button>
        </div>
      </Card>
    </div>
  );
}
