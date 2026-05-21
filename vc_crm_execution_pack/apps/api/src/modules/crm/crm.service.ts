import {
  AccountStatus,
  ActivityStatus,
  LeadStatus,
  OpportunityStage,
  Prisma,
  ProposalApprovalStatus,
  ProposalStatus,
  SubmissionStatus,
  VendorRiskStatus,
} from "@prisma/client";

import { AppError } from "../../shared/errors/app-error.js";
import { prisma } from "../../shared/prisma/client.js";
import type {
  AccountListQuery,
  ActivityListQuery,
  ContactListQuery,
  CreateActivityInput,
  CreateAccountInput,
  CreateCandidateInput,
  CreateContactInput,
  CreateInterviewInput,
  CreateLeadInput,
  CreateOpportunityInput,
  CreateProposalInput,
  CreateProposalVersionInput,
  CreatePlacementInput,
  CreateRequirementInput,
  CreateSubmissionInput,
  CreateVendorInput,
  ConvertLeadInput,
  DecideProposalInput,
  CandidateListQuery,
  InterviewListQuery,
  LeadListQuery,
  OpportunityListQuery,
  PlacementListQuery,
  ProposalListQuery,
  RequirementListQuery,
  SubmitProposalInput,
  SubmissionListQuery,
  UpdateActivityInput,
  UpdateAccountInput,
  UpdateCandidateInput,
  UpdateContactInput,
  UpdateInterviewInput,
  UpdateLeadInput,
  UpdateOpportunityInput,
  UpdateProposalInput,
  UpdatePlacementInput,
  UpdateRequirementInput,
  UpdateSubmissionInput,
  UpdateVendorInput,
  VendorListQuery,
} from "./crm.schema.js";
import type { CrmActor, CrmRequestContext, PaginatedResult } from "./crm.types.js";

const accountSelect = {
  id: true,
  tenantId: true,
  name: true,
  website: true,
  domain: true,
  industry: true,
  phone: true,
  city: true,
  country: true,
  status: true,
  notes: true,
  createdAt: true,
  updatedAt: true,
  contacts: {
    where: { deletedAt: null },
    select: {
      id: true,
      firstName: true,
      lastName: true,
      email: true,
      title: true,
      status: true,
    },
    orderBy: { createdAt: Prisma.SortOrder.desc },
    take: 10,
  },
  activities: {
    where: { deletedAt: null },
    select: {
      id: true,
      type: true,
      title: true,
      description: true,
      occurredAt: true,
    },
    orderBy: { occurredAt: Prisma.SortOrder.desc },
    take: 10,
  },
} satisfies Prisma.AccountSelect;

const contactSelect = {
  id: true,
  tenantId: true,
  accountId: true,
  firstName: true,
  lastName: true,
  email: true,
  phone: true,
  title: true,
  linkedinUrl: true,
  decisionMaker: true,
  influenceLevel: true,
  status: true,
  notes: true,
  createdAt: true,
  updatedAt: true,
  account: {
    select: {
      id: true,
      name: true,
      domain: true,
    },
  },
  activities: {
    where: { deletedAt: null },
    select: {
      id: true,
      type: true,
      title: true,
      description: true,
      occurredAt: true,
    },
    orderBy: { occurredAt: Prisma.SortOrder.desc },
    take: 10,
  },
} satisfies Prisma.ContactSelect;

const leadSelect = {
  id: true,
  tenantId: true,
  firstName: true,
  lastName: true,
  email: true,
  phone: true,
  company: true,
  website: true,
  companyDomain: true,
  linkedinUrl: true,
  country: true,
  source: true,
  serviceInterest: true,
  budgetRange: true,
  status: true,
  score: true,
  scoreReason: true,
  ownerId: true,
  followUpAt: true,
  lostReason: true,
  disqualifiedReason: true,
  importBatchId: true,
  importExternalId: true,
  importSourceFilename: true,
  notes: true,
  createdAt: true,
  updatedAt: true,
  activities: {
    where: { deletedAt: null },
    select: {
      id: true,
      type: true,
      title: true,
      description: true,
      occurredAt: true,
    },
    orderBy: { occurredAt: Prisma.SortOrder.desc },
    take: 10,
  },
} satisfies Prisma.LeadSelect;

const opportunitySelect = {
  id: true,
  tenantId: true,
  accountId: true,
  primaryContactId: true,
  leadId: true,
  name: true,
  stage: true,
  probability: true,
  valueCents: true,
  currency: true,
  expectedCloseDate: true,
  weightedForecastCents: true,
  ownerId: true,
  stageChangedAt: true,
  wonAt: true,
  lostAt: true,
  lostReason: true,
  notes: true,
  createdAt: true,
  updatedAt: true,
  account: {
    select: {
      id: true,
      name: true,
      domain: true,
    },
  },
  primaryContact: {
    select: {
      id: true,
      firstName: true,
      lastName: true,
      email: true,
    },
  },
  lead: {
    select: {
      id: true,
      firstName: true,
      lastName: true,
      source: true,
    },
  },
  activities: {
    where: { deletedAt: null },
    select: {
      id: true,
      type: true,
      title: true,
      description: true,
      occurredAt: true,
    },
    orderBy: { occurredAt: Prisma.SortOrder.desc },
    take: 10,
  },
  stageHistory: {
    where: { deletedAt: null },
    select: {
      id: true,
      fromStage: true,
      toStage: true,
      changedAt: true,
      note: true,
    },
    orderBy: { changedAt: Prisma.SortOrder.desc },
    take: 10,
  },
} satisfies Prisma.OpportunitySelect;

const proposalSelect = {
  id: true,
  tenantId: true,
  opportunityId: true,
  accountId: true,
  contactId: true,
  title: true,
  templateKey: true,
  status: true,
  currentVersionNumber: true,
  approvalRole: true,
  ownerId: true,
  valueCents: true,
  currency: true,
  submittedAt: true,
  approvedAt: true,
  rejectedAt: true,
  sentAt: true,
  wonAt: true,
  lostAt: true,
  pdfExportRequestedAt: true,
  notes: true,
  createdAt: true,
  updatedAt: true,
  opportunity: { select: { id: true, name: true, stage: true } },
  account: { select: { id: true, name: true, domain: true } },
  contact: { select: { id: true, firstName: true, lastName: true, email: true } },
  versions: {
    where: { deletedAt: null },
    select: {
      id: true,
      versionNumber: true,
      templateKey: true,
      title: true,
      contentJson: true,
      changeNote: true,
      createdAt: true,
    },
    orderBy: { versionNumber: Prisma.SortOrder.desc },
    take: 5,
  },
  approvals: {
    where: { deletedAt: null },
    select: {
      id: true,
      roleKey: true,
      status: true,
      approverUserId: true,
      decidedAt: true,
      comment: true,
      createdAt: true,
    },
    orderBy: { createdAt: Prisma.SortOrder.desc },
    take: 5,
  },
} satisfies Prisma.ProposalSelect;

const crmActivitySelect = {
  id: true,
  tenantId: true,
  type: true,
  status: true,
  title: true,
  description: true,
  ownerId: true,
  leadId: true,
  accountId: true,
  contactId: true,
  opportunityId: true,
  proposalId: true,
  candidateRef: true,
  candidateId: true,
  vendorRef: true,
  vendorId: true,
  dueAt: true,
  reminderAt: true,
  completedAt: true,
  createdAt: true,
  updatedAt: true,
  lead: { select: { id: true, firstName: true, lastName: true } },
  account: { select: { id: true, name: true } },
  contact: { select: { id: true, firstName: true, lastName: true } },
  opportunity: { select: { id: true, name: true } },
  proposal: { select: { id: true, title: true, status: true } },
  vendor: { select: { id: true, name: true, tier: true, riskStatus: true } },
  candidate: { select: { id: true, firstName: true, lastName: true, email: true } },
} satisfies Prisma.CrmActivitySelect;

const vendorSelect = {
  id: true,
  tenantId: true,
  name: true,
  website: true,
  domain: true,
  email: true,
  phone: true,
  categories: true,
  expertiseSkills: true,
  decisionMakerName: true,
  decisionMakerTitle: true,
  decisionMakerEmail: true,
  decisionMakerPhone: true,
  city: true,
  state: true,
  country: true,
  timezone: true,
  companyOwnershipTag: true,
  ndaStatus: true,
  msaStatus: true,
  rateCard: true,
  tier: true,
  status: true,
  riskStatus: true,
  riskReason: true,
  deliveryScore: true,
  qualityScore: true,
  responsivenessScore: true,
  complianceScore: true,
  overallScore: true,
  portalEnabled: true,
  portalSlug: true,
  portalInviteEmail: true,
  portalLastLoginAt: true,
  notes: true,
  createdAt: true,
  updatedAt: true,
  crmActivities: {
    where: { deletedAt: null },
    select: {
      id: true,
      type: true,
      status: true,
      title: true,
      dueAt: true,
      reminderAt: true,
    },
    orderBy: { createdAt: Prisma.SortOrder.desc },
    take: 10,
  },
} satisfies Prisma.VendorSelect;

const candidateSelect = {
  id: true,
  tenantId: true,
  vendorId: true,
  firstName: true,
  lastName: true,
  email: true,
  phone: true,
  resumeFileName: true,
  resumeStorageKey: true,
  resumeMimeType: true,
  resumeSizeBytes: true,
  resumeUploadedAt: true,
  primarySkills: true,
  secondarySkills: true,
  experienceYears: true,
  currentCtcCents: true,
  expectedCtcCents: true,
  currency: true,
  noticePeriodDays: true,
  city: true,
  state: true,
  country: true,
  timezone: true,
  availability: true,
  availableFrom: true,
  consentStatus: true,
  consentCapturedAt: true,
  consentSource: true,
  blacklisted: true,
  blacklistReason: true,
  status: true,
  resumeParsed: true,
  resumeParseStatus: true,
  parsedResumeJson: true,
  notes: true,
  createdAt: true,
  updatedAt: true,
  vendor: { select: { id: true, name: true, tier: true, riskStatus: true } },
  crmActivities: {
    where: { deletedAt: null },
    select: {
      id: true,
      type: true,
      status: true,
      title: true,
      dueAt: true,
      reminderAt: true,
    },
    orderBy: { createdAt: Prisma.SortOrder.desc },
    take: 10,
  },
} satisfies Prisma.CandidateSelect;

const requirementSelect = {
  id: true,
  tenantId: true,
  accountId: true,
  opportunityId: true,
  roleTitle: true,
  skills: true,
  minExperienceYears: true,
  maxExperienceYears: true,
  budgetMinCents: true,
  budgetMaxCents: true,
  currency: true,
  location: true,
  workMode: true,
  positions: true,
  priority: true,
  status: true,
  notes: true,
  createdAt: true,
  updatedAt: true,
  account: { select: { id: true, name: true, domain: true } },
  opportunity: { select: { id: true, name: true, stage: true } },
  submissions: {
    where: { deletedAt: null },
    select: {
      id: true,
      status: true,
      submittedAt: true,
      candidate: { select: { id: true, firstName: true, lastName: true, email: true } },
      vendor: { select: { id: true, name: true } },
    },
    orderBy: { submittedAt: Prisma.SortOrder.desc },
    take: 10,
  },
} satisfies Prisma.StaffAugRequirementSelect;

const submissionSelect = {
  id: true,
  tenantId: true,
  requirementId: true,
  candidateId: true,
  vendorId: true,
  status: true,
  technicalReviewNotes: true,
  technicalReviewedAt: true,
  clientSubmittedAt: true,
  interviewScheduledAt: true,
  interviewPlaceholder: true,
  feedback: true,
  feedbackRating: true,
  submittedAt: true,
  createdAt: true,
  updatedAt: true,
  requirement: {
    select: {
      id: true,
      roleTitle: true,
      skills: true,
      priority: true,
      status: true,
    },
  },
  candidate: {
    select: {
      id: true,
      firstName: true,
      lastName: true,
      email: true,
      primarySkills: true,
      availability: true,
    },
  },
  vendor: { select: { id: true, name: true, tier: true } },
} satisfies Prisma.CandidateSubmissionSelect;

const interviewSelect = {
  id: true,
  tenantId: true,
  submissionId: true,
  candidateId: true,
  requirementId: true,
  roundNumber: true,
  interviewer: true,
  scheduledAt: true,
  feedback: true,
  outcome: true,
  createdAt: true,
  updatedAt: true,
  submission: { select: { id: true, status: true } },
  candidate: { select: { id: true, firstName: true, lastName: true, email: true } },
  requirement: { select: { id: true, roleTitle: true } },
} satisfies Prisma.InterviewSelect;

const placementSelect = {
  id: true,
  tenantId: true,
  submissionId: true,
  candidateId: true,
  requirementId: true,
  vendorId: true,
  clientBillingRateCents: true,
  vendorCostCents: true,
  marginCents: true,
  marginPercentBasis: true,
  currency: true,
  joiningDate: true,
  replacementPeriodDays: true,
  billingStatus: true,
  notes: true,
  createdAt: true,
  updatedAt: true,
  submission: { select: { id: true, status: true } },
  candidate: { select: { id: true, firstName: true, lastName: true, email: true } },
  requirement: { select: { id: true, roleTitle: true } },
  vendor: { select: { id: true, name: true, tier: true } },
} satisfies Prisma.PlacementSelect;

