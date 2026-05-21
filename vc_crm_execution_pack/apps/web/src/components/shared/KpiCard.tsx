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
            "grid h-10 w-10 shrink-0 place-items-center rounded-control bg-accent text-vc-blue",
            tone === "success" && "bg-emerald-50 text-vc-success",
            tone === "warning" && "bg-amber-50 text-vc-warning",
            tone === "danger" && "bg-red-50 text-vc-danger",
            tone === "info" && "bg-sky-50 text-vc-info",
          )}
        >
          <Icon className="h-5 w-5" />
        </div>
      )}
    </SurfaceCard>
  );
}
