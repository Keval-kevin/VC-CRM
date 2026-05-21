import { Search } from "lucide-react";
import { forwardRef } from "react";
import type { InputHTMLAttributes } from "react";

import { cn } from "../../lib/utils";
import { Input } from "../ui/input";

export type SearchInputProps = InputHTMLAttributes<HTMLInputElement>;

export const SearchInput = forwardRef<HTMLInputElement, SearchInputProps>(function SearchInput(
  { className, placeholder = "Search", ...props },
  ref,
): JSX.Element {
  return (
    <label className="relative block w-full">
      <span className="sr-only">{placeholder}</span>
      <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
      <Input ref={ref} className={cn("pl-9", className)} placeholder={placeholder} {...props} />
    </label>
  );
});
