import { ReactNode } from "react";
import { X } from "lucide-react";

type FormSlideoverProps = {
  open: boolean;
  title: string;
  description?: string;
  children: ReactNode;
  footer?: ReactNode;
  onClose: () => void;
};

export function FormSlideover({
  open,
  title,
  description,
  children,
  footer,
  onClose
}: FormSlideoverProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/30">
      <div className="absolute right-0 top-0 flex h-full w-full max-w-xl flex-col rounded-l-[24px] bg-white shadow-[0_20px_50px_rgba(15,23,42,0.14)]">
        <div className="flex items-start justify-between border-b border-slate-200 px-6 py-5">
          <div>
            <h2 className="text-lg font-semibold text-slate-950">{title}</h2>
            {description ? (
              <p className="mt-1 text-sm text-slate-500">{description}</p>
            ) : null}
          </div>
          <button
            type="button"
            aria-label="Close"
            onClick={onClose}
            className="rounded-xl p-2 text-slate-500 hover:bg-slate-100"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-5">{children}</div>

        {footer ? (
          <div className="border-t border-slate-200 bg-white px-6 py-4">
            {footer}
          </div>
        ) : null}
      </div>
    </div>
  );
}
