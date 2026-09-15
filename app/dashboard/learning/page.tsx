import React from "react";
import { Map, CheckCircle2, Play } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function LearningRoadmapPage() {
  return (
    <div className="mx-auto max-w-4xl space-y-6 p-4 sm:p-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">
          AI Learning & Skill Roadmap
        </h1>
        <p className="text-sm text-muted-foreground">
          Personalized learning modules to bridge skill gaps for your target job
          roles.
        </p>
      </div>

      <Card className="space-y-4 border-border/60 p-6">
        <div className="flex items-center justify-between border-b pb-3">
          <div>
            <h3 className="text-base font-bold">Full Stack Engineer Track</h3>
            <p className="text-xs text-muted-foreground">
              4 Modules • 85% Progress
            </p>
          </div>
          <Badge variant="accent">Active Track</Badge>
        </div>

        <div className="space-y-3 text-xs">
          <div className="flex items-center justify-between rounded-lg border bg-muted/30 p-3">
            <span>Module 1: Next.js 15 App Router & Server Components</span>
            <Badge variant="success">Completed</Badge>
          </div>
          <div className="flex items-center justify-between rounded-lg border bg-muted/30 p-3">
            <span>Module 2: Supabase PostgreSQL RLS & SSR Auth</span>
            <Button size="sm" variant="gradient" className="h-7 text-xs">
              Continue
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
