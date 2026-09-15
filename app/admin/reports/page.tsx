"use client";

import React, { useState } from "react";
import {
  Download,
  FileText,
  CheckCircle2,
  Table,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function ExportableReportsPage() {
  const [downloadedFormat, setDownloadedFormat] = useState<string | null>(null);

  const handleExport = (reportName: string, format: string) => {
    setDownloadedFormat(`${reportName}-${format}`);
    setTimeout(() => setDownloadedFormat(null), 2500);
  };

  const reportTypes = [
    {
      title: "Student Candidate Roster",
      desc: "Complete student profiles, ATS scores, and application counts.",
    },
    {
      title: "Enterprise Recruiter Directory",
      desc: "Corporate verification status, active job listings, and MRR.",
    },
    {
      title: "Monthly Subscription Revenue",
      desc: "MRR breakdown, payment gateway transactions, and refunds.",
    },
    {
      title: "AI Model Token & Telemetry Log",
      desc: "Daily Gemini API invocations, token counts, and compute costs.",
    },
    {
      title: "Job Applications Pipeline",
      desc: "Stage progression history from Applied to Interview & Hired.",
    },
  ];

  return (
    <div className="mx-auto max-w-6xl space-y-6 p-4 sm:p-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">
          Exportable System Reports Engine
        </h1>
        <p className="text-sm text-muted-foreground">
          Generate comprehensive platform data exports in CSV, Excel, and PDF
          formats.
        </p>
      </div>

      <div className="space-y-4">
        {reportTypes.map((rep) => (
          <Card
            key={rep.title}
            className="flex flex-col items-start justify-between gap-4 border-border/60 p-6 shadow-sm sm:flex-row sm:items-center"
          >
            <div className="space-y-1">
              <h3 className="text-base font-bold">{rep.title}</h3>
              <p className="text-xs text-muted-foreground">{rep.desc}</p>
            </div>

            <div className="flex items-center gap-2">
              {["CSV", "Excel", "PDF"].map((fmt) => {
                const isCurrent = downloadedFormat === `${rep.title}-${fmt}`;
                return (
                  <Button
                    key={fmt}
                    variant={isCurrent ? "default" : "outline"}
                    size="sm"
                    onClick={() => handleExport(rep.title, fmt)}
                    className="gap-1.5 text-xs"
                  >
                    {isCurrent ? (
                      <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                    ) : (
                      <Download className="h-3.5 w-3.5" />
                    )}
                    {isCurrent ? `${fmt} Ready` : `Export ${fmt}`}
                  </Button>
                );
              })}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
