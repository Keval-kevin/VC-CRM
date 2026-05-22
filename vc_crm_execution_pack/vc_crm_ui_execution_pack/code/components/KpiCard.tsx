import type { ReactElement } from "react";
import { ArrowDownRight, ArrowUpRight } from "lucide-react";
import { SurfaceCard } from "./SurfaceCard";

type KpiCardProps = {
  label: string;
  value: string;
  helper?: string;
  trend?: {
    value: string;
    direction: "up" | "down";
  };
};

export function KpiCard({ label, value, helper, trend }: KpiCardProps): ReactElement {
  const TrendIcon = trend?.direction === "down" ? ArrowDownRight : ArrowUpRight;

  return (
    <SurfaceCard elevated className="p-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-slate-500">{label}</p>
          <p className="mt-2 text-2xl font-semibold tracking-tight text-slate-950">
            {value}
          </p>
        </div>
        {trend ? (
          <div className="flex items-center gap-1 rounded-full bg-slate-100 px-2 py-1 text-xs font-semibold text-slate-700">
            <TrendIcon className="h-3.5 w-3.5" />
            {trend.value}
          </div>
        ) : null}
      </div>
      {helper ? <p className="mt-3 text-xs text-slate-500">{helper}</p> : null}
    </SurfaceCard>
  );
}
