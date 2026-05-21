import { ReactNode } from "react";
import { PageHeader } from "./PageHeader";

type ListPageTemplateProps = {
  title: string;
  description?: string;
  actions?: ReactNode;
  metrics?: ReactNode;
  toolbar?: ReactNode;
  children: ReactNode;
};

export function ListPageTemplate({
  title,
  description,
  actions,
  metrics,
  toolbar,
  children
}: ListPageTemplateProps) {
  return (
    <div>
      <PageHeader title={title} description={description} actions={actions} />

      {metrics ? (
        <div className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {metrics}
        </div>
      ) : null}

      {toolbar ? (
        <div className="mb-4 rounded-[18px] border border-slate-200 bg-white p-4 shadow-sm">
          {toolbar}
        </div>
      ) : null}

      {children}
    </div>
  );
}
