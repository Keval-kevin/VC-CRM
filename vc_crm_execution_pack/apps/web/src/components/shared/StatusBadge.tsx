import type { ReactNode } from "react";

import { cn } from "../../lib/utils";
import { Badge } from "../ui/badge";

export type StatusTone = "default" | "success" | "warning" | "danger" | "info" | "muted";

export type StatusBadgeProps = {
  children: ReactNode;
  tone?: StatusTone;
  className?: string;
};

export function StatusBadge({
  children,
  className,
  tone = "default",
}: StatusBadgeProps): JSX.Element {
  return (
    <Badge
      className={cn(tone === "info" && "bg-sky-50 text-vc-info", className)}
      variant={tone === "info" ? "default" : tone}
    >
      {children}
    </Badge>
  );
}
