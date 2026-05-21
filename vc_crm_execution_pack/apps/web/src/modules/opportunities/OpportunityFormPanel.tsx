import { RecordFormSlideover, type RecordFormSection } from "../../components/shared";

export function OpportunityFormPanel(props: {
  isOpen: boolean;
  mode: "create" | "edit";
  onClose: () => void;
}): JSX.Element {
  return (
    <RecordFormSlideover
      isOpen={props.isOpen}
      title={props.mode === "create" ? "New opportunity" : "Edit opportunity"}
      description="Capture the required deal, account, stage, value, and owner fields first."
      onClose={props.onClose}
      saveLabel={props.mode === "create" ? "Save opportunity" : "Update opportunity"}
      sections={opportunitySections}
      advancedSections={opportunityAdvancedSections}
    />
  );
}

const opportunitySections: RecordFormSection[] = [
  {
    title: "Required opportunity details",
    fields: [
      { id: "name", label: "Deal name", placeholder: "Acme Cloud - React squad", required: true },
      { id: "account", label: "Account", placeholder: "Acme Cloud Systems", required: true },
      { id: "stage", label: "Stage", placeholder: "Discovery", required: true },
      { id: "owner", label: "Owner", placeholder: "Priya Shah", required: true },
    ],
  },
  {
    title: "Forecast",
    fields: [
      { id: "value", label: "Deal value", placeholder: "2500000", required: true, type: "number" },
      { id: "probability", label: "Probability", placeholder: "50", type: "number" },
      { id: "expectedClose", label: "Expected close", placeholder: "2026-06-30", type: "date" },
    ],
  },
];

const opportunityAdvancedSections: RecordFormSection[] = [
  {
    title: "Advanced pipeline context",
    fields: [
      { id: "currency", label: "Currency", placeholder: "INR" },
      { id: "source", label: "Source lead", placeholder: "Linked lead or campaign" },
    ],
  },
];
