import { RecordFormSlideover, type RecordFormSection } from "../../components/shared";

export type PlacementFormPanelProps = {
  isOpen: boolean;
  mode: "create" | "edit";
  onClose: () => void;
};

export function PlacementFormPanel({ isOpen, mode, onClose }: PlacementFormPanelProps): JSX.Element {
  return (
    <RecordFormSlideover
      isOpen={isOpen}
      title={mode === "create" ? "Create placement" : "Edit placement"}
      description="Capture joining, replacement, billing, and authorized financial context in a slideover."
      onClose={onClose}
      saveLabel={mode === "create" ? "Save placement" : "Update placement"}
      sections={placementSections}
      advancedSections={placementAdvancedSections}
    />
  );
}

const placementSections: RecordFormSection[] = [
  {
    title: "Required placement details",
    fields: [
      { id: "candidate", label: "Candidate", placeholder: "Isha Mehta", required: true },
      { id: "requirement", label: "Requirement", placeholder: "Senior React Engineer", required: true },
      { id: "vendor", label: "Vendor", placeholder: "TalentBridge Solutions", required: true },
      { id: "joiningDate", label: "Joining date", placeholder: "2026-06-01", required: true, type: "date" },
    ],
  },
  {
    title: "Billing",
    fields: [
      { id: "billingStatus", label: "Billing status", placeholder: "Ready" },
      { id: "replacementPeriod", label: "Replacement period", placeholder: "90 days" },
    ],
  },
];

const placementAdvancedSections: RecordFormSection[] = [
  {
    title: "Authorized financial fields",
    fields: [
      { id: "clientBilling", label: "Client billing", placeholder: "INR 3.2L/mo" },
      { id: "vendorCost", label: "Vendor cost", placeholder: "INR 2.5L/mo" },
      { id: "margin", label: "Margin", placeholder: "21.9%" },
    ],
  },
];
