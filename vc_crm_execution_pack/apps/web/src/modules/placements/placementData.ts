export type Placement = {
  id: string;
  candidate: string;
  requirement: string;
  vendor: string;
  clientBillingRate: string;
  vendorCost: string;
  margin: string;
  joiningDate: string;
  replacementPeriod: string;
  billingStatus: string;
};

export const placements: Placement[] = [
  {
    id: "placement-1",
    candidate: "Isha Mehta",
    requirement: "Senior React Engineer",
    vendor: "TalentBridge Solutions",
    clientBillingRate: "INR 3.2L/mo",
    vendorCost: "INR 2.4L/mo",
    margin: "INR 0.8L/mo - 25%",
    joiningDate: "June 3, 2026",
    replacementPeriod: "60 days",
    billingStatus: "Active",
  },
  {
    id: "placement-2",
    candidate: "Rohan Nair",
    requirement: "DevOps Consultant",
    vendor: "CloudStaff Network",
    clientBillingRate: "INR 4.2L/mo",
    vendorCost: "INR 3.1L/mo",
    margin: "INR 1.1L/mo - 26%",
    joiningDate: "June 10, 2026",
    replacementPeriod: "45 days",
    billingStatus: "Not started",
  },
];
