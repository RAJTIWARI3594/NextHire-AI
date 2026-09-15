export const siteConfig = {
  name: "NextHire AI",
  description:
    "Next-Generation AI Powered Talent Acquisition & Hiring Intelligence Platform",
  url: "https://nexthire.ai",
  ogImage: "https://nexthire.ai/og.png",
  links: {
    twitter: "https://twitter.com/nexthireai",
    github: "https://github.com/nexthireai",
    linkedin: "https://linkedin.com/company/nexthireai",
  },
  mainNav: [
    { title: "Home", href: "/" },
    { title: "About Us", href: "/about" },
    { title: "Contact", href: "/contact" },
  ],
  legalNav: [
    { title: "Privacy Policy", href: "/privacy" },
    { title: "Terms & Conditions", href: "/terms" },
  ],
};

export type SiteConfig = typeof siteConfig;
