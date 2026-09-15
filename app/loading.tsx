import { LoadingSpinner } from "@/components/ui/spinner";
import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="container flex min-h-[60vh] flex-col items-center justify-center space-y-8 px-4 py-12 sm:px-8">
      <div className="flex flex-col items-center space-y-3">
        <LoadingSpinner size="lg" />
        <p className="animate-pulse text-sm font-medium text-muted-foreground">
          Loading...
        </p>
      </div>

      <div className="mt-8 w-full max-w-4xl space-y-4">
        <Skeleton className="mx-auto h-10 w-3/4 rounded-md" />
        <Skeleton className="mx-auto h-5 w-1/2 rounded-md" />
        <div className="grid grid-cols-1 gap-5 pt-6 md:grid-cols-3">
          <Skeleton className="h-40 rounded-xl" />
          <Skeleton className="h-40 rounded-xl" />
          <Skeleton className="h-40 rounded-xl" />
        </div>
      </div>
    </div>
  );
}
