import { SlideoverPanel } from "../../components/shared/SlideoverPanel";

export function OpportunityFormPanel(props: {
  isOpen: boolean;
  mode: "create" | "edit";
  onClose: () => void;
}): JSX.Element {
  return (
    <SlideoverPanel
      isOpen={props.isOpen}
      title={props.mode === "create" ? "New opportunity" : "Edit opportunity"}
      description="Pipeline fields are ready for API wiring, validation, and stage movement."
      onClose={props.onClose}
    />
  );
}
