"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  Sparkles,
  Target,
  Cpu,
  ShieldCheck,
  HeartHandshake,
} from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BRANDING } from "@/constants/branding";

const values = [
  {
    icon: Target,
    title: "Precision Matching",
    description:
      "We eliminate guessing games by analyzing true skill competency over resume formatting fluff.",
  },
  {
    icon: Cpu,
    title: "Next-Gen AI First",
    description:
      "Leveraging cutting edge LLM models and neural interview synthesis for real-time candidate evaluation.",
  },
  {
    icon: ShieldCheck,
    title: "Bias-Free Evaluation",
    description:
      "Every candidate gets evaluated on merit alone, ensuring equitable hiring at scale.",
  },
  {
    icon: HeartHandshake,
    title: "Human-In-The-Loop",
    description:
      "AI empowers recruiters with actionable insights, leaving final hiring decisions in expert human hands.",
  },
];

export default function AboutPage() {
  return (
    <div className="container mx-auto max-w-5xl px-4 py-16 sm:px-8 md:py-24">
      <div className="mx-auto max-w-3xl space-y-4 text-center">
        <Badge variant="default" className="gap-1.5 px-3 py-1">
          <Sparkles className="h-3.5 w-3.5" /> About NextHire AI
        </Badge>
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
          Reinventing How Global Teams Discover &amp; Hire Talent
        </h1>
        <p className="text-lg leading-relaxed text-muted-foreground">
          {BRANDING.mission}
        </p>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.15 }}
        className="mt-16 grid grid-cols-1 items-center gap-6 md:grid-cols-2"
      >
        <Card className="p-8">
          <CardHeader className="mb-4 p-0">
            <CardTitle className="text-xl font-semibold">Our Story</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 p-0 text-sm leading-relaxed text-muted-foreground">
            <p>
              Traditional recruitment processes are plagued by slow resume
              screening, scheduling bottlenecks, and subconscious human bias.
            </p>
            <p>
              NextHire AI was founded by engineers and talent leaders to build
              an intelligent, transparent platform that connects companies with
              top talent in minutes instead of weeks.
            </p>
          </CardContent>
        </Card>

        <Card className="p-8">
          <CardHeader className="mb-4 p-0">
            <CardTitle className="text-xl font-semibold">
              Tech Stack &amp; Architecture
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 p-0 text-sm text-muted-foreground">
            {[
              { label: "Framework", value: "Next.js 15 (App Router)" },
              { label: "Language", value: "TypeScript & React 19" },
              { label: "Backend & Database", value: "Supabase PostgreSQL" },
              {
                label: "State & Data Query",
                value: "Zustand + TanStack Query",
              },
            ].map((item) => (
              <div
                key={item.label}
                className="flex items-center justify-between border-b border-border/40 pb-2 last:border-0"
              >
                <span className="font-medium text-foreground">
                  {item.label}
                </span>
                <span className="font-mono text-xs text-primary">
                  {item.value}
                </span>
              </div>
            ))}
          </CardContent>
        </Card>
      </motion.div>

      <div className="mt-20">
        <h2 className="mb-10 text-center text-2xl font-bold tracking-tight">
          Our Core Principles
        </h2>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          {values.map((val, i) => {
            const Icon = val.icon;
            return (
              <motion.div
                key={val.title}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: i * 0.08 }}
              >
                <Card className="hover-lift h-full">
                  <CardHeader>
                    <div className="mb-2 flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                      <Icon className="h-4 w-4" />
                    </div>
                    <CardTitle className="text-base font-semibold">
                      {val.title}
                    </CardTitle>
                    <CardDescription className="mt-1.5 text-sm leading-relaxed">
                      {val.description}
                    </CardDescription>
                  </CardHeader>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
