import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

import { cn } from "../../lib/utils";
import { SurfaceCard } from "./SurfaceCard";

export type KpiCardProps = {
  label: string;
  value: ReactNode;
  trend?: ReactNode;
  icon?: LucideIcon;
  tone?: "default" | "success" | "warning" | "danger" | "info";
  className?: string;
};

export function KpiCard({
  className,
  icon: Icon,
  label,
  tone = "default",
  trend,
  value,
}: KpiCardProps): JSX.Element {
  return (
    <SurfaceCard className={cn("flex items-start justify-between gap-4", className)}>
      <div className="min-w-0">
        <p className="text-sm text-muted-foreground">{label}</p>
        <div className="mt-2 text-2xl font-bold leading-tight text-vc-navy">{value}</div>
        {trend !== undefined && <div className="mt-3 text-sm text-muted-foreground">{trend}</div>}
      </div>
      {Icon !== undefined && (
        <div
          className={cn(
            "grid h-10 w-10 shrink-0 place-items-center rounded-control bg-accent text-vc-blue ring-1 ring-inset ring-vc-blue/10",
            tone === "success" && "bg-card text-vc-success ring-vc-success/20",
            tone === "warning" && "bg-card text-vc-warning ring-vc-warning/25",
            tone === "danger" && "bg-card text-vc-danger ring-vc-danger/20",
            tone === "info" && "bg-card text-vc-info ring-vc-info/20",
          )}
        >
          <Icon className="h-5 w-5" />
        </div>
      )}
    </SurfaceCard>
  );
}
