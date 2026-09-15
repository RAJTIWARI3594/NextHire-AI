"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, Briefcase, Building2 } from "lucide-react";
import {
  recruiterSignupSchema,
  type RecruiterSignupFormData,
} from "@/lib/validations/auth";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAuthStore } from "@/lib/store/use-auth-store";
import { isSupabaseConfigured } from "@/lib/supabase/client";
import { signUpRecruiter } from "@/services/auth-service";

export default function RecruiterSignupPage() {
  const router = useRouter();
  const { initializeAuth, setDemoUser, user, isInitialized } = useAuthStore();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!isInitialized) initializeAuth();
  }, [initializeAuth, isInitialized]);

  useEffect(() => {
    if (user) {
      router.replace("/recruiter");
    }
  }, [user, router]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RecruiterSignupFormData>({
    resolver: zodResolver(recruiterSignupSchema),
    defaultValues: {
      fullName: "",
      companyName: "",
      companyEmail: "",
      password: "",
      confirmPassword: "",
      companyWebsite: "",
      designation: "",
    },
  });

  const onSubmit = async (data: RecruiterSignupFormData) => {
    setError(null);
    setIsSubmitting(true);
    try {
      if (!isSupabaseConfigured()) {
        setDemoUser(data.companyEmail, "recruiter");
        setTimeout(() => router.replace("/recruiter"), 800);
        return;
      }

      const result = await signUpRecruiter(data);
      if (result?.user) {
        setSuccess(
          "Account created! Please check your email to verify, then sign in."
        );
        setTimeout(() => router.replace("/login?registered=1"), 1500);
      }
    } catch (err: any) {
      const msg = err?.message || "Something went wrong. Please try again.";
      if (
        msg.toLowerCase().includes("already registered") ||
        msg.toLowerCase().includes("already exists")
      ) {
        setError(
          "An account with this email already exists. Please sign in instead."
        );
      } else {
        setError(msg);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // Local state for success message (kept separate from error)
  const [success, setSuccess] = useState<string | null>(null);

  return (
    <div className="relative flex min-h-[calc(100vh-8rem)] items-center justify-center px-4 py-12">
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,rgba(245,158,11,0.12),transparent_60%)]" />
      <div className="w-full max-w-lg">
        <div className="mb-6 text-center">
          <Badge variant="secondary" className="mb-3">
            <Briefcase className="mr-1 h-3 w-3" /> Recruiter Account
          </Badge>
          <h1 className="text-3xl font-bold tracking-tight">
            Create your recruiter account
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Post jobs, discover ranked candidates and hire faster.
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-sm">
              <Building2 className="h-4 w-4 text-amber-500" /> Company Sign Up
            </CardTitle>
            <CardDescription>
              Fill in your details below to get started.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="space-y-4"
              noValidate
            >
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <Input
                  placeholder="Your full name"
                  error={errors.fullName?.message}
                  {...register("fullName")}
                />
                <Input
                  placeholder="Company name"
                  error={errors.companyName?.message}
                  {...register("companyName")}
                />
              </div>
              <Input
                type="email"
                placeholder="Company email"
                error={errors.companyEmail?.message}
                {...register("companyEmail")}
              />
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <Input
                  placeholder="Company website (https://...)"
                  error={errors.companyWebsite?.message}
                  {...register("companyWebsite")}
                />
                <Input
                  placeholder="Designation (e.g. Talent Lead)"
                  error={errors.designation?.message}
                  {...register("designation")}
                />
              </div>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="Password"
                    error={errors.password?.message}
                    {...register("password")}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    className="absolute right-3 top-2.5 text-muted-foreground/60 hover:text-foreground"
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
                <div className="relative">
                  <Input
                    type={showConfirm ? "text" : "password"}
                    placeholder="Confirm password"
                    error={errors.confirmPassword?.message}
                    {...register("confirmPassword")}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirm((v) => !v)}
                    className="absolute right-3 top-2.5 text-muted-foreground/60 hover:text-foreground"
                    aria-label={showConfirm ? "Hide password" : "Show password"}
                  >
                    {showConfirm ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>

              {error && (
                <div className="rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2.5 text-xs text-destructive">
                  {error}
                </div>
              )}
              {success && (
                <div className="rounded-md border border-emerald-500/30 bg-emerald-500/10 px-3 py-2.5 text-xs text-emerald-600 dark:text-emerald-400">
                  {success}
                </div>
              )}

              <Button
                type="submit"
                size="lg"
                className="w-full"
                isLoading={isSubmitting}
              >
                <Briefcase className="h-4 w-4" /> Create Recruiter Account
              </Button>
            </form>

            <p className="mt-5 text-center text-xs text-muted-foreground">
              Already have an account?{" "}
              <Link
                href="/login"
                className="font-medium text-primary hover:underline"
              >
                Sign in
              </Link>
              {"  "}·{"  "}
              <Link
                href="/signup"
                className="font-medium text-primary hover:underline"
              >
                Choose another role
              </Link>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
