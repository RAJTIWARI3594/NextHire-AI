"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Coins, Bell, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar } from "@/components/ui/avatar";
import { useAuthStore } from "@/lib/store/use-auth-store";
import { useStudentStore } from "@/lib/store/use-student-store";

export function StudentHeader() {
  const pathname = usePathname();
  const { profile, user, studentProfile } = useAuthStore();
  const { notificationsCount } = useStudentStore();
  const [coinBalance, setCoinBalance] = useState<number | null>(null);
  const [fetched, setFetched] = useState(false);

  useEffect(() => {
    if (studentProfile?.coins_balance != null) {
      setCoinBalance(studentProfile.coins_balance);
      setFetched(true);
    } else if (profile?.id && !fetched) {
      (async () => {
        try {
          const { createClient } = await import("@/lib/supabase/client");
          const supabase = createClient();
          const { data } = await supabase
            .from("student_profiles")
            .select("coins_balance")
            .eq("profile_id", profile.id)
            .maybeSingle();
          if (data?.coins_balance != null) setCoinBalance(data.coins_balance);
          setFetched(true);
        } catch {
          setFetched(true);
        }
      })();
    }
  }, [studentProfile, profile, fetched]);
  const displayName =
    profile?.full_name ||
    user?.user_metadata?.full_name ||
    (user?.email || "").split("@")[0] ||
    "Student";

  const getPageTitle = () => {
    if (pathname === "/dashboard") return "Overview";
    if (pathname.includes("/jobs")) return "Jobs";
    if (pathname.includes("/applications")) return "Applications Tracker";
    if (pathname.includes("/resume-analytics")) return "Resume Analytics";
    if (pathname.includes("/resume")) return "Resume Builder";
    if (pathname.includes("/ai-coach")) return "Career Coach";
    if (pathname.includes("/ai-interview")) return "Interview Practice";
    if (pathname.includes("/learning")) return "Learning Path";
    if (pathname.includes("/roadmaps")) return "Roadmaps";
    if (pathname.includes("/portfolio")) return "Portfolio Generator";
    if (pathname.includes("/cover-letter")) return "Cover Letter";
    if (pathname.includes("/profile")) return "Career Profile";
    if (pathname.includes("/settings")) return "Settings";
    if (pathname.includes("/notifications")) return "Notifications";
    if (pathname.includes("/internships")) return "Internships";
    if (pathname.includes("/saved-jobs")) return "Saved Jobs";
    if (pathname.includes("/coding")) return "Coding Practice";
    if (pathname.includes("/leaderboard")) return "Leaderboard";
    if (pathname.includes("/rewards")) return "Rewards";
    return "Workspace";
  };

  return (
    <header className="sticky top-14 z-30 flex h-12 items-center justify-between border-b border-border/60 bg-[#080B12]/90 px-4 backdrop-blur-md sm:px-6">
      <div className="flex items-center gap-3">
        <h1 className="text-xs font-bold uppercase tracking-tight text-foreground">
          {getPageTitle()}
        </h1>
        <span className="hidden text-[10px] text-muted-foreground/60 sm:inline">
          |
        </span>
        <span className="hidden text-[11px] text-muted-foreground/80 sm:inline">
          Student Workspace
        </span>
      </div>

      <div className="flex items-center gap-2.5">
        <Link href="/dashboard/rewards">
          <div className="flex items-center gap-1.5 rounded-full border border-border/50 bg-card px-2.5 py-1 text-xs font-semibold text-foreground transition-colors hover:bg-secondary">
            <Coins className="h-3.5 w-3.5 text-amber-400" />
            <span className="text-[11px]">{coinBalance ?? 0}</span>
          </div>
        </Link>

        <Link href="/dashboard/notifications" className="relative">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 rounded-full text-muted-foreground hover:text-foreground"
          >
            <Bell className="h-4 w-4" />
            {notificationsCount > 0 && (
              <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-primary ring-2 ring-background" />
            )}
          </Button>
        </Link>

        <Link
          href="/dashboard/profile"
          className="flex items-center gap-2 pl-1 hover:opacity-90"
        >
          <Avatar
            fallback={displayName.slice(0, 2)}
            size="sm"
            className="h-7 w-7 border border-border/60"
          />
          <span className="hidden text-xs font-medium text-foreground sm:inline">
            {displayName.split(" ")[0]}
          </span>
        </Link>
      </div>
    </header>
  );
}
