"use client";

import { useEffect } from "react";
import { AlertTriangle, RefreshCw, Home } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Unhandled Application Error:", error);
  }, [error]);

  return (
    <div className="container flex min-h-[70vh] items-center justify-center px-4 py-20">
      <Card className="w-full max-w-lg border-destructive/20 shadow-elevation-2">
        <CardHeader className="pb-2 text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10 text-destructive">
            <AlertTriangle className="h-6 w-6" />
          </div>
          <CardTitle className="text-xl font-semibold">
            Something Went Wrong
          </CardTitle>
          <CardDescription className="text-sm">
            An unexpected application error occurred while processing your
            request.
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-2 text-center">
          <div className="max-h-28 overflow-y-auto break-all rounded-lg border border-border/40 bg-muted/50 p-3 font-mono text-xs text-muted-foreground">
            {error.message || "Unknown Application Exception"}
          </div>
        </CardContent>
        <CardFooter className="flex justify-center gap-3 pt-2">
          <Button onClick={reset} className="gap-2">
            <RefreshCw className="h-4 w-4" /> Try Again
          </Button>
          <Link href="/">
            <Button variant="outline" className="gap-2">
              <Home className="h-4 w-4" /> Return Home
            </Button>
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
}
