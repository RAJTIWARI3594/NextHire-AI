"use client";

import React, { useState } from "react";
import {
  UserCheck,
  Building2,
  Check,
  X,
  ShieldCheck,
  ExternalLink,
  FileText,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAdminStore } from "@/lib/store/use-admin-store";
import { approveRecruiterRequest } from "@/services/admin-service";

export default function RecruiterVerificationPage() {
  const { recruiters, approveRecruiter } = useAdminStore();
  const [approvedIds, setApprovedIds] = useState<string[]>([]);

  const handleApprove = async (id: string) => {
    await approveRecruiterRequest(id);
    approveRecruiter(id);
    setApprovedIds([...approvedIds, id]);
  };

  return (
    <div className="mx-auto max-w-6xl space-y-6 p-4 sm:p-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">
          Recruiter & Enterprise Verification Engine
        </h1>
        <p className="text-sm text-muted-foreground">
          Audit corporate credentials, company domain ownership, and approve
          recruiter access to job posting.
        </p>
      </div>

      <div className="space-y-4">
        {recruiters.map((r) => {
          const isDone = approvedIds.includes(r.id) || r.status === "approved";
          return (
            <Card
              key={r.id}
              className="space-y-4 border-border/60 p-6 shadow-sm"
            >
              <div className="flex flex-col items-start justify-between gap-4 sm:flex-row">
                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="text-base font-bold">{r.recruiterName}</h3>
                    <Badge variant={isDone ? "success" : "accent"}>
                      {isDone
                        ? "Approved Enterprise Partner"
                        : "Pending Verification Audit"}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {r.companyName} • {r.email} • Requested {r.appliedDate}
                  </p>
                </div>

                {!isDone && (
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="gap-1 text-xs text-destructive"
                    >
                      <X className="h-4 w-4" /> Reject Request
                    </Button>
                    <Button
                      variant="gradient"
                      size="sm"
                      onClick={() => handleApprove(r.id)}
                      className="gap-1 text-xs"
                    >
                      <Check className="h-4 w-4" /> Approve Corporate Recruiter
                    </Button>
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between rounded-lg border bg-muted/30 p-3 text-xs">
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-primary" />
                  <span>
                    Corporate Business License & Tax Certificate verified
                  </span>
                </div>
                <Badge variant="outline">Verified Domain</Badge>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
