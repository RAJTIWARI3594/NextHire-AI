"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import {
  LayoutDashboard,
  User,
  FileText,
  Bot,
  Video,
  Briefcase,
  GraduationCap,
  FileCheck,
  Bookmark,
  Code2,
  Map,
  Bell,
  Trophy,
  Coins,
  Settings,
  Mail,
  Globe,
  BarChart3,
  Layers,
  Share2,
  Lightbulb,
  MessageSquareCode,
  ChevronDown,
  ChevronRight,
  Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";

export const mainNavGroup = [
  { title: "Overview", href: "/dashboard", icon: LayoutDashboard },
  { title: "Jobs", href: "/dashboard/jobs", icon: Briefcase },
  { title: "Applications", href: "/dashboard/applications", icon: FileCheck },
  { title: "Resume", href: "/dashboard/resume", icon: FileText },
  { title: "Interviews", href: "/dashboard/ai-interview", icon: Video },
  { title: "Learning", href: "/dashboard/learning", icon: Map },
];

export const toolsNavGroup = [
  {
    title: "Career Coach",
    href: "/dashboard/ai-coach",
    icon: MessageSquareCode,
  },
  { title: "Portfolio", href: "/dashboard/portfolio", icon: Globe },
  { title: "Analytics", href: "/dashboard/resume-analytics", icon: BarChart3 },
];

export const moreNavGroup = [
  { title: "Internships", href: "/dashboard/internships", icon: GraduationCap },
  { title: "Saved Jobs", href: "/dashboard/saved-jobs", icon: Bookmark },
  { title: "Cover Letter", href: "/dashboard/cover-letter", icon: Mail },
  { title: "Resume Review", href: "/dashboard/ai-resume", icon: Bot },
  { title: "Suggestions", href: "/dashboard/ai-suggestions", icon: Lightbulb },
  { title: "Coding Practice", href: "/dashboard/coding", icon: Code2 },
  { title: "Roadmaps", href: "/dashboard/roadmaps", icon: Map },
  { title: "Templates", href: "/dashboard/templates", icon: Layers },
  { title: "Public Profile", href: "/dashboard/public-profile", icon: Share2 },
  { title: "Notifications", href: "/dashboard/notifications", icon: Bell },
  { title: "Leaderboard", href: "/dashboard/leaderboard", icon: Trophy },
  { title: "Rewards", href: "/dashboard/rewards", icon: Coins },
];

export const bottomNavGroup = [
  { title: "Profile", href: "/dashboard/profile", icon: User },
  { title: "Settings", href: "/dashboard/settings", icon: Settings },
];

// Export full list for backwards compatibility
export const studentNavItems = [
  ...mainNavGroup,
  ...toolsNavGroup,
  ...moreNavGroup,
  ...bottomNavGroup,
];

export function StudentSidebar() {
  const pathname = usePathname();
  const [isMoreOpen, setIsMoreOpen] = useState(false);

  const renderNavItem = (item: {
    title: string;
    href: string;
    icon: any;
    badge?: string;
  }) => {
    const Icon = item.icon;
    const isActive =
      item.href === "/dashboard"
        ? pathname === "/dashboard"
        : pathname.startsWith(item.href);

    return (
      <Link
        key={item.href}
        href={item.href}
        className={cn(
          "group relative flex items-center justify-between rounded-md px-2.5 py-1.5 text-xs font-medium transition-colors",
          isActive
            ? "bg-primary/15 font-semibold text-primary"
            : "text-muted-foreground hover:bg-secondary/70 hover:text-foreground"
        )}
      >
        <div className="flex items-center gap-2.5">
          <Icon
            className={cn(
              "h-4 w-4 shrink-0 transition-colors",
              isActive
                ? "text-primary"
                : "text-muted-foreground/70 group-hover:text-foreground"
            )}
          />
          <span>{item.title}</span>
        </div>
        {isActive && (
          <motion.div
            layoutId="sidebarActiveIndicator"
            className="absolute left-0 h-4 w-0.5 rounded-r-full bg-primary"
          />
        )}
      </Link>
    );
  };

  return (
    <aside className="sticky top-14 hidden h-[calc(100vh-3.5rem)] w-56 shrink-0 flex-col justify-between overflow-y-auto border-r border-border/60 bg-[#080B12] p-3 lg:flex">
      <div className="space-y-4">
        {/* Workspace Title */}
        <div className="px-2 py-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/60">
            Student Workspace
          </span>
        </div>

        {/* MAIN SECTION */}
        <div className="space-y-1">
          <div className="px-2 text-[10px] font-bold uppercase tracking-wider text-muted-foreground/50">
            Main
          </div>
          <nav className="space-y-0.5">{mainNavGroup.map(renderNavItem)}</nav>
        </div>

        {/* TOOLS SECTION */}
        <div className="space-y-1">
          <div className="px-2 text-[10px] font-bold uppercase tracking-wider text-muted-foreground/50">
            Tools
          </div>
          <nav className="space-y-0.5">{toolsNavGroup.map(renderNavItem)}</nav>
        </div>

        {/* MORE TOOLS TOGGLE */}
        <div className="space-y-1">
          <button
            onClick={() => setIsMoreOpen(!isMoreOpen)}
            className="flex w-full items-center justify-between px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-muted-foreground/50 hover:text-foreground"
          >
            <span>More Features</span>
            {isMoreOpen ? (
              <ChevronDown className="h-3 w-3" />
            ) : (
              <ChevronRight className="h-3 w-3" />
            )}
          </button>
          {isMoreOpen && (
            <nav className="ml-2 space-y-0.5 border-l border-border/40 pl-1">
              {moreNavGroup.map(renderNavItem)}
            </nav>
          )}
        </div>
      </div>

      {/* BOTTOM SECTION */}
      <div className="space-y-3 border-t border-border/40 pt-3">
        <nav className="space-y-0.5">{bottomNavGroup.map(renderNavItem)}</nav>

        <div className="rounded-md border border-border/60 bg-card/60 p-2.5 text-xs">
          <div className="flex items-center gap-1.5 text-[11px] font-medium text-foreground">
            <Sparkles className="h-3.5 w-3.5 text-primary" /> Career Assistant
          </div>
          <p className="mt-1 text-[10px] leading-relaxed text-muted-foreground">
            Placement & preparation active.
          </p>
        </div>
      </div>
    </aside>
  );
}
