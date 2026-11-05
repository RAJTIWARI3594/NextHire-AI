"use client";

import React, { useEffect, useState } from "react";
import { Building2, Check, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  approveRecruiterRequest,
  fetchRecruiterRequests,
} from "@/services/admin-service";
import type { RecruiterApproval } from "@/types/admin";

export default function RecruiterVerificationPage() {
  const [recruiters, setRecruiters] = useState<RecruiterApproval[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [approvingId, setApprovingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    fetchRecruiterRequests()
      .then((rows) => {
        if (isMounted) setRecruiters(rows);
      })
      .catch((loadError) => {
        if (isMounted) {
          setError(
            loadError?.message || "Unable to load recruiter verification requests."
          );
        }
      })
      .finally(() => {
        if (isMounted) setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const handleApprove = async (id: string) => {
    setError(null);
    setSuccess(null);
    setApprovingId(id);

    try {
      await approveRecruiterRequest(id);
      setRecruiters((current) =>
        current.map((recruiter) =>
          recruiter.id === id
            ? { ...recruiter, status: "approved" }
            : recruiter
        )
      );
      setSuccess("Recruiter account verified. Job posting access is now enabled.");
    } catch (approvalError: any) {
      setError(
        approvalError?.message || "Unable to approve this recruiter account."
      );
    } finally {
      setApprovingId(null);
    }
  };

  return (
    <div className="mx-auto max-w-6xl space-y-6 p-4 sm:p-8">
      <div>
        <div className="flex items-center gap-2">
          <ShieldCheck className="h-6 w-6 text-primary" />
          <h1 className="text-2xl font-bold tracking-tight">
            Recruiter Verification
          </h1>
        </div>
        <p className="mt-2 text-sm text-muted-foreground">
          Review the registered company and business email before enabling
          recruiter access and job posting.
        </p>
      </div>

      {error && (
        <div
          role="alert"
          className="rounded-md border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive"
        >
          {error}
        </div>
      )}
      {success && (
        <div
          role="status"
          className="rounded-md border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-700 dark:text-emerald-400"
        >
          {success}
        </div>
      )}

      {isLoading ? (
        <Card className="p-6 text-sm text-muted-foreground">
          Loading recruiter requests...
        </Card>
      ) : recruiters.length === 0 ? (
        <Card className="p-8 text-center">
          <Building2 className="mx-auto mb-3 h-8 w-8 text-muted-foreground" />
          <h2 className="font-semibold">No recruiter requests yet</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            New recruiter registrations will appear here after account creation.
          </p>
        </Card>
      ) : (
        <div className="space-y-4">
          {recruiters.map((recruiter) => {
            const isApproved = recruiter.status === "approved";

            return (
              <Card
                key={recruiter.id}
                className="space-y-4 border-border/60 p-6 shadow-sm"
              >
                <div className="flex flex-col items-start justify-between gap-4 sm:flex-row">
                  <div className="space-y-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-base font-bold">
                        {recruiter.recruiterName}
                      </h3>
                      <Badge variant={isApproved ? "success" : "accent"}>
                        {isApproved ? "Verified" : "Pending review"}
                      </Badge>
                    </div>
                    <p className="text-sm">{recruiter.companyName}</p>
                    <p className="text-xs text-muted-foreground">
                      {recruiter.email} · Registered {recruiter.appliedDate}
                    </p>
                  </div>

                  {!isApproved && (
                    <Button
                      variant="gradient"
                      size="sm"
                      disabled={approvingId !== null}
                      isLoading={approvingId === recruiter.id}
                      onClick={() => handleApprove(recruiter.id)}
                      className="gap-1 text-xs"
                    >
                      <Check className="h-4 w-4" />
                      Verify recruiter
                    </Button>
                  )}
                </div>
                {!isApproved && (
                  <p className="rounded-lg border bg-muted/30 p-3 text-xs text-muted-foreground">
                    Confirm the company and business email independently before
                    approving. Approval enables access to candidate details and
                    job posting.
                  </p>
                )}
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
