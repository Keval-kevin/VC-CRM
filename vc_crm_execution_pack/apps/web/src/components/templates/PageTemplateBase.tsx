import type { ReactNode } from "react";

import { PageHeader } from "../shared/PageHeader";
import { cn } from "../../lib/utils";

export type PageTemplateState = "ready" | "loading" | "error" | "empty";

export type PageBreadcrumb = {
  label: string;
};

export type PageTemplateBaseProps = {
  title: string;
  description?: string;
  eyebrow?: string;
  breadcrumbs?: PageBreadcrumb[];
  primaryAction?: ReactNode;
  kpiSection?: ReactNode;
  toolbar?: ReactNode;
  children: ReactNode;
  loadingState?: ReactNode;
  errorState?: ReactNode;
  emptyState?: ReactNode;
  state?: PageTemplateState;
  className?: string;
  contentClassName?: string;
  maxWidthClassName: string;
};

export function PageTemplateBase({
  breadcrumbs,
  children,
  className,
  contentClassName,
  description,
  emptyState,
  errorState,
  eyebrow,
  kpiSection,
  loadingState,
  maxWidthClassName,
  primaryAction,
  state = "ready",
  title,
  toolbar,
}: PageTemplateBaseProps): JSX.Element {
  return (
    <div className={cn("mx-auto w-full space-y-5", maxWidthClassName, className)}>
      {breadcrumbs !== undefined && breadcrumbs.length > 0 && (
        <BreadcrumbTrail breadcrumbs={breadcrumbs} />
      )}
      <PageHeader
        eyebrow={eyebrow}
        title={title}
        subtitle={description ?? ""}
        action={primaryAction}
      />
      {kpiSection !== undefined && <section className="w-full">{kpiSection}</section>}
      {toolbar !== undefined && <section className="w-full">{toolbar}</section>}
      <section className={cn("min-w-0", contentClassName)}>{renderStateContent()}</section>
    </div>
  );

  function renderStateContent(): ReactNode {
    if (state === "loading" && loadingState !== undefined) {
      return loadingState;
    }

    if (state === "error" && errorState !== undefined) {
      return errorState;
    }

    if (state === "empty" && emptyState !== undefined) {
      return emptyState;
    }

    return children;
  }
}

function BreadcrumbTrail({ breadcrumbs }: { breadcrumbs: PageBreadcrumb[] }): JSX.Element {
  return (
    <nav className="text-sm text-muted-foreground" aria-label="Page breadcrumb">
      <ol className="flex min-w-0 flex-wrap items-center gap-1">
        {breadcrumbs.map((breadcrumb, index) => {
          const isLast = index === breadcrumbs.length - 1;

          return (
            <li key={`${breadcrumb.label}-${index}`} className="flex min-w-0 items-center gap-1">
              {index > 0 && <span aria-hidden="true">/</span>}
              <span className={cn("truncate", isLast && "font-semibold text-vc-navy")}>
                {breadcrumb.label}
              </span>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
