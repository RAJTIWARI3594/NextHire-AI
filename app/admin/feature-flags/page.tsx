"use client";

import React from "react";
import { Layers, Sparkles, CheckCircle2, AlertCircle } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useDevOpsStore } from "@/lib/store/use-devops-store";

export default function FeatureFlagsPage() {
  const { flags, toggleFlag } = useDevOpsStore();

  return (
    <div className="mx-auto max-w-6xl space-y-6 p-4 sm:p-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">
          Feature Flag & Gradual Rollout Management
        </h1>
        <p className="text-sm text-muted-foreground">
          Instantly enable, disable, or canary rollout platform capabilities
          across active users.
        </p>
      </div>

      <div className="space-y-4">
        {flags.map((flag) => (
          <Card
            key={flag.id}
            className="space-y-4 border-border/60 p-6 shadow-sm"
          >
            <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-bold">{flag.name}</h3>
                  <Badge variant={flag.isEnabled ? "success" : "outline"}>
                    {flag.isEnabled ? "Enabled" : "Disabled"}
                  </Badge>
                  <Badge variant="accent">
                    {flag.rolloutPercentage}% Rollout
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground">
                  {flag.description} • Key:{" "}
                  <span className="font-mono text-primary">{flag.key}</span>
                </p>
              </div>

              <Button
                variant={flag.isEnabled ? "outline" : "default"}
                size="sm"
                onClick={() => toggleFlag(flag.id)}
                className="shrink-0 text-xs"
              >
                {flag.isEnabled ? "Disable Feature" : "Enable Feature"}
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