export async function listVendors(
  actor: CrmActor,
  query: VendorListQuery,
): Promise<PaginatedResult<unknown>> {
  const tenantId = requireTenant(actor);
  const where: Prisma.VendorWhereInput = {
    tenantId,
    deletedAt: null,
    ...(query.status === undefined ? {} : { status: query.status }),
    ...(query.tier === undefined ? {} : { tier: query.tier }),
    ...(query.riskStatus === undefined ? {} : { riskStatus: query.riskStatus }),
    ...(query.ndaStatus === undefined ? {} : { ndaStatus: query.ndaStatus }),
    ...(query.msaStatus === undefined ? {} : { msaStatus: query.msaStatus }),
    ...(query.country === undefined
      ? {}
      : { country: { contains: query.country, mode: "insensitive" } }),
    ...(query.companyOwnershipTag === undefined
      ? {}
      : { companyOwnershipTag: { equals: query.companyOwnershipTag, mode: "insensitive" } }),
    ...(query.category === undefined ? {} : { categories: { has: query.category } }),
    ...(query.skill === undefined ? {} : { expertiseSkills: { has: query.skill } }),
    ...(query.search === undefined
      ? {}
      : {
          OR: [
            { name: { contains: query.search, mode: "insensitive" } },
            { domain: { contains: query.search, mode: "insensitive" } },
            { email: { contains: query.search, mode: "insensitive" } },
            { decisionMakerName: { contains: query.search, mode: "insensitive" } },
          ],
        }),
  };
  const [items, total] = await prisma.$transaction([
    prisma.vendor.findMany({
      where,
      orderBy: getVendorOrderBy(query),
      skip: (query.page - 1) * query.pageSize,
      take: query.pageSize,
      select: vendorSelect,
    }),
    prisma.vendor.count({ where }),
  ]);

  return toPaginatedResult(items, total, query.page, query.pageSize);
}

export async function getVendor(actor: CrmActor, vendorId: string): Promise<unknown> {
  const tenantId = requireTenant(actor);
  const vendor = await prisma.vendor.findFirst({
    where: { id: vendorId, tenantId, deletedAt: null },
    select: vendorSelect,
  });

  if (vendor === null) {
    throw new AppError("NOT_FOUND", "Vendor not found", 404);
  }

  return vendor;
}

export async function createVendor(
  actor: CrmActor,
  context: CrmRequestContext,
  input: CreateVendorInput,
): Promise<unknown> {
  const tenantId = requireTenant(actor);
  await assertNoDuplicateVendor(tenantId, input);
  validateVendorRisk(input.riskStatus, input.riskReason);
  const vendor = await prisma.vendor.create({
    data: {
      tenantId,
      ...input,
      domain: normalizeDomain(input.domain ?? input.website),
      rateCard: input.rateCard as Prisma.InputJsonValue | undefined,
      overallScore: calculateVendorScore(input),
      createdById: actor.sub,
    },
    select: vendorSelect,
  });

  await createAuditLog(actor, context, {
    action: "vendors.created",
    entityType: "vendor",
    entityId: getRecordId(vendor),
    tenantId,
    metadata: { tier: input.tier, riskStatus: input.riskStatus },
  });

  return vendor;
}

export async function updateVendor(
  actor: CrmActor,
  context: CrmRequestContext,
  vendorId: string,
  input: UpdateVendorInput,
): Promise<unknown> {
  const tenantId = requireTenant(actor);
  const existing = await assertVendorExists(tenantId, vendorId);
  await assertNoDuplicateVendor(tenantId, input, vendorId);
  validateVendorRisk(
    input.riskStatus ?? existing.riskStatus,
    input.riskReason ?? existing.riskReason ?? undefined,
  );
  const { rateCard, ...vendorInput } = input;
  const vendor = await prisma.vendor.update({
    where: { id: vendorId },
    data: {
      ...vendorInput,
      ...(input.domain !== undefined || input.website !== undefined
        ? { domain: normalizeDomain(input.domain ?? input.website) }
        : {}),
      ...(rateCard === undefined ? {} : { rateCard: rateCard as Prisma.InputJsonValue }),
      overallScore: calculateVendorScore({
        deliveryScore: input.deliveryScore ?? existing.deliveryScore,
        qualityScore: input.qualityScore ?? existing.qualityScore,
        responsivenessScore: input.responsivenessScore ?? existing.responsivenessScore,
        complianceScore: input.complianceScore ?? existing.complianceScore,
      }),
      updatedById: actor.sub,
    },
    select: vendorSelect,
  });

  await createAuditLog(actor, context, {
    action: "vendors.updated",
    entityType: "vendor",
    entityId: vendorId,
    tenantId,
    metadata: input as Record<string, unknown>,
  });

  return vendor;
}

export async function deleteVendor(
  actor: CrmActor,
  context: CrmRequestContext,
  vendorId: string,
): Promise<{ deleted: true }> {
  const tenantId = requireTenant(actor);
  await assertVendorExists(tenantId, vendorId);
  await prisma.vendor.update({
    where: { id: vendorId },
    data: { deletedAt: new Date(), deletedById: actor.sub },
  });
  await createAuditLog(actor, context, {
    action: "vendors.deleted",
    entityType: "vendor",
    entityId: vendorId,
    tenantId,
  });

  return { deleted: true };
}

export async function listCandidates(
  actor: CrmActor,
  query: CandidateListQuery,
): Promise<PaginatedResult<unknown>> {
  const tenantId = requireTenant(actor);
  const where: Prisma.CandidateWhereInput = {
    tenantId,
    deletedAt: null,
    ...(query.vendorId === undefined ? {} : { vendorId: query.vendorId }),
    ...(query.status === undefined ? {} : { status: query.status }),
    ...(query.availability === undefined ? {} : { availability: query.availability }),
    ...(query.blacklisted === undefined ? {} : { blacklisted: query.blacklisted }),
    ...(query.primarySkill === undefined ? {} : { primarySkills: { has: query.primarySkill } }),
    ...(query.secondarySkill === undefined
      ? {}
      : { secondarySkills: { has: query.secondarySkill } }),
    ...(query.country === undefined
      ? {}
      : { country: { contains: query.country, mode: "insensitive" } }),
    ...(query.city === undefined ? {} : { city: { contains: query.city, mode: "insensitive" } }),
    ...(query.search === undefined
      ? {}
      : {
          OR: [
            { firstName: { contains: query.search, mode: "insensitive" } },
            { lastName: { contains: query.search, mode: "insensitive" } },
            { email: { contains: query.search, mode: "insensitive" } },
            { phone: { contains: query.search, mode: "insensitive" } },
            { vendor: { name: { contains: query.search, mode: "insensitive" } } },
          ],
        }),
  };
  const [items, total] = await prisma.$transaction([
    prisma.candidate.findMany({
      where,
      orderBy: getCandidateOrderBy(query),
      skip: (query.page - 1) * query.pageSize,
      take: query.pageSize,
      select: candidateSelect,
    }),
    prisma.candidate.count({ where }),
  ]);

  return toPaginatedResult(items, total, query.page, query.pageSize);
}

export async function getCandidate(actor: CrmActor, candidateId: string): Promise<unknown> {
  const tenantId = requireTenant(actor);
  const candidate = await prisma.candidate.findFirst({
    where: { id: candidateId, tenantId, deletedAt: null },
    select: candidateSelect,
  });

  if (candidate === null) {
    throw new AppError("NOT_FOUND", "Candidate not found", 404);
  }

  return candidate;
}

export async function createCandidate(
  actor: CrmActor,
  context: CrmRequestContext,
  input: CreateCandidateInput,
): Promise<unknown> {
  const tenantId = requireTenant(actor);
  await assertCandidateVendorBelongsToTenant(tenantId, input.vendorId);
  await assertNoDuplicateCandidate(tenantId, input);
  validateCandidateBlacklist(input.blacklisted, input.blacklistReason);
  const { parsedResumeJson, ...candidateInput } = input;
  const resumeFields = buildCandidateResumeFields(input);
  const consentCapturedAt = getCandidateConsentCapturedAt(input);
  const candidate = await prisma.candidate.create({
    data: {
      tenantId,
      ...candidateInput,
      ...resumeFields,
      ...(consentCapturedAt === undefined ? {} : { consentCapturedAt }),
      ...(parsedResumeJson === undefined
        ? {}
        : {
            resumeParsed: true,
            resumeParseStatus: "REVIEW_READY",
            parsedResumeJson: parsedResumeJson as Prisma.InputJsonValue,
          }),
      createdById: actor.sub,
    },
    select: candidateSelect,
  });

  await createAuditLog(actor, context, {
    action: "candidates.created",
    entityType: "candidate",
    entityId: getRecordId(candidate),
    tenantId,
    metadata: { availability: input.availability, vendorId: input.vendorId },
  });

  return candidate;
}

export async function updateCandidate(
  actor: CrmActor,
  context: CrmRequestContext,
  candidateId: string,
  input: UpdateCandidateInput,
): Promise<unknown> {
  const tenantId = requireTenant(actor);
  const existing = await assertCandidateExists(tenantId, candidateId);
  await assertCandidateVendorBelongsToTenant(tenantId, input.vendorId);
  await assertNoDuplicateCandidate(tenantId, input, candidateId);
  validateCandidateBlacklist(
    input.blacklisted ?? existing.blacklisted,
    input.blacklistReason ?? existing.blacklistReason ?? undefined,
  );
  const { parsedResumeJson, ...candidateInput } = input;
  const resumeFields = buildCandidateResumeFields(input);
  const consentCapturedAt = getCandidateConsentCapturedAt(input, existing.consentCapturedAt);
  const candidate = await prisma.candidate.update({
    where: { id: candidateId },
    data: {
      ...candidateInput,
      ...resumeFields,
      ...(consentCapturedAt === undefined ? {} : { consentCapturedAt }),
      ...(parsedResumeJson === undefined
        ? {}
        : {
            resumeParsed: true,
            resumeParseStatus: "REVIEW_READY",
            parsedResumeJson: parsedResumeJson as Prisma.InputJsonValue,
          }),
      updatedById: actor.sub,
    },
    select: candidateSelect,
  });

  await createAuditLog(actor, context, {
    action: "candidates.updated",
    entityType: "candidate",
    entityId: candidateId,
    tenantId,
    metadata: input as Record<string, unknown>,
  });

  return candidate;
}

export async function deleteCandidate(
  actor: CrmActor,
  context: CrmRequestContext,
  candidateId: string,
): Promise<{ deleted: true }> {
  const tenantId = requireTenant(actor);
  await assertCandidateExists(tenantId, candidateId);
  await prisma.candidate.update({
    where: { id: candidateId },
    data: { deletedAt: new Date(), deletedById: actor.sub },
  });
  await createAuditLog(actor, context, {
    action: "candidates.deleted",
    entityType: "candidate",
    entityId: candidateId,
    tenantId,
  });

  return { deleted: true };
}

export async function listRequirements(
  actor: CrmActor,
  query: RequirementListQuery,
): Promise<PaginatedResult<unknown>> {
  const tenantId = requireTenant(actor);
  const where: Prisma.StaffAugRequirementWhereInput = {
    tenantId,
    deletedAt: null,
    ...(query.accountId === undefined ? {} : { accountId: query.accountId }),
    ...(query.opportunityId === undefined ? {} : { opportunityId: query.opportunityId }),
    ...(query.status === undefined ? {} : { status: query.status }),
    ...(query.priority === undefined ? {} : { priority: query.priority }),
    ...(query.workMode === undefined ? {} : { workMode: query.workMode }),
    ...(query.skill === undefined ? {} : { skills: { has: query.skill } }),
    ...(query.location === undefined
      ? {}
      : { location: { contains: query.location, mode: "insensitive" } }),
    ...(query.search === undefined
      ? {}
      : {
          OR: [
            { roleTitle: { contains: query.search, mode: "insensitive" } },
            { location: { contains: query.search, mode: "insensitive" } },
            { account: { name: { contains: query.search, mode: "insensitive" } } },
            { opportunity: { name: { contains: query.search, mode: "insensitive" } } },
          ],
        }),
  };
  const [items, total] = await prisma.$transaction([
    prisma.staffAugRequirement.findMany({
      where,
      orderBy: getRequirementOrderBy(query),
      skip: (query.page - 1) * query.pageSize,
      take: query.pageSize,
      select: requirementSelect,
    }),
    prisma.staffAugRequirement.count({ where }),
  ]);

  return toPaginatedResult(items, total, query.page, query.pageSize);
}

export async function getRequirement(actor: CrmActor, requirementId: string): Promise<unknown> {
  const tenantId = requireTenant(actor);
  const requirement = await prisma.staffAugRequirement.findFirst({
    where: { id: requirementId, tenantId, deletedAt: null },
    select: requirementSelect,
  });

  if (requirement === null) {
    throw new AppError("NOT_FOUND", "Requirement not found", 404);
  }

  return requirement;
}

export async function createRequirement(
  actor: CrmActor,
  context: CrmRequestContext,
  input: CreateRequirementInput,
): Promise<unknown> {
  const tenantId = requireTenant(actor);
  await assertRequirementRelationsBelongToTenant(tenantId, input);
  validateRequirementRanges(input);
  const requirement = await prisma.staffAugRequirement.create({
    data: { tenantId, ...input, createdById: actor.sub },
    select: requirementSelect,
  });

  await createAuditLog(actor, context, {
    action: "requirements.created",
    entityType: "requirement",
    entityId: getRecordId(requirement),
    tenantId,
    metadata: { roleTitle: input.roleTitle, positions: input.positions },
  });

  return requirement;
}

export async function updateRequirement(
  actor: CrmActor,
  context: CrmRequestContext,
  requirementId: string,
  input: UpdateRequirementInput,
): Promise<unknown> {
  const tenantId = requireTenant(actor);
  const existing = await assertRequirementExists(tenantId, requirementId);
  await assertRequirementRelationsBelongToTenant(tenantId, input);
  validateRequirementRanges({
    minExperienceYears: input.minExperienceYears ?? existing.minExperienceYears ?? undefined,
    maxExperienceYears: input.maxExperienceYears ?? existing.maxExperienceYears ?? undefined,
    budgetMinCents: input.budgetMinCents ?? existing.budgetMinCents ?? undefined,
    budgetMaxCents: input.budgetMaxCents ?? existing.budgetMaxCents ?? undefined,
  });
  const requirement = await prisma.staffAugRequirement.update({
    where: { id: requirementId },
    data: { ...input, updatedById: actor.sub },
    select: requirementSelect,
  });

  await createAuditLog(actor, context, {
    action: "requirements.updated",
    entityType: "requirement",
    entityId: requirementId,
    tenantId,
    metadata: input as Record<string, unknown>,
  });

  return requirement;
}

