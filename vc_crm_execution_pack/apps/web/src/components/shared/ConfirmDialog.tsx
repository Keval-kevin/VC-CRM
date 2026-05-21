import { AlertTriangle } from "lucide-react";

import { cn } from "../../lib/utils";
import { Button } from "../ui/button";

export type ConfirmDialogProps = {
  isOpen: boolean;
  title: string;
  description: string;
  confirmLabel?: string;
  cancelLabel?: string;
  tone?: "default" | "destructive";
  onConfirm: () => void;
  onCancel: () => void;
  className?: string;
};

export function ConfirmDialog({
  cancelLabel = "Cancel",
  className,
  confirmLabel = "Confirm",
  description,
  isOpen,
  onCancel,
  onConfirm,
  title,
  tone = "default",
}: ConfirmDialogProps): JSX.Element | null {
  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-vc-navy/40 p-4">
      <section
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className={cn(
          "w-full max-w-md rounded-card border border-border bg-card p-5 shadow-modal",
          className,
        )}
      >
        <div className="flex gap-3">
          <div
            className={cn(
              "grid h-10 w-10 shrink-0 place-items-center rounded-full bg-accent text-vc-blue ring-1 ring-inset ring-vc-blue/10",
              tone === "destructive" && "bg-card text-vc-danger ring-vc-danger/20",
            )}
          >
            <AlertTriangle className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-vc-navy">{title}</h2>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">{description}</p>
          </div>
        </div>
        <div className="mt-5 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <Button type="button" variant="secondary" onClick={onCancel}>
            {cancelLabel}
          </Button>
          <Button
            type="button"
            variant={tone === "destructive" ? "destructive" : "default"}
            onClick={onConfirm}
          >
            {confirmLabel}
          </Button>
        </div>
      </section>
    </div>
  );
}
