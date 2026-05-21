export type OpportunityStage =
  | "QUALIFICATION"
  | "DISCOVERY"
  | "REQUIREMENT"
  | "PROPOSAL"
  | "NEGOTIATION"
  | "VERBAL_COMMIT"
  | "CONTRACTING"
  | "WON"
  | "LOST";

export type Opportunity = {
  id: string;
  name: string;
  account: string;
  owner: string;
  stage: OpportunityStage;
  probability: number;
  valueCents: number;
  currency: "INR" | "USD";
  expectedClose: string;
  lastStageMove: string;
  isStagnant: boolean;
};

export const opportunityStages: { stage: OpportunityStage; label: string; probability: number }[] =
  [
    { stage: "QUALIFICATION", label: "Qualification", probability: 10 },
    { stage: "DISCOVERY", label: "Discovery", probability: 20 },
    { stage: "REQUIREMENT", label: "Requirement", probability: 35 },
    { stage: "PROPOSAL", label: "Proposal", probability: 50 },
    { stage: "NEGOTIATION", label: "Negotiation", probability: 70 },
    { stage: "VERBAL_COMMIT", label: "Verbal commit", probability: 85 },
    { stage: "CONTRACTING", label: "Contracting", probability: 95 },
    { stage: "WON", label: "Won", probability: 100 },
    { stage: "LOST", label: "Lost", probability: 0 },
  ];

export const opportunities: Opportunity[] = [
  {
    id: "opp-1",
    name: "Acme Cloud - Dedicated React squad",
    account: "Acme Cloud Systems",
    owner: "Nisha Patel",
    stage: "PROPOSAL",
    probability: 50,
    valueCents: 480000000,
    currency: "INR",
    expectedClose: "2026-06-18",
    lastStageMove: "4 days ago",
    isStagnant: false,
  },
  {
    id: "opp-2",
    name: "FinEdge - QA automation pod",
    account: "FinEdge Capital",
    owner: "Rohan Mehta",
    stage: "NEGOTIATION",
    probability: 70,
    valueCents: 220000000,
    currency: "INR",
    expectedClose: "2026-06-05",
    lastStageMove: "16 days ago",
    isStagnant: true,
  },
  {
    id: "opp-3",
    name: "Nova Retail - Discovery sprint",
    account: "Nova Retail",
    owner: "Avni Shah",
    stage: "DISCOVERY",
    probability: 20,
    valueCents: 90000000,
    currency: "INR",
    expectedClose: "2026-07-02",
    lastStageMove: "2 days ago",
    isStagnant: false,
  },
  {
    id: "opp-4",
    name: "MedCore - Platform support renewal",
    account: "MedCore Health",
    owner: "Nisha Patel",
    stage: "CONTRACTING",
    probability: 95,
    valueCents: 350000000,
    currency: "INR",
    expectedClose: "2026-05-30",
    lastStageMove: "1 day ago",
    isStagnant: false,
  },
];

export function formatMoney(cents: number, currency: string): string {
  return new Intl.NumberFormat("en-IN", {
    currency,
    maximumFractionDigits: 0,
    style: "currency",
  }).format(cents / 100);
}

export function weightedForecast(opportunity: Opportunity): number {
  return Math.round((opportunity.valueCents * opportunity.probability) / 100);
}
