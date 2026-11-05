"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Clock3, LogOut, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useAuthStore } from "@/lib/store/use-auth-store";

export default function RecruiterPendingVerificationPage() {
  const router = useRouter();
  const signOutStore = useAuthStore((state) => state.signOutStore);

  const handleSignOut = async () => {
    await signOutStore();
    router.replace("/login");
  };

  return (
    <div className="mx-auto flex min-h-[65vh] max-w-2xl items-center justify-center p-4">
      <Card className="w-full border-amber-500/30">
        <CardContent className="space-y-5 p-8 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-amber-500/10 text-amber-600">
            <Clock3 className="h-7 w-7" />
          </div>
          <div className="space-y-2">
            <h1 className="text-2xl font-bold">Company verification pending</h1>
            <p className="text-sm leading-6 text-muted-foreground">
              Your recruiter account has been created. The recruiter workspace
              and candidate information will unlock after an administrator
              reviews and verifies your company details.
            </p>
          </div>
          <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
            <ShieldCheck className="h-4 w-4" />
            Your account remains protected while verification is pending.
          </div>
          <div className="flex flex-col justify-center gap-3 sm:flex-row">
            <Button onClick={() => window.location.reload()} variant="outline">
              Refresh verification status
            </Button>
            <Button onClick={handleSignOut} variant="ghost">
              <LogOut className="mr-2 h-4 w-4" />
              Sign out
            </Button>
          </div>
          <p className="text-xs text-muted-foreground">
            <Link href="/" className="text-primary hover:underline">
              Return to homepage
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
