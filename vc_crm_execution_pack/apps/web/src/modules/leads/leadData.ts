export type LeadStatus =
  | "NEW"
  | "CONTACTED"
  | "QUALIFIED"
  | "NURTURING"
  | "CONVERTED"
  | "DISQUALIFIED"
  | "LOST";

export type LeadListItem = {
  id: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  source: string;
  status: LeadStatus;
  owner: string;
  score: string;
  followUp: string;
};

export const leads = [
  {
    id: "lead-1",
    name: "Avni Shah",
    email: "avni@acmecloud.example",
    phone: "+91 98765 10001",
    company: "Acme Cloud Systems",
    source: "Website",
    status: "NEW",
    owner: "Priya Shah",
    score: "85",
    followUp: "Today",
  },
  {
    id: "lead-2",
    name: "Dev Mehta",
    email: "dev@northstar.example",
    phone: "+91 98765 10002",
    company: "Northstar Retail",
    source: "Referral",
    status: "QUALIFIED",
    owner: "Karan Mehta",
    score: "72",
    followUp: "Tomorrow",
  },
  {
    id: "lead-3",
    name: "Isha Rao",
    email: "isha@gmail.com",
    phone: "+91 98765 10003",
    company: "Helio Finance",
    source: "LinkedIn",
    status: "NURTURING",
    owner: "Nisha Patel",
    score: "48",
    followUp: "Friday",
  },
] satisfies LeadListItem[];
