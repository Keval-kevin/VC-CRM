export type Candidate = {
  id: string;
  name: string;
  email: string;
  phone: string;
  vendor: string;
  primarySkills: string[];
  secondarySkills: string[];
  experience: string;
  currentCtc: string;
  expectedCtc: string;
  noticePeriod: string;
  location: string;
  availability: string;
  consent: string;
  blacklist: string;
  resume: string;
  parsingStatus: string;
  status: string;
};

export const candidates: Candidate[] = [
  {
    id: "candidate-1",
    name: "Isha Mehta",
    email: "isha.mehta@example.com",
    phone: "+91 98765 41001",
    vendor: "TalentBridge Solutions",
    primarySkills: ["React", "TypeScript", "Redux"],
    secondarySkills: ["Node.js", "AWS"],
    experience: "5.5 years",
    currentCtc: "INR 18L",
    expectedCtc: "INR 24L",
    noticePeriod: "30 days",
    location: "Ahmedabad, India",
    availability: "Notice period",
    consent: "Captured",
    blacklist: "Clear",
    resume: "isha-mehta-react.pdf",
    parsingStatus: "Review ready",
    status: "Active",
  },
  {
    id: "candidate-2",
    name: "Rohan Nair",
    email: "rohan.nair@example.com",
    phone: "+91 98765 41002",
    vendor: "CloudStaff Network",
    primarySkills: ["DevOps", "Kubernetes", "Terraform"],
    secondarySkills: ["Azure", "Python"],
    experience: "7 years",
    currentCtc: "INR 28L",
    expectedCtc: "INR 36L",
    noticePeriod: "Immediate",
    location: "Pune, India",
    availability: "Immediate",
    consent: "Pending",
    blacklist: "Clear",
    resume: "rohan-nair-devops.pdf",
    parsingStatus: "Queued",
    status: "Active",
  },
];
