"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion } from "framer-motion";
import {
  Mail,
  Phone,
  MapPin,
  Send,
  CheckCircle2,
  Sparkles,
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
import { BRANDING } from "@/constants/branding";

const contactSchema = z.object({
  fullName: z.string().min(2, "Full name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  companyName: z.string().min(1, "Company name is required"),
  hiringNeeds: z
    .string()
    .min(10, "Please describe your hiring needs (min 10 chars)"),
});

type ContactFormData = z.infer<typeof contactSchema>;

export default function ContactPage() {
  const [isSubmitted, setIsSubmitted] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
  });

  const onSubmit = async (data: ContactFormData) => {
    console.log("Contact form submitted:", data);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsSubmitted(true);
    reset();
  };

  return (
    <div className="container mx-auto max-w-5xl px-4 py-16 sm:px-8 md:py-24">
      <div className="mx-auto mb-14 max-w-2xl text-center">
        <Badge variant="default" className="mb-4 gap-1.5 px-3 py-1">
          <Sparkles className="h-3.5 w-3.5" /> Get in Touch
        </Badge>
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
          Talk to Our AI Talent Experts
        </h1>
        <p className="mt-3 text-muted-foreground">
          Ready to transform your hiring workflow? Schedule a platform
          walkthrough or send us your inquiry.
        </p>
      </div>

      <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-3">
        <Card className="space-y-6 p-6 lg:col-span-1">
          <CardHeader className="p-0">
            <CardTitle className="text-lg font-semibold">
              Contact Information
            </CardTitle>
            <CardDescription className="text-xs">
              Our enterprise team responds within 2 business hours.
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-4 p-0 text-sm">
            {[
              {
                icon: Mail,
                label: "Email Us",
                value: BRANDING.contactEmail,
                color: "bg-primary/10 text-primary",
              },
              {
                icon: Phone,
                label: "Sales Desk",
                value: BRANDING.contactPhone,
                color: "bg-primary/10 text-primary",
              },
              {
                icon: MapPin,
                label: "Headquarters",
                value: BRANDING.address,
                color: "bg-primary/10 text-primary",
              },
            ].map((item) => (
              <div key={item.label} className="flex items-start gap-3">
                <div className={`mt-0.5 rounded-lg p-2 ${item.color}`}>
                  <item.icon className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
                    {item.label}
                  </p>
                  <p className="font-medium text-foreground">{item.value}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="p-6 md:p-8 lg:col-span-2">
          {isSubmitted ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              className="space-y-4 py-12 text-center"
            >
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-500">
                <CheckCircle2 className="h-7 w-7" />
              </div>
              <h3 className="text-xl font-semibold">
                Inquiry Sent Successfully!
              </h3>
              <p className="mx-auto max-w-md text-sm text-muted-foreground">
                Thank you for reaching out. One of our AI recruitment
                specialists will contact you shortly.
              </p>
              <Button variant="outline" onClick={() => setIsSubmitted(false)}>
                Send Another Message
              </Button>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-muted-foreground">
                    Full Name
                  </label>
                  <Input
                    placeholder="e.g. Sarah Jenkins"
                    {...register("fullName")}
                    error={errors.fullName?.message}
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-muted-foreground">
                    Work Email
                  </label>
                  <Input
                    type="email"
                    placeholder="sarah@company.com"
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
                  placeholder="e.g. Acme Innovations"
                  {...register("companyName")}
                  error={errors.companyName?.message}
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-muted-foreground">
                  Hiring Goals &amp; Team Size
                </label>
                <textarea
                  rows={4}
                  placeholder="Tell us about the roles you are looking to fill with AI..."
                  className="flex w-full resize-none rounded-md border border-border bg-transparent px-3 py-2 text-sm ring-offset-background transition-all placeholder:text-muted-foreground/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  {...register("hiringNeeds")}
                />
                {errors.hiringNeeds && (
                  <p className="text-xs text-destructive">
                    {errors.hiringNeeds.message}
                  </p>
                )}
              </div>

              <Button
                type="submit"
                size="lg"
                isLoading={isSubmitting}
                className="w-full gap-2"
              >
                <Send className="h-4 w-4" /> Submit Inquiry
              </Button>
            </form>
          )}
        </Card>
      </div>
    </div>
  );
}