export async function deleteRequirement(
  actor: CrmActor,
  context: CrmRequestContext,
  requirementId: string,
): Promise<{ deleted: true }> {
  const tenantId = requireTenant(actor);
  await assertRequirementExists(tenantId, requirementId);
  await prisma.staffAugRequirement.update({
    where: { id: requirementId },
    data: { deletedAt: new Date(), deletedById: actor.sub },
  });
  await createAuditLog(actor, context, {
    action: "requirements.deleted",
    entityType: "requirement",
    entityId: requirementId,
    tenantId,
  });

  return { deleted: true };
}

export async function listSubmissions(
  actor: CrmActor,
  query: SubmissionListQuery,
): Promise<PaginatedResult<unknown>> {
  const tenantId = requireTenant(actor);
  const where: Prisma.CandidateSubmissionWhereInput = {
    tenantId,
    deletedAt: null,
    ...(query.requirementId === undefined ? {} : { requirementId: query.requirementId }),
    ...(query.candidateId === undefined ? {} : { candidateId: query.candidateId }),
    ...(query.vendorId === undefined ? {} : { vendorId: query.vendorId }),
    ...(query.status === undefined ? {} : { status: query.status }),
    ...(query.search === undefined
      ? {}
      : {
          OR: [
            { requirement: { roleTitle: { contains: query.search, mode: "insensitive" } } },
            { candidate: { firstName: { contains: query.search, mode: "insensitive" } } },
            { candidate: { lastName: { contains: query.search, mode: "insensitive" } } },
            { vendor: { name: { contains: query.search, mode: "insensitive" } } },
          ],
        }),
  };
  const [items, total] = await prisma.$transaction([
    prisma.candidateSubmission.findMany({
      where,
      orderBy: getSubmissionOrderBy(query),
      skip: (query.page - 1) * query.pageSize,
      take: query.pageSize,
      select: submissionSelect,
    }),
    prisma.candidateSubmission.count({ where }),
  ]);

  return toPaginatedResult(items, total, query.page, query.pageSize);
}

export async function getSubmission(actor: CrmActor, submissionId: string): Promise<unknown> {
  const tenantId = requireTenant(actor);
  const submission = await prisma.candidateSubmission.findFirst({
    where: { id: submissionId, tenantId, deletedAt: null },
    select: submissionSelect,
  });

  if (submission === null) {
    throw new AppError("NOT_FOUND", "Submission not found", 404);
  }

  return submission;
}

export async function submitCandidateToRequirement(
  actor: CrmActor,
  context: CrmRequestContext,
  requirementId: string,
  input: CreateSubmissionInput,
): Promise<unknown> {
  const tenantId = requireTenant(actor);
  await assertRequirementExists(tenantId, requirementId);
  const candidate = await assertCandidateSubmissionRelations(tenantId, input);
  await assertNoDuplicateSubmission(tenantId, requirementId, input.candidateId);
  const submission = await prisma.candidateSubmission.create({
    data: {
      tenantId,
      requirementId,
      ...normalizeSubmissionLifecycle(input),
      vendorId: input.vendorId ?? candidate.vendorId,
      createdById: actor.sub,
    },
    select: submissionSelect,
  });

  await createAuditLog(actor, context, {
    action: "submissions.created",
    entityType: "candidate_submission",
    entityId: getRecordId(submission),
    tenantId,
    metadata: { requirementId, candidateId: input.candidateId, status: input.status },
  });

  return submission;
}

export async function updateSubmission(
  actor: CrmActor,
  context: CrmRequestContext,
  submissionId: string,
  input: UpdateSubmissionInput,
): Promise<unknown> {
  const tenantId = requireTenant(actor);
  await assertSubmissionExists(tenantId, submissionId);
  await assertSubmissionVendorBelongsToTenant(tenantId, input.vendorId);
  const submission = await prisma.candidateSubmission.update({
    where: { id: submissionId },
    data: { ...normalizeSubmissionLifecycle(input), updatedById: actor.sub },
    select: submissionSelect,
  });

  await createAuditLog(actor, context, {
    action: "submissions.updated",
    entityType: "candidate_submission",
    entityId: submissionId,
    tenantId,
    metadata: input as Record<string, unknown>,
  });

  return submission;
}

export async function deleteSubmission(
  actor: CrmActor,
  context: CrmRequestContext,
  submissionId: string,
): Promise<{ deleted: true }> {
  const tenantId = requireTenant(actor);
  await assertSubmissionExists(tenantId, submissionId);
  await prisma.candidateSubmission.update({
    where: { id: submissionId },
    data: { deletedAt: new Date(), deletedById: actor.sub },
  });
  await createAuditLog(actor, context, {
    action: "submissions.deleted",
    entityType: "candidate_submission",
    entityId: submissionId,
    tenantId,
  });

  return { deleted: true };
}

export async function listInterviews(
  actor: CrmActor,
  query: InterviewListQuery,
): Promise<PaginatedResult<unknown>> {
  const tenantId = requireTenant(actor);
  const where: Prisma.InterviewWhereInput = {
    tenantId,
    deletedAt: null,
    ...(query.submissionId === undefined ? {} : { submissionId: query.submissionId }),
    ...(query.candidateId === undefined ? {} : { candidateId: query.candidateId }),
    ...(query.requirementId === undefined ? {} : { requirementId: query.requirementId }),
    ...(query.outcome === undefined ? {} : { outcome: query.outcome }),
    ...(query.scheduledFrom === undefined && query.scheduledTo === undefined
      ? {}
      : {
          scheduledAt: {
            ...(query.scheduledFrom === undefined ? {} : { gte: query.scheduledFrom }),
            ...(query.scheduledTo === undefined ? {} : { lte: query.scheduledTo }),
          },
        }),
    ...(query.search === undefined
      ? {}
      : {
          OR: [
            { interviewer: { contains: query.search, mode: "insensitive" } },
            { candidate: { firstName: { contains: query.search, mode: "insensitive" } } },
            { candidate: { lastName: { contains: query.search, mode: "insensitive" } } },
            { requirement: { roleTitle: { contains: query.search, mode: "insensitive" } } },
          ],
        }),
  };
  const [items, total] = await prisma.$transaction([
    prisma.interview.findMany({
      where,
      orderBy: getInterviewOrderBy(query),
      skip: (query.page - 1) * query.pageSize,
      take: query.pageSize,
      select: interviewSelect,
    }),
    prisma.interview.count({ where }),
  ]);

  return toPaginatedResult(items, total, query.page, query.pageSize);
}

export async function getInterview(actor: CrmActor, interviewId: string): Promise<unknown> {
  const tenantId = requireTenant(actor);
  const interview = await prisma.interview.findFirst({
    where: { id: interviewId, tenantId, deletedAt: null },
    select: interviewSelect,
  });

  if (interview === null) {
    throw new AppError("NOT_FOUND", "Interview not found", 404);
  }

  return interview;
}

export async function createInterview(
  actor: CrmActor,
  context: CrmRequestContext,
  input: CreateInterviewInput,
): Promise<unknown> {
  const tenantId = requireTenant(actor);
  const submission = await assertSubmissionExists(tenantId, input.submissionId);
  const interview = await prisma.interview.create({
    data: {
      tenantId,
      submissionId: input.submissionId,
      candidateId: submission.candidateId,
      requirementId: submission.requirementId,
      roundNumber: input.roundNumber,
      interviewer: input.interviewer,
      scheduledAt: input.scheduledAt,
      feedback: input.feedback,
      outcome: input.outcome,
      createdById: actor.sub,
    },
    select: interviewSelect,
  });
  await prisma.candidateSubmission.update({
    where: { id: input.submissionId },
    data: { status: SubmissionStatus.INTERVIEW_SCHEDULED, interviewScheduledAt: input.scheduledAt },
  });
  await createAuditLog(actor, context, {
    action: "interviews.created",
    entityType: "interview",
    entityId: getRecordId(interview),
    tenantId,
    metadata: { submissionId: input.submissionId, roundNumber: input.roundNumber },
  });

  return interview;
}

export async function updateInterview(
  actor: CrmActor,
  context: CrmRequestContext,
  interviewId: string,
  input: UpdateInterviewInput,
): Promise<unknown> {
  const tenantId = requireTenant(actor);
  await assertInterviewExists(tenantId, interviewId);
  const interview = await prisma.interview.update({
    where: { id: interviewId },
    data: { ...input, updatedById: actor.sub },
    select: interviewSelect,
  });
  await createAuditLog(actor, context, {
    action: "interviews.updated",
    entityType: "interview",
    entityId: interviewId,
    tenantId,
    metadata: input as Record<string, unknown>,
  });

  return interview;
}

export async function deleteInterview(
  actor: CrmActor,
  context: CrmRequestContext,
  interviewId: string,
): Promise<{ deleted: true }> {
  const tenantId = requireTenant(actor);
  await assertInterviewExists(tenantId, interviewId);
  await prisma.interview.update({
    where: { id: interviewId },
    data: { deletedAt: new Date(), deletedById: actor.sub },
  });
  await createAuditLog(actor, context, {
    action: "interviews.deleted",
    entityType: "interview",
    entityId: interviewId,
    tenantId,
  });

  return { deleted: true };
}

export async function listPlacements(
  actor: CrmActor,
  query: PlacementListQuery,
): Promise<PaginatedResult<unknown>> {
  const tenantId = requireTenant(actor);
  const where: Prisma.PlacementWhereInput = {
    tenantId,
    deletedAt: null,
    ...(query.submissionId === undefined ? {} : { submissionId: query.submissionId }),
    ...(query.candidateId === undefined ? {} : { candidateId: query.candidateId }),
    ...(query.requirementId === undefined ? {} : { requirementId: query.requirementId }),
    ...(query.vendorId === undefined ? {} : { vendorId: query.vendorId }),
    ...(query.billingStatus === undefined ? {} : { billingStatus: query.billingStatus }),
    ...(query.joiningFrom === undefined && query.joiningTo === undefined
      ? {}
      : {
          joiningDate: {
            ...(query.joiningFrom === undefined ? {} : { gte: query.joiningFrom }),
            ...(query.joiningTo === undefined ? {} : { lte: query.joiningTo }),
          },
        }),
    ...(query.search === undefined
      ? {}
      : {
          OR: [
            { candidate: { firstName: { contains: query.search, mode: "insensitive" } } },
            { candidate: { lastName: { contains: query.search, mode: "insensitive" } } },
            { requirement: { roleTitle: { contains: query.search, mode: "insensitive" } } },
            { vendor: { name: { contains: query.search, mode: "insensitive" } } },
          ],
        }),
  };
  const [items, total] = await prisma.$transaction([
    prisma.placement.findMany({
      where,
      orderBy: getPlacementOrderBy(query),
      skip: (query.page - 1) * query.pageSize,
      take: query.pageSize,
      select: placementSelect,
    }),
    prisma.placement.count({ where }),
  ]);

  return toPaginatedResult(items, total, query.page, query.pageSize);
}

export async function getPlacement(actor: CrmActor, placementId: string): Promise<unknown> {
  const tenantId = requireTenant(actor);
  const placement = await prisma.placement.findFirst({
    where: { id: placementId, tenantId, deletedAt: null },
    select: placementSelect,
  });

  if (placement === null) {
    throw new AppError("NOT_FOUND", "Placement not found", 404);
  }

  return placement;
}

export async function createPlacement(
  actor: CrmActor,
  context: CrmRequestContext,
  input: CreatePlacementInput,
): Promise<unknown> {
  const tenantId = requireTenant(actor);
  const submission = await assertSubmissionExists(tenantId, input.submissionId);
  validatePlacementFinancials(input);
  const financials = calculatePlacementMargin(input);
  const { submissionId, ...placementInput } = input;
  const placement = await prisma.placement.create({
    data: {
      tenantId,
      submissionId,
      candidateId: submission.candidateId,
      requirementId: submission.requirementId,
      vendorId: submission.vendorId,
      ...placementInput,
      ...financials,
      createdById: actor.sub,
    },
    select: placementSelect,
  });
  await prisma.candidateSubmission.update({
    where: { id: input.submissionId },
    data: { status: SubmissionStatus.SELECTED },
  });
  await createAuditLog(actor, context, {
    action: "placements.created",
    entityType: "placement",
    entityId: getRecordId(placement),
    tenantId,
    metadata: { submissionId: input.submissionId, marginCents: financials.marginCents },
  });

  return placement;
}

export async function updatePlacement(
  actor: CrmActor,
  context: CrmRequestContext,
  placementId: string,
  input: UpdatePlacementInput,
): Promise<unknown> {
  const tenantId = requireTenant(actor);
  const existing = await assertPlacementExists(tenantId, placementId);
  validatePlacementFinancials({
    clientBillingRateCents: input.clientBillingRateCents ?? existing.clientBillingRateCents,
    vendorCostCents: input.vendorCostCents ?? existing.vendorCostCents,
  });
  const financials = calculatePlacementMargin({
    clientBillingRateCents: input.clientBillingRateCents ?? existing.clientBillingRateCents,
    vendorCostCents: input.vendorCostCents ?? existing.vendorCostCents,
  });
  const placement = await prisma.placement.update({
    where: { id: placementId },
    data: { ...input, ...financials, updatedById: actor.sub },
    select: placementSelect,
  });
  await createAuditLog(actor, context, {
    action: "placements.updated",
    entityType: "placement",
    entityId: placementId,
    tenantId,
    metadata: input as Record<string, unknown>,
  });

  return placement;
}

export async function deletePlacement(
  actor: CrmActor,
  context: CrmRequestContext,
  placementId: string,
): Promise<{ deleted: true }> {
  const tenantId = requireTenant(actor);
  await assertPlacementExists(tenantId, placementId);
  await prisma.placement.update({
    where: { id: placementId },
    data: { deletedAt: new Date(), deletedById: actor.sub },
  });
  await createAuditLog(actor, context, {
    action: "placements.deleted",
    entityType: "placement",
    entityId: placementId,
    tenantId,
  });

  return { deleted: true };
}

