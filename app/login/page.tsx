"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, LogIn, Mail, Lock, Sparkles } from "lucide-react";
import { loginSchema, type LoginFormData } from "@/lib/validations/auth";
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
import { signInWithEmail, signInWithOAuth } from "@/services/auth-service";

export default function LoginPage() {
  const router = useRouter();
  const { initializeAuth, setDemoUser, user, isInitialized } = useAuthStore();
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [authError, setAuthError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!isInitialized) {
      initializeAuth();
    }
  }, [initializeAuth, isInitialized]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("error")) setAuthError(params.get("error"));
  }, []);

  useEffect(() => {
    if (user) {
      const role = user.user_metadata?.role || "student";
      if (role === "recruiter") router.replace("/recruiter");
      else if (role === "admin") router.replace("/admin");
      else router.replace("/dashboard");
    }
  }, [user, router]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  const redirectAfterLogin = () => {
    const next = new URLSearchParams(window.location.search).get("next");
    if (next && !next.startsWith("/login")) {
      router.replace(next);
      return;
    }
    const role = useAuthStore.getState().role;
    if (role === "recruiter") router.replace("/recruiter");
    else if (role === "admin") router.replace("/admin");
    else router.replace("/dashboard");
  };

  const onSubmit = async (data: LoginFormData) => {
    setError(null);
    setIsSubmitting(true);
    try {
      if (!isSupabaseConfigured()) {
        if (process.env.NODE_ENV === "production") {
          setError("Authentication is temporarily unavailable. Please try again later.");
          return;
        }
        const role = data.email.includes("admin")
          ? "admin"
          : data.email.includes("recruiter")
            ? "recruiter"
            : "student";
        setDemoUser(data.email, role);
        redirectAfterLogin();
        return;
      }

      const result = await signInWithEmail(data);
      if (!result?.user) {
        setError("Invalid email or password");
        return;
      }
      await useAuthStore.getState().setAuthState(result);
      redirectAfterLogin();
    } catch (err: any) {
      const msg = err?.message || "Something went wrong. Please try again.";
      if (msg.toLowerCase().includes("invalid login credentials")) {
        setError("Invalid email or password");
      } else if (msg.toLowerCase().includes("email not confirmed")) {
        setError("Please verify your email address before logging in");
      } else {
        setError(msg);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleOAuth = async (provider: "google" | "github") => {
    setError(null);
    try {
      await signInWithOAuth(provider);
    } catch (err: any) {
      setError(err?.message || "OAuth sign-in failed. Please try again.");
    }
  };

  return (
    <div className="relative flex min-h-[calc(100vh-8rem)] items-center justify-center px-4 py-12">
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,rgba(59,130,246,0.12),transparent_60%)]" />
      <div className="w-full max-w-md">
        <div className="mb-6 text-center">
          <Badge variant="accent" className="mb-3">
            <Sparkles className="mr-1 h-3 w-3" /> Welcome back to NextHire AI
          </Badge>
          <h1 className="text-3xl font-bold tracking-tight">
            Sign in to your account
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Continue your career journey. Your workspace awaits.
          </p>
        </div>

        {authError && (
          <div className="mb-4 rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2.5 text-xs text-destructive">
            Authentication failed. Please try again.
          </div>
        )}

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-semibold">
              Student / Recruiter / Admin
            </CardTitle>
            <CardDescription>
              Use your registered email and password to sign in.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="space-y-4"
              noValidate
            >
              <Input
                type="email"
                placeholder="you@example.com"
                icon={<Mail className="h-4 w-4" />}
                error={errors.email?.message}
                {...register("email")}
              />
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  icon={<Lock className="h-4 w-4" />}
                  error={errors.password?.message}
                  {...register("password")}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3 top-2.5 text-muted-foreground/60 hover:text-foreground"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>

              <div className="flex items-center justify-between">
                <Link
                  href="/forgot-password"
                  className="text-xs text-primary hover:underline"
                >
                  Forgot password?
                </Link>
              </div>

              {error && (
                <div className="rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2.5 text-xs text-destructive">
                  {error}
                </div>
              )}

              <Button
                type="submit"
                size="lg"
                className="w-full"
                isLoading={isSubmitting}
              >
                <LogIn className="h-4 w-4" /> Sign In
              </Button>
            </form>

            {isSupabaseConfigured() && (
              <>
                <div className="my-4 flex items-center gap-3">
                  <div className="h-px flex-1 bg-border/60" />
                  <span className="text-[11px] uppercase text-muted-foreground/60">
                    or
                  </span>
                  <div className="h-px flex-1 bg-border/60" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => handleOAuth("google")}
                  >
                    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none">
                      <path
                        d="M12 11v3h5.2c-.3 1.7-1.7 4.7-5.2 4.7-3.1 0-5.7-2.6-5.7-5.8S8.9 7.1 12 7.1c1.8 0 3 .7 3.7 1.4l2.5-2.4C16.5 4.5 14.4 3.5 12 3.5 7.3 3.5 3.5 7.3 3.5 12S7.3 20.5 12 20.5c5.2 0 8.5-3.7 8.5-8.8 0-.6-.1-1-.2-1.5H12Z"
                        fill="#4285F4"
                      />
                      <path
                        d="m3.7 7.4 2.9 2.1C7.4 7.6 9.5 6.1 12 6.1c1.8 0 3 .7 3.7 1.4l2.5-2.4C16.5 4.5 14.4 3.5 12 3.5c-2.9 0-5.5 1.4-7 3.9Z"
                        fill="#34A853"
                      />
                      <path
                        d="M12 20.5c2.4 0 4.5-.8 6-2.1l-2.8-2.3c-.9.6-2 1-3.2 1-2.6 0-4.7-1.5-5.7-3.6l-2.9 2.3c1.6 2.4 4.4 5.7 8.6 6.7Z"
                        fill="#FBBC05"
                      />
                      <path
                        d="M20.6 12H12v3h5.2c-.2.6-.6 1.6-1.6 2.4l2.8 2.3c1.4-1.3 2.4-3.1 2.4-5.4V12H20.6Z"
                        fill="#EA4335"
                      />
                    </svg>
                    Google
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => handleOAuth("github")}
                  >
                    <svg
                      className="h-4 w-4"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path d="M12 2C6.48 2 2 6.48 2 12c0 4.42 2.87 8.17 6.84 9.5.5.09.68-.22.68-.48v-1.7c-2.78.6-3.37-1.34-3.37-1.34-.45-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.61.07-.61 1 .07 1.53 1.03 1.53 1.03.89 1.52 2.34 1.08 2.91.83.09-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.94 0-1.09.39-1.98 1.03-2.68-.1-.25-.45-1.27.1-2.64 0 0 .84-.27 2.75 1.02.8-.22 1.65-.33 2.5-.33s1.7.11 2.5.33c1.91-1.29 2.75-1.02 2.75-1.02.55 1.37.2 2.39.1 2.64.64.7 1.03 1.59 1.03 2.68 0 3.84-2.34 4.68-4.57 4.93.36.31.68.92.68 1.85V21c0 .27.18.58.69.48A10 10 0 0 0 22 12c0-5.52-4.48-10-10-10Z" />
                    </svg>
                    GitHub
                  </Button>
                </div>
              </>
            )}

            <p className="mt-5 text-center text-xs text-muted-foreground">
              Don&apos;t have an account?{" "}
              <Link
                href="/signup"
                className="font-medium text-primary hover:underline"
              >
                Create one free
              </Link>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
