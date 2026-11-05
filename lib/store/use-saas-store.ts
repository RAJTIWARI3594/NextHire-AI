import { create } from "zustand";
import type {
  SubscriptionPlan,
  PaymentTransaction,
  CouponCode,
  InvoiceItem,
  CMSPost,
} from "@/types/saas";

interface SaaSStore {
  plans: SubscriptionPlan[];
  transactions: PaymentTransaction[];
  coupons: CouponCode[];
  invoices: InvoiceItem[];
  cmsPosts: CMSPost[];
  setPlans: (plans: SubscriptionPlan[]) => void;
  setTransactions: (transactions: PaymentTransaction[]) => void;
  setInvoices: (invoices: InvoiceItem[]) => void;
  setCMSPosts: (posts: CMSPost[]) => void;
  addCoupon: (coupon: CouponCode) => void;
  addCMSPost: (post: CMSPost) => void;
  toggleCoupon: (id: string) => void;
}

export const useSaaSStore = create<SaaSStore>((set) => ({
  plans: [],
  transactions: [],
  coupons: [],
  invoices: [],
  cmsPosts: [],
  setPlans: (plans) => set({ plans }),
  setTransactions: (transactions) => set({ transactions }),
  setInvoices: (invoices) => set({ invoices }),
  setCMSPosts: (cmsPosts) => set({ cmsPosts }),
  addCoupon: (coupon) =>
    set((state) => ({ coupons: [coupon, ...state.coupons] })),
  addCMSPost: (post) =>
    set((state) => ({ cmsPosts: [post, ...state.cmsPosts] })),
  toggleCoupon: (id) =>
    set((state) => ({
      coupons: state.coupons.map((coupon) =>
        coupon.id === id
          ? { ...coupon, isActive: !coupon.isActive }
          : coupon
      ),
    })),
}));
