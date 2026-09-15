"use client";

import React from "react";
import {
  FileText,
  Download,
  Mail,
  CheckCircle2,
  DollarSign,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useSaaSStore } from "@/lib/store/use-saas-store";

export default function InvoicesManagerPage() {
  const { invoices } = useSaaSStore();

  return (
    <div className="mx-auto max-w-6xl space-y-6 p-4 sm:p-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">
          Automated PDF Invoice Management
        </h1>
        <p className="text-sm text-muted-foreground">
          View tax GST calculations, download official invoice PDFs, and
          dispatch email billing receipts.
        </p>
      </div>

      <Card className="space-y-4 border-border/60 p-6 shadow-sm">
        <div className="flex items-center justify-between border-b pb-3">
          <h2 className="flex items-center gap-2 text-sm font-bold">
            <FileText className="h-4 w-4 text-primary" /> Issued Tax Invoices
          </h2>
          <Badge variant="accent">GST / VAT Included</Badge>
        </div>

        <div className="space-y-3 text-xs">
          {invoices.map((inv) => (
            <div
              key={inv.id}
              className="flex items-center justify-between rounded-xl border bg-card/60 p-4"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <p className="font-mono text-sm font-bold text-primary">
                    {inv.invoiceNumber}
                  </p>
                  <Badge variant="success">Paid</Badge>
                </div>
                <p className="text-muted-foreground">
                  {inv.userName} ({inv.userEmail}) • {inv.date}
                </p>
                <p className="text-[11px] text-muted-foreground">
                  GST/Tax: ${inv.taxAmount} USD
                </p>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-sm font-extrabold text-foreground">
                  ${inv.amount} USD
                </span>
                <Button variant="outline" size="sm" className="gap-1.5 text-xs">
                  <Download className="h-3.5 w-3.5" /> Download PDF
                </Button>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
