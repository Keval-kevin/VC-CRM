import { SlideoverPanel } from "../../components/shared/SlideoverPanel";

export type AccountFormPanelProps = {
  isOpen: boolean;
  mode: "create" | "edit";
  onClose: () => void;
};

export function AccountFormPanel({ isOpen, mode, onClose }: AccountFormPanelProps): JSX.Element {
  return (
    <SlideoverPanel
      isOpen={isOpen}
      title={mode === "create" ? "Create account" : "Edit account"}
      description="Account create/edit slideover pattern. The API supports tenant-scoped CRUD, duplicate checks, audit logs, and soft deletes."
      onClose={onClose}
    />
  );
}
