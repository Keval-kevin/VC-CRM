import { RecordFormSlideover, type RecordFormSection } from "../../components/shared";

export type SubmissionFormPanelProps = {
  isOpen: boolean;
  mode: "create" | "edit";
  onClose: () => void;
};

export function SubmissionFormPanel({ isOpen, mode, onClose }: SubmissionFormPanelProps): JSX.Element {
  return (
    <RecordFormSlideover
      isOpen={isOpen}
      title={mode === "create" ? "Create submission" : "Edit submission"}
      description="Submit a candidate to a requirement and capture review status without leaving the tracker."
      onClose={onClose}
      saveLabel={mode === "create" ? "Save submission" : "Update submission"}
      sections={submissionSections}
      advancedSections={submissionAdvancedSections}
    />
  );
}

const submissionSections: RecordFormSection[] = [
  {
    title: "Required submission details",
    fields: [
      { id: "candidate", label: "Candidate", placeholder: "Isha Mehta", required: true },
      { id: "requirement", label: "Requirement", placeholder: "Senior React Engineer", required: true },
      { id: "vendor", label: "Vendor", placeholder: "TalentBridge Solutions", required: true },
      { id: "status", label: "Status", placeholder: "Technical review", required: true },
    ],
  },
  {
    title: "Review state",
    fields: [
      { id: "technicalReview", label: "Technical review", placeholder: "Pending panel review" },
      { id: "clientSubmission", label: "Client submission", placeholder: "Not submitted" },
      { id: "interview", label: "Interview", placeholder: "Not scheduled" },
    ],
  },
];

const submissionAdvancedSections: RecordFormSection[] = [
  {
    title: "Advanced submission context",
    fields: [{ id: "feedback", label: "Feedback", placeholder: "Reviewer or client notes" }],
  },
];
