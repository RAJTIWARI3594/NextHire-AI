"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  FileText,
  Briefcase,
  Video,
  BookOpen,
  ArrowRight,
  CheckCircle2,
  Play,
  Layers,
  Sparkles,
  TrendingUp,
  UserCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Modal } from "@/components/ui/modal";

const platformFeatures = [
  {
    icon: FileText,
    title: "Resume Builder & Review",
    description:
      "Craft professional ATS-optimized resumes with real-time score feedback and keyword recommendations.",
  },
  {
    icon: Briefcase,
    title: "Curated Job Opportunities",
    description:
      "Discover tech roles matched directly to your verified skills, experience level, and career preferences.",
  },
  {
    icon: Video,
    title: "Interactive Interview Practice",
    description:
      "Practice mock technical and behavioral interviews with actionable performance feedback.",
  },
  {
    icon: BookOpen,
    title: "Personalized Learning Paths",
    description:
      "Follow structured roadmaps to master high-demand software engineering and product skills.",
  },
];

const howItWorksSteps = [
  {
    step: "01",
    title: "Build your profile",
    description:
      "Define your skills, projects, and career targets to stand out to hiring managers.",
  },
  {
    step: "02",
    title: "Improve your skills",
    description:
      "Follow structured learning roadmaps to close skill gaps and gain confidence.",
  },
  {
    step: "03",
    title: "Discover opportunities",
    description:
      "Access curated jobs and internships tailored to your profile and location.",
  },
  {
    step: "04",
    title: "Prepare and apply",
    description:
      "Practice mock interviews, tailor your resume, and apply directly on employer websites.",
  },
  {
    step: "05",
    title: "Track your progress",
    description:
      "Monitor your preparation, assessment scores, and career growth in one workspace.",
  },
];

export default function HomePage() {
  const [isDemoModalOpen, setIsDemoModalOpen] = useState(false);

  return (
    <div className="flex min-h-screen flex-col bg-[#080B12] text-foreground">
      {/* Hero Section */}
      <section className="relative overflow-hidden border-b border-border/60 pb-16 pt-20 md:pb-28 md:pt-28">
        <div className="container mx-auto max-w-4xl px-4 text-center sm:px-8">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="mb-6 inline-flex items-center gap-2 rounded-full border border-border/80 bg-card px-3.5 py-1 text-xs font-semibold text-muted-foreground"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-primary" />
            <span>NextHire Career Platform</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: 0.05 }}
            className="mx-auto text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl md:text-6xl"
          >
            BUILD THE CAREER <br />
            <span className="text-primary">YOU WANT.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: 0.1 }}
            className="mx-auto mt-6 max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-base"
          >
            Learn the right skills, build a stronger profile, discover relevant
            jobs, prepare for interviews, and track your career progress all in
            one place.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: 0.15 }}
            className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row"
          >
            <Link href="/dashboard">
              <Button
                size="lg"
                className="w-full gap-2 px-6 font-semibold sm:w-auto"
              >
                Get started <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link href="/opportunities">
              <Button
                variant="outline"
                size="lg"
                className="w-full gap-2 border-border/80 sm:w-auto"
              >
                Browse jobs
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* How NextHire Works */}
      <section
        id="how-it-works"
        className="border-b border-border/60 bg-card/20 py-20"
      >
        <div className="container mx-auto max-w-5xl px-4 sm:px-8">
          <div className="mx-auto mb-14 max-w-2xl text-center">
            <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
              HOW NEXTHIRE WORKS
            </h2>
            <p className="mt-2 text-xs text-muted-foreground sm:text-sm">
              A structured step-by-step path to advance your professional
              career.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-5">
            {howItWorksSteps.map((step, idx) => (
              <div
                key={step.step}
                className="flex flex-col rounded-lg border border-border/80 bg-card p-5 transition-colors hover:border-primary/50"
              >
                <span className="mb-3 text-xs font-bold tracking-wider text-primary">
                  {step.step}
                </span>
                <h3 className="mb-1 text-sm font-semibold text-foreground">
                  {step.title}
                </h3>
                <p className="text-xs leading-relaxed text-muted-foreground">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Core Platform Modules */}
      <section className="border-b border-border/60 py-20">
        <div className="container mx-auto max-w-5xl px-4 sm:px-8">
          <div className="mx-auto mb-12 max-w-2xl text-center">
            <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
              EVERYTHING FOR YOUR CAREER
            </h2>
            <p className="mt-2 text-xs text-muted-foreground sm:text-sm">
              Integrated tools designed to guide you from learning to landing
              top offers.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            {platformFeatures.map((feat) => {
              const Icon = feat.icon;
              return (
                <Card key={feat.title} className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md border border-border/60 bg-secondary text-primary">
                      <Icon className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="text-base font-semibold text-foreground">
                        {feat.title}
                      </h3>
                      <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                        {feat.description}
                      </p>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Footer Section */}
      <section className="bg-card/40 py-16">
        <div className="container mx-auto max-w-3xl px-4 text-center sm:px-8">
          <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            Ready to take the next step in your career?
          </h2>
          <p className="mt-3 text-xs text-muted-foreground sm:text-sm">
            Join thousands of developers and professionals managing their growth
            on NextHire.
          </p>
          <div className="mt-6 flex justify-center">
            <Link href="/dashboard">
              <Button size="lg" className="gap-2 font-semibold">
                Open Workspace <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
