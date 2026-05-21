import type { ReactNode } from "react";

import { Button } from "../../components/ui/button";
import { Card, CardContent, CardHeader } from "../../components/ui/card";

type AdminSettingsSectionProps = {
  title: string;
  description?: string;
  children: ReactNode;
  saveLabel?: string;
};

export function AdminSettingsSection({
  children,
  description,
  saveLabel = "Save changes",
  title,
}: AdminSettingsSectionProps): JSX.Element {
  return (
    <Card>
      <CardHeader className="flex flex-col gap-3 border-b border-border p-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 className="text-base font-semibold text-vc-navy">{title}</h2>
          {description !== undefined && (
            <p className="mt-1 text-sm leading-6 text-muted-foreground">{description}</p>
          )}
        </div>
        <Button type="button" variant="secondary" className="shrink-0">
          {saveLabel}
        </Button>
      </CardHeader>
      <CardContent className="p-4">{children}</CardContent>
    </Card>
  );
}
