import { CalendarDays } from "lucide-react";

import { cn } from "../../lib/utils";
import { Input } from "../ui/input";

export type DateRangeValue = {
  from: string;
  to: string;
};

export type DateRangeFilterProps = {
  value: DateRangeValue;
  onChange: (value: DateRangeValue) => void;
  className?: string;
  fromLabel?: string;
  toLabel?: string;
};

export function DateRangeFilter({
  className,
  fromLabel = "From date",
  onChange,
  toLabel = "To date",
  value,
}: DateRangeFilterProps): JSX.Element {
  return (
    <div className={cn("grid gap-2 sm:grid-cols-2", className)}>
      <label className="relative">
        <span className="sr-only">{fromLabel}</span>
        <CalendarDays className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          type="date"
          className="pl-9"
          aria-label={fromLabel}
          value={value.from}
          onChange={(event) => onChange({ ...value, from: event.currentTarget.value })}
        />
      </label>
      <label className="relative">
        <span className="sr-only">{toLabel}</span>
        <CalendarDays className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          type="date"
          className="pl-9"
          aria-label={toLabel}
          value={value.to}
          onChange={(event) => onChange({ ...value, to: event.currentTarget.value })}
        />
      </label>
    </div>
  );
}
