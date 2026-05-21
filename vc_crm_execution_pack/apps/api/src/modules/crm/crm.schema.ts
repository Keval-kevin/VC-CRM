import {
  AccountStatus,
  ActivityStatus,
  ActivityType,
  CandidateAvailability,
  CandidateStatus,
  ContactStatus,
  InterviewOutcome,
  LeadStatus,
  OpportunityStage,
  ProposalStatus,
  PlacementBillingStatus,
  RequirementPriority,
  RequirementStatus,
  SubmissionStatus,
  VendorDocumentStatus,
  VendorRiskStatus,
  VendorStatus,
  VendorTier,
  WorkMode,
} from "@prisma/client";
import { z } from "zod";

export const paginationSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(20),
  search: z.string().trim().max(120).optional(),
  sortBy: z.enum(["createdAt", "updatedAt", "name", "firstName", "lastName"]).optional(),
  sortDirection: z.enum(["asc", "desc"]).default("desc"),
});

export const accountListQuerySchema = paginationSchema.extend({
  status: z.enum(AccountStatus).optional(),
  industry: z.string().trim().max(80).optional(),
});

export const leadListQuerySchema = paginationSchema.extend({
  source: z.string().trim().max(80).optional(),
  status: z.enum(LeadStatus).optional(),
  ownerId: z.string().uuid().optional(),
  followUpFrom: z.coerce.date().optional(),
  followUpTo: z.coerce.date().optional(),
});

export const contactListQuerySchema = paginationSchema.extend({
  accountId: z.string().uuid().optional(),
  status: z.enum(ContactStatus).optional(),
});

export const opportunityListQuerySchema = paginationSchema.extend({
  accountId: z.string().uuid().optional(),
  ownerId: z.string().uuid().optional(),
  stage: z.enum(OpportunityStage).optional(),
  currency: z.string().trim().length(3).optional(),
  expectedCloseFrom: z.coerce.date().optional(),
  expectedCloseTo: z.coerce.date().optional(),
  stagnantOnly: z.coerce.boolean().optional(),
});

export const proposalListQuerySchema = paginationSchema.extend({
  accountId: z.string().uuid().optional(),
  contactId: z.string().uuid().optional(),
  opportunityId: z.string().uuid().optional(),
  ownerId: z.string().uuid().optional(),
  status: z.enum(ProposalStatus).optional(),
  approvalQueue: z.coerce.boolean().optional(),
});

export const activityListQuerySchema = paginationSchema.extend({
  leadId: z.string().uuid().optional(),
  accountId: z.string().uuid().optional(),
  contactId: z.string().uuid().optional(),
  opportunityId: z.string().uuid().optional(),
  proposalId: z.string().uuid().optional(),
  candidateId: z.string().uuid().optional(),
  ownerId: z.string().uuid().optional(),
  type: z.enum(ActivityType).optional(),
  status: z.enum(ActivityStatus).optional(),
  overdueOnly: z.coerce.boolean().optional(),
  dueFrom: z.coerce.date().optional(),
  dueTo: z.coerce.date().optional(),
});

export const vendorListQuerySchema = paginationSchema.extend({
  category: z.string().trim().max(80).optional(),
  skill: z.string().trim().max(80).optional(),
  country: z.string().trim().max(80).optional(),
  companyOwnershipTag: z.string().trim().max(80).optional(),
  tier: z.enum(VendorTier).optional(),
  status: z.enum(VendorStatus).optional(),
  riskStatus: z.enum(VendorRiskStatus).optional(),
  ndaStatus: z.enum(VendorDocumentStatus).optional(),
  msaStatus: z.enum(VendorDocumentStatus).optional(),
});

export const candidateListQuerySchema = paginationSchema.extend({
  vendorId: z.string().uuid().optional(),
  status: z.enum(CandidateStatus).optional(),
  availability: z.enum(CandidateAvailability).optional(),
  primarySkill: z.string().trim().max(80).optional(),
  secondarySkill: z.string().trim().max(80).optional(),
  country: z.string().trim().max(80).optional(),
  city: z.string().trim().max(80).optional(),
  blacklisted: z.coerce.boolean().optional(),
});

