import type { ReactNode } from "react";

import { cn } from "../../lib/utils";
import { SurfaceCard } from "./SurfaceCard";

export type FilterBarProps = {
  children: ReactNode;
  actions?: ReactNode;
  className?: string;
};

export function FilterBar({ actions, children, className }: FilterBarProps): JSX.Element {
  return (
    <SurfaceCard
      depth="flat"
      padding="sm"
      className={cn(
        "flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between",
        className,
      )}
    >
      <div className="grid min-w-0 flex-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">{children}</div>
      {actions !== undefined && <div className="flex shrink-0 flex-wrap gap-2">{actions}</div>}
    </SurfaceCard>
  );
}
