"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Globe,
  Palette,
  ExternalLink,
  Sparkles,
  CheckCircle2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAuthStore } from "@/lib/store/use-auth-store";

export default function PortfolioGeneratorPage() {
  const { profile, user } = useAuthStore();
  const [username, setUsername] = useState("rajtiwari");
  const [theme, setTheme] = useState("modern_indigo");
  const [isSaved, setIsSaved] = useState(false);

  const handleSave = () => {
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  return (
    <div className="mx-auto max-w-5xl space-y-6 p-4 sm:p-8">
      <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            Student Portfolio Website Generator
          </h1>
          <p className="text-sm text-muted-foreground">
            Instantly turn your student profile into a shareable personal
            website.
          </p>
        </div>

        <Link href={`/portfolio/${username}`} target="_blank">
          <Button variant="gradient" className="gap-2">
            <ExternalLink className="h-4 w-4" /> View Live Portfolio
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Settings */}
        <Card className="space-y-4 border-border/60 p-6 lg:col-span-1">
          <h2 className="flex items-center gap-2 text-sm font-bold">
            <Palette className="h-4 w-4 text-primary" /> Portfolio Settings
          </h2>

          <div className="space-y-4 text-xs">
            <div className="space-y-1">
              <label className="font-semibold uppercase text-muted-foreground">
                Custom Username
              </label>
              <Input
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
              <p className="pt-1 text-[10px] text-muted-foreground">
                URL:{" "}
                <span className="font-mono text-primary">
                  nexthire.ai/portfolio/{username}
                </span>
              </p>
            </div>

            <div className="space-y-2">
              <label className="font-semibold uppercase text-muted-foreground">
                Color Theme
              </label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { id: "modern_indigo", name: "Indigo Night" },
                  { id: "emerald_dark", name: "Emerald Cyber" },
                  { id: "sunset_amber", name: "Amber Glow" },
                  { id: "cyber_purple", name: "Neon Purple" },
                ].map((t) => (
                  <button
                    key={t.id}
                    onClick={() => setTheme(t.id)}
                    className={`rounded-lg border p-2 text-left text-xs font-semibold transition-all ${
                      theme === t.id
                        ? "border-primary bg-primary text-white"
                        : "bg-card hover:bg-muted"
                    }`}
                  >
                    {t.name}
                  </button>
                ))}
              </div>
            </div>

            <Button
              variant="default"
              onClick={handleSave}
              className="mt-2 w-full"
            >
              {isSaved ? "Saved Portfolio!" : "Save Portfolio Config"}
            </Button>
          </div>
        </Card>

        {/* Live Portfolio Preview Box */}
        <Card className="space-y-6 border-border/60 bg-gradient-to-br from-card via-card to-primary/5 p-8 lg:col-span-2">
          <div className="flex items-center justify-between border-b pb-4">
            <Badge variant="accent">Live Interactive Portfolio Preview</Badge>
            <span className="font-mono text-xs text-muted-foreground">
              nexthire.ai/portfolio/{username}
            </span>
          </div>

          <div className="space-y-6 text-center sm:text-left">
            <div className="space-y-2">
              <h2 className="text-3xl font-extrabold tracking-tight">
                Hi, I&apos;m{" "}
                {profile?.full_name ||
                  (user?.email || "").split("@")[0] ||
                  "Student"}{" "}
                👋
              </h2>
              <p className="text-sm font-semibold text-primary">
                Senior Full Stack Engineer & System Architect
              </p>
              <p className="max-w-lg text-xs leading-relaxed text-muted-foreground">
                Building Next.js 15 apps, TypeScript SDKs, and high-performance
                Supabase PostgreSQL database architecture.
              </p>
            </div>

            <div className="space-y-2 border-t border-border/40 pt-4 text-xs">
              <h3 className="font-bold text-foreground">Featured Project</h3>
              <div className="flex items-center justify-between rounded-xl border bg-background/60 p-3">
                <div>
                  <p className="font-semibold">NextHire AI Platform</p>
                  <p className="text-[11px] text-muted-foreground">
                    Autonomous AI Recruiting System
                  </p>
                </div>
                <Badge variant="outline">Next.js 15</Badge>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
