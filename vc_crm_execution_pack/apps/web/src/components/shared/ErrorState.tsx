import { AlertTriangle } from "lucide-react";

import { Button } from "../ui/button";

export type ErrorStateProps = {
  title: string;
  description: string;
};

export function ErrorState({ description, title }: ErrorStateProps): JSX.Element {
  return (
    <div className="rounded-lg border border-red-200 bg-red-50 p-5">
      <div className="flex gap-3">
        <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-vc-danger" />
        <div>
          <h2 className="text-base font-semibold text-vc-danger">{title}</h2>
          <p className="mt-1 text-sm leading-6 text-red-900">{description}</p>
          <Button type="button" variant="secondary" className="mt-3">
            Retry
          </Button>
        </div>
      </div>
    </div>
  );
}
