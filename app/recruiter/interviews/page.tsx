"use client";

import React, { useEffect, useMemo, useState } from "react";
import { Calendar, Clock, Video, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useRecruiterStore } from "@/lib/store/use-recruiter-store";
import {
  fetchRankedCandidates,
  fetchRecruiterInterviews,
  scheduleInterview,
} from "@/services/recruiter-service";

const getDefaultDateTime = () => {
  const date = new Date(Date.now() + 24 * 60 * 60 * 1000);
  date.setMinutes(0, 0, 0);
  const pad = (value: number) => String(value).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
};

export default function InterviewSchedulerPage() {
  const {
    candidates,
    interviews,
    setCandidates,
    setInterviews,
    addInterview,
    selectedCandidateId,
  } = useRecruiterStore();
  const [candidateApplicationId, setCandidateApplicationId] = useState("");
  const [interviewType, setInterviewType] = useState<
    "HR" | "Technical" | "Coding" | "Managerial" | "Final Round"
  >("Technical");
  const [scheduledTime, setScheduledTime] = useState(getDefaultDateTime);
  const [interviewerName, setInterviewerName] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    Promise.all([fetchRankedCandidates(), fetchRecruiterInterviews()])
      .then(([applicants, scheduled]) => {
        if (!active) return;
        setCandidates(applicants);
        setInterviews(scheduled);
        const selected =
          applicants.find((applicant) => applicant.id === selectedCandidateId) ||
          applicants[0];
        if (selected) setCandidateApplicationId(selected.id);
      })
      .catch((loadError: unknown) => {
        if (active) {
          setError(
            (loadError as Error)?.message || "Interview data could not be loaded."
          );
        }
      })
      .finally(() => {
        if (active) setIsLoading(false);
      });
    return () => {
      active = false;
    };
  }, [selectedCandidateId, setCandidates, setInterviews]);

  const selectedCandidate = useMemo(
    () =>
      candidates.find(
        (candidate) => candidate.id === candidateApplicationId
      ),
    [candidates, candidateApplicationId]
  );

  const handleSchedule = async () => {
    setError(null);
    setSuccess(null);
    if (!selectedCandidate) {
      setError("Select a real applicant before scheduling an interview.");
      return;
    }

    setIsSubmitting(true);
    try {
      const created = await scheduleInterview({
        jobId: selectedCandidate.jobId,
        studentId: selectedCandidate.studentId,
        candidateName: selectedCandidate.studentName,
        jobTitle: selectedCandidate.jobTitle,
        interviewType,
        scheduledTime: new Date(scheduledTime).toISOString(),
        durationMinutes: 45,
        interviewerName,
      });
      addInterview(created);
      setSuccess("Interview record created successfully.");
    } catch (scheduleError: unknown) {
      setError(
        (scheduleError as Error)?.message || "Interview could not be scheduled."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-6xl space-y-6 p-4 sm:p-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">
          Interview Scheduling
        </h1>
        <p className="text-sm text-muted-foreground">
          Schedule interviews only for students who have applied to your jobs.
          Email notifications are not connected yet.
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

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
        <Card className="space-y-4 border-indigo-500/20 p-6 shadow-sm lg:col-span-5">
          <h2 className="flex items-center gap-2 text-sm font-bold">
            <Plus className="h-4 w-4 text-indigo-500" /> Schedule New Interview
          </h2>

          {isLoading ? (
            <p className="text-sm text-muted-foreground">
              Loading applicants...
            </p>
          ) : candidates.length === 0 ? (
            <p className="rounded-lg border bg-muted/30 p-4 text-sm text-muted-foreground">
              No applicants are available. Students must apply to one of your
              verified job listings before an interview can be scheduled.
            </p>
          ) : (
            <div className="space-y-3 text-xs">
              <div className="space-y-1">
                <label className="font-semibold uppercase text-muted-foreground">
                  Candidate
                </label>
                <select
                  value={candidateApplicationId}
                  onChange={(event) =>
                    setCandidateApplicationId(event.target.value)
                  }
                  className="w-full rounded-md border border-input bg-background p-2.5 text-xs"
                >
                  {candidates.map((candidate) => (
                    <option key={candidate.id} value={candidate.id}>
                      {candidate.studentName} — {candidate.jobTitle}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="font-semibold uppercase text-muted-foreground">
                  Interview Track
                </label>
                <div className="grid grid-cols-2 gap-2 pt-1">
                  {(
                    ["HR", "Technical", "Coding", "Managerial", "Final Round"] as const
                  ).map((track) => (
                    <button
                      key={track}
                      type="button"
                      onClick={() => setInterviewType(track)}
                      className={`rounded-lg border px-2 py-1.5 text-left text-xs font-medium transition-all ${interviewType === track ? "border-indigo-500 bg-indigo-500 text-white" : "bg-card hover:bg-muted"}`}
                    >
                      {track}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-semibold uppercase text-muted-foreground">
                  Date & Time
                </label>
                <Input
                  type="datetime-local"
                  min={getDefaultDateTime()}
                  value={scheduledTime}
                  onChange={(event) => setScheduledTime(event.target.value)}
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold uppercase text-muted-foreground">
                  Interviewer Name
                </label>
                <Input
                  value={interviewerName}
                  onChange={(event) => setInterviewerName(event.target.value)}
                  placeholder="Enter interviewer name"
                />
              </div>

              <Button
                variant="gradient"
                onClick={handleSchedule}
                disabled={isSubmitting || !selectedCandidate}
                className="mt-2 w-full gap-2"
              >
                {isSubmitting ? (
                  "Saving..."
                ) : (
                  <>
                    <Calendar className="h-4 w-4" /> Schedule Interview
                  </>
                )}
              </Button>
            </div>
          )}
        </Card>

        <Card className="space-y-4 border-indigo-500/20 p-6 shadow-sm lg:col-span-7">
          <h2 className="flex items-center gap-2 text-sm font-bold">
            <Video className="h-4 w-4 text-purple-500" /> Scheduled Interviews
            ({interviews.length})
          </h2>

          {isLoading ? (
            <p className="text-sm text-muted-foreground">
              Loading interviews...
            </p>
          ) : interviews.length === 0 ? (
            <p className="rounded-lg border bg-muted/30 p-6 text-center text-sm text-muted-foreground">
              No interviews have been scheduled yet.
            </p>
          ) : (
            <div className="space-y-3 text-xs">
              {interviews.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between rounded-xl border bg-card/60 p-4"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-bold text-foreground">
                        {item.candidateName}
                      </p>
                      <Badge variant="accent">{item.interviewType}</Badge>
                    </div>
                    <p className="text-muted-foreground">{item.jobTitle}</p>
                    <p className="flex items-center gap-1 pt-1 text-[11px] text-indigo-400">
                      <Clock className="h-3.5 w-3.5" />
                      {item.scheduledTime} ({item.durationMinutes} mins)
                    </p>
                  </div>
                  <Badge variant="outline" className="capitalize">
                    {item.status}
                  </Badge>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
