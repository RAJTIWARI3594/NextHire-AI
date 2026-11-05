"use client";

import React, { useEffect, useState } from "react";
import { CreditCard, RefreshCw } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { fetchTransactions } from "@/services/saas-service";
import type { PaymentTransaction } from "@/types/saas";

export default function PaymentsManagerPage() {
  const [transactions, setTransactions] = useState<PaymentTransaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    setError(null);
    try { setTransactions(await fetchTransactions()); }
    catch (loadError: unknown) { setError((loadError as Error)?.message || "Payment records could not be loaded."); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  return (
    <div className="mx-auto max-w-6xl space-y-6 p-4 sm:p-8">
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Payment Records</h1>
          <p className="text-sm text-muted-foreground">
            Read-only records from Supabase. No payment gateway is reported as connected
            unless a real payment record identifies it.
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={load} disabled={loading}>
          <RefreshCw className={`mr-2 h-4 w-4 ${loading ? "animate-spin" : ""}`} /> Refresh
        </Button>
      </div>
      {error && <div role="alert" className="rounded-md border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">{error}</div>}
      <Card className="space-y-4 border-border/60 p-6">
        <div className="flex items-center justify-between border-b pb-3">
          <h2 className="flex items-center gap-2 text-sm font-bold"><CreditCard className="h-4 w-4 text-primary" /> Recorded transactions</h2>
          <Badge variant="outline">{transactions.length} records</Badge>
        </div>
        {loading ? (
          <p className="py-8 text-center text-sm text-muted-foreground">Loading transactions...</p>
        ) : transactions.length === 0 ? (
          <p className="py-8 text-center text-sm text-muted-foreground">No payment transactions are recorded in this project yet. Gateway processing and refunds are not configured by this dashboard.</p>
        ) : (
          <div className="space-y-3">
            {transactions.map((tx) => (
              <div key={tx.id} className="flex flex-col justify-between gap-3 rounded-xl border bg-card/60 p-4 sm:flex-row sm:items-center">
                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="text-sm font-semibold">{tx.userName}</p>
                    <Badge variant={tx.status === "success" || tx.status === "paid" ? "success" : "outline"}>{tx.status}</Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">{tx.paymentMethod} · {tx.gateway} · {tx.date}</p>
                  <p className="font-mono text-[10px] text-muted-foreground">Reference: {tx.transactionId}</p>
                </div>
                <p className="text-lg font-extrabold">{tx.currency} {tx.amount.toLocaleString()}</p>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}
