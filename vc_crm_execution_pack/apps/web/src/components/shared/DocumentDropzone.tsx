import { UploadCloud } from "lucide-react";
import type { ChangeEvent } from "react";

import { cn } from "../../lib/utils";
import { Button } from "../ui/button";

export type DocumentDropzoneProps = {
  label: string;
  description?: string;
  accept?: string;
  multiple?: boolean;
  onFilesSelected: (files: File[]) => void;
  className?: string;
};

export function DocumentDropzone({
  accept,
  className,
  description,
  label,
  multiple = false,
  onFilesSelected,
}: DocumentDropzoneProps): JSX.Element {
  function handleChange(event: ChangeEvent<HTMLInputElement>): void {
    onFilesSelected(Array.from(event.currentTarget.files ?? []));
  }

  return (
    <label
      className={cn(
        "flex cursor-pointer flex-col items-center justify-center rounded-card border border-dashed border-border bg-card p-6 text-center transition-colors hover:border-vc-blue hover:bg-accent/40",
        className,
      )}
    >
      <span className="grid h-11 w-11 place-items-center rounded-full bg-accent text-vc-blue">
        <UploadCloud className="h-5 w-5" />
      </span>
      <span className="mt-3 text-sm font-semibold text-vc-navy">{label}</span>
      {description !== undefined && (
        <span className="mt-1 max-w-md text-sm leading-6 text-muted-foreground">{description}</span>
      )}
      <Button type="button" variant="secondary" className="pointer-events-none mt-4">
        Select files
      </Button>
      <input
        type="file"
        className="sr-only"
        accept={accept}
        multiple={multiple}
        onChange={handleChange}
      />
    </label>
  );
}
