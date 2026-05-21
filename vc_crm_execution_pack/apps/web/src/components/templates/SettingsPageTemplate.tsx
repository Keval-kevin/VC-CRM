import type { ReactNode } from "react";

import { PageTemplateBase, type PageBreadcrumb, type PageTemplateState } from "./PageTemplateBase";

export type SettingsPageTemplateProps = {
  title: string;
  description?: string;
  eyebrow?: string;
  breadcrumbs?: PageBreadcrumb[];
  primaryAction?: ReactNode;
  kpiSection?: ReactNode;
  toolbar?: ReactNode;
  sideNavigation?: ReactNode;
  children: ReactNode;
  loadingState?: ReactNode;
  errorState?: ReactNode;
  emptyState?: ReactNode;
  state?: PageTemplateState;
};

export function SettingsPageTemplate({
  children,
  sideNavigation,
  ...props
}: SettingsPageTemplateProps): JSX.Element {
  return (
    <PageTemplateBase
      {...props}
      maxWidthClassName="max-w-[1180px]"
      contentClassName="grid gap-5 lg:grid-cols-[260px_minmax(0,1fr)]"
    >
      {sideNavigation !== undefined && <aside className="min-w-0">{sideNavigation}</aside>}
      <div className="min-w-0">{children}</div>
    </PageTemplateBase>
  );
}
