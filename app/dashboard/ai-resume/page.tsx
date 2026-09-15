import React from "react";
import { Bot, Sparkles, CheckCircle2 } from "lucide-react";
import { Card } from "@/components/ui/card";

export default function AIResumeReviewPage() {
  return (
    <div className="mx-auto max-w-4xl space-y-6 p-4 sm:p-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">
          AI Resume Review & ATS Diagnostics
        </h1>
        <p className="text-sm text-muted-foreground">
          Deep semantic analysis of your resume against target job roles.
        </p>
      </div>

      <Card className="space-y-4 border-border/60 p-6">
        <div className="flex items-center gap-3 border-b pb-4">
          <div className="rounded-xl bg-primary/10 p-3 text-primary">
            <Bot className="h-6 w-6" />
          </div>
          <div>
            <h2 className="text-lg font-bold">
              Latest Analysis: Overall Score 88/100
            </h2>
            <p className="text-xs text-emerald-400">
              High Match for Full Stack Engineer track
            </p>
          </div>
        </div>

        <div className="space-y-3 text-xs">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-500" />
            <span>
              Strong technical keyword density: Next.js 15, TypeScript, Supabase
              RLS.
            </span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-500" />
            <span>
              Clean standard formatting readable by Taleo, Greenhouse, and Lever
              ATS parsers.
            </span>
          </div>
        </div>
      </Card>
    </div>
  );
}
