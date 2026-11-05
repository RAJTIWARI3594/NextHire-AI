"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Ban, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useAuthStore } from "@/lib/store/use-auth-store";

export default function AccountSuspendedPage() {
  const router = useRouter();
  const signOutStore = useAuthStore((state) => state.signOutStore);

  const handleSignOut = async () => {
    await signOutStore();
    router.replace("/login");
  };

  return (
    <main className="flex min-h-[70vh] items-center justify-center p-4">
      <Card className="w-full max-w-lg space-y-5 p-8 text-center">
        <Ban className="mx-auto h-10 w-10 text-destructive" />
        <h1 className="text-2xl font-bold">Account temporarily suspended</h1>
        <p className="text-sm leading-6 text-muted-foreground">
          Access to this account has been paused by the platform administrator.
          Contact NextHire AI support if you believe this is a mistake.
        </p>
        <Button onClick={handleSignOut} className="w-full">
          <LogOut className="mr-2 h-4 w-4" />
          Sign out
        </Button>
      </Card>
    </main>
  );
}
