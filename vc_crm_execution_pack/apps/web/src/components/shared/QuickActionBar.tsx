import type { ReactNode } from "react";

import { cn } from "../../lib/utils";
import { SurfaceCard } from "./SurfaceCard";

export type QuickActionBarProps = {
  children: ReactNode;
  align?: "start" | "between" | "end";
  className?: string;
};

export function QuickActionBar({
  align = "between",
  children,
  className,
}: QuickActionBarProps): JSX.Element {
  return (
    <SurfaceCard
      depth="flat"
      padding="sm"
      className={cn(
        "flex flex-col gap-3 sm:flex-row sm:items-center",
        align === "start" && "sm:justify-start",
        align === "between" && "sm:justify-between",
        align === "end" && "sm:justify-end",
        className,
      )}
    >
      {children}
    </SurfaceCard>
  );
}
