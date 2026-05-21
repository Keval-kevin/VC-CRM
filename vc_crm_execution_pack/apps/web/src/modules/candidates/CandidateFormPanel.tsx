import { SlideoverPanel } from "../../components/shared/SlideoverPanel";

export type CandidateFormPanelProps = {
  isOpen: boolean;
  onClose: () => void;
};

export function CandidateFormPanel({ isOpen, onClose }: CandidateFormPanelProps): JSX.Element {
  return (
    <SlideoverPanel
      isOpen={isOpen}
      title="Create candidate"
      description="Capture identity, skills, CTC, notice period, vendor link, consent, resume metadata, and parsed-data review readiness."
      onClose={onClose}
    />
  );
}
