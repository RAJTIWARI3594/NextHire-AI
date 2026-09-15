import React from "react";
import {
  Sparkles,
  FileText,
  Download,
  ShieldCheck,
  Mail,
  ArrowUpRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { defaultResumeData } from "@/services/resume-service";
import { TemplateRenderer } from "@/components/resume/templates/template-renderer";

export default async function PublicResumeProfilePage({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const { username } = await params;

  return (
    <div className="mx-auto min-h-screen max-w-4xl space-y-8 bg-background px-4 py-12 text-foreground sm:px-8">
      {/* Header */}
      <div className="flex flex-col items-start justify-between gap-4 border-b border-border/40 pb-6 sm:flex-row sm:items-center">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-2xl font-extrabold capitalize tracking-tight">
              {username}&apos;s Master ATS Resume
            </h1>
            <Badge variant="accent" className="gap-1">
              <ShieldCheck className="h-3.5 w-3.5" /> NextHire Verified (88 ATS
              Score)
            </Badge>
          </div>
          <p className="mt-1 text-xs text-muted-foreground">
            Public verified candidate profile hosted on NextHire AI Intelligence
            Platform.
          </p>
        </div>

        <Button variant="gradient" size="sm" className="gap-1.5 text-xs">
          <Download className="h-4 w-4" /> Download Official PDF
        </Button>
      </div>

      {/* Embedded Master Resume Preview */}
      <div className="overflow-hidden rounded-xl border shadow-2xl">
        <TemplateRenderer data={defaultResumeData} template="modern" />
      </div>
    </div>
  );
}
