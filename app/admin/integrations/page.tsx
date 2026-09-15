"use client";

import React from "react";
import {
  Globe,
  CheckCircle2,
  ShieldCheck,
  Activity,
  RefreshCw,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useDevOpsStore } from "@/lib/store/use-devops-store";

export default function ThirdPartyIntegrationsPage() {
  const { integrations } = useDevOpsStore();

  return (
    <div className="mx-auto max-w-6xl space-y-6 p-4 sm:p-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">
          Third-Party Service Integrations Hub
        </h1>
        <p className="text-sm text-muted-foreground">
          Monitor connection health for OAuth providers, payment gateways, AI
          inference APIs, and email gateways.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {integrations.map((item) => (
          <Card
            key={item.id}
            className="space-y-4 border-border/60 p-5 shadow-sm"
          >
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <h3 className="text-base font-bold">{item.name}</h3>
                <p className="text-xs text-muted-foreground">
                  Provider:{" "}
                  <span className="font-mono text-primary">
                    {item.provider}
                  </span>
                </p>
              </div>
              <Badge variant="success">{item.healthStatus}</Badge>
            </div>

            <div className="flex items-center justify-between border-t border-border/40 pt-2 text-xs">
              <span className="flex items-center gap-1 text-emerald-400">
                <CheckCircle2 className="h-3.5 w-3.5" /> Connected
              </span>
              <Button variant="ghost" size="sm" className="h-7 text-xs">
                Test Connection
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
