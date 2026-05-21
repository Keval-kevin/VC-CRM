export type Interview = {
  id: string;
  candidate: string;
  requirement: string;
  round: string;
  interviewer: string;
  scheduledAt: string;
  outcome: string;
  feedback: string;
};

export const interviews: Interview[] = [
  {
    id: "int-1",
    candidate: "Isha Mehta",
    requirement: "Senior React Engineer",
    round: "Round 1",
    interviewer: "Ananya Rao",
    scheduledAt: "May 22, 2026 11:00 AM",
    outcome: "Pending",
    feedback: "Frontend architecture panel",
  },
  {
    id: "int-2",
    candidate: "Rohan Nair",
    requirement: "DevOps Consultant",
    round: "Round 2",
    interviewer: "Vikram Shah",
    scheduledAt: "May 23, 2026 3:30 PM",
    outcome: "Passed",
    feedback: "Strong Terraform depth, client round next",
  },
];
