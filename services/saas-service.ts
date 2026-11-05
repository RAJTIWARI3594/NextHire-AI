import { createClient } from "@/lib/supabase/client";
import type {
  SubscriptionPlan,
  PaymentTransaction,
  AIUsageMetrics,
  InvoiceItem,
} from "@/types/saas";

export async function fetchSubscriptionPlans(): Promise<SubscriptionPlan[]> {
  // No subscription_plans/pricing configuration table exists in this database.
  return [];
}

export async function fetchSubscriptionsOverview(): Promise<SubscriptionPlan[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("subscriptions")
    .select("id, plan_name, status, current_period_end");

  if (error) throw error;

  const summary = new Map<string, { count: number; active: boolean }>();
  (data || []).forEach((row) => {
    const name = row.plan_name || "Unspecified";
    const item = summary.get(name) || { count: 0, active: false };
    item.count += 1;
    item.active =
      item.active ||
      ["active", "trialing"].includes(String(row.status).toLowerCase());
    summary.set(name, item);
  });

  return [...summary.entries()].map(([name, dataForPlan]) => ({
    id: name,
    name,
    priceMonthly: null,
    priceYearly: null,
    features: [],
    subscriberCount: dataForPlan.count,
    isActive: dataForPlan.active,
  }));
}

export async function fetchTransactions(): Promise<PaymentTransaction[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("payments")
    .select(
      "id, profile_id, amount, currency, payment_method, status, transaction_id, created_at, profile:profiles!payments_profile_id_fkey(full_name)"
    )
    .order("created_at", { ascending: false });

  if (error) throw error;

  return (data || []).map((payment: any) => {
    const profile = Array.isArray(payment.profile)
      ? payment.profile[0]
      : payment.profile;
    return {
      id: payment.id,
      userName: profile?.full_name || "Platform user",
      userEmail: "Not available",
      amount: Number(payment.amount || 0),
      currency: payment.currency || "Not recorded",
      gateway: "Not recorded",
      paymentMethod: payment.payment_method || "Not recorded",
      status: String(payment.status || "unknown").toLowerCase(),
      transactionId: payment.transaction_id || "Not recorded",
      date: payment.created_at
        ? new Date(payment.created_at).toLocaleDateString("en-IN", {
            day: "2-digit",
            month: "short",
            year: "numeric",
          })
        : "Date unavailable",
    };
  });
}

export async function fetchInvoices(): Promise<InvoiceItem[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("invoices")
    .select(
      "id, invoice_number, pdf_url, created_at, payment:payments!invoices_payment_id_fkey(amount, currency, profile:profiles!payments_profile_id_fkey(full_name))"
    )
    .order("created_at", { ascending: false });

  if (error) throw error;

  return (data || []).map((invoice: any) => {
    const payment = Array.isArray(invoice.payment)
      ? invoice.payment[0]
      : invoice.payment;
    const profile = Array.isArray(payment?.profile)
      ? payment.profile[0]
      : payment?.profile;
    return {
      id: invoice.id,
      invoiceNumber: invoice.invoice_number || "Invoice",
      userName: profile?.full_name || "Platform user",
      userEmail: "Not available",
      amount: Number(payment?.amount || 0),
      currency: payment?.currency || "Not recorded",
      taxAmount: null,
      date: invoice.created_at
        ? new Date(invoice.created_at).toLocaleDateString("en-IN", {
            day: "2-digit",
            month: "short",
            year: "numeric",
          })
        : "Date unavailable",
      pdfUrl: invoice.pdf_url || undefined,
    };
  });
}

export async function fetchAIUsageMetrics(): Promise<AIUsageMetrics> {
  const supabase = createClient();
  const dayStart = new Date();
  dayStart.setHours(0, 0, 0, 0);
  const { count, error } = await supabase
    .from("ai_chat_history")
    .select("id", { count: "exact", head: true })
    .gte("created_at", dayStart.toISOString());

  if (error) throw error;

  return {
    totalRequestsToday: count || 0,
    totalTokensUsed: null,
    totalCostUsd: null,
    costPerUserUsd: null,
    featureBreakdown: [],
  };
}
