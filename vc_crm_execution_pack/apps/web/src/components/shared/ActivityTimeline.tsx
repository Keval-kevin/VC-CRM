import type { LucideIcon } from "lucide-react";
import { Clock } from "lucide-react";

import { SurfaceCard } from "./SurfaceCard";

export type ActivityTimelineItem = {
  id: string;
  title: string;
  description?: string;
  timestamp?: string;
  icon?: LucideIcon;
};

export type ActivityTimelineProps = {
  items: ActivityTimelineItem[];
  title?: string;
  className?: string;
};

export function ActivityTimeline({
  className,
  items,
  title = "Activity timeline",
}: ActivityTimelineProps): JSX.Element {
  return (
    <SurfaceCard padding="none" className={className}>
      <div className="border-b border-border p-4">
        <div className="flex items-center gap-2">
          <Clock className="h-4 w-4 text-vc-blue" />
          <h2 className="text-base font-semibold text-vc-navy">{title}</h2>
        </div>
      </div>
      <div className="space-y-4 p-4">
        {items.map((item, index) => {
          const Icon = item.icon ?? Clock;

          return (
            <div key={item.id} className="relative flex gap-3">
              {index < items.length - 1 && (
                <span className="absolute left-4 top-9 h-[calc(100%-1.5rem)] w-px bg-border" />
              )}
              <div className="z-10 grid h-8 w-8 shrink-0 place-items-center rounded-full bg-accent text-vc-blue">
                <Icon className="h-4 w-4" />
              </div>
              <div className="min-w-0 pb-2">
                <p className="text-sm font-semibold text-vc-navy">{item.title}</p>
                {item.description !== undefined && (
                  <p className="mt-1 text-sm leading-6 text-muted-foreground">{item.description}</p>
                )}
                {item.timestamp !== undefined && (
                  <p className="mt-1 text-xs text-muted-foreground">{item.timestamp}</p>
                )}
              </div>
            </div>
          );
        })}
        {items.length === 0 && (
          <p className="rounded-card border border-dashed border-border p-4 text-sm text-muted-foreground">
            No activity yet.
          </p>
        )}
      </div>
    </SurfaceCard>
  );
}
