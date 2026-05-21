import { RecordFormSlideover, type RecordFormSection } from "../../components/shared";

export type ContactFormPanelProps = {
  isOpen: boolean;
  mode: "create" | "edit";
  onClose: () => void;
};

export function ContactFormPanel({ isOpen, mode, onClose }: ContactFormPanelProps): JSX.Element {
  return (
    <RecordFormSlideover
      isOpen={isOpen}
      title={mode === "create" ? "Create contact" : "Edit contact"}
      description="Link the contact to an account and capture decision-maker context without a full-page form."
      onClose={onClose}
      saveLabel={mode === "create" ? "Save contact" : "Update contact"}
      sections={contactSections}
      advancedSections={contactAdvancedSections}
    />
  );
}

const contactSections: RecordFormSection[] = [
  {
    title: "Required contact details",
    fields: [
      { id: "name", label: "Contact name", placeholder: "Aarav Desai", required: true },
      {
        id: "email",
        label: "Email",
        placeholder: "name@account.com",
        required: true,
        type: "email",
      },
      { id: "account", label: "Account", placeholder: "Acme Cloud Systems", required: true },
      { id: "title", label: "Title", placeholder: "CTO", required: true },
    ],
  },
  {
    title: "Relationship",
    fields: [
      { id: "status", label: "Status", placeholder: "Active" },
      { id: "decisionMaker", label: "Decision maker", placeholder: "Yes or No" },
    ],
  },
];

const contactAdvancedSections: RecordFormSection[] = [
  {
    title: "Advanced contact context",
    fields: [
      { id: "phone", label: "Phone", placeholder: "+91 98765 10001" },
      { id: "linkedin", label: "LinkedIn", placeholder: "Profile URL" },
    ],
  },
];
