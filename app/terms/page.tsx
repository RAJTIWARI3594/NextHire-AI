import React from "react";
import { FileText } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function TermsPage() {
  return (
    <div className="container mx-auto max-w-4xl space-y-8 px-4 py-16 sm:px-8 md:py-24">
      <div className="border-b border-border/40 pb-8">
        <Badge variant="accent" className="mb-4 gap-1.5 px-3 py-1">
          <FileText className="h-3.5 w-3.5" /> Terms of Service
        </Badge>
        <h1 className="text-4xl font-extrabold tracking-tight">
          Terms & Conditions
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Effective Date: August 5, 2026 | NextHire AI Master Services Agreement
        </p>
      </div>

      <div className="prose dark:prose-invert max-w-none space-y-6 text-sm leading-relaxed text-muted-foreground">
        <section className="space-y-2">
          <h2 className="text-xl font-bold text-foreground">
            1. Platform Acceptance
          </h2>
          <p>
            By accessing NextHire AI software, enterprise dashboards, or
            automated AI interview engines, you agree to comply with these terms
            and conditions in full.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-xl font-bold text-foreground">
            2. Fair Hiring Compliance
          </h2>
          <p>
            Customers using NextHire AI agree to comply with local labor laws,
            EEOC guidelines, and anti-discrimination hiring regulations.
            NextHire AI acts as an intelligence assistant; final hiring
            authority rests with the client enterprise.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-xl font-bold text-foreground">
            3. System Availability & Service Levels
          </h2>
          <p>
            We strive for 99.9% platform uptime across our Supabase database
            clusters, API gateways, and Next.js edge deployments.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-xl font-bold text-foreground">
            4. Intellectual Property
          </h2>
          <p>
            All AI algorithms, branding elements, UI component libraries, and
            proprietary scoring models remain the sole property of NextHire AI
            Inc.
          </p>
        </section>
      </div>
    </div>
  );
}
