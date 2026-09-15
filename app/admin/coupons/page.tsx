"use client";

import React, { useState } from "react";
import { Plus, Check, Tag, Calendar, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useSaaSStore } from "@/lib/store/use-saas-store";

export default function CouponsEnginePage() {
  const { coupons, addCoupon, toggleCoupon } = useSaaSStore();
  const [code, setCode] = useState("");
  const [discountType, setDiscountType] = useState<"percentage" | "flat">(
    "percentage"
  );
  const [discountValue, setDiscountValue] = useState(20);
  const [maxUses, setMaxUses] = useState(200);

  const handleCreateCoupon = () => {
    if (code.trim()) {
      addCoupon({
        id: `c-${Date.now()}`,
        code: code.trim().toUpperCase(),
        discountType,
        discountValue,
        maxUses,
        usesCount: 0,
        expiresAt: "2026-12-31",
        isActive: true,
      });
      setCode("");
    }
  };

  return (
    <div className="mx-auto max-w-6xl space-y-6 p-4 sm:p-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">
          Coupons & Promotional Code Engine
        </h1>
        <p className="text-sm text-muted-foreground">
          Create student discount codes, recruiter promotional offers, and set
          usage limits.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
        {/* Create Form (5 cols) */}
        <Card className="space-y-4 border-border/60 p-6 shadow-sm lg:col-span-5">
          <h2 className="flex items-center gap-2 text-sm font-bold">
            <Plus className="h-4 w-4 text-primary" /> Create Promo Code
          </h2>

          <div className="space-y-3 text-xs">
            <div className="space-y-1">
              <label className="font-semibold uppercase text-muted-foreground">
                Coupon Code
              </label>
              <Input
                placeholder="e.g. STUDENT50"
                value={code}
                onChange={(e) => setCode(e.target.value)}
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1">
                <label className="font-semibold uppercase text-muted-foreground">
                  Discount Type
                </label>
                <select
                  value={discountType}
                  onChange={(e) => setDiscountType(e.target.value as any)}
                  className="w-full rounded-md border border-input bg-background p-2.5 text-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <option value="percentage">Percentage (%)</option>
                  <option value="flat">Flat Amount ($)</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="font-semibold uppercase text-muted-foreground">
                  Discount Value
                </label>
                <Input
                  type="number"
                  value={discountValue}
                  onChange={(e) => setDiscountValue(Number(e.target.value))}
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="font-semibold uppercase text-muted-foreground">
                Max Uses Limit
              </label>
              <Input
                type="number"
                value={maxUses}
                onChange={(e) => setMaxUses(Number(e.target.value))}
              />
            </div>

            <Button
              variant="gradient"
              onClick={handleCreateCoupon}
              className="mt-2 w-full gap-2"
            >
              <Tag className="h-4 w-4" /> Issue Coupon Code
            </Button>
          </div>
        </Card>

        {/* Coupons List (7 cols) */}
        <Card className="space-y-4 border-border/60 p-6 shadow-sm lg:col-span-7">
          <h2 className="flex items-center gap-2 text-sm font-bold">
            <Tag className="h-4 w-4 text-primary" /> Active Coupons (
            {coupons.length})
          </h2>

          <div className="space-y-3 text-xs">
            {coupons.map((c) => (
              <div
                key={c.id}
                className="flex items-center justify-between rounded-xl border bg-card/60 p-4"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <p className="font-mono text-sm font-extrabold text-primary">
                      {c.code}
                    </p>
                    <Badge variant={c.isActive ? "success" : "outline"}>
                      {c.discountType === "percentage"
                        ? `${c.discountValue}% OFF`
                        : `$${c.discountValue} OFF`}
                    </Badge>
                  </div>
                  <p className="text-muted-foreground">
                    Uses: {c.usesCount} / {c.maxUses} • Expires {c.expiresAt}
                  </p>
                </div>

                <Button
                  variant={c.isActive ? "outline" : "default"}
                  size="sm"
                  onClick={() => toggleCoupon(c.id)}
                  className="text-xs"
                >
                  {c.isActive ? "Disable Code" : "Activate Code"}
                </Button>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
