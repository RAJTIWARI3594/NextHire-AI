"use client";

import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion } from "framer-motion";
import {
  User,
  School,
  BookOpen,
  Calendar,
  Globe,
  Github,
  Linkedin,
  CheckCircle2,
  AlertCircle,
  Upload,
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
import { Avatar } from "@/components/ui/avatar";
import { useAuthStore } from "@/lib/store/use-auth-store";
import {
  updateStudentProfileData,
  fetchStudentDashboardData,
} from "@/services/student-dashboard-service";

const profileSchema = z.object({
  fullName: z.string().trim().min(2, "Full name must be at least 2 characters"),
  college: z.string().trim().min(2, "College name is required"),
  course: z.string().trim().min(2, "Course is required"),
  graduationYear: z.coerce.number().min(2020).max(2035),
  cgpa: z.coerce.number().min(0).max(10).optional(),
  githubUrl: z.string().trim().url("Valid URL required").or(z.literal("")),
  linkedinUrl: z.string().trim().url("Valid URL required").or(z.literal("")),
  portfolioUrl: z.string().trim().url("Valid URL required").or(z.literal("")),
});

type ProfileFormData = z.infer<typeof profileSchema>;

export default function StudentProfilePage() {
  const { user, profile } = useAuthStore();
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      fullName: profile?.full_name || (user?.email || "").split("@")[0] || "",
      college: "",
      course: "",
      graduationYear: undefined,
      cgpa: undefined,
      githubUrl: "",
      linkedinUrl: "",
      portfolioUrl: "",
    },
  });

  useEffect(() => {
    async function loadProfile() {
      if (user?.id) {
        const data = await fetchStudentDashboardData(user.id);
        if (data?.profile) setValue("fullName", data.profile.full_name);
        if (data?.studentProfile) {
          if (data.studentProfile.college)
            setValue("college", data.studentProfile.college);
          if (data.studentProfile.course)
            setValue("course", data.studentProfile.course);
          if (data.studentProfile.graduation_year)
            setValue("graduationYear", data.studentProfile.graduation_year);
          if (data.studentProfile.github_url)
            setValue("githubUrl", data.studentProfile.github_url);
          if (data.studentProfile.linkedin_url)
            setValue("linkedinUrl", data.studentProfile.linkedin_url);
          if (data.studentProfile.portfolio_url)
            setValue("portfolioUrl", data.studentProfile.portfolio_url);
        }
      }
    }
    loadProfile();
  }, [user?.id, setValue]);

  const onSubmit = async (data: ProfileFormData) => {
    try {
      setErrorMessage(null);
      setSuccessMessage(null);
      if (profile?.id) {
        await updateStudentProfileData(profile.id, {
          full_name: data.fullName,
          college: data.college,
          course: data.course,
          graduation_year: data.graduationYear,
          cgpa: data.cgpa,
          github_url: data.githubUrl,
          linkedin_url: data.linkedinUrl,
          portfolio_url: data.portfolioUrl,
        });
        setSuccessMessage("Profile updated successfully!");
      }
    } catch (err: any) {
      setErrorMessage(err.message || "Failed to update profile.");
    }
  };

  return (
    <div className="mx-auto max-w-4xl space-y-8 p-4 sm:p-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">
          Student Profile Editor
        </h1>
        <p className="text-sm text-muted-foreground">
          Keep your academic details and social links updated for AI resume
          matching.
        </p>
      </div>

      <Card className="border-border/60 p-6 sm:p-8">
        {successMessage && (
          <div className="mb-6 flex items-center gap-2 rounded-lg border border-emerald-500/20 bg-emerald-500/10 p-3 text-xs font-medium text-emerald-500">
            <CheckCircle2 className="h-4 w-4 shrink-0" />
            <span>{successMessage}</span>
          </div>
        )}

        {errorMessage && (
          <div className="mb-6 flex items-center gap-2 rounded-lg border border-destructive/20 bg-destructive/10 p-3 text-xs font-medium text-destructive">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Avatar Upload Preview */}
          <div className="flex items-center gap-6 border-b border-border/40 pb-6">
            <Avatar
              fallback={profile?.full_name?.slice(0, 2) || "AC"}
              size="lg"
              className="h-20 w-20 border-2 border-primary/30 text-xl"
            />
            <div className="space-y-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="gap-2 text-xs"
              >
                <Upload className="h-4 w-4" /> Change Profile Picture
              </Button>
              <p className="text-[11px] text-muted-foreground">
                JPG, PNG or WEBP. Max size 2MB.
              </p>
            </div>
          </div>

          {/* Personal Info */}
          <div className="space-y-4">
            <h2 className="flex items-center gap-2 text-base font-bold">
              <User className="h-4 w-4 text-primary" /> Personal Information
            </h2>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase text-muted-foreground">
                  Full Name
                </label>
                <Input
                  placeholder={profile?.full_name || "Your full name"}
                  icon={<User className="h-4 w-4" />}
                  {...register("fullName")}
                  error={errors.fullName?.message}
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase text-muted-foreground">
                  Email Address (Read-only)
                </label>
                <Input
                  type="email"
                  value={user?.email || ""}
                  disabled
                  className="cursor-not-allowed bg-muted/40"
                />
              </div>
            </div>
          </div>

          {/* Academic Info */}
          <div className="space-y-4 border-t border-border/40 pt-4">
            <h2 className="flex items-center gap-2 text-base font-bold">
              <School className="h-4 w-4 text-primary" /> Academic Credentials
            </h2>

            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase text-muted-foreground">
                  College / University
                </label>
                <Input
                  placeholder="Stanford University"
                  icon={<School className="h-4 w-4" />}
                  {...register("college")}
                  error={errors.college?.message}
                />
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold uppercase text-muted-foreground">
                    Course / Degree
                  </label>
                  <Input
                    placeholder="B.S. Computer Science"
                    icon={<BookOpen className="h-4 w-4" />}
                    {...register("course")}
                    error={errors.course?.message}
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold uppercase text-muted-foreground">
                    Graduation Year
                  </label>
                  <Input
                    type="number"
                    placeholder="2026"
                    icon={<Calendar className="h-4 w-4" />}
                    {...register("graduationYear")}
                    error={errors.graduationYear?.message}
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold uppercase text-muted-foreground">
                    CGPA / Grade
                  </label>
                  <Input
                    type="number"
                    step="0.1"
                    placeholder="3.9"
                    {...register("cgpa")}
                    error={errors.cgpa?.message}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Social Links */}
          <div className="space-y-4 border-t border-border/40 pt-4">
            <h2 className="flex items-center gap-2 text-base font-bold">
              <Globe className="h-4 w-4 text-pink-500" /> Portfolio & Social
              Profiles
            </h2>

            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase text-muted-foreground">
                  GitHub URL
                </label>
                <Input
                  placeholder="https://github.com/rajtiwari"
                  icon={<Github className="h-4 w-4" />}
                  {...register("githubUrl")}
                  error={errors.githubUrl?.message}
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase text-muted-foreground">
                  LinkedIn URL
                </label>
                <Input
                  placeholder="https://linkedin.com/in/rajtiwari"
                  icon={<Linkedin className="h-4 w-4" />}
                  {...register("linkedinUrl")}
                  error={errors.linkedinUrl?.message}
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase text-muted-foreground">
                  Portfolio Website
                </label>
                <Input
                  placeholder="https://rajtiwari.dev"
                  icon={<Globe className="h-4 w-4" />}
                  {...register("portfolioUrl")}
                  error={errors.portfolioUrl?.message}
                />
              </div>
            </div>
          </div>

          <div className="pt-4">
            <Button
              type="submit"
              variant="gradient"
              size="lg"
              isLoading={isSubmitting}
              className="w-full sm:w-auto"
            >
              Save Profile Changes
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
