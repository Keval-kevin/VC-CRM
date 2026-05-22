import { X } from "lucide-react";
import { useRef, type ReactNode } from "react";

import { cn } from "../../lib/utils";
import { useOverlayFocus } from "../../lib/overlayFocus";
import { Button } from "../ui/button";

export type FormSlideoverProps = {
  isOpen: boolean;
  title: string;
  description?: string;
  children: ReactNode;
  footer?: ReactNode;
  onClose: () => void;
  className?: string;
};

export function FormSlideover({
  children,
  className,
  description,
  footer,
  isOpen,
  onClose,
  title,
}: FormSlideoverProps): JSX.Element {
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
        role="dialog"
        aria-modal="true"
        aria-label={title}
        tabIndex={-1}
        className={cn(
          "absolute right-0 top-0 flex h-full w-full max-w-full flex-col bg-card shadow-modal transition-transform sm:max-w-xl sm:rounded-l-card",
          isOpen ? "translate-x-0" : "translate-x-full",
          className,
        )}
      >
        <div className="flex items-start justify-between gap-4 border-b border-border p-4 sm:p-5">
          <div className="min-w-0">
            <h2 className="text-lg font-semibold text-vc-navy">{title}</h2>
            {description !== undefined && (
              <p className="mt-1 text-sm leading-6 text-muted-foreground">{description}</p>
            )}
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
        <div className="flex-1 overflow-y-auto p-4 sm:p-5">{children}</div>
        {footer !== undefined && (
          <div className="sticky bottom-0 border-t border-border bg-card p-4">{footer}</div>
        )}
      </aside>
    </div>
  );
}
