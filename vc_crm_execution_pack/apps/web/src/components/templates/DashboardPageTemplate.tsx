import type { ReactNode } from "react";

import { PageTemplateBase, type PageBreadcrumb, type PageTemplateState } from "./PageTemplateBase";

export type DashboardPageTemplateProps = {
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
};

export function DashboardPageTemplate(props: DashboardPageTemplateProps): JSX.Element {
  return (
    <PageTemplateBase {...props} maxWidthClassName="max-w-[1440px]" contentClassName="space-y-6" />
  );
}
