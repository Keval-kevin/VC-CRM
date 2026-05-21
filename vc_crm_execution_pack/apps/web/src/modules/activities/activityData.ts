export type ActivityKind = "CALL" | "EMAIL" | "MEETING" | "TASK" | "NOTE";
export type ActivityStatus = "OPEN" | "COMPLETED" | "CANCELLED";

export type ActivityItem = {
  id: string;
  type: ActivityKind;
  title: string;
  owner: string;
  linkedTo: string;
  due: string;
  reminder: string;
  status: ActivityStatus;
  isOverdue: boolean;
};

export const activities: ActivityItem[] = [
  {
    id: "act-1",
    type: "CALL",
    title: "Discovery call with Acme Cloud",
    owner: "Nisha Patel",
    linkedTo: "Acme Cloud - Dedicated React squad",
    due: "Today 4:00 PM",
    reminder: "30 min before",
    status: "OPEN",
    isOverdue: false,
  },
  {
    id: "act-2",
    type: "TASK",
    title: "Send revised commercials",
    owner: "Rohan Mehta",
    linkedTo: "FinEdge - QA automation pod",
    due: "Yesterday",
    reminder: "Overdue",
    status: "OPEN",
    isOverdue: true,
  },
  {
    id: "act-3",
    type: "NOTE",
    title: "Stakeholder prefers monthly billing",
    owner: "Avni Shah",
    linkedTo: "Nova Retail",
    due: "No due date",
    reminder: "None",
    status: "COMPLETED",
    isOverdue: false,
  },
];
