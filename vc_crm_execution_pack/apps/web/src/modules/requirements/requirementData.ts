export type Requirement = {
  id: string;
  roleTitle: string;
  account: string;
  opportunity: string;
  skills: string[];
  experienceRange: string;
  budget: string;
  location: string;
  workMode: string;
  positions: number;
  priority: string;
  status: string;
  submissions: number;
};

export type Submission = {
  id: string;
  requirementId: string;
  candidate: string;
  vendor: string;
  status: string;
  technicalReview: string;
  clientSubmission: string;
  interview: string;
  feedback: string;
};

export const requirements: Requirement[] = [
  {
    id: "req-1",
    roleTitle: "Senior React Engineer",
    account: "Acme Cloud Systems",
    opportunity: "Acme Cloud - Dedicated React squad",
    skills: ["React", "TypeScript", "Redux"],
    experienceRange: "5-8 years",
    budget: "INR 24L-32L",
    location: "Ahmedabad / Remote",
    workMode: "Hybrid",
    positions: 3,
    priority: "High",
    status: "Open",
    submissions: 4,
  },
  {
    id: "req-2",
    roleTitle: "DevOps Consultant",
    account: "Northstar Finance",
    opportunity: "Infrastructure modernization",
    skills: ["Kubernetes", "Terraform", "Azure"],
    experienceRange: "6-10 years",
    budget: "INR 30L-42L",
    location: "Pune",
    workMode: "Onsite",
    positions: 2,
    priority: "Urgent",
    status: "Technical review",
    submissions: 2,
  },
];

export const submissions: Submission[] = [
  {
    id: "sub-1",
    requirementId: "req-1",
    candidate: "Isha Mehta",
    vendor: "TalentBridge Solutions",
    status: "Client submitted",
    technicalReview: "Approved",
    clientSubmission: "Submitted May 21",
    interview: "Scheduling placeholder",
    feedback: "Awaiting client feedback",
  },
  {
    id: "sub-2",
    requirementId: "req-1",
    candidate: "Rohan Nair",
    vendor: "CloudStaff Network",
    status: "Technical review",
    technicalReview: "Pending panel review",
    clientSubmission: "Not submitted",
    interview: "Not scheduled",
    feedback: "No feedback yet",
  },
];