export const requirementListQuerySchema = paginationSchema.extend({
  accountId: z.string().uuid().optional(),
  opportunityId: z.string().uuid().optional(),
  status: z.enum(RequirementStatus).optional(),
  priority: z.enum(RequirementPriority).optional(),
  workMode: z.enum(WorkMode).optional(),
  skill: z.string().trim().max(80).optional(),
  location: z.string().trim().max(120).optional(),
});

export const submissionListQuerySchema = paginationSchema.extend({
  requirementId: z.string().uuid().optional(),
  candidateId: z.string().uuid().optional(),
  vendorId: z.string().uuid().optional(),
  status: z.enum(SubmissionStatus).optional(),
});

export const interviewListQuerySchema = paginationSchema.extend({
  submissionId: z.string().uuid().optional(),
  candidateId: z.string().uuid().optional(),
  requirementId: z.string().uuid().optional(),
  outcome: z.enum(InterviewOutcome).optional(),
  scheduledFrom: z.coerce.date().optional(),
  scheduledTo: z.coerce.date().optional(),
});

export const placementListQuerySchema = paginationSchema.extend({
  submissionId: z.string().uuid().optional(),
  candidateId: z.string().uuid().optional(),
  requirementId: z.string().uuid().optional(),
  vendorId: z.string().uuid().optional(),
  billingStatus: z.enum(PlacementBillingStatus).optional(),
  joiningFrom: z.coerce.date().optional(),
  joiningTo: z.coerce.date().optional(),
});

export const createAccountSchema = z
  .object({
    name: z.string().trim().min(2).max(160),
    website: z.string().trim().url().optional(),
    domain: z.string().trim().min(2).max(120).optional(),
    industry: z.string().trim().max(100).optional(),
    phone: z.string().trim().max(40).optional(),
    city: z.string().trim().max(80).optional(),
    country: z.string().trim().max(80).optional(),
    status: z.enum(AccountStatus).default(AccountStatus.PROSPECT),
    notes: z.string().trim().max(2000).optional(),
  })
  .strict();

export const updateAccountSchema = createAccountSchema.partial().strict();

export const createLeadSchema = z
  .object({
    firstName: z.string().trim().min(1).max(80),
    lastName: z.string().trim().min(1).max(80),
    email: z
      .string()
      .trim()
      .email()
      .transform((value) => value.toLowerCase())
      .optional(),
    phone: z.string().trim().max(40).optional(),
    company: z.string().trim().max(160).optional(),
    website: z.string().trim().url().optional(),
    companyDomain: z.string().trim().min(2).max(120).optional(),
    linkedinUrl: z.string().trim().url().optional(),
    country: z.string().trim().max(80).optional(),
    source: z.string().trim().min(1).max(80),
    serviceInterest: z.string().trim().max(120).optional(),
    budgetRange: z.string().trim().max(80).optional(),
    status: z.enum(LeadStatus).default(LeadStatus.NEW),
    ownerId: z.string().uuid().optional(),
    followUpAt: z.coerce.date().optional(),
    lostReason: z.string().trim().max(500).optional(),
    disqualifiedReason: z.string().trim().max(500).optional(),
    importBatchId: z.string().trim().max(120).optional(),
    importExternalId: z.string().trim().max(120).optional(),
    importSourceFilename: z.string().trim().max(240).optional(),
    notes: z.string().trim().max(2000).optional(),
  })
  .strict();

export const updateLeadSchema = createLeadSchema.partial().strict();

