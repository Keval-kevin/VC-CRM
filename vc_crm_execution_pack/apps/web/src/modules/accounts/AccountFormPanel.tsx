import { RecordFormSlideover, type RecordFormSection } from "../../components/shared";

export type AccountFormPanelProps = {
  isOpen: boolean;
  mode: "create" | "edit";
  onClose: () => void;
};

export function AccountFormPanel({ isOpen, mode, onClose }: AccountFormPanelProps): JSX.Element {
  return (
    <RecordFormSlideover
      isOpen={isOpen}
      title={mode === "create" ? "Create account" : "Edit account"}
      description="Create the account record with required company, ownership, and location context first."
      onClose={onClose}
      saveLabel={mode === "create" ? "Save account" : "Update account"}
      sections={accountSections}
      advancedSections={accountAdvancedSections}
    />
  );
}

const accountSections: RecordFormSection[] = [
  {
    title: "Required account details",
    fields: [
      { id: "name", label: "Account name", placeholder: "Acme Cloud Systems", required: true },
      { id: "domain", label: "Domain", placeholder: "acmecloud.example", required: true },
      { id: "owner", label: "Owner", placeholder: "Priya Shah", required: true },
      { id: "status", label: "Status", placeholder: "Active", required: true },
    ],
  },
  {
    title: "Company profile",
    fields: [
      { id: "industry", label: "Industry", placeholder: "SaaS" },
      { id: "city", label: "Location", placeholder: "Ahmedabad" },
    ],
  },
];

const accountAdvancedSections: RecordFormSection[] = [
  {
    title: "Advanced account context",
    fields: [
      { id: "parentAccount", label: "Parent account", placeholder: "Optional parent company" },
      { id: "tags", label: "Tags", placeholder: "Strategic, enterprise, renewal" },
    ],
  },
];
