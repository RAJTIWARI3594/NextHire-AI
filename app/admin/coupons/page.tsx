"use client";

import React from "react";
import { Tag, AlertCircle } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function CouponsEnginePage() {
  return (
    <div className="mx-auto max-w-5xl space-y-6 p-4 sm:p-8">
      <div>
        <Badge variant="outline">Not configured</Badge>
        <h1 className="mt-2 text-2xl font-bold tracking-tight">Promotional Codes</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Coupon creation is disabled until a persistent coupon schema and billing integration are configured.
        </p>
      </div>
      <Card className="flex items-start gap-3 border-amber-500/30 p-6">
        <AlertCircle className="mt-0.5 h-5 w-5 text-amber-500" />
        <div className="space-y-1">
          <h2 className="text-sm font-semibold">No coupon records table found</h2>
          <p className="text-sm text-muted-foreground">
            Previous sample codes were stored only in browser state and did not affect checkout or payment amounts. They have been removed.
          </p>
        </div>
      </Card>
    </div>
  );
}
