import { RecordFormSlideover, type RecordFormSection } from "../../components/shared";

export type RequirementFormPanelProps = {
  isOpen: boolean;
  mode: "create" | "edit";
  onClose: () => void;
};

export function RequirementFormPanel({
  isOpen,
  mode,
  onClose,
}: RequirementFormPanelProps): JSX.Element {
  return (
    <RecordFormSlideover
      isOpen={isOpen}
      title={mode === "create" ? "Create requirement" : "Edit requirement"}
      description="Capture demand, skills, budget, and priority before vendor broadcast or submissions."
      onClose={onClose}
      saveLabel={mode === "create" ? "Save requirement" : "Update requirement"}
      sections={requirementSections}
      advancedSections={requirementAdvancedSections}
    />
  );
}

const requirementSections: RecordFormSection[] = [
  {
    title: "Required requirement details",
    fields: [
      { id: "roleTitle", label: "Role title", placeholder: "Senior React Engineer", required: true },
      { id: "account", label: "Account", placeholder: "Acme Cloud Systems", required: true },
      { id: "skills", label: "Required skills", placeholder: "React, TypeScript, Redux", required: true },
      { id: "positions", label: "Positions", placeholder: "3", required: true, type: "number" },
    ],
  },
  {
    title: "Delivery context",
    fields: [
      { id: "budget", label: "Budget", placeholder: "INR 24L-32L" },
      { id: "experienceRange", label: "Experience", placeholder: "5-8 years" },
      { id: "priority", label: "Priority", placeholder: "High" },
      { id: "status", label: "Status", placeholder: "Open" },
    ],
  },
];

const requirementAdvancedSections: RecordFormSection[] = [
  {
    title: "Advanced requirement context",
    fields: [
      { id: "opportunity", label: "Opportunity", placeholder: "Linked opportunity" },
      { id: "workMode", label: "Work mode", placeholder: "Hybrid" },
      { id: "location", label: "Location", placeholder: "Ahmedabad / Remote" },
    ],
  },
];
