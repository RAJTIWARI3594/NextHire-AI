import Link from "next/link";
import { Sparkles, Home, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="container flex min-h-[70vh] flex-col items-center justify-center px-4 py-24 text-center">
      <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-border/60 bg-muted/60 px-3.5 py-1 text-xs font-medium text-muted-foreground">
        <Sparkles className="h-3.5 w-3.5" />
        404 Page Not Found
      </div>
      <h1 className="text-6xl font-bold tracking-tight sm:text-7xl">
        Lost in AI Space?
      </h1>
      <p className="mt-4 max-w-md text-lg text-muted-foreground">
        The page you are looking for doesn&apos;t exist or has been moved to
        another candidate pipeline.
      </p>
      <div className="mt-8 flex gap-3">
        <Link href="/">
          <Button size="lg" className="gap-2">
            <Home className="h-4 w-4" /> Go to Homepage
          </Button>
        </Link>
      </div>
    </div>
  );
}
