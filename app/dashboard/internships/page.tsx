import React from "react";
import { GraduationCap, Briefcase, Bookmark, Sparkles } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function InternshipsPage() {
  return (
    <div className="mx-auto max-w-5xl space-y-6 p-4 sm:p-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Internship Portal</h1>
        <p className="text-sm text-muted-foreground">
          Find summer and pre-placement internship offers for 2026/2027.
        </p>
      </div>

      <Card className="space-y-4 border-border/60 p-6">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold">
                Software Engineering Intern
              </h3>
              <Badge variant="success">PPO Available</Badge>
            </div>
            <p className="text-xs text-muted-foreground">
              Stripe Developer Labs • San Francisco, CA (Remote Option)
            </p>
            <p className="text-xs font-semibold text-emerald-400">
              $55 / hour • 3 Months
            </p>
          </div>
          <Button variant="gradient" size="sm">
            Apply Now
          </Button>
        </div>
      </Card>
    </div>
  );
}
