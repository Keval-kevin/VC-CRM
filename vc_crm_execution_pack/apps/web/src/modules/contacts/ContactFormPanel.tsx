import { SlideoverPanel } from "../../components/shared/SlideoverPanel";

export type ContactFormPanelProps = {
  isOpen: boolean;
  mode: "create" | "edit";
  onClose: () => void;
};

export function ContactFormPanel({ isOpen, mode, onClose }: ContactFormPanelProps): JSX.Element {
  return (
    <SlideoverPanel
      isOpen={isOpen}
      title={mode === "create" ? "Create contact" : "Edit contact"}
      description="Contact create/edit slideover pattern. Backend support includes duplicate detection, account relation checks, and audit logs."
      onClose={onClose}
    />
  );
}
