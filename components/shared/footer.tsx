import React from "react";
import Link from "next/link";
import { Sparkles, Github, Twitter, Linkedin, Heart } from "lucide-react";
import { footerNavItems } from "@/constants/navigation";
import { BRANDING } from "@/constants/branding";

export function Footer() {
  return (
    <footer className="border-t border-border/40 bg-card/40">
      <div className="container px-4 py-12 sm:px-8 md:py-16">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4 lg:grid-cols-5">
          <div className="lg:col-span-2">
            <Link
              href="/"
              className="flex items-center gap-2 text-lg font-semibold tracking-tight"
            >
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <Sparkles className="h-3.5 w-3.5" />
              </div>
              <span>NextHire AI</span>
            </Link>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-muted-foreground">
              {BRANDING.mission}
            </p>
            <div className="mt-6 flex items-center gap-4">
              {[
                { icon: Github, label: "GitHub", href: "https://github.com" },
                {
                  icon: Twitter,
                  label: "Twitter",
                  href: "https://twitter.com",
                },
                {
                  icon: Linkedin,
                  label: "LinkedIn",
                  href: "https://linkedin.com",
                },
              ].map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noreferrer"
                  className="flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                  aria-label={social.label}
                >
                  <social.icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Platform
            </h4>
            <ul className="mt-4 space-y-2.5 text-sm">
              {footerNavItems.product.map((link) => (
                <li key={link.title}>
                  <Link
                    href={link.href}
                    className="text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {link.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Company
            </h4>
            <ul className="mt-4 space-y-2.5 text-sm">
              {footerNavItems.company.map((link) => (
                <li key={link.title}>
                  <Link
                    href={link.href}
                    className="text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {link.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Legal
            </h4>
            <ul className="mt-4 space-y-2.5 text-sm">
              {footerNavItems.legal.map((link) => (
                <li key={link.title}>
                  <Link
                    href={link.href}
                    className="text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {link.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-border/40 pt-8 text-xs text-muted-foreground sm:flex-row">
          <p>
            &copy; {new Date().getFullYear()} NextHire AI Inc. All rights
            reserved.
          </p>
          <p className="flex items-center gap-1.5">
            Built with
            <Heart className="h-3 w-3 fill-primary text-primary" />
            for modern hiring teams.
          </p>
        </div>
      </div>
    </footer>
  );
}