export const createContactSchema = z
  .object({
    accountId: z.string().uuid().optional(),
    firstName: z.string().trim().min(1).max(80),
    lastName: z.string().trim().min(1).max(80),
    email: z
      .string()
      .trim()
      .email()
      .transform((value) => value.toLowerCase())
      .optional(),
    phone: z.string().trim().max(40).optional(),
    title: z.string().trim().max(120).optional(),
    linkedinUrl: z.string().trim().url().optional(),
    decisionMaker: z.boolean().default(false),
    influenceLevel: z.string().trim().max(40).optional(),
    status: z.enum(ContactStatus).default(ContactStatus.ACTIVE),
    notes: z.string().trim().max(2000).optional(),
  })
  .strict();

export const updateContactSchema = createContactSchema.partial().strict();

export const createOpportunitySchema = z
  .object({
    accountId: z.string().uuid().optional(),
    primaryContactId: z.string().uuid().optional(),
    leadId: z.string().uuid().optional(),
    name: z.string().trim().min(2).max(180),
    stage: z.enum(OpportunityStage).default(OpportunityStage.QUALIFICATION),
    probability: z.coerce.number().int().min(0).max(100).optional(),
    valueCents: z.coerce.number().int().min(0).default(0),
    currency: z
      .string()
      .trim()
      .length(3)
      .transform((value) => value.toUpperCase())
      .default("INR"),
    expectedCloseDate: z.coerce.date().optional(),
    ownerId: z.string().uuid().optional(),
    lostReason: z.string().trim().max(500).optional(),
    notes: z.string().trim().max(2000).optional(),
  })
  .strict();

export const updateOpportunitySchema = createOpportunitySchema.partial().strict();

export const convertLeadSchema = z
  .object({
    accountName: z.string().trim().min(2).max(160).optional(),
    opportunityName: z.string().trim().min(2).max(180).optional(),
    valueCents: z.coerce.number().int().min(0).default(0),
    currency: z
      .string()
      .trim()
      .length(3)
      .transform((value) => value.toUpperCase())
      .default("INR"),
    expectedCloseDate: z.coerce.date().optional(),
    ownerId: z.string().uuid().optional(),
    notes: z.string().trim().max(2000).optional(),
  })
  .strict();

const jsonObjectSchema = z.record(z.string(), z.unknown());

export const createProposalSchema = z
  .object({
    opportunityId: z.string().uuid().optional(),
    accountId: z.string().uuid().optional(),
    contactId: z.string().uuid().optional(),
    title: z.string().trim().min(2).max(180),
    templateKey: z.string().trim().min(2).max(80),
    contentJson: jsonObjectSchema.default({ sections: [] }),
    approvalRole: z.string().trim().max(80).optional(),
    ownerId: z.string().uuid().optional(),
    valueCents: z.coerce.number().int().min(0).default(0),
    currency: z
      .string()
      .trim()
      .length(3)
      .transform((value) => value.toUpperCase())
      .default("INR"),
    notes: z.string().trim().max(2000).optional(),
  })
  .strict();

export const updateProposalSchema = createProposalSchema
  .omit({ contentJson: true })
  .extend({
    status: z.enum(ProposalStatus).optional(),
  })
  .partial()
  .strict();

export const createProposalVersionSchema = z
  .object({
    templateKey: z.string().trim().min(2).max(80).optional(),
    title: z.string().trim().min(2).max(180).optional(),
    contentJson: jsonObjectSchema,
    changeNote: z.string().trim().max(500).optional(),
  })
  .strict();

export const submitProposalSchema = z
  .object({
    approvalRole: z.string().trim().min(2).max(80).default("sales-manager"),
  })
  .strict();

export const decideProposalSchema = z
  .object({
    decision: z.enum(["APPROVED", "REJECTED"]),
    roleKey: z.string().trim().min(2).max(80).optional(),
    comment: z.string().trim().max(500).optional(),
  })
  .strict();

