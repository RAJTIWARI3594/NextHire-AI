"use client";

import React, { useEffect, useState } from "react";
import { CreditCard, Users, AlertCircle, RefreshCw } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { fetchSubscriptionsOverview } from "@/services/saas-service";
import type { SubscriptionPlan } from "@/types/saas";

export default function SubscriptionsManagementPage() {
  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    setError(null);
    try { setPlans(await fetchSubscriptionsOverview()); }
    catch (loadError: unknown) { setError((loadError as Error)?.message || "Subscription records could not be loaded."); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  return (
    <div className="mx-auto max-w-6xl space-y-6 p-4 sm:p-8">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Subscription Activity</h1>
          <p className="text-sm text-muted-foreground">
            Counts from recorded subscription rows. Pricing plans and checkout configuration are not stored in this database.
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={load} disabled={loading}>
          <RefreshCw className={`mr-2 h-4 w-4 ${loading ? "animate-spin" : ""}`} /> Refresh
        </Button>
      </div>
      {error && <div role="alert" className="rounded-md border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">{error}</div>}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Card className="space-y-2 p-5">
          <CreditCard className="h-5 w-5 text-primary" />
          <p className="text-xs uppercase text-muted-foreground">Recorded subscription plans</p>
          <p className="text-2xl font-extrabold">{loading ? "…" : plans.length}</p>
        </Card>
        <Card className="space-y-2 p-5">
          <Users className="h-5 w-5 text-primary" />
          <p className="text-xs uppercase text-muted-foreground">Subscribers in records</p>
          <p className="text-2xl font-extrabold">{loading ? "…" : plans.reduce((total, plan) => total + (plan.subscriberCount || 0), 0)}</p>
        </Card>
      </div>
      <Card className="space-y-4 p-6">
        <h2 className="text-sm font-bold">Subscription records by plan</h2>
        {loading ? (
          <p className="text-sm text-muted-foreground">Loading subscriptions...</p>
        ) : plans.length === 0 ? (
          <div className="flex items-start gap-3 rounded-lg border bg-muted/30 p-5">
            <AlertCircle className="mt-0.5 h-4 w-4 text-amber-500" />
            <p className="text-sm text-muted-foreground">
              No subscriptions have been recorded. A plan-pricing table and live billing gateway are not configured, so no prices or subscriber totals are invented.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {plans.map((plan) => (
              <div key={plan.id} className="flex items-center justify-between rounded-lg border p-4">
                <div><p className="font-semibold">{plan.name}</p><p className="text-xs text-muted-foreground">{plan.subscriberCount} records · Pricing not configured</p></div>
                <Badge variant={plan.isActive ? "success" : "outline"}>{plan.isActive ? "Has active subscribers" : "No active subscribers"}</Badge>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}
