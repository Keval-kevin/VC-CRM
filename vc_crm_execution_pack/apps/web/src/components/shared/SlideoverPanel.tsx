import { X } from "lucide-react";
import { useRef } from "react";

import { useOverlayFocus } from "../../lib/overlayFocus";
import { cn } from "../../lib/utils";
import { Button } from "../ui/button";
import { Input } from "../ui/input";

export type SlideoverPanelProps = {
  isOpen: boolean;
  title: string;
  description: string;
  onClose: () => void;
};

export function SlideoverPanel({
  description,
  isOpen,
  onClose,
  title,
}: SlideoverPanelProps): JSX.Element {
  const panelRef = useRef<HTMLElement>(null);

  useOverlayFocus({ containerRef: panelRef, isOpen, onClose });

  return (
    <div
      className={cn(
        "fixed inset-0 z-50 transition",
        isOpen ? "pointer-events-auto" : "pointer-events-none",
      )}
      aria-hidden={!isOpen}
    >
      <div
        className={cn(
          "absolute inset-0 bg-vc-navy/40 transition-opacity",
          isOpen ? "opacity-100" : "opacity-0",
        )}
        onClick={onClose}
      />
      <aside
        ref={panelRef}
        role="complementary"
        tabIndex={-1}
        className={cn(
          "absolute right-0 top-0 flex h-full w-full max-w-full flex-col bg-card shadow-modal transition-transform sm:max-w-xl sm:rounded-l-card",
          isOpen ? "translate-x-0" : "translate-x-full",
        )}
        aria-label={title}
      >
        <div className="flex items-start justify-between gap-3 border-b border-border p-4">
          <div>
            <h2 className="text-lg font-semibold text-vc-navy">{title}</h2>
            <p className="mt-1 text-sm leading-6 text-muted-foreground">{description}</p>
          </div>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            aria-label="Close panel"
            onClick={onClose}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
        <div className="flex-1 space-y-4 overflow-y-auto p-4 sm:p-5">
          <section className="rounded-card border border-border bg-card p-4 shadow-flat">
            <h3 className="text-sm font-semibold text-foreground">Record basics</h3>
            <div className="mt-3 grid gap-3">
              <Input placeholder="Record name" />
              <Input placeholder="Owner" />
              <Input placeholder="Priority" />
            </div>
          </section>
          <section className="rounded-card border border-border bg-card p-4 shadow-flat">
            <h3 className="text-sm font-semibold text-foreground">Workflow context</h3>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              This panel establishes the create/edit pattern. Module-specific validated forms will
              replace these fields in later phases.
            </p>
          </section>
        </div>
        <div className="flex items-center justify-end gap-2 border-t border-border p-4">
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button type="button">Save draft</Button>
        </div>
      </aside>
    </div>
  );
}
