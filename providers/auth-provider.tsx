"use client";

import React, { useEffect } from "react";
import { useAuthStore } from "@/lib/store/use-auth-store";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { initializeAuth, isInitialized } = useAuthStore();

  useEffect(() => {
    if (!isInitialized) {
      initializeAuth();
    }
  }, [initializeAuth, isInitialized]);

  return <>{children}</>;
}
