import type { ReactNode } from "react";

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
    <Badge className={className} variant={tone}>
      {children}
    </Badge>
  );
}
