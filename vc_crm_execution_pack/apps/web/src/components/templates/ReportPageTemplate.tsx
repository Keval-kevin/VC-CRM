import type { ReactNode } from "react";

import { PageTemplateBase, type PageBreadcrumb, type PageTemplateState } from "./PageTemplateBase";

export type ReportPageTemplateProps = {
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

export function ReportPageTemplate(props: ReportPageTemplateProps): JSX.Element {
  return (
    <PageTemplateBase {...props} maxWidthClassName="max-w-[1320px]" contentClassName="space-y-5" />
  );
}
