import type { HTMLAttributes } from "react";

import { cn } from "../../lib/utils";

export type SurfaceCardProps = HTMLAttributes<HTMLDivElement> & {
  depth?: "flat" | "card" | "floating";
  padding?: "none" | "sm" | "md" | "lg";
};

export function SurfaceCard({
  className,
  depth = "card",
  padding = "md",
  ...props
}: SurfaceCardProps): JSX.Element {
  return (
    <div
      className={cn(
        "rounded-card border border-border bg-card",
        depth === "flat" && "shadow-flat",
        depth === "card" && "shadow-card",
        depth === "floating" && "shadow-floating",
        padding === "sm" && "p-4",
        padding === "md" && "p-5",
        padding === "lg" && "p-6",
        className,
      )}
      {...props}
    />
  );
}
