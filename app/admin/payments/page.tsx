"use client";

import React, { useState } from "react";
import {
  CreditCard,
  DollarSign,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  Download,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useSaaSStore } from "@/lib/store/use-saas-store";

export default function PaymentGatewaysPage() {
  const { transactions } = useSaaSStore();

  return (
    <div className="mx-auto max-w-6xl space-y-6 p-4 sm:p-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">
          Payment Gateways & Transaction Logs
        </h1>
        <p className="text-sm text-muted-foreground">
          Monitor Stripe & Razorpay integration health, live subscription
          charges, and refund requests.
        </p>
      </div>

      {/* Gateway Connection Status Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Card className="flex items-center justify-between border-border/60 p-5">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold">
                Stripe Payments (Global)
              </span>
              <Badge variant="success">Connected Live</Badge>
            </div>
            <p className="text-xs text-muted-foreground">
              Webhook endpoint active • Auto-invoicing enabled
            </p>
          </div>
          <CreditCard className="h-6 w-6 text-primary" />
        </Card>

        <Card className="flex items-center justify-between border-border/60 p-5">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold">
                Razorpay Payments (India / UPI)
              </span>
              <Badge variant="success">Connected Live</Badge>
            </div>
            <p className="text-xs text-muted-foreground">
              UPI & Net Banking enabled • Auto-reconciliation
            </p>
          </div>
          <CreditCard className="h-6 w-6 text-primary" />
        </Card>
      </div>

      {/* Transaction History Table */}
      <Card className="space-y-4 border-border/60 p-6 shadow-sm">
        <div className="flex items-center justify-between border-b pb-3">
          <h2 className="flex items-center gap-2 text-sm font-bold">
            <DollarSign className="h-4 w-4 text-emerald-500" /> Live Transaction
            Feed
          </h2>
          <Button variant="outline" size="sm" className="gap-1.5 text-xs">
            <Download className="h-3.5 w-3.5" /> Export Payment CSV
          </Button>
        </div>

        <div className="space-y-3 text-xs">
          {transactions.map((tx) => (
            <div
              key={tx.id}
              className="flex flex-col items-start justify-between gap-4 rounded-xl border bg-card/60 p-4 sm:flex-row sm:items-center"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <p className="font-bold text-foreground">{tx.userName}</p>
                  <Badge variant="outline" className="capitalize">
                    {tx.gateway}
                  </Badge>
                  <Badge variant="success">{tx.status}</Badge>
                </div>
                <p className="text-muted-foreground">
                  {tx.userEmail} • Tx ID: {tx.transactionId} • {tx.date}
                </p>
              </div>

              <div className="text-right">
                <p className="text-sm font-extrabold text-emerald-400">
                  ${tx.amount} {tx.currency}
                </p>
                <p className="text-[10px] uppercase text-muted-foreground">
                  {tx.paymentMethod}
                </p>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
