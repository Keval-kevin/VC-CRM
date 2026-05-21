import type { ReactNode } from "react";

import { cn } from "../../lib/utils";
import { SurfaceCard } from "./SurfaceCard";

export type DetailSummaryItem = {
  label: string;
  value: ReactNode;
};

export function DetailSummaryGrid({
  className,
  items,
}: {
  items: DetailSummaryItem[];
  className?: string;
}): JSX.Element {
  return (
    <section className={cn("grid gap-3 sm:grid-cols-2 xl:grid-cols-4", className)}>
      {items.map((item) => (
        <SurfaceCard key={item.label} padding="sm">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            {item.label}
          </p>
          <div className="mt-2 text-sm font-semibold text-vc-navy">{item.value}</div>
        </SurfaceCard>
      ))}
    </section>
  );
}

export function DetailSection({
  children,
  className,
  title,
}: {
  title: string;
  children: ReactNode;
  className?: string;
}): JSX.Element {
  return (
    <SurfaceCard padding="none" className={className}>
      <div className="border-b border-border p-4">
        <h2 className="text-base font-semibold text-vc-navy">{title}</h2>
      </div>
      <div className="space-y-3 p-4">{children}</div>
    </SurfaceCard>
  );
}

export function DetailField({ label, value }: { label: string; value: ReactNode }): JSX.Element {
  return (
    <div className="flex items-start justify-between gap-3 rounded-card border border-border bg-vc-bg p-3">
      <span className="text-sm text-muted-foreground">{label}</span>
      <span className="text-right text-sm font-semibold text-vc-navy">{value}</span>
    </div>
  );
}
