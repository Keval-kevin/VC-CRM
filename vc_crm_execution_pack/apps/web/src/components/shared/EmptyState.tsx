import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

import { cn } from "../../lib/utils";
import { Button } from "../ui/button";

export type EmptyStateProps = {
  icon: LucideIcon;
  title: string;
  description: string;
  actionLabel?: string;
  action?: ReactNode;
  onAction?: () => void;
  className?: string;
};

export function EmptyState({
  action,
  actionLabel,
  className,
  description,
  icon: Icon,
  onAction,
  title,
}: EmptyStateProps): JSX.Element {
  return (
    <div
      className={cn(
        "rounded-card border border-dashed border-border bg-card p-6 text-center shadow-flat",
        className,
      )}
    >
      <div className="mx-auto grid h-11 w-11 place-items-center rounded-full bg-accent text-vc-blue">
        <Icon className="h-5 w-5" />
      </div>
      <h2 className="mt-3 text-base font-semibold text-vc-navy">{title}</h2>
      <p className="mx-auto mt-1 max-w-lg text-sm leading-6 text-muted-foreground">{description}</p>
      {action !== undefined && <div className="mt-4">{action}</div>}
      {action === undefined && actionLabel !== undefined && (
        <Button type="button" className="mt-4" onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </div>
  );
}