export async function listProposals(
  actor: CrmActor,
  query: ProposalListQuery,
): Promise<PaginatedResult<unknown>> {
  const tenantId = requireTenant(actor);
  const where: Prisma.ProposalWhereInput = {
    tenantId,
    deletedAt: null,
    ...(query.accountId === undefined ? {} : { accountId: query.accountId }),
    ...(query.contactId === undefined ? {} : { contactId: query.contactId }),
    ...(query.opportunityId === undefined ? {} : { opportunityId: query.opportunityId }),
    ...(query.ownerId === undefined ? {} : { ownerId: query.ownerId }),
    ...(query.status === undefined ? {} : { status: query.status }),
    ...(query.approvalQueue === true
      ? { approvals: { some: { status: ProposalApprovalStatus.PENDING, deletedAt: null } } }
      : {}),
    ...(query.search === undefined
      ? {}
      : {
          OR: [
            { title: { contains: query.search, mode: "insensitive" } },
            { account: { name: { contains: query.search, mode: "insensitive" } } },
            { opportunity: { name: { contains: query.search, mode: "insensitive" } } },
          ],
        }),
  };
  const [items, total] = await prisma.$transaction([
    prisma.proposal.findMany({
      where,
      orderBy: getProposalOrderBy(query),
      skip: (query.page - 1) * query.pageSize,
      take: query.pageSize,
      select: proposalSelect,
    }),
    prisma.proposal.count({ where }),
  ]);

  return toPaginatedResult(items, total, query.page, query.pageSize);
}

export async function getProposal(actor: CrmActor, proposalId: string): Promise<unknown> {
  const tenantId = requireTenant(actor);
  const proposal = await prisma.proposal.findFirst({
    where: { id: proposalId, tenantId, deletedAt: null },
    select: proposalSelect,
  });

  if (proposal === null) {
    throw new AppError("NOT_FOUND", "Proposal not found", 404);
  }

  return proposal;
}

export async function createProposal(
  actor: CrmActor,
  context: CrmRequestContext,
  input: CreateProposalInput,
): Promise<unknown> {
  const tenantId = requireTenant(actor);
  await assertProposalRelationsBelongToTenant(tenantId, input);
  await assertTenantUserExists(
    tenantId,
    input.ownerId,
    "Proposal owner must belong to the active tenant",
  );
  const { contentJson, ...proposalInput } = input;

  const proposal = await prisma.proposal.create({
    data: {
      tenantId,
      ...proposalInput,
      createdById: actor.sub,
      versions: {
        create: {
          tenantId,
          versionNumber: 1,
          templateKey: input.templateKey,
          title: input.title,
          contentJson: contentJson as Prisma.InputJsonValue,
          changeNote: "Initial draft",
          createdById: actor.sub,
        },
      },
    },
    select: proposalSelect,
  });

  await createAuditLog(actor, context, {
    action: "proposals.created",
    entityType: "proposal",
    entityId: getRecordId(proposal),
    tenantId,
    metadata: { templateKey: input.templateKey },
  });

  return proposal;
}

export async function updateProposal(
  actor: CrmActor,
  context: CrmRequestContext,
  proposalId: string,
  input: UpdateProposalInput,
): Promise<unknown> {
  const tenantId = requireTenant(actor);
  await assertProposalExists(tenantId, proposalId);
  await assertProposalRelationsBelongToTenant(tenantId, input);
  await assertTenantUserExists(
    tenantId,
    input.ownerId,
    "Proposal owner must belong to the active tenant",
  );

  const proposal = await prisma.proposal.update({
    where: { id: proposalId },
    data: {
      ...input,
      updatedById: actor.sub,
      ...(input.status === ProposalStatus.SENT ? { sentAt: new Date() } : {}),
      ...(input.status === ProposalStatus.WON ? { wonAt: new Date() } : {}),
      ...(input.status === ProposalStatus.LOST ? { lostAt: new Date() } : {}),
      ...(input.status === ProposalStatus.DRAFT
        ? { submittedAt: null, approvedAt: null, rejectedAt: null }
        : {}),
    },
    select: proposalSelect,
  });

  await createAuditLog(actor, context, {
    action: "proposals.updated",
    entityType: "proposal",
    entityId: proposalId,
    tenantId,
    metadata: input as Record<string, unknown>,
  });

  return proposal;
}

export async function createProposalVersion(
  actor: CrmActor,
  context: CrmRequestContext,
  proposalId: string,
  input: CreateProposalVersionInput,
): Promise<unknown> {
  const tenantId = requireTenant(actor);
  const existing = await assertProposalExists(tenantId, proposalId);
  const nextVersion = existing.currentVersionNumber + 1;

  const proposal = await prisma.proposal.update({
    where: { id: proposalId },
    data: {
      title: input.title ?? existing.title,
      templateKey: input.templateKey ?? existing.templateKey,
      currentVersionNumber: nextVersion,
      status: ProposalStatus.DRAFT,
      updatedById: actor.sub,
      versions: {
        create: {
          tenantId,
          versionNumber: nextVersion,
          templateKey: input.templateKey ?? existing.templateKey,
          title: input.title ?? existing.title,
          contentJson: input.contentJson as Prisma.InputJsonValue,
          changeNote: input.changeNote,
          createdById: actor.sub,
        },
      },
    },
    select: proposalSelect,
  });

  await createAuditLog(actor, context, {
    action: "proposals.version_created",
    entityType: "proposal",
    entityId: proposalId,
    tenantId,
    metadata: { versionNumber: nextVersion },
  });

  return proposal;
}

export async function submitProposal(
  actor: CrmActor,
  context: CrmRequestContext,
  proposalId: string,
  input: SubmitProposalInput,
): Promise<unknown> {
  const tenantId = requireTenant(actor);
  const existing = await assertProposalExists(tenantId, proposalId);

  if (existing.status !== ProposalStatus.DRAFT && existing.status !== ProposalStatus.REJECTED) {
    throw new AppError(
      "VALIDATION_ERROR",
      "Only draft or rejected proposals can be submitted",
      400,
    );
  }

  const proposal = await prisma.proposal.update({
    where: { id: proposalId },
    data: {
      status: ProposalStatus.SUBMITTED,
      approvalRole: input.approvalRole,
      submittedAt: new Date(),
      rejectedAt: null,
      updatedById: actor.sub,
      approvals: {
        create: {
          tenantId,
          roleKey: input.approvalRole,
          status: ProposalApprovalStatus.PENDING,
          createdById: actor.sub,
        },
      },
    },
    select: proposalSelect,
  });

  await createAuditLog(actor, context, {
    action: "proposals.submitted",
    entityType: "proposal",
    entityId: proposalId,
    tenantId,
    metadata: { approvalRole: input.approvalRole },
  });

  return proposal;
}

export async function decideProposal(
  actor: CrmActor,
  context: CrmRequestContext,
  proposalId: string,
  input: DecideProposalInput,
): Promise<unknown> {
  const tenantId = requireTenant(actor);
  await assertProposalExists(tenantId, proposalId);
  const pendingApproval = await prisma.proposalApproval.findFirst({
    where: {
      tenantId,
      proposalId,
      deletedAt: null,
      status: ProposalApprovalStatus.PENDING,
      ...(input.roleKey === undefined ? {} : { roleKey: input.roleKey }),
    },
    select: { id: true },
  });

  if (pendingApproval === null) {
    throw new AppError("NOT_FOUND", "Pending proposal approval not found", 404);
  }

  const approved = input.decision === ProposalApprovalStatus.APPROVED;
  const now = new Date();
  const proposal = await prisma.proposal.update({
    where: { id: proposalId },
    data: {
      status: approved ? ProposalStatus.APPROVED : ProposalStatus.REJECTED,
      approvedAt: approved ? now : null,
      rejectedAt: approved ? null : now,
      updatedById: actor.sub,
      approvals: {
        update: {
          where: { id: pendingApproval.id },
          data: {
            status: input.decision,
            approverUserId: actor.sub,
            decidedAt: now,
            comment: input.comment,
            updatedById: actor.sub,
          },
        },
      },
    },
    select: proposalSelect,
  });

  await createAuditLog(actor, context, {
    action: approved ? "proposals.approved" : "proposals.rejected",
    entityType: "proposal",
    entityId: proposalId,
    tenantId,
    metadata: { comment: input.comment },
  });

  return proposal;
}

export async function requestProposalPdfExport(
  actor: CrmActor,
  context: CrmRequestContext,
  proposalId: string,
): Promise<unknown> {
  const tenantId = requireTenant(actor);
  await assertProposalExists(tenantId, proposalId);
  const proposal = await prisma.proposal.update({
    where: { id: proposalId },
    data: { pdfExportRequestedAt: new Date(), updatedById: actor.sub },
    select: proposalSelect,
  });

  await createAuditLog(actor, context, {
    action: "proposals.pdf_export_requested",
    entityType: "proposal",
    entityId: proposalId,
    tenantId,
  });

  return proposal;
}

export async function deleteProposal(
  actor: CrmActor,
  context: CrmRequestContext,
  proposalId: string,
): Promise<{ deleted: true }> {
  const tenantId = requireTenant(actor);
  await assertProposalExists(tenantId, proposalId);
  await prisma.proposal.update({
    where: { id: proposalId },
    data: { deletedAt: new Date(), deletedById: actor.sub },
  });
  await createAuditLog(actor, context, {
    action: "proposals.deleted",
    entityType: "proposal",
    entityId: proposalId,
    tenantId,
  });

  return { deleted: true };
}

export async function listCrmActivities(
  actor: CrmActor,
  query: ActivityListQuery,
): Promise<PaginatedResult<unknown>> {
  const tenantId = requireTenant(actor);
  const where: Prisma.CrmActivityWhereInput = {
    tenantId,
    deletedAt: null,
    ...(query.leadId === undefined ? {} : { leadId: query.leadId }),
    ...(query.accountId === undefined ? {} : { accountId: query.accountId }),
    ...(query.contactId === undefined ? {} : { contactId: query.contactId }),
    ...(query.opportunityId === undefined ? {} : { opportunityId: query.opportunityId }),
    ...(query.proposalId === undefined ? {} : { proposalId: query.proposalId }),
    ...(query.candidateId === undefined ? {} : { candidateId: query.candidateId }),
    ...(query.ownerId === undefined ? {} : { ownerId: query.ownerId }),
    ...(query.type === undefined ? {} : { type: query.type }),
    ...(query.status === undefined ? {} : { status: query.status }),
    ...(query.overdueOnly === true
      ? { status: ActivityStatus.OPEN, dueAt: { lt: new Date() }, completedAt: null }
      : {}),
    ...(query.dueFrom === undefined && query.dueTo === undefined
      ? {}
      : {
          dueAt: {
            ...(query.dueFrom === undefined ? {} : { gte: query.dueFrom }),
            ...(query.dueTo === undefined ? {} : { lte: query.dueTo }),
          },
        }),
    ...(query.search === undefined
      ? {}
      : {
          OR: [
            { title: { contains: query.search, mode: "insensitive" } },
            { description: { contains: query.search, mode: "insensitive" } },
          ],
        }),
  };
  const [items, total] = await prisma.$transaction([
    prisma.crmActivity.findMany({
      where,
      orderBy: getActivityOrderBy(query),
      skip: (query.page - 1) * query.pageSize,
      take: query.pageSize,
      select: crmActivitySelect,
    }),
    prisma.crmActivity.count({ where }),
  ]);

  return toPaginatedResult(items.map(toActivityView), total, query.page, query.pageSize);
}

export async function getCrmActivity(actor: CrmActor, activityId: string): Promise<unknown> {
  const tenantId = requireTenant(actor);
  const activity = await prisma.crmActivity.findFirst({
    where: { id: activityId, tenantId, deletedAt: null },
    select: crmActivitySelect,
  });

  if (activity === null) {
    throw new AppError("NOT_FOUND", "Activity not found", 404);
  }

  return toActivityView(activity);
}

export async function createCrmActivity(
  actor: CrmActor,
  context: CrmRequestContext,
  input: CreateActivityInput,
): Promise<unknown> {
  const tenantId = requireTenant(actor);
  await assertActivityRelationsBelongToTenant(tenantId, input);
  await assertTenantUserExists(
    tenantId,
    input.ownerId,
    "Activity owner must belong to the active tenant",
  );
  const completedAt = input.status === ActivityStatus.COMPLETED ? new Date() : undefined;
  const activity = await prisma.crmActivity.create({
    data: { tenantId, ...input, completedAt, createdById: actor.sub },
    select: crmActivitySelect,
  });

  await createAuditLog(actor, context, {
    action: "activities.created",
    entityType: "activity",
    entityId: getRecordId(activity),
    tenantId,
    metadata: { type: input.type },
  });

  return toActivityView(activity);
}

export async function updateCrmActivity(
  actor: CrmActor,
  context: CrmRequestContext,
  activityId: string,
  input: UpdateActivityInput,
): Promise<unknown> {
  const tenantId = requireTenant(actor);
  await assertActivityExists(tenantId, activityId);
  await assertActivityRelationsBelongToTenant(tenantId, input);
  await assertTenantUserExists(
    tenantId,
    input.ownerId,
    "Activity owner must belong to the active tenant",
  );
  const activity = await prisma.crmActivity.update({
    where: { id: activityId },
    data: {
      ...input,
      updatedById: actor.sub,
      ...(input.status === ActivityStatus.COMPLETED ? { completedAt: new Date() } : {}),
      ...(input.status === ActivityStatus.OPEN ? { completedAt: null } : {}),
    },
    select: crmActivitySelect,
  });

  await createAuditLog(actor, context, {
    action: "activities.updated",
    entityType: "activity",
    entityId: activityId,
    tenantId,
    metadata: input as Record<string, unknown>,
  });

  return toActivityView(activity);
}

export async function deleteCrmActivity(
  actor: CrmActor,
  context: CrmRequestContext,
  activityId: string,
): Promise<{ deleted: true }> {
  const tenantId = requireTenant(actor);
  await assertActivityExists(tenantId, activityId);
  await prisma.crmActivity.update({
    where: { id: activityId },
    data: { deletedAt: new Date(), deletedById: actor.sub },
  });
  await createAuditLog(actor, context, {
    action: "activities.deleted",
    entityType: "activity",
    entityId: activityId,
    tenantId,
  });

  return { deleted: true };
}

