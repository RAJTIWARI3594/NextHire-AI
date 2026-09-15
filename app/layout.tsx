import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { RootProvider } from "@/providers/root-provider";
import { Navbar } from "@/components/shared/navbar";
import { Sidebar } from "@/components/shared/sidebar";
import { Footer } from "@/components/shared/footer";
import { PwaInstaller } from "@/components/shared/pwa-installer";
import { siteConfig } from "@/config/site";

import { MobileBottomNav } from "@/components/shared/mobile-bottom-nav";

const fontJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const viewport: Viewport = {
  themeColor: "#080B12",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
};

export const metadata: Metadata = {
  title: {
    default: siteConfig.name,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  keywords: [
    "AI Hiring",
    "Recruitment Platform",
    "Career Platform",
    "Resume Builder",
    "Interview Practice",
    "Career Coach",
    "Supabase",
    "Next.js 15",
  ],
  authors: [{ name: "NextHire AI Team" }],
  creator: "NextHire AI",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "NextHire AI",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteConfig.url,
    title: siteConfig.name,
    description: siteConfig.description,
    siteName: siteConfig.name,
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.name,
    description: siteConfig.description,
    creator: "@nexthireai",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body
        className={`${fontJakarta.variable} flex min-h-screen flex-col bg-[#080B12] font-sans text-foreground antialiased`}
      >
        <RootProvider>
          <Navbar />
          <Sidebar />
          <main className="flex-1 pb-16 lg:pb-0">{children}</main>
          <Footer />
          <MobileBottomNav />
          <PwaInstaller />
        </RootProvider>
      </body>
    </html>
  );
}
