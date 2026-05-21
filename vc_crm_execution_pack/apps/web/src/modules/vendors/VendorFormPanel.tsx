import { RecordFormSlideover, type RecordFormSection } from "../../components/shared";

export type VendorFormPanelProps = {
  isOpen: boolean;
  mode: "create" | "edit";
  onClose: () => void;
};

export function VendorFormPanel({ isOpen, mode, onClose }: VendorFormPanelProps): JSX.Element {
  return (
    <RecordFormSlideover
      isOpen={isOpen}
      title={mode === "create" ? "Create vendor" : "Edit vendor"}
      description="Capture vendor identity, expertise, compliance, and portal readiness in a focused panel."
      onClose={onClose}
      saveLabel={mode === "create" ? "Save vendor" : "Update vendor"}
      sections={vendorSections}
      advancedSections={vendorAdvancedSections}
    />
  );
}

const vendorSections: RecordFormSection[] = [
  {
    title: "Required vendor details",
    fields: [
      { id: "name", label: "Vendor name", placeholder: "TalentBridge Solutions", required: true },
      { id: "categories", label: "Categories", placeholder: "Staffing, Implementation", required: true },
      { id: "expertise", label: "Expertise", placeholder: "React, Node.js, AWS", required: true },
      { id: "decisionMaker", label: "Decision maker", placeholder: "Priya Shah, Partner", required: true },
    ],
  },
  {
    title: "Compliance and risk",
    fields: [
      { id: "tier", label: "Tier", placeholder: "Preferred" },
      { id: "riskStatus", label: "Risk status", placeholder: "Clear" },
      { id: "ndaStatus", label: "NDA status", placeholder: "Signed" },
      { id: "msaStatus", label: "MSA status", placeholder: "In review" },
    ],
  },
];

const vendorAdvancedSections: RecordFormSection[] = [
  {
    title: "Advanced vendor context",
    fields: [
      { id: "rateCard", label: "Rate card", placeholder: "INR 2.5L/mo React developer" },
      { id: "portal", label: "Portal status", placeholder: "Enabled" },
      { id: "location", label: "Location", placeholder: "Ahmedabad, India" },
      { id: "ownership", label: "Ownership", placeholder: "Virtual Coders" },
    ],
  },
];
