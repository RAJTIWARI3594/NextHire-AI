export interface SubscriptionPlan {
  id: string;
  name: string;
  priceMonthly: number | null;
  priceYearly: number | null;
  features: string[];
  subscriberCount?: number;
  isActive: boolean;
}

export interface PaymentTransaction {
  id: string;
  userName: string;
  userEmail: string;
  amount: number;
  currency: string;
  gateway: string;
  paymentMethod: string;
  status: string;
  transactionId: string;
  date: string;
}

export interface CouponCode {
  id: string;
  code: string;
  discountType: "percentage" | "flat";
  discountValue: number;
  maxUses: number;
  usesCount: number;
  expiresAt: string;
  isActive: boolean;
}

export interface InvoiceItem {
  id: string;
  invoiceNumber: string;
  userName: string;
  userEmail: string;
  amount: number;
  currency: string;
  taxAmount: number | null;
  date: string;
  pdfUrl?: string;
}

export interface AIUsageMetrics {
  totalRequestsToday: number;
  totalTokensUsed: number | null;
  totalCostUsd: number | null;
  costPerUserUsd: number | null;
  featureBreakdown: { feature: string; count: number; cost: number }[];
}

export interface CMSPost {
  id: string;
  title: string;
  slug: string;
  category: "blog" | "announcement" | "career_tip" | "faq";
  content: string;
  status: "draft" | "published" | "archived";
  publishedAt?: string;
}
