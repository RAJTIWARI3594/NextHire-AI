"use client";

import React from "react";
import { ShieldCheck, Check, Lock, Users } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function RolesPermissionsPage() {
  const roles = [
    {
      name: "Super Admin",
      desc: "Full systemic control over all databases, payments, users, and settings.",
      usersCount: 2,
    },
    {
      name: "Admin",
      desc: "Platform operations, recruiter verification, job moderation, and user management.",
      usersCount: 4,
    },
    {
      name: "Moderator",
      desc: "Review reported job postings, user complaints, and CMS content.",
      usersCount: 8,
    },
    {
      name: "Content Manager",
      desc: "Publish blogs, announcements, career guides, and FAQs.",
      usersCount: 3,
    },
    {
      name: "Finance Manager",
      desc: "View payments, refund charges, inspect MRR metrics, and export invoices.",
      usersCount: 2,
    },
  ];

  return (
    <div className="mx-auto max-w-6xl space-y-6 p-4 sm:p-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">
          Roles & Granular Permission Management
        </h1>
        <p className="text-sm text-muted-foreground">
          Define administrative access control tiers, assign team roles, and
          enforce RBAC policies.
        </p>
      </div>

      <div className="space-y-4">
        {roles.map((r) => (
          <Card
            key={r.name}
            className="flex items-center justify-between space-y-2 border-border/60 p-6"
          >
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold">{r.name}</h3>
                <Badge variant="accent">{r.usersCount} Active Users</Badge>
              </div>
              <p className="text-xs text-muted-foreground">{r.desc}</p>
            </div>

            <Badge variant="outline" className="shrink-0 gap-1 text-xs">
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" /> RBAC
              Enforced
            </Badge>
          </Card>
        ))}
      </div>
    </div>
  );
}
