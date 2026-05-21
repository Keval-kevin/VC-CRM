import { RecordFormSlideover, type RecordFormSection } from "../../components/shared";

export type CandidateFormPanelProps = {
  isOpen: boolean;
  mode?: "create" | "edit";
  onClose: () => void;
};

export function CandidateFormPanel({
  isOpen,
  mode = "create",
  onClose,
}: CandidateFormPanelProps): JSX.Element {
  return (
    <RecordFormSlideover
      isOpen={isOpen}
      title={mode === "create" ? "Create candidate" : "Edit candidate"}
      description="Capture identity, skills, availability, vendor, and consent before adding advanced compensation details."
      onClose={onClose}
      saveLabel={mode === "create" ? "Save candidate" : "Update candidate"}
      sections={candidateSections}
      advancedSections={candidateAdvancedSections}
    />
  );
}

const candidateSections: RecordFormSection[] = [
  {
    title: "Required candidate details",
    fields: [
      { id: "name", label: "Candidate name", placeholder: "Isha Mehta", required: true },
      {
        id: "email",
        label: "Email",
        placeholder: "candidate@example.com",
        required: true,
        type: "email",
      },
      { id: "primarySkills", label: "Primary skills", placeholder: "React, TypeScript", required: true },
      { id: "availability", label: "Availability", placeholder: "Immediate", required: true },
    ],
  },
  {
    title: "Sourcing",
    fields: [
      { id: "vendor", label: "Vendor", placeholder: "TalentBridge Solutions" },
      { id: "location", label: "Location", placeholder: "Ahmedabad" },
      { id: "consent", label: "Consent", placeholder: "Captured" },
      { id: "noticePeriod", label: "Notice period", placeholder: "30 days" },
    ],
  },
];

const candidateAdvancedSections: RecordFormSection[] = [
  {
    title: "Advanced candidate context",
    fields: [
      { id: "currentCtc", label: "Current CTC", placeholder: "INR 18L" },
      { id: "expectedCtc", label: "Expected CTC", placeholder: "INR 24L" },
      { id: "resume", label: "Resume file", placeholder: "MinIO key or file name" },
      { id: "secondarySkills", label: "Secondary skills", placeholder: "Redux, Testing" },
    ],
  },
];
