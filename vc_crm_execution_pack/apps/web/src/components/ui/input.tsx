import { forwardRef, type InputHTMLAttributes } from "react";

import { cn } from "../../lib/utils";

export type InputProps = InputHTMLAttributes<HTMLInputElement>;

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { className, type = "text", ...props },
  ref,
): JSX.Element {
  return (
    <input
      ref={ref}
      type={type}
      className={cn(
        "h-9 w-full rounded-control border border-input bg-card px-3 text-sm text-foreground shadow-flat transition-colors placeholder:text-muted-foreground focus:border-vc-blue",
        className,
      )}
      {...props}
    />
  );
});
