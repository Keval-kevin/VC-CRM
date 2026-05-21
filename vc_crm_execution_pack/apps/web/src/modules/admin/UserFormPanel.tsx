import { RecordFormSlideover, type RecordFormSection } from "../../components/shared";

export type UserFormPanelProps = {
  isOpen: boolean;
  mode: "create" | "edit";
  onClose: () => void;
};

export function UserFormPanel({ isOpen, mode, onClose }: UserFormPanelProps): JSX.Element {
  return (
    <RecordFormSlideover
      isOpen={isOpen}
      title={mode === "create" ? "Invite user" : "Edit user"}
      description="Invite or update a tenant user with role assignment and access controls."
      onClose={onClose}
      saveLabel={mode === "create" ? "Send invite" : "Update user"}
      sections={userSections}
      advancedSections={userAdvancedSections}
    />
  );
}

const userSections: RecordFormSection[] = [
  {
    title: "Required user details",
    fields: [
      { id: "firstName", label: "First name", placeholder: "Priya", required: true },
      { id: "lastName", label: "Last name", placeholder: "Shah", required: true },
      { id: "email", label: "Email", placeholder: "user@company.com", required: true, type: "email" },
      { id: "role", label: "Role", placeholder: "Sales Manager", required: true },
    ],
  },
  {
    title: "Access",
    fields: [
      { id: "status", label: "Status", placeholder: "Invited" },
      { id: "team", label: "Team", placeholder: "Sales" },
    ],
  },
];

const userAdvancedSections: RecordFormSection[] = [
  {
    title: "Advanced user controls",
    fields: [
      { id: "permissionGroup", label: "Permission group", placeholder: "Default role permissions" },
      { id: "notes", label: "Admin notes", placeholder: "Internal access notes" },
    ],
  },
];
