"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Menu,
  User,
  LayoutDashboard,
  LogIn,
  LogOut,
  ArrowRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { mainNavItems } from "@/constants/navigation";
import { useUIStore } from "@/lib/store";
import { useAuthStore } from "@/lib/store/use-auth-store";
import { Button } from "@/components/ui/button";
import { Avatar } from "@/components/ui/avatar";

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { toggleSidebar } = useUIStore();
  const { role, user, profile, initializeAuth, isInitialized, signOutStore } =
    useAuthStore();

  useEffect(() => {
    if (!isInitialized) {
      initializeAuth();
    }
  }, [initializeAuth, isInitialized]);

  const getDashboardPath = () => {
    if (role === "recruiter") return "/recruiter";
    if (role === "admin") return "/admin";
    return "/dashboard";
  };

  const handleLogout = async () => {
    await signOutStore();
    router.replace("/login");
  };

  if (pathname === "/login" || pathname.startsWith("/signup")) {
    return (
      <header className="sticky top-0 z-40 w-full border-b border-border/60 bg-[#080B12]/90 backdrop-blur-md">
        <div className="container flex h-14 items-center justify-between px-4 sm:px-8">
          <Link
            href="/"
            className="flex items-center gap-2 text-base font-bold tracking-wider text-foreground"
          >
            <div className="flex h-7 w-7 items-center justify-center rounded-md bg-primary text-xs font-black text-primary-foreground">
              NH
            </div>
            <span className="text-sm font-bold tracking-tight">NEXT HIRE</span>
          </Link>
          <Link
            href="/"
            className="text-xs text-muted-foreground hover:text-foreground"
          >
            Back to site
          </Link>
        </div>
      </header>
    );
  }

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/60 bg-[#080B12]/90 backdrop-blur-md">
      <div className="container flex h-14 items-center justify-between px-4 sm:px-8">
        <Link
          href="/"
          className="flex items-center gap-2 text-base font-bold tracking-wider text-foreground"
        >
          <div className="flex h-7 w-7 items-center justify-center rounded-md bg-primary text-xs font-black text-primary-foreground">
            NH
          </div>
          <span className="text-sm font-bold tracking-tight">NEXT HIRE</span>
        </Link>

        <nav className="hidden items-center gap-1 lg:flex">
          {mainNavItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "relative rounded-md px-3 py-1.5 text-xs font-medium transition-colors",
                  isActive
                    ? "font-semibold text-foreground"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                {item.title}
                {isActive && (
                  <span className="absolute inset-x-1 -bottom-px h-[2px] bg-primary" />
                )}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-2">
          {user ? (
            <>
              <Link href={getDashboardPath()}>
                <Button variant="ghost" size="sm" className="gap-1.5 text-xs">
                  <LayoutDashboard className="h-3.5 w-3.5" />
                  <span className="hidden sm:inline">Workspace</span>
                </Button>
              </Link>
              <Link
                href={getDashboardPath()}
                className="flex items-center gap-2 pl-1"
              >
                <Avatar
                  fallback={(profile?.full_name || user?.email || "U").slice(
                    0,
                    2
                  )}
                  size="sm"
                  className="h-7 w-7 border border-border/60"
                />
                <span className="hidden text-xs font-medium text-foreground sm:inline">
                  {(
                    profile?.full_name ||
                    user?.user_metadata?.full_name ||
                    ""
                  ).split(" ")[0] || "Account"}
                </span>
              </Link>
              <Button
                variant="outline"
                size="sm"
                className="gap-1.5 text-xs"
                onClick={handleLogout}
              >
                <LogOut className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Logout</span>
              </Button>
            </>
          ) : (
            <>
              <Link href="/recruiter" className="hidden md:inline-flex">
                <Button variant="ghost" size="sm" className="gap-1.5 text-xs">
                  <User className="h-3.5 w-3.5" />
                  <span>For Recruiters</span>
                </Button>
              </Link>
              <Link href="/login">
                <Button variant="outline" size="sm" className="gap-1.5 text-xs">
                  <LogIn className="h-3.5 w-3.5" />
                  Login
                </Button>
              </Link>
              <Link href="/signup">
                <Button size="sm" className="gap-1.5 text-xs font-semibold">
                  Get Started <ArrowRight className="h-3.5 w-3.5" />
                </Button>
              </Link>
            </>
          )}

          <Button
            variant="ghost"
            size="icon"
            onClick={toggleSidebar}
            className="rounded-md lg:hidden"
            aria-label="Open menu"
          >
            <Menu className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </header>
  );
}
