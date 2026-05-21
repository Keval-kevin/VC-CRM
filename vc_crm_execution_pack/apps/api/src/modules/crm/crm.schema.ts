import {
  AccountStatus,
  ActivityStatus,
  ActivityType,
  ContactStatus,
  LeadStatus,
  OpportunityStage,
  ProposalStatus,
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
  ownerId: z.string().uuid().optional(),
  type: z.enum(ActivityType).optional(),
  status: z.enum(ActivityStatus).optional(),
  overdueOnly: z.coerce.boolean().optional(),
  dueFrom: z.coerce.date().optional(),
  dueTo: z.coerce.date().optional(),
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
    candidateRef: z.string().trim().max(120).optional(),
    vendorRef: z.string().trim().max(120).optional(),
    dueAt: z.coerce.date().optional(),
    reminderAt: z.coerce.date().optional(),
  })
  .strict();

export const updateActivitySchema = createActivitySchema.partial().strict();

export type AccountListQuery = z.infer<typeof accountListQuerySchema>;
export type ContactListQuery = z.infer<typeof contactListQuerySchema>;
export type LeadListQuery = z.infer<typeof leadListQuerySchema>;
export type OpportunityListQuery = z.infer<typeof opportunityListQuerySchema>;
export type ProposalListQuery = z.infer<typeof proposalListQuerySchema>;
export type ActivityListQuery = z.infer<typeof activityListQuerySchema>;
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
export type UpdateAccountInput = z.infer<typeof updateAccountSchema>;
export type UpdateContactInput = z.infer<typeof updateContactSchema>;
export type UpdateLeadInput = z.infer<typeof updateLeadSchema>;
export type UpdateOpportunityInput = z.infer<typeof updateOpportunitySchema>;
export type UpdateProposalInput = z.infer<typeof updateProposalSchema>;
export type UpdateActivityInput = z.infer<typeof updateActivitySchema>;
