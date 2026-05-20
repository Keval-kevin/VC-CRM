import type { ReactNode } from "react";

export type PageHeaderProps = {
  eyebrow?: string;
  title: string;
  subtitle: string;
  action?: ReactNode;
};

export function PageHeader({ action, eyebrow, subtitle, title }: PageHeaderProps): JSX.Element {
  return (
    <div className="mb-4 flex flex-col gap-3 border-b border-border pb-4 sm:flex-row sm:items-end sm:justify-between">
      <div className="min-w-0">
        {eyebrow !== undefined && (
          <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-vc-blue">
            {eyebrow}
          </p>
        )}
        <h1 className="text-2xl font-bold leading-tight text-vc-navy sm:text-3xl">{title}</h1>
        <p className="mt-1 max-w-3xl text-sm leading-6 text-muted-foreground">{subtitle}</p>
      </div>
      {action !== undefined && <div className="shrink-0">{action}</div>}
    </div>
  );
}
