"use client";

import React, { useState } from "react";
import {
  CreditCard,
  Check,
  Sparkles,
  Plus,
  Users,
  ShieldCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useSaaSStore } from "@/lib/store/use-saas-store";

export default function SubscriptionsManagementPage() {
  const { plans } = useSaaSStore();
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">(
    "monthly"
  );

  return (
    <div className="mx-auto max-w-6xl space-y-6 p-4 sm:p-8">
      <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            Subscription Plans & Tier Management
          </h1>
          <p className="text-sm text-muted-foreground">
            Configure pricing tiers, active features, subscriber quotas, and
            billing frequencies.
          </p>
        </div>

        <div className="flex gap-1 rounded-lg bg-muted p-1">
          <button
            onClick={() => setBillingCycle("monthly")}
            className={`rounded-md px-3 py-1 text-xs font-semibold transition-all ${
              billingCycle === "monthly"
                ? "bg-primary text-white shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Monthly Billing
          </button>
          <button
            onClick={() => setBillingCycle("yearly")}
            className={`rounded-md px-3 py-1 text-xs font-semibold transition-all ${
              billingCycle === "yearly"
                ? "bg-primary text-white shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Yearly (Save 20%)
          </button>
        </div>
      </div>

      {/* Plans Cards */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {plans.map((plan) => {
          const price =
            billingCycle === "monthly" ? plan.priceMonthly : plan.priceYearly;
          return (
            <Card
              key={plan.id}
              className={`flex flex-col justify-between space-y-6 border-border/60 p-6 shadow-sm ${
                plan.name === "Pro"
                  ? "border-primary/30 bg-primary/5 ring-2 ring-primary/30"
                  : ""
              }`}
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-extrabold">{plan.name} Plan</h3>
                  {plan.name === "Pro" && (
                    <Badge variant="accent">Most Popular</Badge>
                  )}
                </div>

                <div>
                  <span className="text-3xl font-extrabold">${price}</span>
                  <span className="text-xs text-muted-foreground">
                    {" "}
                    / {billingCycle === "monthly" ? "month" : "year"}
                  </span>
                </div>

                <div className="space-y-2 border-t border-border/40 pt-4 text-xs">
                  <p className="font-semibold uppercase text-muted-foreground">
                    Included Capabilities:
                  </p>
                  {plan.features.map((feat) => (
                    <div key={feat} className="flex items-center gap-2">
                      <Check className="h-4 w-4 shrink-0 text-emerald-500" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between border-t border-border/40 pt-4">
                <span className="text-xs text-muted-foreground">
                  Subscribers:{" "}
                  <span className="font-bold text-foreground">
                    {plan.subscriberCount?.toLocaleString()}
                  </span>
                </span>
                <Button variant="outline" size="sm" className="text-xs">
                  Edit Plan
                </Button>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
