export type ParsingJob = {
  id: string;
  document: string;
  provider: string;
  type: string;
  status: string;
  source: string;
  tokens: string;
  cost: string;
  retry: string;
};

export const parsingJobs: ParsingJob[] = [
  {
    id: "job-1",
    document: "Isha-Mehta-Resume.pdf",
    provider: "OpenAI",
    type: "Resume parse",
    status: "Review ready",
    source: "Candidate",
    tokens: "0",
    cost: "INR 0.00",
    retry: "Not scheduled",
  },
  {
    id: "job-2",
    document: "Acme-SOW-v3.docx",
    provider: "Anthropic",
    type: "Proposal/SOW parse",
    status: "Pending",
    source: "Proposal",
    tokens: "0",
    cost: "INR 0.00",
    retry: "Foundation mode",
  },
  {
    id: "job-3",
    document: "talentbridge.example",
    provider: "Gemini",
    type: "Vendor website intelligence placeholder",
    status: "Failed",
    source: "Vendor",
    tokens: "0",
    cost: "INR 0.00",
    retry: "Retry waiting",
  },
];

export const parsedResumeFields = [
  { field: "First name", extracted: "Isha", confidence: "High", decision: "Approve" },
  {
    field: "Primary skills",
    extracted: "React, TypeScript, GraphQL",
    confidence: "Medium",
    decision: "Approve",
  },
  { field: "Experience", extracted: "6 years", confidence: "Medium", decision: "Approve" },
  { field: "Location", extracted: "Bengaluru, India", confidence: "Low", decision: "Needs review" },
];
