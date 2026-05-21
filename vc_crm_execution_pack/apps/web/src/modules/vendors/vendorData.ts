export type Vendor = {
  id: string;
  name: string;
  categories: string[];
  expertise: string[];
  decisionMaker: string;
  location: string;
  ownership: string;
  ndaStatus: string;
  msaStatus: string;
  tier: string;
  status: string;
  riskStatus: string;
  score: number;
  rateCard: string;
  portal: string;
};

export const vendors: Vendor[] = [
  {
    id: "vendor-1",
    name: "TalentBridge Solutions",
    categories: ["Staffing", "Implementation"],
    expertise: ["React", "Node.js", "AWS"],
    decisionMaker: "Priya Shah, Partner",
    location: "Ahmedabad, India",
    ownership: "Virtual Coders",
    ndaStatus: "Signed",
    msaStatus: "In review",
    tier: "Preferred",
    status: "Active",
    riskStatus: "Clear",
    score: 86,
    rateCard: "INR 2.5L/mo React developer",
    portal: "Enabled",
  },
  {
    id: "vendor-2",
    name: "CloudStaff Network",
    categories: ["Cloud", "DevOps"],
    expertise: ["Azure", "Kubernetes", "Terraform"],
    decisionMaker: "Rahul Menon, Director",
    location: "Pune, India",
    ownership: "Virtual Coders",
    ndaStatus: "Requested",
    msaStatus: "Not started",
    tier: "Standard",
    status: "Onboarding",
    riskStatus: "Warning",
    score: 68,
    rateCard: "INR 3.2L/mo DevOps engineer",
    portal: "Invited",
  },
];
