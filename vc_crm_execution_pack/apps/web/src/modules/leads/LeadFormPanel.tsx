import { RecordFormSlideover, type RecordFormSection } from "../../components/shared";

export type LeadFormPanelProps = {
  isOpen: boolean;
  mode: "create" | "edit";
  onClose: () => void;
};

export function LeadFormPanel({ isOpen, mode, onClose }: LeadFormPanelProps): JSX.Element {
  return (
    <RecordFormSlideover
      isOpen={isOpen}
      title={mode === "create" ? "Create lead" : "Edit lead"}
      description="Capture the required lead identity first, then add routing and qualification context."
      onClose={onClose}
      saveLabel={mode === "create" ? "Save lead" : "Update lead"}
      sections={leadSections}
      advancedSections={leadAdvancedSections}
    />
  );
}

const leadSections: RecordFormSection[] = [
  {
    title: "Required lead details",
    description: "Minimum fields needed before duplicate checks and owner assignment.",
    fields: [
      { id: "name", label: "Lead name", placeholder: "Avni Shah", required: true },
      {
        id: "email",
        label: "Email",
        placeholder: "name@company.com",
        required: true,
        type: "email",
      },
      { id: "company", label: "Company", placeholder: "Acme Cloud Systems", required: true },
      { id: "owner", label: "Owner", placeholder: "Priya Shah", required: true },
    ],
  },
  {
    title: "Qualification",
    fields: [
      { id: "source", label: "Source", placeholder: "Website, referral, LinkedIn" },
      { id: "status", label: "Lifecycle status", placeholder: "NEW" },
      { id: "followUp", label: "Next follow-up", placeholder: "Today" },
      { id: "score", label: "Score", placeholder: "85", type: "number" },
    ],
  },
];

const leadAdvancedSections: RecordFormSection[] = [
  {
    title: "Advanced lead context",
    fields: [
      { id: "phone", label: "Phone", placeholder: "+91 98765 10001" },
      {
        id: "importSource",
        label: "Import source",
        placeholder: "CSV import batch or campaign name",
      },
    ],
  },
];
