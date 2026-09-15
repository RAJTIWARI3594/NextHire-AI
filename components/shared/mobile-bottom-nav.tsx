"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  LayoutDashboard,
  Briefcase,
  Shield,
  MessageSquareCode,
} from "lucide-react";
import { cn } from "@/lib/utils";

export function MobileBottomNav() {
  const pathname = usePathname();

  const navItems = [
    { title: "Home", href: "/", icon: Home },
    { title: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { title: "AI Coach", href: "/dashboard/ai-coach", icon: MessageSquareCode },
    { title: "Recruiter", href: "/recruiter", icon: Briefcase },
    { title: "Admin", href: "/admin", icon: Shield },
  ];

  return (
    <nav className="pb-safe fixed bottom-0 left-0 right-0 z-50 flex h-14 items-center justify-around border-t border-border/40 bg-background/95 px-2 backdrop-blur-xl lg:hidden">
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive =
          item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);

        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex flex-col items-center justify-center gap-0.5 rounded-lg px-3 py-1 text-[10px] font-medium transition-colors active:scale-95",
              isActive ? "text-primary" : "text-muted-foreground"
            )}
          >
            <Icon
              className={cn(
                "h-[18px] w-[18px] transition-colors",
                isActive ? "text-primary" : "text-muted-foreground"
              )}
            />
            <span className="max-w-[60px] truncate">{item.title}</span>
          </Link>
        );
      })}
    </nav>
  );
}
