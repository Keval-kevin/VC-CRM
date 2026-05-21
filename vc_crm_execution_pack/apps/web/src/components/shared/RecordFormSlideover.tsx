import type { FormEvent } from "react";

import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { FormSlideover } from "./FormSlideover";

export type RecordFormField = {
  id: string;
  label: string;
  placeholder: string;
  required?: boolean;
  type?: "date" | "email" | "number" | "text";
  helperText?: string;
};

export type RecordFormSection = {
  title: string;
  description?: string;
  fields: RecordFormField[];
};

export type RecordFormSlideoverProps = {
  isOpen: boolean;
  title: string;
  description: string;
  sections: RecordFormSection[];
  advancedSections?: RecordFormSection[];
  saveLabel: string;
  onClose: () => void;
  onSubmit?: (event: FormEvent<HTMLFormElement>) => void;
};

export function RecordFormSlideover({
  advancedSections = [],
  description,
  isOpen,
  onClose,
  onSubmit,
  saveLabel,
  sections,
  title,
}: RecordFormSlideoverProps): JSX.Element {
  function handleSubmit(event: FormEvent<HTMLFormElement>): void {
    event.preventDefault();
    onSubmit?.(event);
  }

  return (
    <FormSlideover
      isOpen={isOpen}
      title={title}
      description={description}
      onClose={onClose}
      className="sm:max-w-2xl"
      footer={
        <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" form="record-slideover-form">
            {saveLabel}
          </Button>
        </div>
      }
    >
      <form id="record-slideover-form" className="space-y-5" onSubmit={handleSubmit}>
        {sections.map((section) => (
          <FormSection key={section.title} section={section} />
        ))}
        {advancedSections.length > 0 && (
          <details className="rounded-card border border-border bg-vc-bg p-4">
            <summary className="cursor-pointer text-sm font-semibold text-vc-navy">
              Advanced fields
            </summary>
            <div className="mt-4 space-y-5">
              {advancedSections.map((section) => (
                <FormSection key={section.title} section={section} />
              ))}
            </div>
          </details>
        )}
      </form>
    </FormSlideover>
  );
}

function FormSection({ section }: { section: RecordFormSection }): JSX.Element {
  return (
    <section className="rounded-card border border-border bg-card p-4 shadow-flat">
      <div>
        <h3 className="text-sm font-semibold text-vc-navy">{section.title}</h3>
        {section.description !== undefined && (
          <p className="mt-1 text-sm leading-6 text-muted-foreground">{section.description}</p>
        )}
      </div>
      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        {section.fields.map((field) => (
          <label key={field.id} className="grid gap-1.5 text-sm font-medium text-foreground">
            <span>
              {field.label}
              {field.required === true && <span className="text-danger"> *</span>}
            </span>
            <Input
              name={field.id}
              placeholder={field.placeholder}
              required={field.required}
              type={field.type ?? "text"}
              aria-describedby={field.helperText !== undefined ? `${field.id}-helper` : undefined}
            />
            {field.helperText !== undefined && (
              <span id={`${field.id}-helper`} className="text-xs text-muted-foreground">
                {field.helperText}
              </span>
            )}
          </label>
        ))}
      </div>
    </section>
  );
}