export const createActivitySchema = z
  .object({
    type: z.enum(ActivityType),
    status: z.enum(ActivityStatus).default(ActivityStatus.OPEN),
    title: z.string().trim().min(2).max(180),
    description: z.string().trim().max(2000).optional(),
    ownerId: z.string().uuid().optional(),
    leadId: z.string().uuid().optional(),
    accountId: z.string().uuid().optional(),
    contactId: z.string().uuid().optional(),
    opportunityId: z.string().uuid().optional(),
    proposalId: z.string().uuid().optional(),
    vendorId: z.string().uuid().optional(),
    candidateId: z.string().uuid().optional(),
    candidateRef: z.string().trim().max(120).optional(),
    vendorRef: z.string().trim().max(120).optional(),
    dueAt: z.coerce.date().optional(),
    reminderAt: z.coerce.date().optional(),
  })
  .strict();

export const updateActivitySchema = createActivitySchema.partial().strict();

const scoreSchema = z.coerce.number().int().min(0).max(100);

export const createVendorSchema = z
  .object({
    name: z.string().trim().min(2).max(180),
    website: z.string().trim().url().optional(),
    domain: z.string().trim().min(2).max(120).optional(),
    email: z
      .string()
      .trim()
      .email()
      .transform((value) => value.toLowerCase())
      .optional(),
    phone: z.string().trim().max(40).optional(),
    categories: z.array(z.string().trim().min(1).max(80)).default([]),
    expertiseSkills: z.array(z.string().trim().min(1).max(80)).default([]),
    decisionMakerName: z.string().trim().max(120).optional(),
    decisionMakerTitle: z.string().trim().max(120).optional(),
    decisionMakerEmail: z
      .string()
      .trim()
      .email()
      .transform((value) => value.toLowerCase())
      .optional(),
    decisionMakerPhone: z.string().trim().max(40).optional(),
    city: z.string().trim().max(80).optional(),
    state: z.string().trim().max(80).optional(),
    country: z.string().trim().max(80).optional(),
    timezone: z.string().trim().max(80).optional(),
    companyOwnershipTag: z.string().trim().min(1).max(80),
    ndaStatus: z.enum(VendorDocumentStatus).default(VendorDocumentStatus.NOT_STARTED),
    msaStatus: z.enum(VendorDocumentStatus).default(VendorDocumentStatus.NOT_STARTED),
    rateCard: jsonObjectSchema.optional(),
    tier: z.enum(VendorTier).default(VendorTier.STANDARD),
    status: z.enum(VendorStatus).default(VendorStatus.ONBOARDING),
    riskStatus: z.enum(VendorRiskStatus).default(VendorRiskStatus.CLEAR),
    riskReason: z.string().trim().max(500).optional(),
    deliveryScore: scoreSchema.default(0),
    qualityScore: scoreSchema.default(0),
    responsivenessScore: scoreSchema.default(0),
    complianceScore: scoreSchema.default(0),
    portalEnabled: z.boolean().default(false),
    portalSlug: z.string().trim().min(2).max(100).optional(),
    portalInviteEmail: z
      .string()
      .trim()
      .email()
      .transform((value) => value.toLowerCase())
      .optional(),
    notes: z.string().trim().max(2000).optional(),
  })
  .strict();

export const updateVendorSchema = createVendorSchema.partial().strict();

