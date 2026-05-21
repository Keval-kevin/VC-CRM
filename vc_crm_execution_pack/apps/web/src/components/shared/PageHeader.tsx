import type { ReactNode } from "react";

import { cn } from "../../lib/utils";

export type PageHeaderProps = {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  description?: string;
  action?: ReactNode;
  breadcrumbs?: ReactNode;
  className?: string;
};

export function PageHeader({
  action,
  breadcrumbs,
  className,
  description,
  eyebrow,
  subtitle,
  title,
}: PageHeaderProps): JSX.Element {
  const supportingText = description ?? subtitle;

  return (
    <div
      className={cn(
        "mb-4 flex flex-col gap-3 border-b border-border pb-4 sm:flex-row sm:items-end sm:justify-between",
        className,
      )}
    >
      <div className="min-w-0">
        {breadcrumbs !== undefined && <div className="mb-2">{breadcrumbs}</div>}
        {eyebrow !== undefined && (
          <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-vc-blue">
            {eyebrow}
          </p>
        )}
        <h1 className="text-2xl font-bold leading-tight text-vc-navy sm:text-3xl">{title}</h1>
        {supportingText !== undefined && supportingText.length > 0 && (
          <p className="mt-1 max-w-3xl text-sm leading-6 text-muted-foreground">{supportingText}</p>
        )}
      </div>
      {action !== undefined && <div className="shrink-0">{action}</div>}
    </div>
  );
}
