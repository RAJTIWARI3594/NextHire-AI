"use client";

import React, { useState } from "react";
import { KeyRound, RefreshCw, CheckCircle2, Copy, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useDevOpsStore } from "@/lib/store/use-devops-store";

export default function ApiKeysPage() {
  const { apiKeys, rotateApiKey } = useDevOpsStore();
  const [rotatedId, setRotatedId] = useState<string | null>(null);

  const handleRotate = (id: string) => {
    rotateApiKey(id);
    setRotatedId(id);
    setTimeout(() => setRotatedId(null), 2000);
  };

  return (
    <div className="mx-auto max-w-6xl space-y-6 p-4 sm:p-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">
          API Key Management & Webhook Secret Rotation
        </h1>
        <p className="text-sm text-muted-foreground">
          Manage Google Gemini AI, Stripe, Razorpay, and OpenAI secret keys with
          zero-downtime rotation.
        </p>
      </div>

      <div className="space-y-4">
        {apiKeys.map((key) => (
          <Card
            key={key.id}
            className="space-y-4 border-border/60 p-6 shadow-sm"
          >
            <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-bold">{key.keyName}</h3>
                  <Badge variant="success">Active Key</Badge>
                </div>
                <p className="text-xs text-muted-foreground">
                  Provider: {key.provider} • Key:{" "}
                  <span className="font-mono text-primary">
                    {key.maskedKey}
                  </span>{" "}
                  • Last Used: {key.lastUsed}
                </p>
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={() => handleRotate(key.id)}
                className="shrink-0 gap-1.5 text-xs"
              >
                <RefreshCw className="h-3.5 w-3.5" />
                {rotatedId === key.id ? "Key Rotated!" : "Rotate Secret Key"}
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
