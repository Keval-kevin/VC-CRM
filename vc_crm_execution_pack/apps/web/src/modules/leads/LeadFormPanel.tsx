import { SlideoverPanel } from "../../components/shared/SlideoverPanel";

export type LeadFormPanelProps = {
  isOpen: boolean;
  mode: "create" | "edit";
  onClose: () => void;
};

export function LeadFormPanel({ isOpen, mode, onClose }: LeadFormPanelProps): JSX.Element {
  return (
    <SlideoverPanel
      isOpen={isOpen}
      title={mode === "create" ? "Create lead" : "Edit lead"}
      description="Lead create/edit slideover pattern. Backend support includes lifecycle status, scoring placeholder, duplicate checks, follow-up dates, and import-ready fields."
      onClose={onClose}
    />
  );
}
