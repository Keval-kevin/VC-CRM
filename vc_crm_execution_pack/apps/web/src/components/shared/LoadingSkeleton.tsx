export function LoadingSkeleton(): JSX.Element {
  return (
    <div className="grid gap-3" aria-label="Loading">
      <div className="h-24 animate-pulse rounded-lg bg-muted" />
      <div className="grid gap-3 md:grid-cols-3">
        <div className="h-28 animate-pulse rounded-lg bg-muted" />
        <div className="h-28 animate-pulse rounded-lg bg-muted" />
        <div className="h-28 animate-pulse rounded-lg bg-muted" />
      </div>
      <div className="h-56 animate-pulse rounded-lg bg-muted" />
    </div>
  );
}
