export interface NavItem {
  title: string;
  href: string;
  description?: string;
  disabled?: boolean;
  external?: boolean;
}

export const mainNavItems: NavItem[] = [
  { title: "Home", href: "/" },
  { title: "About", href: "/about" },
  { title: "Contact", href: "/contact" },
];

export const footerNavItems = {
  product: [
    { title: "AI Interviewer", href: "/#features" },
    { title: "Smart Resume Screening", href: "/#features" },
    { title: "Predictive Analytics", href: "/#features" },
    { title: "Automated Scheduling", href: "/#features" },
  ],
  company: [
    { title: "About NextHire", href: "/about" },
    { title: "Careers", href: "/about#careers" },
    { title: "Contact Sales", href: "/contact" },
    { title: "Partners", href: "/about#partners" },
  ],
  legal: [
    { title: "Privacy Policy", href: "/privacy" },
    { title: "Terms of Service", href: "/terms" },
    { title: "Security", href: "/privacy#security" },
    { title: "GDPR Compliance", href: "/privacy#gdpr" },
  ],
};
