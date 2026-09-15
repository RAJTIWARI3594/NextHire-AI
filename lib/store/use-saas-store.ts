import { create } from "zustand";
import type {
  SubscriptionPlan,
  PaymentTransaction,
  CouponCode,
  InvoiceItem,
  AIUsageMetrics,
  CMSPost,
} from "@/types/saas";
import { MOCK_PLANS, MOCK_TRANSACTIONS } from "@/services/saas-service";

interface SaaSStore {
  plans: SubscriptionPlan[];
  transactions: PaymentTransaction[];
  coupons: CouponCode[];
  invoices: InvoiceItem[];
  cmsPosts: CMSPost[];

  addCoupon: (coupon: CouponCode) => void;
  addCMSPost: (post: CMSPost) => void;
  toggleCoupon: (id: string) => void;
}

export const useSaaSStore = create<SaaSStore>((set) => ({
  plans: MOCK_PLANS,
  transactions: MOCK_TRANSACTIONS,
  coupons: [
    {
      id: "c-1",
      code: "STUDENT50",
      discountType: "percentage",
      discountValue: 50,
      maxUses: 500,
      usesCount: 142,
      expiresAt: "2026-12-31",
      isActive: true,
    },
    {
      id: "c-[2]",
      code: "WELCOME10",
      discountType: "flat",
      discountValue: 10,
      maxUses: 1000,
      usesCount: 380,
      expiresAt: "2026-09-30",
      isActive: true,
    },
  ],
  invoices: [
    {
      id: "inv-1",
      invoiceNumber: "INV-2026-001",
      userName: "Vercel Partner Labs",
      userEmail: "billing@vercel.com",
      amount: 499,
      taxAmount: 89.82,
      date: "Aug 5, 2026",
    },
  ],
  cmsPosts: [
    {
      id: "cms-1",
      title:
        "Mastering Next.js 15 App Router & Server Components for Technical Interviews",
      slug: "mastering-nextjs-15-interviews",
      category: "blog",
      content:
        "Complete guide on architecture, streaming, and performance optimization.",
      status: "published",
      publishedAt: "Aug 4, 2026",
    },
  ],

  addCoupon: (coupon) =>
    set((state) => ({ coupons: [coupon, ...state.coupons] })),

  addCMSPost: (post) =>
    set((state) => ({ cmsPosts: [post, ...state.cmsPosts] })),

  toggleCoupon: (id) =>
    set((state) => ({
      coupons: state.coupons.map((c) =>
        c.id === id ? { ...c, isActive: !c.isActive } : c
      ),
    })),
}));
