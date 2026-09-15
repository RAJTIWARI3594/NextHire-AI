export interface SubscriptionPlan {
  id: string;
  name: "Free" | "Pro" | "Enterprise";
  priceMonthly: number;
  priceYearly: number;
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
  gateway: "stripe" | "razorpay";
  paymentMethod: "card" | "upi" | "netbanking";
  status: "success" | "pending" | "failed" | "refunded";
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
  taxAmount: number;
  date: string;
  pdfUrl?: string;
}

export interface AIUsageMetrics {
  totalRequestsToday: number;
  totalTokensUsed: number;
  totalCostUsd: number;
  costPerUserUsd: number;
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