export async function listOpportunities(
  actor: CrmActor,
  query: OpportunityListQuery,
): Promise<PaginatedResult<unknown>> {
  const tenantId = requireTenant(actor);
  const stagnantBefore = getStagnantCutoff();
  const where: Prisma.OpportunityWhereInput = {
    tenantId,
    deletedAt: null,
    ...(query.accountId === undefined ? {} : { accountId: query.accountId }),
    ...(query.ownerId === undefined ? {} : { ownerId: query.ownerId }),
    ...(query.stage === undefined ? {} : { stage: query.stage }),
    ...(query.currency === undefined ? {} : { currency: query.currency.toUpperCase() }),
    ...(query.expectedCloseFrom === undefined && query.expectedCloseTo === undefined
      ? {}
      : {
          expectedCloseDate: {
            ...(query.expectedCloseFrom === undefined ? {} : { gte: query.expectedCloseFrom }),
            ...(query.expectedCloseTo === undefined ? {} : { lte: query.expectedCloseTo }),
          },
        }),
    ...(query.stagnantOnly === true
      ? { stage: { notIn: terminalOpportunityStages }, stageChangedAt: { lt: stagnantBefore } }
      : {}),
    ...(query.search === undefined
      ? {}
      : {
          OR: [
            { name: { contains: query.search, mode: "insensitive" } },
            { account: { name: { contains: query.search, mode: "insensitive" } } },
          ],
        }),
  };
  const [items, total] = await prisma.$transaction([
    prisma.opportunity.findMany({
      where,
      orderBy: getOpportunityOrderBy(query),
      skip: (query.page - 1) * query.pageSize,
      take: query.pageSize,
      select: opportunitySelect,
    }),
    prisma.opportunity.count({ where }),
  ]);

  return toPaginatedResult(
    items.map((item) => toOpportunityView(item)),
    total,
    query.page,
    query.pageSize,
  );
}

export async function listOpportunityPipeline(actor: CrmActor): Promise<unknown> {
  const tenantId = requireTenant(actor);
  const opportunities = await prisma.opportunity.findMany({
    where: { tenantId, deletedAt: null },
    orderBy: [{ stage: Prisma.SortOrder.asc }, { expectedCloseDate: Prisma.SortOrder.asc }],
    select: opportunitySelect,
  });

  return opportunityStages.map((stage) => {
    const items = opportunities.filter((item) => item.stage === stage).map(toOpportunityView);
    return {
      stage,
      probability: defaultStageProbability[stage],
      count: items.length,
      valueCents: items.reduce((sum, item) => sum + item.valueCents, 0),
      weightedForecastCents: items.reduce((sum, item) => sum + item.weightedForecastCents, 0),
      items,
    };
  });
}

export async function getOpportunity(actor: CrmActor, opportunityId: string): Promise<unknown> {
  const tenantId = requireTenant(actor);
  const opportunity = await prisma.opportunity.findFirst({
    where: { id: opportunityId, tenantId, deletedAt: null },
    select: opportunitySelect,
  });

  if (opportunity === null) {
    throw new AppError("NOT_FOUND", "Opportunity not found", 404);
  }

  return toOpportunityView(opportunity);
}

export async function createOpportunity(
  actor: CrmActor,
  context: CrmRequestContext,
  input: CreateOpportunityInput,
): Promise<unknown> {
  const tenantId = requireTenant(actor);
  await assertOpportunityRelationsBelongToTenant(tenantId, input);
  await assertOpportunityOwnerBelongsToTenant(tenantId, input.ownerId);
  const stage = input.stage ?? OpportunityStage.QUALIFICATION;
  validateOpportunityStageInput(stage, input.lostReason);
  const normalized = normalizeOpportunityFinancials({ ...input, stage });

  const opportunity = await prisma.opportunity.create({
    data: {
      tenantId,
      ...input,
      stage,
      ...normalized,
      stageChangedAt: new Date(),
      wonAt: stage === OpportunityStage.WON ? new Date() : undefined,
      lostAt: stage === OpportunityStage.LOST ? new Date() : undefined,
      createdById: actor.sub,
      activities: {
        create: {
          tenantId,
          type: "opportunity.created",
          title: "Opportunity created",
          description: `${input.name} entered the ${stage} stage.`,
          createdById: actor.sub,
        },
      },
      stageHistory: {
        create: {
          tenantId,
          toStage: stage,
          changedById: actor.sub,
          note: "Opportunity created",
        },
      },
    },
    select: opportunitySelect,
  });

  await createAuditLog(actor, context, {
    action: "opportunities.created",
    entityType: "opportunity",
    entityId: getRecordId(opportunity),
    tenantId,
    metadata: { stage, valueCents: input.valueCents },
  });

  return toOpportunityView(opportunity);
}

export async function convertLeadToOpportunity(
  actor: CrmActor,
  context: CrmRequestContext,
  leadId: string,
  input: ConvertLeadInput,
): Promise<unknown> {
  const tenantId = requireTenant(actor);
  await assertOpportunityOwnerBelongsToTenant(tenantId, input.ownerId);

  const result = await prisma.$transaction(async (tx) => {
    const lead = await tx.lead.findFirst({
      where: { id: leadId, tenantId, deletedAt: null },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        phone: true,
        company: true,
        website: true,
        companyDomain: true,
        country: true,
        serviceInterest: true,
        ownerId: true,
        status: true,
      },
    });

    if (lead === null) {
      throw new AppError("NOT_FOUND", "Lead not found", 404);
    }

    if (lead.status === LeadStatus.CONVERTED) {
      throw new AppError("CONFLICT", "Lead is already converted", 409);
    }

    const existingOpportunity = await tx.opportunity.findFirst({
      where: { tenantId, leadId: lead.id, deletedAt: null },
      select: { id: true },
    });

    if (existingOpportunity !== null) {
      throw new AppError("CONFLICT", "Lead is already converted", 409);
    }

    const accountName = input.accountName ?? lead.company ?? `${lead.firstName} ${lead.lastName}`;
    const account = await tx.account.create({
      data: {
        tenantId,
        name: accountName,
        website: lead.website,
        domain: normalizeDomain(lead.companyDomain ?? lead.website ?? undefined),
        country: lead.country,
        status: AccountStatus.PROSPECT,
        ownerId: input.ownerId ?? lead.ownerId,
        createdById: actor.sub,
      },
      select: { id: true, name: true },
    });
    const contact = await tx.contact.create({
      data: {
        tenantId,
        accountId: account.id,
        firstName: lead.firstName,
        lastName: lead.lastName,
        email: lead.email,
        phone: lead.phone,
        ownerId: input.ownerId ?? lead.ownerId,
        createdById: actor.sub,
      },
      select: { id: true },
    });
    const opportunityName =
      input.opportunityName ?? `${account.name} - ${lead.serviceInterest ?? "New opportunity"}`;
    const normalized = normalizeOpportunityFinancials({
      stage: OpportunityStage.QUALIFICATION,
      valueCents: input.valueCents,
      currency: input.currency,
    });
    const opportunity = await tx.opportunity.create({
      data: {
        tenantId,
        accountId: account.id,
        primaryContactId: contact.id,
        leadId: lead.id,
        name: opportunityName,
        stage: OpportunityStage.QUALIFICATION,
        ...normalized,
        expectedCloseDate: input.expectedCloseDate,
        ownerId: input.ownerId ?? lead.ownerId,
        notes: input.notes,
        createdById: actor.sub,
        activities: {
          create: {
            tenantId,
            leadId: lead.id,
            accountId: account.id,
            contactId: contact.id,
            type: "opportunity.converted",
            title: "Lead converted",
            description: "Lead conversion created account, contact, and opportunity.",
            createdById: actor.sub,
          },
        },
        stageHistory: {
          create: {
            tenantId,
            toStage: OpportunityStage.QUALIFICATION,
            changedById: actor.sub,
            note: "Converted from lead",
          },
        },
      },
      select: opportunitySelect,
    });

    await tx.lead.update({
      where: { id: lead.id },
      data: {
        status: LeadStatus.CONVERTED,
        updatedById: actor.sub,
        activities: {
          create: {
            tenantId,
            accountId: account.id,
            contactId: contact.id,
            opportunityId: opportunity.id,
            type: "lead.converted",
            title: "Lead converted",
            description: `Converted to ${opportunityName}.`,
            createdById: actor.sub,
          },
        },
      },
    });

    return opportunity;
  });

  await createAuditLog(actor, context, {
    action: "leads.converted",
    entityType: "lead",
    entityId: leadId,
    tenantId,
    metadata: { opportunityId: getRecordId(result) },
  });
  await createAuditLog(actor, context, {
    action: "opportunities.created_from_lead",
    entityType: "opportunity",
    entityId: getRecordId(result),
    tenantId,
    metadata: { leadId },
  });

  return toOpportunityView(result);
}

export async function updateOpportunity(
  actor: CrmActor,
  context: CrmRequestContext,
  opportunityId: string,
  input: UpdateOpportunityInput,
): Promise<unknown> {
  const tenantId = requireTenant(actor);
  const existing = await assertOpportunityExists(tenantId, opportunityId);
  await assertOpportunityRelationsBelongToTenant(tenantId, input);
  await assertOpportunityOwnerBelongsToTenant(tenantId, input.ownerId);
  const nextStage = input.stage ?? existing.stage;
  validateStageTransition(existing.stage, nextStage);
  validateOpportunityStageInput(nextStage, input.lostReason ?? existing.lostReason ?? undefined);
  const stageChanged = input.stage !== undefined && input.stage !== existing.stage;
  const normalized = normalizeOpportunityFinancials({
    stage: nextStage,
    probability: input.probability ?? (stageChanged ? undefined : existing.probability),
    valueCents: input.valueCents ?? existing.valueCents,
    currency: input.currency ?? existing.currency,
  });
  const now = new Date();

  const opportunity = await prisma.opportunity.update({
    where: { id: opportunityId },
    data: {
      ...input,
      ...normalized,
      ...(stageChanged ? { stageChangedAt: now } : {}),
      ...(nextStage === OpportunityStage.WON && existing.wonAt === null ? { wonAt: now } : {}),
      ...(nextStage === OpportunityStage.LOST && existing.lostAt === null ? { lostAt: now } : {}),
      updatedById: actor.sub,
      activities: {
        create: {
          tenantId,
          type: stageChanged ? "opportunity.stage_changed" : "opportunity.updated",
          title: stageChanged ? "Opportunity stage changed" : "Opportunity updated",
          description: stageChanged
            ? `${existing.stage} moved to ${nextStage}.`
            : "Opportunity fields were updated.",
          createdById: actor.sub,
        },
      },
      ...(stageChanged
        ? {
            stageHistory: {
              create: {
                tenantId,
                fromStage: existing.stage,
                toStage: nextStage,
                changedById: actor.sub,
                note: input.notes,
              },
            },
          }
        : {}),
    },
    select: opportunitySelect,
  });

  await createAuditLog(actor, context, {
    action: stageChanged ? "opportunities.stage_changed" : "opportunities.updated",
    entityType: "opportunity",
    entityId: opportunityId,
    tenantId,
    metadata: input as Record<string, unknown>,
  });

  return toOpportunityView(opportunity);
}

export async function deleteOpportunity(
  actor: CrmActor,
  context: CrmRequestContext,
  opportunityId: string,
): Promise<{ deleted: true }> {
  const tenantId = requireTenant(actor);
  await assertOpportunityExists(tenantId, opportunityId);

  await prisma.opportunity.update({
    where: { id: opportunityId },
    data: {
      deletedAt: new Date(),
      deletedById: actor.sub,
    },
  });

  await createAuditLog(actor, context, {
    action: "opportunities.deleted",
    entityType: "opportunity",
    entityId: opportunityId,
    tenantId,
  });

  return { deleted: true };
}

export async function listLeads(
  actor: CrmActor,
  query: LeadListQuery,
): Promise<PaginatedResult<unknown>> {
  const tenantId = requireTenant(actor);
  const where: Prisma.LeadWhereInput = {
    tenantId,
    deletedAt: null,
    ...(query.source === undefined
      ? {}
      : { source: { contains: query.source, mode: "insensitive" } }),
    ...(query.status === undefined ? {} : { status: query.status }),
    ...(query.ownerId === undefined ? {} : { ownerId: query.ownerId }),
    ...(query.followUpFrom === undefined && query.followUpTo === undefined
      ? {}
      : {
          followUpAt: {
            ...(query.followUpFrom === undefined ? {} : { gte: query.followUpFrom }),
            ...(query.followUpTo === undefined ? {} : { lte: query.followUpTo }),
          },
        }),
    ...(query.search === undefined
      ? {}
      : {
          OR: [
            { firstName: { contains: query.search, mode: "insensitive" } },
            { lastName: { contains: query.search, mode: "insensitive" } },
            { email: { contains: query.search, mode: "insensitive" } },
            { phone: { contains: query.search, mode: "insensitive" } },
            { company: { contains: query.search, mode: "insensitive" } },
          ],
        }),
  };
  const [items, total] = await prisma.$transaction([
    prisma.lead.findMany({
      where,
      orderBy: getLeadOrderBy(query),
      skip: (query.page - 1) * query.pageSize,
      take: query.pageSize,
      select: leadSelect,
    }),
    prisma.lead.count({ where }),
  ]);

  return toPaginatedResult(items, total, query.page, query.pageSize);
}

export async function getLead(actor: CrmActor, leadId: string): Promise<unknown> {
  const tenantId = requireTenant(actor);
  const lead = await prisma.lead.findFirst({
    where: { id: leadId, tenantId, deletedAt: null },
    select: leadSelect,
  });

  if (lead === null) {
    throw new AppError("NOT_FOUND", "Lead not found", 404);
  }

  return lead;
}

