"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { GraduationCap, Briefcase, ArrowRight, Sparkles } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAuthStore } from "@/lib/store/use-auth-store";

export default function SignupPage() {
  const router = useRouter();
  const { initializeAuth, isInitialized, user } = useAuthStore();

  useEffect(() => {
    if (!isInitialized) initializeAuth();
  }, [initializeAuth, isInitialized]);

  useEffect(() => {
    if (user) {
      const role = user.user_metadata?.role || "student";
      if (role === "recruiter") router.replace("/recruiter");
      else if (role === "admin") router.replace("/admin");
      else router.replace("/dashboard");
    }
  }, [user, router]);

  return (
    <div className="relative flex min-h-[calc(100vh-8rem)] items-center justify-center px-4 py-12">
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,rgba(59,130,246,0.12),transparent_60%)]" />
      <div className="w-full max-w-2xl">
        <div className="mb-8 text-center">
          <Badge variant="accent" className="mb-3">
            <Sparkles className="mr-1 h-3 w-3" /> Join NextHire AI
          </Badge>
          <h1 className="text-3xl font-bold tracking-tight">
            How do you want to get started?
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Choose the workspace that fits your goals.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Link href="/signup/student">
            <Card className="group cursor-pointer transition-all hover:border-primary/50 hover:bg-primary/5">
              <CardContent className="p-6">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <GraduationCap className="h-6 w-6" />
                </div>
                <h2 className="text-lg font-semibold">I&apos;m a Student</h2>
                <p className="mt-1.5 text-sm text-muted-foreground">
                  Build your resume, practice interviews, browse jobs, and track
                  applications all in one place.
                </p>
                <div className="mt-4 flex items-center gap-1.5 text-sm font-medium text-primary">
                  Sign up as student
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </div>
              </CardContent>
            </Card>
          </Link>

          <Link href="/signup/recruiter">
            <Card className="group cursor-pointer transition-all hover:border-primary/50 hover:bg-primary/5">
              <CardContent className="p-6">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-amber-500/10 text-amber-500">
                  <Briefcase className="h-6 w-6" />
                </div>
                <h2 className="text-lg font-semibold">I&apos;m a Recruiter</h2>
                <p className="mt-1.5 text-sm text-muted-foreground">
                  Post jobs, review ranked candidates, schedule interviews, and
                  send offers to top talent.
                </p>
                <div className="mt-4 flex items-center gap-1.5 text-sm font-medium text-amber-500">
                  Sign up as recruiter
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </div>
              </CardContent>
            </Card>
          </Link>
        </div>

        <p className="mt-6 text-center text-xs text-muted-foreground">
          Already have an account?{" "}
          <Link
            href="/login"
            className="font-medium text-primary hover:underline"
          >
            Sign in
          </Link>
          {"  "}·{"  "}
          <Link href="/" className="font-medium text-primary hover:underline">
            Back to home
          </Link>
        </p>
      </div>
    </div>
  );
}
