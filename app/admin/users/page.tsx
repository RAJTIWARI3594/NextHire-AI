"use client";

import React, { useEffect, useState } from "react";
import { Search, Ban } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAdminStore } from "@/lib/store/use-admin-store";
import { fetchAllUsers, toggleUserStatus } from "@/services/admin-service";

export default function UserManagementPage() {
  const {
    users,
    setUsers,
    toggleUserStatus: toggleStoreStatus,
  } = useAdminStore();
  const [searchQuery, setSearchQuery] = useState("");
  const [filterRole, setFilterRole] = useState("All");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    fetchAllUsers()
      .then((rows) => {
        if (active) setUsers(rows);
      })
      .catch((loadError: unknown) => {
        if (active) {
          setError(
            (loadError as Error)?.message || "Users could not be loaded."
          );
        }
      })
      .finally(() => {
        if (active) setIsLoading(false);
      });

    return () => {
      active = false;
    };
  }, [setUsers]);

  const filteredUsers = users.filter((user) => {
    const query = searchQuery.toLowerCase();
    const matchesSearch =
      user.fullName.toLowerCase().includes(query) ||
      user.email.toLowerCase().includes(query);
    const matchesRole =
      filterRole === "All" || user.role === filterRole.toLowerCase();
    return matchesSearch && matchesRole;
  });

  const handleToggleSuspend = async (
    userId: string,
    currentStatus: string
  ) => {
    setError(null);
    setIsSaving(true);
    try {
      await toggleUserStatus(userId, currentStatus);
      toggleStoreStatus(userId);
    } catch (toggleError: unknown) {
      setError(
        (toggleError as Error)?.message ||
          "Account status could not be changed."
      );
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="mx-auto max-w-7xl space-y-6 p-4 sm:p-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">
          Platform User Management
        </h1>
        <p className="text-sm text-muted-foreground">
          Review registered student, recruiter, and administrator accounts.
          Email addresses and last-login timestamps are not exposed in this view.
        </p>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row">
        <Input
          placeholder="Search user by name..."
          icon={<Search className="h-4 w-4" />}
          value={searchQuery}
          onChange={(event) => setSearchQuery(event.target.value)}
          className="flex-1"
        />
        <div className="flex gap-2 overflow-x-auto border-b border-border/40 pb-2">
          {["All", "Student", "Recruiter", "Admin"].map((role) => (
            <Button
              key={role}
              variant={filterRole === role ? "default" : "ghost"}
              size="sm"
              onClick={() => setFilterRole(role)}
              className="whitespace-nowrap rounded-full text-xs"
            >
              {role}
            </Button>
          ))}
        </div>
      </div>

      {error && (
        <div
          role="alert"
          className="rounded-md border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive"
        >
          {error}
        </div>
      )}

      <Card className="space-y-4 border-border/60 p-6 shadow-sm">
        {isLoading ? (
          <p className="py-6 text-center text-sm text-muted-foreground">
            Loading users...
          </p>
        ) : filteredUsers.length === 0 ? (
          <p className="py-6 text-center text-sm text-muted-foreground">
            No users match this filter.
          </p>
        ) : (
          <div className="space-y-3 text-xs">
            {filteredUsers.map((user) => (
              <div
                key={user.id}
                className="flex flex-col items-start justify-between gap-4 rounded-xl border bg-card/60 p-4 sm:flex-row sm:items-center"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-bold text-foreground">
                      {user.fullName}
                    </p>
                    <Badge
                      variant={
                        user.role === "recruiter" ? "accent" : "secondary"
                      }
                      className="capitalize"
                    >
                      {user.role}
                    </Badge>
                    <Badge
                      variant={
                        user.status === "active" ? "success" : "destructive"
                      }
                    >
                      {user.status}
                    </Badge>
                  </div>
                  <p className="text-muted-foreground">
                    {user.email} • Joined {user.joinedDate} • Last login{" "}
                    {user.lastLogin}
                  </p>
                </div>

                <Button
                  variant={
                    user.status === "active" ? "destructive" : "outline"
                  }
                  size="sm"
                  disabled={isSaving}
                  onClick={() => handleToggleSuspend(user.id, user.status)}
                  className="gap-1 text-xs"
                >
                  <Ban className="h-3.5 w-3.5" />
                  {user.status === "active"
                    ? "Suspend Account"
                    : "Reactivate Account"}
                </Button>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}