export async function createLead(
  actor: CrmActor,
  context: CrmRequestContext,
  input: CreateLeadInput,
): Promise<unknown> {
  const tenantId = requireTenant(actor);
  await assertLeadOwnerBelongsToTenant(tenantId, input.ownerId);
  await assertNoDuplicateLead(tenantId, input);
  const score = scoreLead(input);

  const lead = await prisma.lead.create({
    data: {
      tenantId,
      ...input,
      companyDomain: normalizeDomain(input.companyDomain ?? input.website),
      score: score.score,
      scoreReason: score.reason,
      createdById: actor.sub,
      activities: {
        create: {
          tenantId,
          type: "lead.created",
          title: "Lead created",
          description: `${input.firstName} ${input.lastName} was created from ${input.source}.`,
          createdById: actor.sub,
        },
      },
    },
    select: leadSelect,
  });

  await createAuditLog(actor, context, {
    action: "leads.created",
    entityType: "lead",
    entityId: getRecordId(lead),
    tenantId,
    metadata: { source: input.source, score: score.score },
  });

  return lead;
}

export async function updateLead(
  actor: CrmActor,
  context: CrmRequestContext,
  leadId: string,
  input: UpdateLeadInput,
): Promise<unknown> {
  const tenantId = requireTenant(actor);
  const existingLead = await assertLeadExists(tenantId, leadId);
  await assertLeadOwnerBelongsToTenant(tenantId, input.ownerId);
  await assertNoDuplicateLead(tenantId, input, leadId);
  const score = scoreLead({
    email: input.email ?? existingLead.email ?? undefined,
    phone: input.phone ?? existingLead.phone ?? undefined,
    company: input.company ?? existingLead.company ?? undefined,
    serviceInterest: input.serviceInterest ?? existingLead.serviceInterest ?? undefined,
    budgetRange: input.budgetRange ?? existingLead.budgetRange ?? undefined,
    followUpAt: input.followUpAt ?? existingLead.followUpAt ?? undefined,
  });

  const lead = await prisma.lead.update({
    where: { id: leadId },
    data: {
      ...input,
      ...(input.companyDomain !== undefined || input.website !== undefined
        ? { companyDomain: normalizeDomain(input.companyDomain ?? input.website) }
        : {}),
      ...(Object.keys(input).length === 0 ? {} : { score: score.score, scoreReason: score.reason }),
      updatedById: actor.sub,
      activities: {
        create: {
          tenantId,
          type: "lead.updated",
          title: "Lead updated",
          description: "Lead fields or lifecycle status were updated.",
          createdById: actor.sub,
        },
      },
    },
    select: leadSelect,
  });

  await createAuditLog(actor, context, {
    action: "leads.updated",
    entityType: "lead",
    entityId: leadId,
    tenantId,
    metadata: input as Record<string, unknown>,
  });

  return lead;
}

export async function deleteLead(
  actor: CrmActor,
  context: CrmRequestContext,
  leadId: string,
): Promise<{ deleted: true }> {
  const tenantId = requireTenant(actor);
  await assertLeadExists(tenantId, leadId);

  await prisma.lead.update({
    where: { id: leadId },
    data: {
      deletedAt: new Date(),
      deletedById: actor.sub,
    },
  });

  await createAuditLog(actor, context, {
    action: "leads.deleted",
    entityType: "lead",
    entityId: leadId,
    tenantId,
  });

  return { deleted: true };
}

export async function listAccounts(
  actor: CrmActor,
  query: AccountListQuery,
): Promise<PaginatedResult<unknown>> {
  const tenantId = requireTenant(actor);
  const where: Prisma.AccountWhereInput = {
    tenantId,
    deletedAt: null,
    ...(query.status === undefined ? {} : { status: query.status }),
    ...(query.industry === undefined
      ? {}
      : { industry: { contains: query.industry, mode: "insensitive" } }),
    ...(query.search === undefined
      ? {}
      : {
          OR: [
            { name: { contains: query.search, mode: "insensitive" } },
            { domain: { contains: query.search, mode: "insensitive" } },
            { website: { contains: query.search, mode: "insensitive" } },
          ],
        }),
  };
  const [items, total] = await prisma.$transaction([
    prisma.account.findMany({
      where,
      orderBy: getAccountOrderBy(query),
      skip: (query.page - 1) * query.pageSize,
      take: query.pageSize,
      select: accountSelect,
    }),
    prisma.account.count({ where }),
  ]);

  return toPaginatedResult(items, total, query.page, query.pageSize);
}

export async function getAccount(actor: CrmActor, accountId: string): Promise<unknown> {
  const tenantId = requireTenant(actor);
  const account = await prisma.account.findFirst({
    where: { id: accountId, tenantId, deletedAt: null },
    select: accountSelect,
  });

  if (account === null) {
    throw new AppError("NOT_FOUND", "Account not found", 404);
  }

  return account;
}

export async function createAccount(
  actor: CrmActor,
  context: CrmRequestContext,
  input: CreateAccountInput,
): Promise<unknown> {
  const tenantId = requireTenant(actor);
  await assertNoDuplicateAccount(tenantId, input);

  const account = await prisma.account.create({
    data: {
      tenantId,
      ...input,
      domain: normalizeDomain(input.domain ?? input.website),
      createdById: actor.sub,
      activities: {
        create: {
          tenantId,
          type: "account.created",
          title: "Account created",
          description: `${input.name} was created.`,
          createdById: actor.sub,
        },
      },
    },
    select: accountSelect,
  });

  await createAuditLog(actor, context, {
    action: "accounts.created",
    entityType: "account",
    entityId: getRecordId(account),
    tenantId,
    metadata: { name: input.name },
  });

  return account;
}

export async function updateAccount(
  actor: CrmActor,
  context: CrmRequestContext,
  accountId: string,
  input: UpdateAccountInput,
): Promise<unknown> {
  const tenantId = requireTenant(actor);
  await assertAccountExists(tenantId, accountId);
  await assertNoDuplicateAccount(tenantId, input, accountId);

  const account = await prisma.account.update({
    where: { id: accountId },
    data: {
      ...input,
      ...(input.domain !== undefined || input.website !== undefined
        ? { domain: normalizeDomain(input.domain ?? input.website) }
        : {}),
      updatedById: actor.sub,
      activities: {
        create: {
          tenantId,
          type: "account.updated",
          title: "Account updated",
          description: "Account fields were updated.",
          createdById: actor.sub,
        },
      },
    },
    select: accountSelect,
  });

  await createAuditLog(actor, context, {
    action: "accounts.updated",
    entityType: "account",
    entityId: accountId,
    tenantId,
    metadata: input as Record<string, unknown>,
  });

  return account;
}

export async function deleteAccount(
  actor: CrmActor,
  context: CrmRequestContext,
  accountId: string,
): Promise<{ deleted: true }> {
  const tenantId = requireTenant(actor);
  await assertAccountExists(tenantId, accountId);

  await prisma.account.update({
    where: { id: accountId },
    data: {
      deletedAt: new Date(),
      deletedById: actor.sub,
      contacts: {
        updateMany: {
          where: { deletedAt: null },
          data: {
            deletedAt: new Date(),
            deletedById: actor.sub,
          },
        },
      },
    },
  });

  await createAuditLog(actor, context, {
    action: "accounts.deleted",
    entityType: "account",
    entityId: accountId,
    tenantId,
  });

  return { deleted: true };
}

export async function listContacts(
  actor: CrmActor,
  query: ContactListQuery,
): Promise<PaginatedResult<unknown>> {
  const tenantId = requireTenant(actor);
  const where: Prisma.ContactWhereInput = {
    tenantId,
    deletedAt: null,
    ...(query.accountId === undefined ? {} : { accountId: query.accountId }),
    ...(query.status === undefined ? {} : { status: query.status }),
    ...(query.search === undefined
      ? {}
      : {
          OR: [
            { firstName: { contains: query.search, mode: "insensitive" } },
            { lastName: { contains: query.search, mode: "insensitive" } },
            { email: { contains: query.search, mode: "insensitive" } },
            { phone: { contains: query.search, mode: "insensitive" } },
          ],
        }),
  };
  const [items, total] = await prisma.$transaction([
    prisma.contact.findMany({
      where,
      orderBy: getContactOrderBy(query),
      skip: (query.page - 1) * query.pageSize,
      take: query.pageSize,
      select: contactSelect,
    }),
    prisma.contact.count({ where }),
  ]);

  return toPaginatedResult(items, total, query.page, query.pageSize);
}

export async function getContact(actor: CrmActor, contactId: string): Promise<unknown> {
  const tenantId = requireTenant(actor);
  const contact = await prisma.contact.findFirst({
    where: { id: contactId, tenantId, deletedAt: null },
    select: contactSelect,
  });

  if (contact === null) {
    throw new AppError("NOT_FOUND", "Contact not found", 404);
  }

  return contact;
}

export async function createContact(
  actor: CrmActor,
  context: CrmRequestContext,
  input: CreateContactInput,
): Promise<unknown> {
  const tenantId = requireTenant(actor);
  await assertContactAccountBelongsToTenant(tenantId, input.accountId);
  await assertNoDuplicateContact(tenantId, input);

  const contact = await prisma.contact.create({
    data: {
      tenantId,
      ...input,
      createdById: actor.sub,
      activities: {
        create: {
          tenantId,
          accountId: input.accountId,
          type: "contact.created",
          title: "Contact created",
          description: `${input.firstName} ${input.lastName} was created.`,
          createdById: actor.sub,
        },
      },
    },
    select: contactSelect,
  });

  await createAuditLog(actor, context, {
    action: "contacts.created",
    entityType: "contact",
    entityId: getRecordId(contact),
    tenantId,
    metadata: { email: input.email },
  });

  return contact;
}

export async function updateContact(
  actor: CrmActor,
  context: CrmRequestContext,
  contactId: string,
  input: UpdateContactInput,
): Promise<unknown> {
  const tenantId = requireTenant(actor);
  await assertContactExists(tenantId, contactId);
  await assertContactAccountBelongsToTenant(tenantId, input.accountId);
  await assertNoDuplicateContact(tenantId, input, contactId);

  const contact = await prisma.contact.update({
    where: { id: contactId },
    data: {
      ...input,
      updatedById: actor.sub,
      activities: {
        create: {
          tenantId,
          accountId: input.accountId,
          type: "contact.updated",
          title: "Contact updated",
          description: "Contact fields were updated.",
          createdById: actor.sub,
        },
      },
    },
    select: contactSelect,
  });

  await createAuditLog(actor, context, {
    action: "contacts.updated",
    entityType: "contact",
    entityId: contactId,
    tenantId,
    metadata: input as Record<string, unknown>,
  });

  return contact;
}

export async function deleteContact(
  actor: CrmActor,
  context: CrmRequestContext,
  contactId: string,
): Promise<{ deleted: true }> {
  const tenantId = requireTenant(actor);
  await assertContactExists(tenantId, contactId);

  await prisma.contact.update({
    where: { id: contactId },
    data: {
      deletedAt: new Date(),
      deletedById: actor.sub,
    },
  });

  await createAuditLog(actor, context, {
    action: "contacts.deleted",
    entityType: "contact",
    entityId: contactId,
    tenantId,
  });

  return { deleted: true };
}

const opportunityStages = [
  OpportunityStage.QUALIFICATION,
  OpportunityStage.DISCOVERY,
  OpportunityStage.REQUIREMENT,
  OpportunityStage.PROPOSAL,
  OpportunityStage.NEGOTIATION,
  OpportunityStage.VERBAL_COMMIT,
  OpportunityStage.CONTRACTING,
  OpportunityStage.WON,
  OpportunityStage.LOST,
] as const;

const terminalOpportunityStages: OpportunityStage[] = [OpportunityStage.WON, OpportunityStage.LOST];

const defaultStageProbability: Record<OpportunityStage, number> = {
  QUALIFICATION: 10,
  DISCOVERY: 20,
  REQUIREMENT: 35,
  PROPOSAL: 50,
  NEGOTIATION: 70,
  VERBAL_COMMIT: 85,
  CONTRACTING: 95,
  WON: 100,
  LOST: 0,
};

function normalizeOpportunityFinancials(input: {
  stage?: OpportunityStage;
  probability?: number;
  valueCents: number;
  currency: string;
}): {
  probability: number;
  valueCents: number;
  currency: string;
  weightedForecastCents: number;
} {
  const probability =
    input.probability ?? defaultStageProbability[input.stage ?? OpportunityStage.QUALIFICATION];

  return {
    probability,
    valueCents: input.valueCents,
    currency: input.currency.toUpperCase(),
    weightedForecastCents: Math.round((input.valueCents * probability) / 100),
  };
}

function validateOpportunityStageInput(stage: OpportunityStage, lostReason?: string): void {
  if (stage === OpportunityStage.LOST && (lostReason === undefined || lostReason.length === 0)) {
    throw new AppError("VALIDATION_ERROR", "Lost opportunities require a lost reason", 400);
  }
}

function validateStageTransition(fromStage: OpportunityStage, toStage: OpportunityStage): void {
  if (fromStage === toStage) {
    return;
  }

  if (terminalOpportunityStages.includes(fromStage)) {
    throw new AppError("VALIDATION_ERROR", "Closed opportunities cannot move stages", 400);
  }

  if (terminalOpportunityStages.includes(toStage)) {
    return;
  }

  const fromIndex = opportunityStages.indexOf(fromStage);
  const toIndex = opportunityStages.indexOf(toStage);

  if (toIndex !== fromIndex + 1) {
    throw new AppError(
      "VALIDATION_ERROR",
      "Opportunity stages must move forward one step at a time",
      400,
    );
  }
}

function getStagnantCutoff(): Date {
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - 14);

  return cutoff;
}

function toOpportunityView<T extends { stage: OpportunityStage; stageChangedAt: Date }>(
  opportunity: T,
): T & { isStagnant: boolean } {
  return {
    ...opportunity,
    isStagnant:
      !terminalOpportunityStages.includes(opportunity.stage) &&
      opportunity.stageChangedAt < getStagnantCutoff(),
  };
}

function getOpportunityOrderBy(
  query: OpportunityListQuery,
): Prisma.OpportunityOrderByWithRelationInput {
  if (query.sortBy === "name") {
    return { name: query.sortDirection };
  }

  if (query.sortBy === "updatedAt") {
    return { updatedAt: query.sortDirection };
  }

  return { createdAt: query.sortDirection };
}

