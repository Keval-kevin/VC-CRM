export type ProposalStatus =
  | "DRAFT"
  | "SUBMITTED"
  | "APPROVED"
  | "REJECTED"
  | "SENT"
  | "WON"
  | "LOST";

export type Proposal = {
  id: string;
  title: string;
  account: string;
  opportunity: string;
  template: string;
  status: ProposalStatus;
  version: number;
  approverRole: string;
  owner: string;
  value: string;
};

export const proposals: Proposal[] = [
  {
    id: "prop-1",
    title: "Acme React Squad Proposal",
    account: "Acme Cloud Systems",
    opportunity: "Acme Cloud - Dedicated React squad",
    template: "Staff augmentation",
    status: "SUBMITTED",
    version: 3,
    approverRole: "Sales manager",
    owner: "Nisha Patel",
    value: "₹48,00,000",
  },
  {
    id: "prop-2",
    title: "FinEdge QA Automation Commercials",
    account: "FinEdge Capital",
    opportunity: "FinEdge - QA automation pod",
    template: "Managed pod",
    status: "APPROVED",
    version: 2,
    approverRole: "Founder",
    owner: "Rohan Mehta",
    value: "₹22,00,000",
  },
];
