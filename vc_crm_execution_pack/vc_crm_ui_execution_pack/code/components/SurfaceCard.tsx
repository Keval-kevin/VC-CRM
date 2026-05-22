import { ReactElement, ReactNode } from "react";
import { cn } from "@/lib/utils";

type SurfaceCardProps = {
  children: ReactNode;
  className?: string;
  elevated?: boolean;
};

export function SurfaceCard({ children, className, elevated = false }: SurfaceCardProps): ReactElement {
  return (
    <section
      className={cn(
        "rounded-[18px] border border-slate-200 bg-white",
        elevated ? "shadow-[0_10px_30px_rgba(15,23,42,0.06)]" : "shadow-sm",
        className
      )}
    >
      {children}
    </section>
  );
}
