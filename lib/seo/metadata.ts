import { Metadata } from "next";

export interface SeoConfig {
  title: string;
  description: string;
  path?: string;
  ogImage?: string;
  noIndex?: boolean;
}

export const SITE_CONFIG = {
  name: "NextHire AI",
  domain: "nexthire.ai",
  url: "https://nexthire.ai",
  defaultDescription:
    "Enterprise AI-Powered Hiring, ATS Resume Scoring, Automated Mock Interviews, and Interactive Coding Platform.",
  defaultOgImage: "https://nexthire.ai/og-banner.png",
  twitterHandle: "@NextHireAI",
};

/**
 * Generate standard SEO Metadata, Open Graph, Twitter Card, and Canonical tags.
 */
export function buildSeoMetadata({
  title,
  description,
  path = "",
  ogImage = SITE_CONFIG.defaultOgImage,
  noIndex = false,
}: SeoConfig): Metadata {
  const fullTitle = `${title} | ${SITE_CONFIG.name}`;
  const canonicalUrl = `${SITE_CONFIG.url}${path}`;

  return {
    title: fullTitle,
    description,
    alternates: {
      canonical: canonicalUrl,
    },
    robots: {
      index: !noIndex,
      follow: !noIndex,
      googleBot: {
        index: !noIndex,
        follow: !noIndex,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
    openGraph: {
      title: fullTitle,
      description,
      url: canonicalUrl,
      siteName: SITE_CONFIG.name,
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: fullTitle,
        },
      ],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
      creator: SITE_CONFIG.twitterHandle,
      images: [ogImage],
    },
  };
}

/**
 * Generate JSON-LD Structured Data Schema for Organization & Software Application.
 */
export function generateStructuredDataSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: SITE_CONFIG.name,
    url: SITE_CONFIG.url,
    applicationCategory: "BusinessApplication",
    operatingSystem: "Web",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
    publisher: {
      "@type": "Organization",
      name: SITE_CONFIG.name,
      url: SITE_CONFIG.url,
      logo: `${SITE_CONFIG.url}/logo.png`,
    },
  };
}
