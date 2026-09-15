"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import {
  User,
  Lock,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
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
import { Avatar } from "@/components/ui/avatar";
import { useAuthStore } from "@/lib/store/use-auth-store";
import {
  changePasswordSchema,
  type ChangePasswordFormData,
} from "@/lib/validations/auth";
import { updateUserPassword } from "@/services/auth-service";

export default function ProfilePage() {
  const { user, profile, role } = useAuthStore();
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<ChangePasswordFormData>({
    resolver: zodResolver(changePasswordSchema),
  });

  const onChangePassword = async (data: ChangePasswordFormData) => {
    try {
      setErrorMessage(null);
      setSuccessMessage(null);
      await updateUserPassword(data.newPassword);
      setSuccessMessage("Password changed successfully!");
      reset();
    } catch (err: any) {
      setErrorMessage(err.message || "Failed to update password.");
    }
  };

  return (
    <div className="container mx-auto max-w-4xl space-y-8 px-4 py-12 sm:px-8">
      {/* Profile Header */}
      <div className="flex flex-col items-center gap-6 rounded-2xl border bg-card p-6 shadow-lg sm:flex-row md:p-8">
        <Avatar
          fallback={profile?.full_name?.slice(0, 2) || "NH"}
          size="lg"
          className="h-20 w-20 text-xl"
        />
        <div className="space-y-1.5 text-center sm:text-left">
          <div className="flex items-center justify-center gap-2 sm:justify-start">
            <h1 className="text-2xl font-bold tracking-tight">
              {profile?.full_name ||
                user?.user_metadata?.full_name ||
                "Authenticated User"}
            </h1>
            <Badge variant="accent" className="capitalize">
              {role || "student"}
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground">
            {user?.email || "user@example.com"}
          </p>
          <p className="text-xs text-muted-foreground">
            Account ID:{" "}
            <span className="font-mono">{user?.id || "syncing..."}</span>
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
        {/* Profile Info */}
        <Card className="space-y-4 p-6">
          <CardHeader className="mb-4 p-0">
            <CardTitle className="flex items-center gap-2 text-xl font-bold">
              <User className="h-5 w-5 text-indigo-500" /> Account Details
            </CardTitle>
            <CardDescription className="text-xs">
              Synchronized with Supabase Auth profile
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 p-0 text-sm">
            <div className="flex justify-between border-b pb-2">
              <span className="text-muted-foreground">Full Name:</span>
              <span className="font-semibold">
                {profile?.full_name ||
                  user?.user_metadata?.full_name ||
                  (user?.email || "").split("@")[0] ||
                  "Student"}
              </span>
            </div>
            <div className="flex justify-between border-b pb-2">
              <span className="text-muted-foreground">Email:</span>
              <span className="font-semibold">
                {user?.email || "user@example.com"}
              </span>
            </div>
            <div className="flex justify-between border-b pb-2">
              <span className="text-muted-foreground">System Role:</span>
              <span className="font-semibold capitalize text-indigo-400">
                {role || "student"}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Security Protocol:</span>
              <span className="flex items-center gap-1 font-semibold text-emerald-500">
                <ShieldCheck className="h-4 w-4" /> RLS Protected
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Change Password Card */}
        <Card className="space-y-4 p-6">
          <CardHeader className="mb-4 p-0">
            <CardTitle className="flex items-center gap-2 text-xl font-bold">
              <Lock className="h-5 w-5 text-purple-500" /> Change Security
              Password
            </CardTitle>
            <CardDescription className="text-xs">
              Update your account password
            </CardDescription>
          </CardHeader>

          <CardContent className="p-0">
            {successMessage && (
              <div className="mb-4 flex items-center gap-2 rounded-lg border border-emerald-500/20 bg-emerald-500/10 p-3 text-xs font-medium text-emerald-500">
                <CheckCircle2 className="h-4 w-4 shrink-0" />
                <span>{successMessage}</span>
              </div>
            )}

            {errorMessage && (
              <div className="mb-4 flex items-center gap-2 rounded-lg border border-destructive/20 bg-destructive/10 p-3 text-xs font-medium text-destructive">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            <form
              onSubmit={handleSubmit(onChangePassword)}
              className="space-y-3"
            >
              <div className="space-y-1">
                <label className="text-xs font-semibold text-muted-foreground">
                  Current Password
                </label>
                <Input
                  type="password"
                  placeholder="••••••••"
                  {...register("currentPassword")}
                  error={errors.currentPassword?.message}
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-muted-foreground">
                  New Password
                </label>
                <Input
                  type="password"
                  placeholder="••••••••"
                  {...register("newPassword")}
                  error={errors.newPassword?.message}
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-muted-foreground">
                  Confirm New Password
                </label>
                <Input
                  type="password"
                  placeholder="••••••••"
                  {...register("confirmNewPassword")}
                  error={errors.confirmNewPassword?.message}
                />
              </div>

              <Button
                type="submit"
                variant="default"
                size="sm"
                isLoading={isSubmitting}
                className="mt-2 w-full"
              >
                Update Password
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
