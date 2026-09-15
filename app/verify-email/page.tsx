import React from "react";
import Link from "next/link";
import { MailCheck, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";

export default function VerifyEmailPage() {
  return (
    <div className="container flex min-h-[75vh] items-center justify-center px-4 py-16">
      <Card className="w-full max-w-md p-6 text-center shadow-2xl backdrop-blur-md md:p-8">
        <CardHeader className="mb-4 p-0">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary">
            <MailCheck className="h-8 w-8 animate-bounce" />
          </div>
          <CardTitle className="text-2xl font-extrabold tracking-tight">
            Check Your Email
          </CardTitle>
          <CardDescription className="text-sm">
            We&apos;ve sent a verification link to your registered email
            address.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-3 p-0 text-xs text-muted-foreground">
          <p>
            Please click on the link inside the email to verify your NextHire AI
            account and access your dashboard.
          </p>
          <div className="rounded-lg border bg-muted/40 p-3 font-mono text-[11px]">
            Tip: Check your spam or junk folder if you don&apos;t see the email
            within 2 minutes.
          </div>
        </CardContent>

        <CardFooter className="mt-6 flex-col justify-center gap-2 border-t border-border/40 p-0 pt-4">
          <Link href="/login" className="w-full">
            <Button variant="gradient" className="w-full gap-2">
              Proceed to Sign In <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
}
