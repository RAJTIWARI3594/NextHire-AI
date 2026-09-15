import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "NextHire AI - Smart Hiring Platform",
    short_name: "NextHire AI",
    description:
      "AI-Powered Career & Recruitment Platform for Resume Optimization, Mock Interviews, and Job Matching.",
    start_url: "/",
    display: "standalone",
    background_color: "#090d16",
    theme_color: "#0f172a",
    orientation: "portrait",
    scope: "/",
    icons: [
      {
        src: "/icons/icon-192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icons/icon-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icons/icon-maskable-192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "maskable",
      },
      {
        src: "/icons/icon-maskable-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
    categories: ["productivity", "business", "utilities"],
    shortcuts: [
      {
        name: "Dashboard",
        short_name: "Dashboard",
        description: "Open NextHire AI Dashboard",
        url: "/dashboard",
        icons: [{ src: "/icons/icon-192.png", sizes: "192x192" }],
      },
      {
        name: "AI Interview",
        short_name: "AI Interview",
        description: "Start AI Practice Interview",
        url: "/dashboard/ai-interview",
        icons: [{ src: "/icons/icon-192.png", sizes: "192x192" }],
      },
      {
        name: "Resume Builder",
        short_name: "Resume Builder",
        description: "Build ATS Optimized Resume",
        url: "/dashboard/resume",
        icons: [{ src: "/icons/icon-192.png", sizes: "192x192" }],
      },
    ],
  };
}
