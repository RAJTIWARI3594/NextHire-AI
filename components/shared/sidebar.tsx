"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Sparkles,
  Home,
  Info,
  Mail,
  ShieldCheck,
  FileText,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useUIStore } from "@/lib/store";
import { Button } from "@/components/ui/button";

const sidebarLinks = [
  { title: "Home", href: "/", icon: Home },
  { title: "About Us", href: "/about", icon: Info },
  { title: "Contact", href: "/contact", icon: Mail },
  { title: "Privacy Policy", href: "/privacy", icon: ShieldCheck },
  { title: "Terms & Conditions", href: "/terms", icon: FileText },
];

export function Sidebar() {
  const { isSidebarOpen, closeSidebar } = useUIStore();
  const pathname = usePathname();

  return (
    <AnimatePresence>
      {isSidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeSidebar}
            className="fixed inset-0 bg-foreground/20 backdrop-blur-sm"
          />

          <motion.aside
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="fixed inset-y-0 left-0 z-50 flex w-72 flex-col justify-between border-r border-border/60 bg-card p-6 shadow-elevation-4"
          >
            <div>
              <div className="flex items-center justify-between border-b border-border/40 pb-6">
                <Link
                  href="/"
                  onClick={closeSidebar}
                  className="flex items-center gap-2 text-lg font-semibold tracking-tight"
                >
                  <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                    <Sparkles className="h-3.5 w-3.5" />
                  </div>
                  <span>NextHire AI</span>
                </Link>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={closeSidebar}
                  className="h-8 w-8 rounded-full"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>

              <nav className="mt-6 space-y-0.5">
                {sidebarLinks.map((link) => {
                  const Icon = link.icon;
                  const isActive = pathname === link.href;

                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={closeSidebar}
                      className={cn(
                        "flex items-center justify-between rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                        isActive
                          ? "bg-primary/10 text-primary"
                          : "text-muted-foreground hover:bg-muted hover:text-foreground"
                      )}
                    >
                      <div className="flex items-center gap-3">
                        <Icon className="h-4 w-4" />
                        <span>{link.title}</span>
                      </div>
                      <ChevronRight className="h-3.5 w-3.5 opacity-30" />
                    </Link>
                  );
                })}
              </nav>
            </div>

            <div className="rounded-lg border border-border/40 bg-muted/50 p-4 text-xs text-muted-foreground">
              <p className="mb-1 font-medium text-foreground">
                NextHire AI Platform
              </p>
              <p>
                Phase 1 Setup active. AI recruiting engines ready for
                integration.
              </p>
            </div>
          </motion.aside>
        </div>
      )}
    </AnimatePresence>
  );
}
