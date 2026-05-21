import { cva, type VariantProps } from "class-variance-authority";
import type { HTMLAttributes } from "react";

import { cn } from "../../lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ring-inset",
  {
    variants: {
      variant: {
        default: "bg-accent text-vc-navy ring-vc-blue/10",
        success: "bg-card text-vc-success ring-vc-success/20",
        warning: "bg-card text-vc-warning ring-vc-warning/25",
        danger: "bg-card text-vc-danger ring-vc-danger/20",
        info: "bg-card text-vc-info ring-vc-info/20",
        muted: "bg-muted text-muted-foreground ring-border",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

export type BadgeProps = HTMLAttributes<HTMLSpanElement> & VariantProps<typeof badgeVariants>;

export function Badge({ className, variant, ...props }: BadgeProps): JSX.Element {
  return <span className={cn(badgeVariants({ variant }), className)} {...props} />;
}
