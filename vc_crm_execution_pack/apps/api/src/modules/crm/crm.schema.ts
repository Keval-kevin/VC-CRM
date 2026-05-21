import { AccountStatus, ContactStatus, LeadStatus } from "@prisma/client";
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

export type AccountListQuery = z.infer<typeof accountListQuerySchema>;
export type ContactListQuery = z.infer<typeof contactListQuerySchema>;
export type LeadListQuery = z.infer<typeof leadListQuerySchema>;
export type CreateAccountInput = z.infer<typeof createAccountSchema>;
export type CreateContactInput = z.infer<typeof createContactSchema>;
export type CreateLeadInput = z.infer<typeof createLeadSchema>;
export type UpdateAccountInput = z.infer<typeof updateAccountSchema>;
export type UpdateContactInput = z.infer<typeof updateContactSchema>;
export type UpdateLeadInput = z.infer<typeof updateLeadSchema>;