function getProposalOrderBy(query: ProposalListQuery): Prisma.ProposalOrderByWithRelationInput {
  if (query.sortBy === "name") {
    return { title: query.sortDirection };
  }

  if (query.sortBy === "updatedAt") {
    return { updatedAt: query.sortDirection };
  }

  return { createdAt: query.sortDirection };
}

function getActivityOrderBy(query: ActivityListQuery): Prisma.CrmActivityOrderByWithRelationInput {
  if (query.sortBy === "updatedAt") {
    return { updatedAt: query.sortDirection };
  }

  return { dueAt: query.sortDirection };
}

function getVendorOrderBy(query: VendorListQuery): Prisma.VendorOrderByWithRelationInput {
  if (query.sortBy === "name") {
    return { name: query.sortDirection };
  }

  if (query.sortBy === "updatedAt") {
    return { updatedAt: query.sortDirection };
  }

  return { createdAt: query.sortDirection };
}

function getCandidateOrderBy(query: CandidateListQuery): Prisma.CandidateOrderByWithRelationInput {
  if (query.sortBy === "firstName") {
    return { firstName: query.sortDirection };
  }

  if (query.sortBy === "lastName") {
    return { lastName: query.sortDirection };
  }

  if (query.sortBy === "updatedAt") {
    return { updatedAt: query.sortDirection };
  }

  return { createdAt: query.sortDirection };
}

function getRequirementOrderBy(
  query: RequirementListQuery,
): Prisma.StaffAugRequirementOrderByWithRelationInput {
  if (query.sortBy === "name") {
    return { roleTitle: query.sortDirection };
  }

  if (query.sortBy === "updatedAt") {
    return { updatedAt: query.sortDirection };
  }

  return { createdAt: query.sortDirection };
}

function getSubmissionOrderBy(
  query: SubmissionListQuery,
): Prisma.CandidateSubmissionOrderByWithRelationInput {
  if (query.sortBy === "updatedAt") {
    return { updatedAt: query.sortDirection };
  }

  return { submittedAt: query.sortDirection };
}

function getInterviewOrderBy(query: InterviewListQuery): Prisma.InterviewOrderByWithRelationInput {
  if (query.sortBy === "updatedAt") {
    return { updatedAt: query.sortDirection };
  }

  return { scheduledAt: query.sortDirection };
}

function getPlacementOrderBy(query: PlacementListQuery): Prisma.PlacementOrderByWithRelationInput {
  if (query.sortBy === "updatedAt") {
    return { updatedAt: query.sortDirection };
  }

  return { joiningDate: query.sortDirection };
}

function calculateVendorScore(input: {
  deliveryScore?: number;
  qualityScore?: number;
  responsivenessScore?: number;
  complianceScore?: number;
}): number {
  const scores = [
    input.deliveryScore ?? 0,
    input.qualityScore ?? 0,
    input.responsivenessScore ?? 0,
    input.complianceScore ?? 0,
  ];

  return Math.round(scores.reduce((sum, score) => sum + score, 0) / scores.length);
}

function validateVendorRisk(riskStatus?: VendorRiskStatus, riskReason?: string): void {
  if (
    (riskStatus === VendorRiskStatus.WARNING || riskStatus === VendorRiskStatus.BLACKLISTED) &&
    (riskReason === undefined || riskReason.length === 0)
  ) {
    throw new AppError(
      "VALIDATION_ERROR",
      "Warning or blacklisted vendors require a risk reason",
      400,
    );
  }
}

function validateCandidateBlacklist(blacklisted?: boolean, blacklistReason?: string): void {
  if (blacklisted === true && (blacklistReason === undefined || blacklistReason.length === 0)) {
    throw new AppError("VALIDATION_ERROR", "Blacklisted candidates require a reason", 400);
  }
}

function hasResumeUpload(input: {
  resumeFileName?: string;
  resumeStorageKey?: string;
  resumeMimeType?: string;
  resumeSizeBytes?: number;
}): boolean {
  return (
    input.resumeFileName !== undefined ||
    input.resumeStorageKey !== undefined ||
    input.resumeMimeType !== undefined ||
    input.resumeSizeBytes !== undefined
  );
}

function buildCandidateResumeFields(input: {
  resumeFileName?: string;
  resumeStorageKey?: string;
  resumeMimeType?: string;
  resumeSizeBytes?: number;
}): {
  resumeUploadedAt?: Date;
  resumeParsed?: boolean;
  resumeParseStatus?: string;
  parsedResumeJson?: Prisma.InputJsonValue;
} {
  if (!hasResumeUpload(input)) {
    return {};
  }

  return {
    resumeUploadedAt: new Date(),
    resumeParsed: false,
    resumeParseStatus: "QUEUED",
    parsedResumeJson: {
      placeholder: true,
      fileName: input.resumeFileName,
      message: "Resume parsing placeholder queued for AI extraction.",
    },
  };
}

function getCandidateConsentCapturedAt(
  input: { consentStatus?: boolean; consentCapturedAt?: Date },
  existingConsentCapturedAt?: Date | null,
): Date | undefined {
  if (input.consentCapturedAt !== undefined) {
    return input.consentCapturedAt;
  }

  if (input.consentStatus === true && existingConsentCapturedAt == null) {
    return new Date();
  }

  return undefined;
}

function validateRequirementRanges(input: {
  minExperienceYears?: number;
  maxExperienceYears?: number;
  budgetMinCents?: number;
  budgetMaxCents?: number;
}): void {
  if (
    input.minExperienceYears !== undefined &&
    input.maxExperienceYears !== undefined &&
    input.minExperienceYears > input.maxExperienceYears
  ) {
    throw new AppError("VALIDATION_ERROR", "Minimum experience cannot exceed maximum", 400);
  }

  if (
    input.budgetMinCents !== undefined &&
    input.budgetMaxCents !== undefined &&
    input.budgetMinCents > input.budgetMaxCents
  ) {
    throw new AppError("VALIDATION_ERROR", "Minimum budget cannot exceed maximum", 400);
  }
}

function validatePlacementFinancials(input: {
  clientBillingRateCents: number;
  vendorCostCents: number;
}): void {
  if (input.vendorCostCents > input.clientBillingRateCents) {
    throw new AppError("VALIDATION_ERROR", "Vendor cost cannot exceed client billing rate", 400);
  }
}

function calculatePlacementMargin(input: {
  clientBillingRateCents: number;
  vendorCostCents: number;
}): { marginCents: number; marginPercentBasis: number } {
  const marginCents = input.clientBillingRateCents - input.vendorCostCents;

  return {
    marginCents,
    marginPercentBasis:
      input.clientBillingRateCents === 0
        ? 0
        : Math.round((marginCents / input.clientBillingRateCents) * 10_000),
  };
}

function normalizeSubmissionLifecycle<TInput extends { status?: SubmissionStatus }>(
  input: TInput & {
    technicalReviewNotes?: string;
    clientSubmittedAt?: Date;
    interviewScheduledAt?: Date;
  },
): TInput & {
  technicalReviewedAt?: Date;
  clientSubmittedAt?: Date;
  interviewScheduledAt?: Date;
} {
  return {
    ...input,
    ...(input.status === SubmissionStatus.TECHNICAL_REVIEW ||
    input.technicalReviewNotes !== undefined
      ? { technicalReviewedAt: new Date() }
      : {}),
    ...(input.status === SubmissionStatus.CLIENT_SUBMITTED && input.clientSubmittedAt === undefined
      ? { clientSubmittedAt: new Date() }
      : {}),
    ...(input.status === SubmissionStatus.INTERVIEW_SCHEDULED &&
    input.interviewScheduledAt === undefined
      ? { interviewScheduledAt: new Date() }
      : {}),
  };
}

function toActivityView<
  T extends { status: ActivityStatus; dueAt: Date | null; completedAt: Date | null },
>(activity: T): T & { isOverdue: boolean } {
  return {
    ...activity,
    isOverdue:
      activity.status === ActivityStatus.OPEN &&
      activity.completedAt === null &&
      activity.dueAt !== null &&
      activity.dueAt < new Date(),
  };
}

async function assertNoDuplicateAccount(
  tenantId: string,
  input: { name?: string; domain?: string; website?: string },
  excludeId?: string,
): Promise<void> {
  const domain = normalizeDomain(input.domain ?? input.website);
  const duplicateFilters: Prisma.AccountWhereInput[] = [
    ...(input.name === undefined
      ? []
      : [{ name: { equals: input.name, mode: Prisma.QueryMode.insensitive } }]),
    ...(domain === undefined
      ? []
      : [{ domain: { equals: domain, mode: Prisma.QueryMode.insensitive } }]),
  ];
  const duplicate = await prisma.account.findFirst({
    where: {
      tenantId,
      deletedAt: null,
      ...(excludeId === undefined ? {} : { id: { not: excludeId } }),
      OR: duplicateFilters,
    },
    select: { id: true },
  });

  if (duplicate !== null) {
    throw new AppError("CONFLICT", "Duplicate account detected", 409);
  }
}

async function assertNoDuplicateLead(
  tenantId: string,
  input: {
    email?: string;
    phone?: string;
    company?: string;
    companyDomain?: string;
    website?: string;
  },
  excludeId?: string,
): Promise<void> {
  const companyDomain = normalizeDomain(input.companyDomain ?? input.website);
  const duplicateFilters: Prisma.LeadWhereInput[] = [
    ...(input.email === undefined
      ? []
      : [{ email: { equals: input.email, mode: Prisma.QueryMode.insensitive } }]),
    ...(input.phone === undefined ? [] : [{ phone: input.phone }]),
    ...(input.company === undefined
      ? []
      : [{ company: { equals: input.company, mode: Prisma.QueryMode.insensitive } }]),
    ...(companyDomain === undefined
      ? []
      : [{ companyDomain: { equals: companyDomain, mode: Prisma.QueryMode.insensitive } }]),
  ];

  if (duplicateFilters.length === 0) {
    return;
  }

  const duplicate = await prisma.lead.findFirst({
    where: {
      tenantId,
      deletedAt: null,
      ...(excludeId === undefined ? {} : { id: { not: excludeId } }),
      OR: duplicateFilters,
    },
    select: { id: true },
  });

  if (duplicate !== null) {
    throw new AppError("CONFLICT", "Duplicate lead detected", 409);
  }
}

async function assertNoDuplicateContact(
  tenantId: string,
  input: { email?: string; phone?: string },
  excludeId?: string,
): Promise<void> {
  if (input.email === undefined && input.phone === undefined) {
    return;
  }

  const duplicateFilters: Prisma.ContactWhereInput[] = [
    ...(input.email === undefined
      ? []
      : [{ email: { equals: input.email, mode: Prisma.QueryMode.insensitive } }]),
    ...(input.phone === undefined ? [] : [{ phone: input.phone }]),
  ];
  const duplicate = await prisma.contact.findFirst({
    where: {
      tenantId,
      deletedAt: null,
      ...(excludeId === undefined ? {} : { id: { not: excludeId } }),
      OR: duplicateFilters,
    },
    select: { id: true },
  });

  if (duplicate !== null) {
    throw new AppError("CONFLICT", "Duplicate contact detected", 409);
  }
}

async function assertAccountExists(tenantId: string, accountId: string): Promise<void> {
  const account = await prisma.account.findFirst({
    where: { id: accountId, tenantId, deletedAt: null },
    select: { id: true },
  });

  if (account === null) {
    throw new AppError("NOT_FOUND", "Account not found", 404);
  }
}

async function assertLeadExists(
  tenantId: string,
  leadId: string,
): Promise<{
  email: string | null;
  phone: string | null;
  company: string | null;
  serviceInterest: string | null;
  budgetRange: string | null;
  followUpAt: Date | null;
}> {
  const lead = await prisma.lead.findFirst({
    where: { id: leadId, tenantId, deletedAt: null },
    select: {
      email: true,
      phone: true,
      company: true,
      serviceInterest: true,
      budgetRange: true,
      followUpAt: true,
    },
  });

  if (lead === null) {
    throw new AppError("NOT_FOUND", "Lead not found", 404);
  }

  return lead;
}

async function assertContactExists(tenantId: string, contactId: string): Promise<void> {
  const contact = await prisma.contact.findFirst({
    where: { id: contactId, tenantId, deletedAt: null },
    select: { id: true },
  });

  if (contact === null) {
    throw new AppError("NOT_FOUND", "Contact not found", 404);
  }
}

async function assertContactAccountBelongsToTenant(
  tenantId: string,
  accountId?: string,
): Promise<void> {
  if (accountId === undefined) {
    return;
  }

  await assertAccountExists(tenantId, accountId);
}

async function assertOpportunityExists(
  tenantId: string,
  opportunityId: string,
): Promise<{
  stage: OpportunityStage;
  probability: number;
  valueCents: number;
  currency: string;
  lostReason: string | null;
  wonAt: Date | null;
  lostAt: Date | null;
}> {
  const opportunity = await prisma.opportunity.findFirst({
    where: { id: opportunityId, tenantId, deletedAt: null },
    select: {
      stage: true,
      probability: true,
      valueCents: true,
      currency: true,
      lostReason: true,
      wonAt: true,
      lostAt: true,
    },
  });

  if (opportunity === null) {
    throw new AppError("NOT_FOUND", "Opportunity not found", 404);
  }

  return opportunity;
}

async function assertOpportunityRelationsBelongToTenant(
  tenantId: string,
  input: { accountId?: string; primaryContactId?: string; leadId?: string },
): Promise<void> {
  if (input.accountId !== undefined) {
    await assertAccountExists(tenantId, input.accountId);
  }

  if (input.primaryContactId !== undefined) {
    await assertContactExists(tenantId, input.primaryContactId);
  }

  if (input.leadId !== undefined) {
    await assertLeadExists(tenantId, input.leadId);
  }
}

async function assertOpportunityOwnerBelongsToTenant(
  tenantId: string,
  ownerId?: string,
): Promise<void> {
  if (ownerId === undefined) {
    return;
  }

  const owner = await prisma.user.findFirst({
    where: { id: ownerId, tenantId, deletedAt: null },
    select: { id: true },
  });

  if (owner === null) {
    throw new AppError(
      "VALIDATION_ERROR",
      "Opportunity owner must belong to the active tenant",
      400,
    );
  }
}

