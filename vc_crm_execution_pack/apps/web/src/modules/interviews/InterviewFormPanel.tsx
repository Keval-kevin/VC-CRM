import { RecordFormSlideover, type RecordFormSection } from "../../components/shared";

export type InterviewFormPanelProps = {
  isOpen: boolean;
  mode: "create" | "edit";
  onClose: () => void;
};

export function InterviewFormPanel({ isOpen, mode, onClose }: InterviewFormPanelProps): JSX.Element {
  return (
    <RecordFormSlideover
      isOpen={isOpen}
      title={mode === "create" ? "Schedule interview" : "Edit interview"}
      description="Schedule interview rounds, panel owners, timing, and feedback capture in one focused sheet."
      onClose={onClose}
      saveLabel={mode === "create" ? "Save interview" : "Update interview"}
      sections={interviewSections}
      advancedSections={interviewAdvancedSections}
    />
  );
}

const interviewSections: RecordFormSection[] = [
  {
    title: "Required interview details",
    fields: [
      { id: "candidate", label: "Candidate", placeholder: "Isha Mehta", required: true },
      { id: "requirement", label: "Requirement", placeholder: "Senior React Engineer", required: true },
      { id: "round", label: "Round", placeholder: "Technical round", required: true },
      { id: "scheduledAt", label: "Scheduled date", placeholder: "2026-05-22", required: true, type: "date" },
    ],
  },
  {
    title: "Panel and outcome",
    fields: [
      { id: "interviewer", label: "Interviewer", placeholder: "Engineering panel" },
      { id: "outcome", label: "Outcome", placeholder: "Pending feedback" },
    ],
  },
];

const interviewAdvancedSections: RecordFormSection[] = [
  {
    title: "Advanced interview context",
    fields: [
      { id: "meetingLink", label: "Meeting link", placeholder: "Video call URL" },
      { id: "feedback", label: "Feedback", placeholder: "Panel feedback notes" },
    ],
  },
];