export const createCandidateSchema = z
  .object({
    vendorId: z.string().uuid().optional(),
    firstName: z.string().trim().min(1).max(80),
    lastName: z.string().trim().min(1).max(80),
    email: z
      .string()
      .trim()
      .email()
      .transform((value) => value.toLowerCase())
      .optional(),
    phone: z.string().trim().max(40).optional(),
    resumeFileName: z.string().trim().max(240).optional(),
    resumeStorageKey: z.string().trim().max(500).optional(),
    resumeMimeType: z.string().trim().max(120).optional(),
    resumeSizeBytes: z.coerce.number().int().min(1).optional(),
    primarySkills: z.array(z.string().trim().min(1).max(80)).default([]),
    secondarySkills: z.array(z.string().trim().min(1).max(80)).default([]),
    experienceYears: z.coerce.number().min(0).max(60).optional(),
    currentCtcCents: z.coerce.number().int().min(0).optional(),
    expectedCtcCents: z.coerce.number().int().min(0).optional(),
    currency: z
      .string()
      .trim()
      .length(3)
      .transform((value) => value.toUpperCase())
      .default("INR"),
    noticePeriodDays: z.coerce.number().int().min(0).max(365).optional(),
    city: z.string().trim().max(80).optional(),
    state: z.string().trim().max(80).optional(),
    country: z.string().trim().max(80).optional(),
    timezone: z.string().trim().max(80).optional(),
    availability: z.enum(CandidateAvailability).default(CandidateAvailability.UNKNOWN),
    availableFrom: z.coerce.date().optional(),
    consentStatus: z.boolean().default(false),
    consentCapturedAt: z.coerce.date().optional(),
    consentSource: z.string().trim().max(120).optional(),
    blacklisted: z.boolean().default(false),
    blacklistReason: z.string().trim().max(500).optional(),
    status: z.enum(CandidateStatus).default(CandidateStatus.ACTIVE),
    parsedResumeJson: jsonObjectSchema.optional(),
    notes: z.string().trim().max(2000).optional(),
  })
  .strict();

export const updateCandidateSchema = createCandidateSchema.partial().strict();

export const createRequirementSchema = z
  .object({
    accountId: z.string().uuid().optional(),
    opportunityId: z.string().uuid().optional(),
    roleTitle: z.string().trim().min(2).max(160),
    skills: z.array(z.string().trim().min(1).max(80)).default([]),
    minExperienceYears: z.coerce.number().min(0).max(60).optional(),
    maxExperienceYears: z.coerce.number().min(0).max(60).optional(),
    budgetMinCents: z.coerce.number().int().min(0).optional(),
    budgetMaxCents: z.coerce.number().int().min(0).optional(),
    currency: z
      .string()
      .trim()
      .length(3)
      .transform((value) => value.toUpperCase())
      .default("INR"),
    location: z.string().trim().max(120).optional(),
    workMode: z.enum(WorkMode).default(WorkMode.REMOTE),
    positions: z.coerce.number().int().min(1).max(500).default(1),
    priority: z.enum(RequirementPriority).default(RequirementPriority.MEDIUM),
    status: z.enum(RequirementStatus).default(RequirementStatus.OPEN),
    notes: z.string().trim().max(2000).optional(),
  })
  .strict();

export const updateRequirementSchema = createRequirementSchema.partial().strict();

export const createSubmissionSchema = z
  .object({
    candidateId: z.string().uuid(),
    vendorId: z.string().uuid().optional(),
    status: z.enum(SubmissionStatus).default(SubmissionStatus.SUBMITTED),
    technicalReviewNotes: z.string().trim().max(2000).optional(),
    clientSubmittedAt: z.coerce.date().optional(),
    interviewScheduledAt: z.coerce.date().optional(),
    interviewPlaceholder: z.string().trim().max(500).optional(),
    feedback: z.string().trim().max(2000).optional(),
    feedbackRating: z.coerce.number().int().min(1).max(5).optional(),
  })
  .strict();

export const updateSubmissionSchema = createSubmissionSchema
  .omit({ candidateId: true })
  .partial()
  .strict();

export const createInterviewSchema = z
  .object({
    submissionId: z.string().uuid(),
    roundNumber: z.coerce.number().int().min(1).max(20),
    interviewer: z.string().trim().min(2).max(160),
    scheduledAt: z.coerce.date(),
    feedback: z.string().trim().max(2000).optional(),
    outcome: z.enum(InterviewOutcome).default(InterviewOutcome.PENDING),
  })
  .strict();

export const updateInterviewSchema = createInterviewSchema
  .omit({ submissionId: true })
  .partial()
  .strict();

