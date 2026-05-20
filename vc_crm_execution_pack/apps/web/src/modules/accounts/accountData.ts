export type AccountListItem = {
  id: string;
  name: string;
  domain: string;
  industry: string;
  status: string;
  owner: string;
  city: string;
  updated: string;
};

export type ContactListItem = {
  id: string;
  accountId: string;
  name: string;
  email: string;
  title: string;
  status: string;
  decisionMaker: string;
};

export const accounts = [
  {
    id: "acct-1",
    name: "Acme Cloud Systems",
    domain: "acmecloud.example",
    industry: "SaaS",
    status: "Active",
    owner: "Priya Shah",
    city: "Ahmedabad",
    updated: "Today",
  },
  {
    id: "acct-2",
    name: "Northstar Retail",
    domain: "northstar.example",
    industry: "Retail",
    status: "Prospect",
    owner: "Karan Mehta",
    city: "Mumbai",
    updated: "Yesterday",
  },
  {
    id: "acct-3",
    name: "Helio Finance",
    domain: "helio.example",
    industry: "Fintech",
    status: "Active",
    owner: "Nisha Patel",
    city: "Bengaluru",
    updated: "This week",
  },
] satisfies AccountListItem[];

export const contacts = [
  {
    id: "cont-1",
    accountId: "acct-1",
    name: "Aarav Desai",
    email: "aarav@acmecloud.example",
    title: "CTO",
    status: "Active",
    decisionMaker: "Yes",
  },
  {
    id: "cont-2",
    accountId: "acct-1",
    name: "Meera Rao",
    email: "meera@acmecloud.example",
    title: "VP Engineering",
    status: "Active",
    decisionMaker: "No",
  },
  {
    id: "cont-3",
    accountId: "acct-2",
    name: "Rohan Iyer",
    email: "rohan@northstar.example",
    title: "Founder",
    status: "Active",
    decisionMaker: "Yes",
  },
] satisfies ContactListItem[];
