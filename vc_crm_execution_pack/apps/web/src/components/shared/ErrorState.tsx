import { AlertTriangle } from "lucide-react";

import { cn } from "../../lib/utils";
import { Button } from "../ui/button";

export type ErrorStateProps = {
  title: string;
  description: string;
  actionLabel?: string;
  onRetry?: () => void;
  className?: string;
};

export function ErrorState({
  actionLabel = "Retry",
  className,
  description,
  onRetry,
  title,
}: ErrorStateProps): JSX.Element {
  return (
    <div className={cn("rounded-card border border-red-200 bg-red-50 p-5", className)}>
      <div className="flex gap-3">
        <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-vc-danger" />
        <div>
          <h2 className="text-base font-semibold text-vc-danger">{title}</h2>
          <p className="mt-1 text-sm leading-6 text-red-900">{description}</p>
          <Button type="button" variant="secondary" className="mt-3" onClick={onRetry}>
            {actionLabel}
          </Button>
        </div>
      </div>
    </div>
  );
}
