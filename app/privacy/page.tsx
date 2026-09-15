import React from "react";
import { ShieldCheck } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { BRANDING } from "@/constants/branding";

export default function PrivacyPage() {
  return (
    <div className="container mx-auto max-w-4xl space-y-8 px-4 py-16 sm:px-8 md:py-24">
      <div className="border-b border-border/40 pb-8">
        <Badge variant="accent" className="mb-4 gap-1.5 px-3 py-1">
          <ShieldCheck className="h-3.5 w-3.5" /> Legal & Governance
        </Badge>
        <h1 className="text-4xl font-extrabold tracking-tight">
          Privacy Policy
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Last Updated: August 5, 2026 | NextHire AI Data Protection Protocol
        </p>
      </div>

      <div className="prose dark:prose-invert max-w-none space-y-6 text-sm leading-relaxed text-muted-foreground">
        <section className="space-y-2">
          <h2 className="text-xl font-bold text-foreground">
            1. Information We Collect
          </h2>
          <p>
            When you use NextHire AI, we collect candidate information including
            uploaded resumes, contact details, work history, and interactive
            voice/text interview responses strictly for assessment purposes.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-xl font-bold text-foreground">
            2. How AI Models Use Your Data
          </h2>
          <p>
            We process data using private, enterprise-tier machine learning
            models. Your candidate data is NEVER sold, exported to public
            dataset training pools, or retained beyond your explicit hiring
            retention windows.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-xl font-bold text-foreground">
            3. Data Security & Storage
          </h2>
          <p>
            All candidate records and metadata are encrypted in transit via TLS
            1.3 and at rest using AES-256 encryption within our Supabase
            PostgreSQL infrastructure.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-xl font-bold text-foreground">
            4. Your Rights (GDPR & CCPA)
          </h2>
          <p>
            Candidates retain the full right to request data extraction, full
            deletion (&quot;Right to be Forgotten&quot;), or opt-out of
            automated interview evaluations at any time by emailing{" "}
            {BRANDING.contactEmail}.
          </p>
        </section>
      </div>
    </div>
  );
}
