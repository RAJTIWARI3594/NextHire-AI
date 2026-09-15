"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, GraduationCap, Sparkles } from "lucide-react";
import {
  studentSignupSchema,
  type StudentSignupFormData,
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
import { signUpStudent } from "@/services/auth-service";

export default function StudentSignupPage() {
  const router = useRouter();
  const { initializeAuth, setDemoUser, user, isInitialized } = useAuthStore();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!isInitialized) initializeAuth();
  }, [initializeAuth, isInitialized]);

  useEffect(() => {
    if (user && !success) {
      router.replace("/dashboard");
    }
  }, [user, router, success]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<StudentSignupFormData>({
    resolver: zodResolver(studentSignupSchema),
    defaultValues: {
      fullName: "",
      email: "",
      password: "",
      confirmPassword: "",
      college: "",
      course: "",
      graduationYear: undefined,
      acceptTerms: false,
    },
  });

  const onSubmit = async (data: StudentSignupFormData) => {
    setError(null);
    setSuccess(null);
    setIsSubmitting(true);
    try {
      if (!isSupabaseConfigured()) {
        setDemoUser(data.email, "student");
        setSuccess("Demo account created. Redirecting to your dashboard...");
        setTimeout(() => router.replace("/dashboard"), 800);
        return;
      }

      const result = await signUpStudent(data);
      if (result?.user) {
        const session = await useAuthStore.getState().setAuthState(result);
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

  return (
    <div className="relative flex min-h-[calc(100vh-8rem)] items-center justify-center px-4 py-12">
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,rgba(59,130,246,0.12),transparent_60%)]" />
      <div className="w-full max-w-lg">
        <div className="mb-6 text-center">
          <Badge variant="accent" className="mb-3">
            <GraduationCap className="mr-1 h-3 w-3" /> Student Account
          </Badge>
          <h1 className="text-3xl font-bold tracking-tight">
            Create your student account
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Unlock AI resume building, interviews, jobs and more.
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-sm">
              <Sparkles className="h-4 w-4 text-primary" /> Student Sign Up
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
              <Input
                placeholder="Full name"
                error={errors.fullName?.message}
                {...register("fullName")}
              />
              <Input
                type="email"
                placeholder="Email address"
                error={errors.email?.message}
                {...register("email")}
              />

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

              <Input
                placeholder="College / University"
                error={errors.college?.message}
                {...register("college")}
              />
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <Input
                  placeholder="Course / Degree (e.g. B.Tech CSE)"
                  error={errors.course?.message}
                  {...register("course")}
                />
                <Input
                  type="number"
                  placeholder="Graduation year"
                  error={errors.graduationYear?.message}
                  {...register("graduationYear")}
                />
              </div>

              <label className="flex items-start gap-2 text-xs text-muted-foreground">
                <input
                  type="checkbox"
                  className="mt-0.5 h-3.5 w-3.5 rounded border-border"
                  {...register("acceptTerms")}
                />
                <span>
                  I agree to the{" "}
                  <Link href="/terms" className="text-primary hover:underline">
                    Terms of Service
                  </Link>{" "}
                  and{" "}
                  <Link
                    href="/privacy"
                    className="text-primary hover:underline"
                  >
                    Privacy Policy
                  </Link>
                </span>
              </label>
              {errors.acceptTerms && (
                <p className="text-xs text-destructive">
                  {errors.acceptTerms.message}
                </p>
              )}

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
                <GraduationCap className="h-4 w-4" /> Create Student Account
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
