import React from "react";
import Link from "next/link";
import {
  Sparkles,
  Globe,
  Github,
  Linkedin,
  Mail,
  ExternalLink,
  ShieldCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Avatar } from "@/components/ui/avatar";

export default async function PublicPortfolioPage({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const { username } = await params;

  return (
    <div className="mx-auto min-h-screen max-w-4xl space-y-12 bg-background px-4 py-16 text-foreground sm:px-8">
      {/* Portfolio Header */}
      <div className="flex flex-col items-center gap-6 border-b border-border/40 pb-8 sm:flex-row sm:items-start">
        <Avatar
          fallback={username.slice(0, 2).toUpperCase()}
          size="lg"
          className="h-24 w-24 border-4 border-indigo-500/40 text-2xl"
        />
        <div className="flex-1 space-y-2 text-center sm:text-left">
          <div className="flex flex-wrap items-center justify-center gap-2 sm:justify-start">
            <h1 className="text-3xl font-extrabold capitalize tracking-tight">
              {username}
            </h1>
            <Badge variant="accent" className="gap-1">
              <ShieldCheck className="h-3.5 w-3.5" /> NextHire Verified
              Candidate
            </Badge>
          </div>
          <p className="text-base font-semibold text-indigo-400">
            Senior Full Stack Engineer
          </p>
          <p className="max-w-xl text-xs leading-relaxed text-muted-foreground">
            Specialized in Next.js 15, React 19, TypeScript, and Supabase
            PostgreSQL architecture. Stanford CS Candidate.
          </p>

          <div className="flex items-center justify-center gap-3 pt-2 sm:justify-start">
            <a href="https://github.com" target="_blank" rel="noreferrer">
              <Button variant="outline" size="sm" className="gap-1.5 text-xs">
                <Github className="h-4 w-4" /> GitHub
              </Button>
            </a>
            <a href="https://linkedin.com" target="_blank" rel="noreferrer">
              <Button variant="outline" size="sm" className="gap-1.5 text-xs">
                <Linkedin className="h-4 w-4" /> LinkedIn
              </Button>
            </a>
          </div>
        </div>
      </div>

      {/* Featured Projects */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold tracking-tight">Featured Projects</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Card className="space-y-3 border-indigo-500/20 p-6 transition-all hover:border-indigo-500/50">
            <h3 className="text-base font-bold">NextHire AI Talent Platform</h3>
            <p className="text-xs leading-relaxed text-muted-foreground">
              Autonomous AI recruiting platform with real-time video evaluation
              and strict RLS security policies.
            </p>
            <div className="flex flex-wrap gap-1 pt-1">
              <Badge variant="outline">Next.js 15</Badge>
              <Badge variant="outline">Supabase</Badge>
              <Badge variant="outline">TypeScript</Badge>
            </div>
          </Card>

          <Card className="space-y-3 border-purple-500/20 p-6 transition-all hover:border-purple-500/50">
            <h3 className="text-base font-bold">Distributed Vector Database</h3>
            <p className="text-xs leading-relaxed text-muted-foreground">
              High-throughput vector search index built for sub-millisecond LLM
              RAG pipelines.
            </p>
            <div className="flex flex-wrap gap-1 pt-1">
              <Badge variant="outline">Python</Badge>
              <Badge variant="outline">PyTorch</Badge>
              <Badge variant="outline">PostgreSQL</Badge>
            </div>
          </Card>
        </div>
      </div>

      {/* Contact CTA */}
      <div className="space-y-4 rounded-2xl border border-indigo-500/30 bg-gradient-to-r from-indigo-950/40 via-card to-purple-950/30 p-8 text-center">
        <h2 className="text-2xl font-bold">Interested in Hiring {username}?</h2>
        <p className="mx-auto max-w-md text-xs text-muted-foreground">
          Send an interview invitation or recruiter message directly via
          NextHire AI.
        </p>
        <Link href="/contact">
          <Button variant="gradient" size="lg" className="gap-2">
            <Mail className="h-4 w-4" /> Send Recruiter Inquiry
          </Button>
        </Link>
      </div>
    </div>
  );
}