async function assertProposalExists(
  tenantId: string,
  proposalId: string,
): Promise<{
  id: string;
  title: string;
  templateKey: string;
  status: ProposalStatus;
  currentVersionNumber: number;
}> {
  const proposal = await prisma.proposal.findFirst({
    where: { id: proposalId, tenantId, deletedAt: null },
    select: {
      id: true,
      title: true,
      templateKey: true,
      status: true,
      currentVersionNumber: true,
    },
  });

  if (proposal === null) {
    throw new AppError("NOT_FOUND", "Proposal not found", 404);
  }

  return proposal;
}

async function assertActivityExists(tenantId: string, activityId: string): Promise<void> {
  const activity = await prisma.crmActivity.findFirst({
    where: { id: activityId, tenantId, deletedAt: null },
    select: { id: true },
  });

  if (activity === null) {
    throw new AppError("NOT_FOUND", "Activity not found", 404);
  }
}

async function assertVendorExists(
  tenantId: string,
  vendorId: string,
): Promise<{
  riskStatus: VendorRiskStatus;
  riskReason: string | null;
  deliveryScore: number;
  qualityScore: number;
  responsivenessScore: number;
  complianceScore: number;
}> {
  const vendor = await prisma.vendor.findFirst({
    where: { id: vendorId, tenantId, deletedAt: null },
    select: {
      riskStatus: true,
      riskReason: true,
      deliveryScore: true,
      qualityScore: true,
      responsivenessScore: true,
      complianceScore: true,
    },
  });

  if (vendor === null) {
    throw new AppError("NOT_FOUND", "Vendor not found", 404);
  }

  return vendor;
}

async function assertCandidateExists(
  tenantId: string,
  candidateId: string,
): Promise<{
  blacklisted: boolean;
  blacklistReason: string | null;
  consentCapturedAt: Date | null;
  vendorId: string | null;
}> {
  const candidate = await prisma.candidate.findFirst({
    where: { id: candidateId, tenantId, deletedAt: null },
    select: {
      blacklisted: true,
      blacklistReason: true,
      consentCapturedAt: true,
      vendorId: true,
    },
  });

  if (candidate === null) {
    throw new AppError("NOT_FOUND", "Candidate not found", 404);
  }

  return candidate;
}

async function assertRequirementExists(
  tenantId: string,
  requirementId: string,
): Promise<{
  minExperienceYears: number | null;
  maxExperienceYears: number | null;
  budgetMinCents: number | null;
  budgetMaxCents: number | null;
}> {
  const requirement = await prisma.staffAugRequirement.findFirst({
    where: { id: requirementId, tenantId, deletedAt: null },
    select: {
      minExperienceYears: true,
      maxExperienceYears: true,
      budgetMinCents: true,
      budgetMaxCents: true,
    },
  });

  if (requirement === null) {
    throw new AppError("NOT_FOUND", "Requirement not found", 404);
  }

  return requirement;
}

async function assertSubmissionExists(
  tenantId: string,
  submissionId: string,
): Promise<{
  candidateId: string;
  requirementId: string;
  vendorId: string | null;
}> {
  const submission = await prisma.candidateSubmission.findFirst({
    where: { id: submissionId, tenantId, deletedAt: null },
    select: { candidateId: true, requirementId: true, vendorId: true },
  });

  if (submission === null) {
    throw new AppError("NOT_FOUND", "Submission not found", 404);
  }

  return submission;
}

async function assertInterviewExists(tenantId: string, interviewId: string): Promise<void> {
  const interview = await prisma.interview.findFirst({
    where: { id: interviewId, tenantId, deletedAt: null },
    select: { id: true },
  });

  if (interview === null) {
    throw new AppError("NOT_FOUND", "Interview not found", 404);
  }
}

async function assertPlacementExists(
  tenantId: string,
  placementId: string,
): Promise<{
  clientBillingRateCents: number;
  vendorCostCents: number;
}> {
  const placement = await prisma.placement.findFirst({
    where: { id: placementId, tenantId, deletedAt: null },
    select: { clientBillingRateCents: true, vendorCostCents: true },
  });

  if (placement === null) {
    throw new AppError("NOT_FOUND", "Placement not found", 404);
  }

  return placement;
}

async function assertNoDuplicateVendor(
  tenantId: string,
  input: { name?: string; domain?: string; website?: string; portalSlug?: string },
  excludeId?: string,
): Promise<void> {
  const domain = normalizeDomain(input.domain ?? input.website);
  const duplicateFilters: Prisma.VendorWhereInput[] = [
    ...(input.name === undefined
      ? []
      : [{ name: { equals: input.name, mode: Prisma.QueryMode.insensitive } }]),
    ...(domain === undefined
      ? []
      : [{ domain: { equals: domain, mode: Prisma.QueryMode.insensitive } }]),
    ...(input.portalSlug === undefined
      ? []
      : [{ portalSlug: { equals: input.portalSlug, mode: Prisma.QueryMode.insensitive } }]),
  ];

  if (duplicateFilters.length === 0) {
    return;
  }

  const duplicate = await prisma.vendor.findFirst({
    where: {
      tenantId,
      deletedAt: null,
      ...(excludeId === undefined ? {} : { id: { not: excludeId } }),
      OR: duplicateFilters,
    },
    select: { id: true },
  });

  if (duplicate !== null) {
    throw new AppError("CONFLICT", "Duplicate vendor detected", 409);
  }
}

async function assertNoDuplicateCandidate(
  tenantId: string,
  input: { email?: string; phone?: string },
  excludeId?: string,
): Promise<void> {
  if (input.email === undefined && input.phone === undefined) {
    return;
  }

  const duplicateFilters: Prisma.CandidateWhereInput[] = [
    ...(input.email === undefined
      ? []
      : [{ email: { equals: input.email, mode: Prisma.QueryMode.insensitive } }]),
    ...(input.phone === undefined ? [] : [{ phone: input.phone }]),
  ];
  const duplicate = await prisma.candidate.findFirst({
    where: {
      tenantId,
      deletedAt: null,
      ...(excludeId === undefined ? {} : { id: { not: excludeId } }),
      OR: duplicateFilters,
    },
    select: { id: true },
  });

  if (duplicate !== null) {
    throw new AppError("CONFLICT", "Duplicate candidate detected", 409);
  }
}

async function assertCandidateVendorBelongsToTenant(
  tenantId: string,
  vendorId?: string,
): Promise<void> {
  if (vendorId === undefined) {
    return;
  }

  await assertVendorExists(tenantId, vendorId);
}

async function assertRequirementRelationsBelongToTenant(
  tenantId: string,
  input: { accountId?: string; opportunityId?: string },
): Promise<void> {
  if (input.accountId !== undefined) {
    await assertAccountExists(tenantId, input.accountId);
  }

  if (input.opportunityId !== undefined) {
    await assertOpportunityExists(tenantId, input.opportunityId);
  }
}

async function assertCandidateSubmissionRelations(
  tenantId: string,
  input: { candidateId: string; vendorId?: string },
): Promise<{ vendorId: string | null }> {
  const candidate = await assertCandidateExists(tenantId, input.candidateId);
  await assertSubmissionVendorBelongsToTenant(tenantId, input.vendorId);

  return { vendorId: candidate.vendorId };
}

async function assertSubmissionVendorBelongsToTenant(
  tenantId: string,
  vendorId?: string,
): Promise<void> {
  if (vendorId === undefined) {
    return;
  }

  await assertVendorExists(tenantId, vendorId);
}

async function assertNoDuplicateSubmission(
  tenantId: string,
  requirementId: string,
  candidateId: string,
): Promise<void> {
  const duplicate = await prisma.candidateSubmission.findFirst({
    where: { tenantId, requirementId, candidateId, deletedAt: null },
    select: { id: true },
  });

  if (duplicate !== null) {
    throw new AppError("CONFLICT", "Candidate already submitted to this requirement", 409);
  }
}

async function assertProposalRelationsBelongToTenant(
  tenantId: string,
  input: { opportunityId?: string; accountId?: string; contactId?: string },
): Promise<void> {
  if (input.opportunityId !== undefined) {
    await assertOpportunityExists(tenantId, input.opportunityId);
  }

  if (input.accountId !== undefined) {
    await assertAccountExists(tenantId, input.accountId);
  }

  if (input.contactId !== undefined) {
    await assertContactExists(tenantId, input.contactId);
  }
}

async function assertActivityRelationsBelongToTenant(
  tenantId: string,
  input: {
    leadId?: string;
    accountId?: string;
    contactId?: string;
    opportunityId?: string;
    proposalId?: string;
    vendorId?: string;
    candidateId?: string;
  },
): Promise<void> {
  if (input.leadId !== undefined) {
    await assertLeadExists(tenantId, input.leadId);
  }

  if (input.accountId !== undefined) {
    await assertAccountExists(tenantId, input.accountId);
  }

  if (input.contactId !== undefined) {
    await assertContactExists(tenantId, input.contactId);
  }

  if (input.opportunityId !== undefined) {
    await assertOpportunityExists(tenantId, input.opportunityId);
  }

  if (input.proposalId !== undefined) {
    await assertProposalExists(tenantId, input.proposalId);
  }

  if (input.vendorId !== undefined) {
    await assertVendorExists(tenantId, input.vendorId);
  }

  if (input.candidateId !== undefined) {
    await assertCandidateExists(tenantId, input.candidateId);
  }
}

async function assertTenantUserExists(
  tenantId: string,
  userId: string | undefined,
  message: string,
): Promise<void> {
  if (userId === undefined) {
    return;
  }

  const user = await prisma.user.findFirst({
    where: { id: userId, tenantId, deletedAt: null },
    select: { id: true },
  });

  if (user === null) {
    throw new AppError("VALIDATION_ERROR", message, 400);
  }
}

async function assertLeadOwnerBelongsToTenant(tenantId: string, ownerId?: string): Promise<void> {
  if (ownerId === undefined) {
    return;
  }

  const owner = await prisma.user.findFirst({
    where: { id: ownerId, tenantId, deletedAt: null },
    select: { id: true },
  });

  if (owner === null) {
    throw new AppError("VALIDATION_ERROR", "Lead owner must belong to the active tenant", 400);
  }
}

async function createAuditLog(
  actor: CrmActor,
  context: CrmRequestContext,
  input: {
    action: string;
    entityType: string;
    entityId: string;
    tenantId: string;
    metadata?: Record<string, unknown>;
  },
): Promise<void> {
  await prisma.auditLog.create({
    data: {
      tenantId: input.tenantId,
      actorUserId: actor.sub,
      action: input.action,
      entityType: input.entityType,
      entityId: input.entityId,
      ipAddress: context.ipAddress,
      userAgent: context.userAgent,
      metadata: input.metadata as Prisma.InputJsonValue | undefined,
    },
  });
}

function requireTenant(actor: CrmActor): string {
  if (actor.tenantId === null) {
    throw new AppError("TENANT_001", "Tenant context is required", 403);
  }

  return actor.tenantId;
}

function normalizeDomain(value?: string): string | undefined {
  if (value === undefined || value.trim().length === 0) {
    return undefined;
  }

  return value
    .trim()
    .toLowerCase()
    .replace(/^https?:\/\//u, "")
    .replace(/^www\./u, "")
    .split("/")[0];
}

function getAccountOrderBy(query: AccountListQuery): Prisma.AccountOrderByWithRelationInput {
  if (query.sortBy === "name") {
    return { name: query.sortDirection };
  }

  if (query.sortBy === "updatedAt") {
    return { updatedAt: query.sortDirection };
  }

  return { createdAt: query.sortDirection };
}

function getLeadOrderBy(query: LeadListQuery): Prisma.LeadOrderByWithRelationInput {
  if (query.sortBy === "updatedAt") {
    return { updatedAt: query.sortDirection };
  }

  if (query.sortBy === "firstName") {
    return { firstName: query.sortDirection };
  }

  if (query.sortBy === "lastName") {
    return { lastName: query.sortDirection };
  }

  return { createdAt: query.sortDirection };
}

function getContactOrderBy(query: ContactListQuery): Prisma.ContactOrderByWithRelationInput {
  if (query.sortBy === "firstName") {
    return { firstName: query.sortDirection };
  }

  if (query.sortBy === "lastName") {
    return { lastName: query.sortDirection };
  }

  if (query.sortBy === "updatedAt") {
    return { updatedAt: query.sortDirection };
  }

  return { createdAt: query.sortDirection };
}

function toPaginatedResult<TItem>(
  items: TItem[],
  total: number,
  page: number,
  pageSize: number,
): PaginatedResult<TItem> {
  return {
    items,
    pagination: {
      page,
      pageSize,
      total,
      totalPages: Math.ceil(total / pageSize),
    },
  };
}

function getRecordId(value: unknown): string {
  if (
    typeof value === "object" &&
    value !== null &&
    "id" in value &&
    typeof value.id === "string"
  ) {
    return value.id;
  }

  throw new Error("Record id missing");
}

function scoreLead(input: {
  email?: string;
  phone?: string;
  company?: string;
  serviceInterest?: string;
  budgetRange?: string;
  followUpAt?: Date;
}): { score: number; reason: string } {
  let score = 20;
  const reasons: string[] = ["Base lead score"];

  if (input.email !== undefined && !input.email.endsWith("@gmail.com")) {
    score += 25;
    reasons.push("business email");
  }

  if (input.phone !== undefined) {
    score += 10;
    reasons.push("phone available");
  }

  if (input.company !== undefined) {
    score += 15;
    reasons.push("company provided");
  }

  if (input.serviceInterest !== undefined) {
    score += 15;
    reasons.push("service interest provided");
  }

  if (input.budgetRange !== undefined) {
    score += 10;
    reasons.push("budget range provided");
  }

  if (input.followUpAt !== undefined) {
    score += 5;
    reasons.push("follow-up scheduled");
  }

  return {
    score: Math.min(score, 100),
    reason: reasons.join(", "),
  };
}
