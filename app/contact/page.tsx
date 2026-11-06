"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Mail, Send, Sparkles } from "lucide-react";
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
import { BRANDING } from "@/constants/branding";

const contactSchema = z.object({
  fullName: z.string().min(2, "Full name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  companyName: z.string().min(1, "Company name is required"),
  hiringNeeds: z
    .string()
    .min(10, "Please describe your inquiry (min 10 characters)"),
});

type ContactFormData = z.infer<typeof contactSchema>;

export default function ContactPage() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
  });

  const onSubmit = (data: ContactFormData) => {
    const subject = `NextHire AI inquiry from ${data.fullName}`;
    const body = [
      `Name: ${data.fullName}`,
      `Email: ${data.email}`,
      `Company: ${data.companyName}`,
      "",
      "Inquiry:",
      data.hiringNeeds,
    ].join("\n");

    const mailto = `mailto:${BRANDING.contactEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.location.assign(mailto);
  };

  return (
    <div className="container mx-auto max-w-5xl px-4 py-16 sm:px-8 md:py-24">
      <div className="mx-auto mb-14 max-w-2xl text-center">
        <Badge variant="default" className="mb-4 gap-1.5 px-3 py-1">
          <Sparkles className="h-3.5 w-3.5" /> Get in Touch
        </Badge>
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
          Contact NextHire AI
        </h1>
        <p className="mt-3 text-muted-foreground">
          Send an inquiry about the platform, hiring, or partnership opportunities.
        </p>
      </div>

      <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-3">
        <Card className="space-y-6 p-6 lg:col-span-1">
          <CardHeader className="p-0">
            <CardTitle className="text-lg font-semibold">
              Contact Information
            </CardTitle>
            <CardDescription className="text-xs">
              Reach us by email.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0 text-sm">
            <a
              href={`mailto:${BRANDING.contactEmail}`}
              className="flex items-center gap-3 font-medium text-foreground underline-offset-4 hover:underline"
            >
              <span className="rounded-lg bg-primary/10 p-2 text-primary">
                <Mail className="h-4 w-4" />
              </span>
              {BRANDING.contactEmail}
            </a>
          </CardContent>
        </Card>

        <Card className="p-6 md:p-8 lg:col-span-2">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-muted-foreground">
                  Full Name
                </label>
                <Input
                  placeholder="Your full name"
                  {...register("fullName")}
                  error={errors.fullName?.message}
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-muted-foreground">
                  Email
                </label>
                <Input
                  type="email"
                  placeholder="you@company.com"
                  {...register("email")}
                  error={errors.email?.message}
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-muted-foreground">
                Company Name
              </label>
              <Input
                placeholder="Company or organization"
                {...register("companyName")}
                error={errors.companyName?.message}
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-muted-foreground">
                Inquiry
              </label>
              <textarea
                rows={4}
                placeholder="How can we help?"
                className="flex w-full resize-none rounded-md border border-border bg-transparent px-3 py-2 text-sm ring-offset-background transition-all placeholder:text-muted-foreground/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                {...register("hiringNeeds")}
              />
              {errors.hiringNeeds && (
                <p className="text-xs text-destructive">
                  {errors.hiringNeeds.message}
                </p>
              )}
            </div>

            <p className="text-xs text-muted-foreground">
              This opens your default email app with a prepared draft. Review it
              and press Send there; this website does not send or store the message.
            </p>
            <Button type="submit" size="lg" className="w-full gap-2">
              <Send className="h-4 w-4" /> Continue in email
            </Button>
          </form>
        </Card>
      </div>
    </div>
  );
}
