import { createClient } from "@/lib/supabase/client";
import type {
  SubscriptionPlan,
  PaymentTransaction,
  CouponCode,
  InvoiceItem,
  AIUsageMetrics,
  CMSPost,
} from "@/types/saas";

export const MOCK_PLANS: SubscriptionPlan[] = [
  {
    id: "plan-free",
    name: "Free",
    priceMonthly: 0,
    priceYearly: 0,
    features: [
      "Limited AI Chats (5/day)",
      "Basic Resume Builder",
      "Limited Job Applications",
    ],
    subscriberCount: 14250,
    isActive: true,
  },
  {
    id: "plan-pro",
    name: "Pro",
    priceMonthly: 19,
    priceYearly: 190,
    features: [
      "Unlimited AI Chat & AI Coach",
      "AI Resume Review & Cover Letters",
      "AI Mock Interviews (Voice + Text)",
      "Premium Resume Templates",
      "Unlimited Job Applications",
    ],
    subscriberCount: 890,
    isActive: true,
  },
  {
    id: "plan-ent",
    name: "Enterprise",
    priceMonthly: 499,
    priceYearly: 4990,
    features: [
      "Enterprise Recruiter Portal",
      "AI Candidate Ranking Engine",
      "Interview Scheduling & Chat",
      "Offer Letter Generator",
      "Priority API Access & Support",
    ],
    subscriberCount: 85,
    isActive: true,
  },
];

export const MOCK_TRANSACTIONS: PaymentTransaction[] = [
  {
    id: "tx-1",
    userName: "Vercel Partner Labs",
    userEmail: "billing@vercel.com",
    amount: 499,
    currency: "USD",
    gateway: "stripe",
    paymentMethod: "card",
    status: "success",
    transactionId: "pi_3MtwL2LkdIwbfR1n1",
    date: "Aug 5, 2026",
  },
  {
    id: "tx-2",
    userName: "Aarav Sharma",
    userEmail: "aarav@student.nexthire.ai",
    amount: 19,
    currency: "USD",
    gateway: "razorpay",
    paymentMethod: "upi",
    status: "success",
    transactionId: "pay_K1jL9xM2nO3p",
    date: "Aug 4, 2026",
  },
];

export async function fetchSubscriptionPlans(): Promise<SubscriptionPlan[]> {
  const supabase = createClient();
  const { data } = await supabase.from("subscription_plans").select("*");

  if (!data || data.length === 0) return MOCK_PLANS;

  return data.map((p) => ({
    id: p.id,
    name: p.name,
    priceMonthly: Number(p.price_monthly),
    priceYearly: Number(p.price_yearly),
    features: p.features || [],
    isActive: p.is_active,
  }));
}

export async function fetchTransactions(): Promise<PaymentTransaction[]> {
  const supabase = createClient();
  const { data } = await supabase
    .from("payments")
    .select("*, profiles(full_name, email)");

  if (!data || data.length === 0) return MOCK_TRANSACTIONS;

  return data.map((t) => ({
    id: t.id,
    userName: t.profiles?.full_name || "Subscriber",
    userEmail: t.profiles?.email || "billing@nexthire.ai",
    amount: Number(t.amount),
    currency: t.currency || "USD",
    gateway: t.gateway,
    paymentMethod: t.payment_method,
    status: t.status,
    transactionId: t.transaction_id,
    date: "Recent",
  }));
}

export async function fetchAIUsageMetrics(): Promise<AIUsageMetrics> {
  return {
    totalRequestsToday: 18500,
    totalTokensUsed: 4250000,
    totalCostUsd: 14.85,
    costPerUserUsd: 0.00104,
    featureBreakdown: [
      { feature: "AI Career Coach", count: 8200, cost: 6.45 },
      { feature: "AI Resume Review", count: 4500, cost: 3.8 },
      { feature: "AI Mock Interview", count: 3800, cost: 3.1 },
      { feature: "AI Cover Letter", count: 2000, cost: 1.5 },
    ],
  };
}
