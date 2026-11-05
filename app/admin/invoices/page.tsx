"use client";

import React, { useEffect, useState } from "react";
import { FileText, Download, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { fetchInvoices } from "@/services/saas-service";
import type { InvoiceItem } from "@/types/saas";

export default function InvoicesManagerPage() {
  const [invoices, setInvoices] = useState<InvoiceItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    setError(null);
    try { setInvoices(await fetchInvoices()); }
    catch (loadError: unknown) { setError((loadError as Error)?.message || "Invoices could not be loaded."); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  return (
    <div className="mx-auto max-w-6xl space-y-6 p-4 sm:p-8">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Invoice Records</h1>
          <p className="text-sm text-muted-foreground">
            Existing invoice rows and stored PDF links only. GST calculations and email dispatch are not inferred.
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={load} disabled={loading}>
          <RefreshCw className={`mr-2 h-4 w-4 ${loading ? "animate-spin" : ""}`} /> Refresh
        </Button>
      </div>
      {error && <div role="alert" className="rounded-md border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">{error}</div>}
      <Card className="space-y-4 border-border/60 p-6">
        <div className="flex items-center justify-between border-b pb-3">
          <h2 className="flex items-center gap-2 text-sm font-bold"><FileText className="h-4 w-4 text-primary" /> Issued invoices</h2>
          <Badge variant="outline">{invoices.length} records</Badge>
        </div>
        {loading ? (
          <p className="py-8 text-center text-sm text-muted-foreground">Loading invoices...</p>
        ) : invoices.length === 0 ? (
          <p className="py-8 text-center text-sm text-muted-foreground">No invoices are recorded in the database.</p>
        ) : (
          <div className="space-y-3">
            {invoices.map((invoice) => (
              <div key={invoice.id} className="flex flex-col justify-between gap-3 rounded-xl border bg-card/60 p-4 sm:flex-row sm:items-center">
                <div className="space-y-1">
                  <div className="flex items-center gap-2"><p className="font-mono text-sm font-bold text-primary">{invoice.invoiceNumber}</p><Badge variant="outline">Recorded</Badge></div>
                  <p className="text-xs text-muted-foreground">{invoice.userName} · {invoice.date}</p>
                  <p className="text-xs text-muted-foreground">Tax amount: {invoice.taxAmount == null ? "Not recorded" : `${invoice.currency} ${invoice.taxAmount.toFixed(2)}`}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm font-extrabold">{invoice.currency} {invoice.amount.toLocaleString()}</span>
                  {invoice.pdfUrl ? (
                    <a href={invoice.pdfUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 rounded-md border px-3 py-2 text-xs font-medium hover:bg-muted">
                      <Download className="h-3.5 w-3.5" /> Open PDF
                    </a>
                  ) : (
                    <Badge variant="outline">No PDF stored</Badge>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}