export const createPlacementSchema = z
  .object({
    submissionId: z.string().uuid(),
    clientBillingRateCents: z.coerce.number().int().min(0),
    vendorCostCents: z.coerce.number().int().min(0),
    currency: z
      .string()
      .trim()
      .length(3)
      .transform((value) => value.toUpperCase())
      .default("INR"),
    joiningDate: z.coerce.date(),
    replacementPeriodDays: z.coerce.number().int().min(0).max(365).default(0),
    billingStatus: z.enum(PlacementBillingStatus).default(PlacementBillingStatus.NOT_STARTED),
    notes: z.string().trim().max(2000).optional(),
  })
  .strict();

export const updatePlacementSchema = createPlacementSchema
  .omit({ submissionId: true })
  .partial()
  .strict();

export type AccountListQuery = z.infer<typeof accountListQuerySchema>;
export type ContactListQuery = z.infer<typeof contactListQuerySchema>;
export type LeadListQuery = z.infer<typeof leadListQuerySchema>;
export type OpportunityListQuery = z.infer<typeof opportunityListQuerySchema>;
export type ProposalListQuery = z.infer<typeof proposalListQuerySchema>;
export type ActivityListQuery = z.infer<typeof activityListQuerySchema>;
export type VendorListQuery = z.infer<typeof vendorListQuerySchema>;
export type CandidateListQuery = z.infer<typeof candidateListQuerySchema>;
export type RequirementListQuery = z.infer<typeof requirementListQuerySchema>;
export type SubmissionListQuery = z.infer<typeof submissionListQuerySchema>;
export type InterviewListQuery = z.infer<typeof interviewListQuerySchema>;
export type PlacementListQuery = z.infer<typeof placementListQuerySchema>;
export type CreateAccountInput = z.infer<typeof createAccountSchema>;
export type CreateContactInput = z.infer<typeof createContactSchema>;
export type CreateLeadInput = z.infer<typeof createLeadSchema>;
export type CreateOpportunityInput = z.infer<typeof createOpportunitySchema>;
export type ConvertLeadInput = z.infer<typeof convertLeadSchema>;
export type CreateProposalInput = z.infer<typeof createProposalSchema>;
export type CreateProposalVersionInput = z.infer<typeof createProposalVersionSchema>;
export type SubmitProposalInput = z.infer<typeof submitProposalSchema>;
export type DecideProposalInput = z.infer<typeof decideProposalSchema>;
export type CreateActivityInput = z.infer<typeof createActivitySchema>;
export type CreateVendorInput = z.infer<typeof createVendorSchema>;
export type CreateCandidateInput = z.infer<typeof createCandidateSchema>;
export type CreateRequirementInput = z.infer<typeof createRequirementSchema>;
export type CreateSubmissionInput = z.infer<typeof createSubmissionSchema>;
export type CreateInterviewInput = z.infer<typeof createInterviewSchema>;
export type CreatePlacementInput = z.infer<typeof createPlacementSchema>;
export type UpdateAccountInput = z.infer<typeof updateAccountSchema>;
export type UpdateContactInput = z.infer<typeof updateContactSchema>;
export type UpdateLeadInput = z.infer<typeof updateLeadSchema>;
export type UpdateOpportunityInput = z.infer<typeof updateOpportunitySchema>;
export type UpdateProposalInput = z.infer<typeof updateProposalSchema>;
export type UpdateActivityInput = z.infer<typeof updateActivitySchema>;
export type UpdateVendorInput = z.infer<typeof updateVendorSchema>;
export type UpdateCandidateInput = z.infer<typeof updateCandidateSchema>;
export type UpdateRequirementInput = z.infer<typeof updateRequirementSchema>;
export type UpdateSubmissionInput = z.infer<typeof updateSubmissionSchema>;
export type UpdateInterviewInput = z.infer<typeof updateInterviewSchema>;
export type UpdatePlacementInput = z.infer<typeof updatePlacementSchema>;
