import { cn } from "../../lib/utils";

export type LoadingSkeletonProps = {
  className?: string;
  variant?: "page" | "table" | "cards";
};

export function LoadingSkeleton({
  className,
  variant = "page",
}: LoadingSkeletonProps): JSX.Element {
  if (variant === "table") {
    return (
      <div className={cn("grid gap-3", className)} aria-label="Loading">
        <div className="h-12 animate-pulse rounded-card bg-muted" />
        <div className="h-72 animate-pulse rounded-card bg-muted" />
      </div>
    );
  }

  if (variant === "cards") {
    return (
      <div
        className={cn("grid gap-3 sm:grid-cols-2 xl:grid-cols-4", className)}
        aria-label="Loading"
      >
        {["card-1", "card-2", "card-3", "card-4"].map((item) => (
          <div key={item} className="h-28 animate-pulse rounded-card bg-muted" />
        ))}
      </div>
    );
  }

  return (
    <div className={cn("grid gap-3", className)} aria-label="Loading">
      <div className="h-24 animate-pulse rounded-card bg-muted" />
      <div className="grid gap-3 md:grid-cols-3">
        <div className="h-28 animate-pulse rounded-card bg-muted" />
        <div className="h-28 animate-pulse rounded-card bg-muted" />
        <div className="h-28 animate-pulse rounded-card bg-muted" />
      </div>
      <div className="h-56 animate-pulse rounded-card bg-muted" />
    </div>
  );
}
