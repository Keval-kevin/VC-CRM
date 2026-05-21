import type { ReactNode } from "react";

import { PageTemplateBase, type PageBreadcrumb, type PageTemplateState } from "./PageTemplateBase";

export type ListPageTemplateProps = {
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

export function ListPageTemplate(props: ListPageTemplateProps): JSX.Element {
  return (
    <PageTemplateBase {...props} maxWidthClassName="max-w-[1480px]" contentClassName="space-y-5" />
  );
}
