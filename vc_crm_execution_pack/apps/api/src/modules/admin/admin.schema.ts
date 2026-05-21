import { AIJobStatus, AIJobType, AIProvider, TenantStatus, UserStatus } from "@prisma/client";
import { z } from "zod";

export const updateTenantSettingsSchema = z
  .object({
    companyName: z.string().min(2).max(120),
    timezone: z.string().min(2).max(80),
    locale: z.string().min(2).max(20),
    sessionTimeoutMinutes: z.number().int().min(15).max(14_400),
    passwordMinLength: z.number().int().min(8).max(128),
    requireStrongPassword: z.boolean(),
    ipAllowlist: z.array(z.string().min(1).max(128)).max(50),
  })
  .strict();

export const inviteUserSchema = z
  .object({
    email: z
      .string()
      .email()
      .transform((value) => value.toLowerCase()),
    firstName: z.string().min(1).max(80),
    lastName: z.string().min(1).max(80),
    roleIds: z.array(z.string().uuid()).min(1).max(10),
  })
  .strict();

export const updateUserStatusSchema = z
  .object({
    status: z.enum([UserStatus.ACTIVE, UserStatus.DEACTIVATED]),
  })
  .strict();

export const assignRolesSchema = z
  .object({
    roleIds: z.array(z.string().uuid()).min(1).max(10),
  })
  .strict();

export const updateAiProviderSettingSchema = z
  .object({
    defaultModel: z.string().min(1).max(120),
    enabled: z.boolean(),
    monthlyBudgetCents: z.number().int().min(0).max(100_000_000),
    apiKey: z.string().min(8).max(4096).optional(),
  })
  .strict();

export const parsingJobListQuerySchema = z.object({
  status: z.enum(AIJobStatus).optional(),
  jobType: z.enum(AIJobType).optional(),
  provider: z.enum(AIProvider).optional(),
});

export const createParsingJobSchema = z
  .object({
    provider: z.enum(AIProvider),
    jobType: z.enum(AIJobType),
    sourceEntityType: z.enum(["candidate", "proposal", "vendor"]),
    sourceEntityId: z.string().uuid(),
    sourceDocumentName: z.string().trim().max(240).optional(),
    sourceDocumentUrl: z.string().trim().url().optional(),
  })
  .strict();

export const approveParsingJobSchema = z
  .object({
    approvedDataJson: z.record(z.string(), z.unknown()),
  })
  .strict();

export const rejectParsingJobSchema = z
  .object({
    rejectionReason: z.string().trim().min(2).max(1000),
  })
  .strict();

export const createTenantSchema = z
  .object({
    name: z.string().min(2).max(120),
    slug: z
      .string()
      .min(2)
      .max(80)
      .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/u),
    timezone: z.string().min(2).max(80).default("Asia/Kolkata"),
    locale: z.string().min(2).max(20).default("en-IN"),
  })
  .strict();

export const updateTenantStatusSchema = z
  .object({
    status: z.enum([TenantStatus.ACTIVE, TenantStatus.SUSPENDED, TenantStatus.ARCHIVED]),
  })
  .strict();

export type AssignRolesInput = z.infer<typeof assignRolesSchema>;
export type CreateTenantInput = z.infer<typeof createTenantSchema>;
export type InviteUserInput = z.infer<typeof inviteUserSchema>;
export type ApproveParsingJobInput = z.infer<typeof approveParsingJobSchema>;
export type CreateParsingJobInput = z.infer<typeof createParsingJobSchema>;
export type ParsingJobListQuery = z.infer<typeof parsingJobListQuerySchema>;
export type RejectParsingJobInput = z.infer<typeof rejectParsingJobSchema>;
export type UpdateAiProviderSettingInput = z.infer<typeof updateAiProviderSettingSchema>;
export type UpdateTenantSettingsInput = z.infer<typeof updateTenantSettingsSchema>;
export type UpdateTenantStatusInput = z.infer<typeof updateTenantStatusSchema>;
export type UpdateUserStatusInput = z.infer<typeof updateUserStatusSchema>;
