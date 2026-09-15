"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Search,
  Users,
  ShieldCheck,
  Ban,
  CheckCircle2,
  Download,
  Trash2,
  KeyRound,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAdminStore } from "@/lib/store/use-admin-store";
import { toggleUserStatus } from "@/services/admin-service";

export default function UserManagementPage() {
  const { users, toggleUserStatus: toggleStoreStatus } = useAdminStore();
  const [searchQuery, setSearchQuery] = useState("");
  const [filterRole, setFilterRole] = useState<string>("All");

  const filteredUsers = users.filter((u) => {
    const matchesSearch =
      u.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole =
      filterRole === "All" || u.role === filterRole.toLowerCase();
    return matchesSearch && matchesRole;
  });

  const handleToggleSuspend = async (userId: string, currentStatus: string) => {
    await toggleUserStatus(userId, currentStatus);
    toggleStoreStatus(userId);
  };

  return (
    <div className="mx-auto max-w-7xl space-y-6 p-4 sm:p-8">
      <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            Platform User Management
          </h1>
          <p className="text-sm text-muted-foreground">
            View, filter, suspend, and manage student, recruiter, and
            administrator accounts.
          </p>
        </div>

        <Button variant="outline" size="sm" className="gap-1.5">
          <Download className="h-4 w-4" /> Export CSV Data
        </Button>
      </div>

      {/* Search & Filter Controls */}
      <div className="flex flex-col gap-3 sm:flex-row">
        <Input
          placeholder="Search user by name or email address..."
          icon={<Search className="h-4 w-4" />}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="flex-1"
        />

        <div className="flex gap-2 overflow-x-auto border-b border-border/40 pb-2">
          {["All", "Student", "Recruiter", "Admin"].map((r) => (
            <Button
              key={r}
              variant={filterRole === r ? "default" : "ghost"}
              size="sm"
              onClick={() => setFilterRole(r)}
              className="whitespace-nowrap rounded-full text-xs"
            >
              {r}
            </Button>
          ))}
        </div>
      </div>

      {/* Users Table List */}
      <Card className="space-y-4 border-border/60 p-6 shadow-sm">
        <div className="space-y-3 text-xs">
          {filteredUsers.map((u) => (
            <div
              key={u.id}
              className="flex flex-col items-start justify-between gap-4 rounded-xl border bg-card/60 p-4 sm:flex-row sm:items-center"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-bold text-foreground">
                    {u.fullName}
                  </p>
                  <Badge
                    variant={u.role === "recruiter" ? "accent" : "secondary"}
                    className="capitalize"
                  >
                    {u.role}
                  </Badge>
                  <Badge
                    variant={u.status === "active" ? "success" : "destructive"}
                  >
                    {u.status}
                  </Badge>
                </div>
                <p className="text-muted-foreground">
                  {u.email} • Joined {u.joinedDate} • Last Login {u.lastLogin}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant={u.status === "active" ? "destructive" : "outline"}
                  size="sm"
                  onClick={() => handleToggleSuspend(u.id, u.status)}
                  className="gap-1 text-xs"
                >
                  <Ban className="h-3.5 w-3.5" />
                  {u.status === "active"
                    ? "Suspend Account"
                    : "Reactivate Account"}
                </Button>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
