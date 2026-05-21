import { randomUUID } from "node:crypto";

import { describe, expect, it } from "vitest";

import {
  createCrmActivity,
  convertLeadToOpportunity,
  createAccount,
  createCandidate,
  createContact,
  createInterview,
  createLead,
  createOpportunity,
  createPlacement,
  createProposal,
  createProposalVersion,
  createRequirement,
  createVendor,
  decideProposal,
  deleteCandidate,
  deleteInterview,
  deletePlacement,
  deleteRequirement,
  deleteSubmission,
  deleteVendor,
  listCandidates,
  listCrmActivities,
  listInterviews,
  listPlacements,
  listRequirements,
  listSubmissions,
  listProposals,
  listVendors,
  deleteAccount,
  deleteLead,
  requestProposalPdfExport,
  submitProposal,
  updateCrmActivity,
  updateCandidate,
  updateVendor,
  listOpportunities,
  listOpportunityPipeline,
  listAccounts,
  listLeads,
  updateContact,
  updateInterview,
  updateLead,
  updateOpportunity,
  updatePlacement,
  submitCandidateToRequirement,
  updateRequirement,
  updateSubmission,
} from "../src/modules/crm/crm.service.js";
import type { CrmActor } from "../src/modules/crm/crm.types.js";
import { prisma } from "../src/shared/prisma/client.js";

describe("crm service", (): void => {
  it("schedules interviews and creates placements with calculated margins", async (): Promise<void> => {
    const actor = await getTenantActor();
    const account = await createAccount(actor, {}, { name: `Interview Account ${randomUUID()}` });
    const vendor = await createVendor(
      actor,
      {},
      { name: `Interview Vendor ${randomUUID()}`, companyOwnershipTag: "Virtual Coders" },
    );
    const candidate = await createCandidate(
      actor,
      {},
      {
        vendorId: getId(vendor),
        firstName: "Interview",
        lastName: "Candidate",
        email: `interview-${randomUUID()}@example.com`,
      },
    );
    const requirement = await createRequirement(
      actor,
      {},
      {
        accountId: getId(account),
        roleTitle: `Interview Requirement ${randomUUID()}`,
        skills: ["React"],
      },
    );
    const submission = await submitCandidateToRequirement(actor, {}, getId(requirement), {
      candidateId: getId(candidate),
    });

    const interview = await createInterview(
      actor,
      {},
      {
        submissionId: getId(submission),
        roundNumber: 1,
        interviewer: "Client Panel",
        scheduledAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
      },
    );
    const interviewId = getId(interview);
    expect(interview).toMatchObject({ roundNumber: 1, outcome: "PENDING" });

    const passed = await updateInterview(actor, {}, interviewId, {
      outcome: "PASSED",
      feedback: "Strong communication and technical depth",
    });
    expect(passed).toMatchObject({ outcome: "PASSED" });

    const listedInterviews = await listInterviews(actor, {
      page: 1,
      pageSize: 10,
      sortDirection: "desc",
      outcome: "PASSED",
    });
    expect(listedInterviews.items.some((item) => getId(item) === interviewId)).toBe(true);

    await expect(
      createPlacement(
        actor,
        {},
        {
          submissionId: getId(submission),
          clientBillingRateCents: 200_000,
          vendorCostCents: 250_000,
          joiningDate: new Date(),
        },
      ),
    ).rejects.toMatchObject({ code: "VALIDATION_ERROR" });

    const placement = await createPlacement(
      actor,
      {},
      {
        submissionId: getId(submission),
        clientBillingRateCents: 320_000,
        vendorCostCents: 240_000,
        joiningDate: new Date(),
        replacementPeriodDays: 60,
        billingStatus: "ACTIVE",
      },
    );
    const placementId = getId(placement);
    expect(placement).toMatchObject({
      marginCents: 80_000,
      marginPercentBasis: 2500,
      billingStatus: "ACTIVE",
    });

    const updatedPlacement = await updatePlacement(actor, {}, placementId, {
      clientBillingRateCents: 400_000,
    });
    expect(updatedPlacement).toMatchObject({ marginCents: 160_000, marginPercentBasis: 4000 });

    const listedPlacements = await listPlacements(actor, {
      page: 1,
      pageSize: 10,
      sortDirection: "desc",
      billingStatus: "ACTIVE",
    });
    expect(listedPlacements.items.some((item) => getId(item) === placementId)).toBe(true);

    await deleteInterview(actor, {}, interviewId);
    await deletePlacement(actor, {}, placementId);
  });

  it("creates requirements and tracks candidate submissions without duplicates", async (): Promise<void> => {
    const actor = await getTenantActor();
    const account = await createAccount(actor, {}, { name: `Requirement Account ${randomUUID()}` });
    const vendor = await createVendor(
      actor,
      {},
      { name: `Requirement Vendor ${randomUUID()}`, companyOwnershipTag: "Virtual Coders" },
    );
    const candidate = await createCandidate(
      actor,
      {},
      {
        vendorId: getId(vendor),
        firstName: "Submit",
        lastName: "Candidate",
        email: `submission-${randomUUID()}@example.com`,
        primarySkills: ["React", "TypeScript"],
      },
    );
    const requirement = await createRequirement(
      actor,
      {},
      {
        accountId: getId(account),
        roleTitle: `React Requirement ${randomUUID()}`,
        skills: ["React", "TypeScript"],
        minExperienceYears: 4,
        maxExperienceYears: 8,
        budgetMinCents: 2_000_000,
        budgetMaxCents: 3_200_000,
        location: "Ahmedabad",
        workMode: "HYBRID",
        positions: 2,
        priority: "HIGH",
        status: "OPEN",
      },
    );
    const requirementId = getId(requirement);

    const listed = await listRequirements(actor, {
      page: 1,
      pageSize: 10,
      sortDirection: "desc",
      skill: "React",
      workMode: "HYBRID",
    });
    expect(listed.items.some((item) => getId(item) === requirementId)).toBe(true);

    const submission = await submitCandidateToRequirement(actor, {}, requirementId, {
      candidateId: getId(candidate),
      status: "TECHNICAL_REVIEW",
      technicalReviewNotes: "Strong React fundamentals",
    });
    const submissionId = getId(submission);
    expect(submission).toMatchObject({
      status: "TECHNICAL_REVIEW",
      vendorId: getId(vendor),
    });

    await expect(
      submitCandidateToRequirement(actor, {}, requirementId, { candidateId: getId(candidate) }),
    ).rejects.toMatchObject({ code: "CONFLICT" });

    const clientSubmitted = await updateSubmission(actor, {}, submissionId, {
      status: "CLIENT_SUBMITTED",
    });
    expect(clientSubmitted).toMatchObject({ status: "CLIENT_SUBMITTED" });
    expect((clientSubmitted as { clientSubmittedAt?: Date }).clientSubmittedAt).toBeInstanceOf(
      Date,
    );

    const tracked = await listSubmissions(actor, {
      page: 1,
      pageSize: 10,
      sortDirection: "desc",
      requirementId,
      status: "CLIENT_SUBMITTED",
    });
    expect(tracked.items.some((item) => getId(item) === submissionId)).toBe(true);

    await updateRequirement(actor, {}, requirementId, { status: "ON_HOLD" });
    await deleteSubmission(actor, {}, submissionId);
    await deleteRequirement(actor, {}, requirementId);
  });

  it("creates, filters, validates, updates, and soft deletes candidates", async (): Promise<void> => {
    const actor = await getTenantActor();
    const vendor = await createVendor(
      actor,
      {},
      {
        name: `Candidate Vendor ${randomUUID()}`,
        companyOwnershipTag: "Virtual Coders",
        status: "ACTIVE",
      },
    );
    const email = `candidate-${randomUUID()}@example.com`;
    const phone = `+91 ${randomUUID().slice(0, 8)}`;
    const candidate = await createCandidate(
      actor,
      {},
      {
        vendorId: getId(vendor),
        firstName: "Service",
        lastName: "Candidate",
        email,
        phone,
        resumeFileName: "service-candidate.pdf",
        resumeStorageKey: `resumes/${randomUUID()}.pdf`,
        resumeMimeType: "application/pdf",
        resumeSizeBytes: 128_000,
        primarySkills: ["React", "TypeScript"],
        secondarySkills: ["Node.js"],
        experienceYears: 5.5,
        currentCtcCents: 1_800_000,
        expectedCtcCents: 2_400_000,
        noticePeriodDays: 30,
        city: "Ahmedabad",
        country: "India",
        availability: "NOTICE_PERIOD",
        consentStatus: true,
      },
    );
    const candidateId = getId(candidate);

    expect(candidate).toMatchObject({
      resumeParseStatus: "QUEUED",
      resumeParsed: false,
      consentStatus: true,
      vendorId: getId(vendor),
    });
    expect((candidate as { consentCapturedAt?: Date }).consentCapturedAt).toBeInstanceOf(Date);

    const listed = await listCandidates(actor, {
      page: 1,
      pageSize: 10,
      sortDirection: "desc",
      primarySkill: "React",
      availability: "NOTICE_PERIOD",
    });
    expect(listed.items.some((item) => getId(item) === candidateId)).toBe(true);

    await expect(
      createCandidate(actor, {}, { firstName: "Duplicate", lastName: "Candidate", email }),
    ).rejects.toMatchObject({ code: "CONFLICT" });
    await expect(
      createCandidate(actor, {}, { firstName: "Duplicate", lastName: "Phone", phone }),
    ).rejects.toMatchObject({ code: "CONFLICT" });
    await expect(
      updateCandidate(actor, {}, candidateId, { blacklisted: true }),
    ).rejects.toMatchObject({ code: "VALIDATION_ERROR" });

    const blacklisted = await updateCandidate(actor, {}, candidateId, {
      blacklisted: true,
      blacklistReason: "Duplicate profile under review",
    });
    expect(blacklisted).toMatchObject({
      blacklisted: true,
      blacklistReason: "Duplicate profile under review",
    });

    await deleteCandidate(actor, {}, candidateId);
    const deleted = await prisma.candidate.findUniqueOrThrow({
      where: { id: candidateId },
      select: { deletedAt: true },
    });
    expect(deleted.deletedAt).toBeInstanceOf(Date);
  });

  it("creates, filters, scores, updates, and soft deletes vendors", async (): Promise<void> => {
    const actor = await getTenantActor();
    const vendor = await createVendor(
      actor,
      {},
      {
        name: `Vendor ${randomUUID()}`,
        website: `https://${randomUUID()}.vendor.example.com`,
        categories: ["staffing", "implementation"],
        expertiseSkills: ["React", "Node.js", "AWS"],
        decisionMakerName: "Priya Vendor",
        decisionMakerEmail: `vendor-${randomUUID()}@example.com`,
        city: "Ahmedabad",
        state: "Gujarat",
        country: "India",
        companyOwnershipTag: "Virtual Coders",
        ndaStatus: "SIGNED",
        msaStatus: "IN_REVIEW",
        rateCard: { currency: "INR", roles: [{ role: "React Developer", monthly: 250000 }] },
        tier: "PREFERRED",
        status: "ACTIVE",
        deliveryScore: 80,
        qualityScore: 90,
        responsivenessScore: 70,
        complianceScore: 100,
        portalEnabled: true,
        portalSlug: `vendor-${randomUUID().replaceAll("-", "").slice(0, 10)}`,
      },
    );
    const vendorId = getId(vendor);

    expect(vendor).toMatchObject({
      ndaStatus: "SIGNED",
      msaStatus: "IN_REVIEW",
      tier: "PREFERRED",
      overallScore: 85,
      portalEnabled: true,
    });

    const listed = await listVendors(actor, {
      page: 1,
      pageSize: 10,
      sortDirection: "desc",
      skill: "React",
      category: "staffing",
      riskStatus: "CLEAR",
    });
    expect(listed.items.some((item) => getId(item) === vendorId)).toBe(true);

    await expect(
      updateVendor(actor, {}, vendorId, { riskStatus: "BLACKLISTED" }),
    ).rejects.toMatchObject({ code: "VALIDATION_ERROR" });

    const warned = await updateVendor(actor, {}, vendorId, {
      riskStatus: "WARNING",
      riskReason: "SLA misses",
      responsivenessScore: 60,
    });
    expect(warned).toMatchObject({ riskStatus: "WARNING", riskReason: "SLA misses" });

    await deleteVendor(actor, {}, vendorId);
    const deleted = await prisma.vendor.findUniqueOrThrow({
      where: { id: vendorId },
      select: { deletedAt: true },
    });
    expect(deleted.deletedAt).toBeInstanceOf(Date);
  });

  it("creates proposal versions and approval workflow records", async (): Promise<void> => {
    const actor = await getTenantActor();
    const account = await createAccount(actor, {}, { name: `Proposal Account ${randomUUID()}` });
    const proposal = await createProposal(
      actor,
      {},
      {
        accountId: getId(account),
        title: `Proposal ${randomUUID()}`,
        templateKey: "staff-augmentation",
        contentJson: { sections: ["overview"] },
        approvalRole: "sales-manager",
        valueCents: 750_000,
      },
    );
    const proposalId = getId(proposal);

    const versioned = await createProposalVersion(actor, {}, proposalId, {
      contentJson: { sections: ["overview", "pricing"] },
      changeNote: "Added pricing",
    });
    expect(versioned).toMatchObject({ currentVersionNumber: 2, status: "DRAFT" });

    const submitted = await submitProposal(actor, {}, proposalId, {
      approvalRole: "sales-manager",
    });
    expect(submitted).toMatchObject({ status: "SUBMITTED", approvalRole: "sales-manager" });

    const queue = await listProposals(actor, {
      page: 1,
      pageSize: 10,
      sortDirection: "desc",
      approvalQueue: true,
    });
    expect(queue.items.some((item) => getId(item) === proposalId)).toBe(true);

    const approved = await decideProposal(actor, {}, proposalId, {
      decision: "APPROVED",
      comment: "Commercials approved",
    });
    expect(approved).toMatchObject({ status: "APPROVED" });

    const exported = await requestProposalPdfExport(actor, {}, proposalId);
    expect((exported as { pdfExportRequestedAt?: Date }).pdfExportRequestedAt).toBeInstanceOf(Date);
  });

  it("creates activities, detects overdue tasks, and completes reminders", async (): Promise<void> => {
    const actor = await getTenantActor();
    const account = await createAccount(actor, {}, { name: `Activity Account ${randomUUID()}` });
    const activity = await createCrmActivity(
      actor,
      {},
      {
        type: "TASK",
        title: `Follow up ${randomUUID()}`,
        accountId: getId(account),
        dueAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
        reminderAt: new Date(),
      },
    );
    const activityId = getId(activity);

    expect(activity).toMatchObject({ isOverdue: true, status: "OPEN" });

    const overdue = await listCrmActivities(actor, {
      page: 1,
      pageSize: 10,
      sortDirection: "asc",
      overdueOnly: true,
    });
    expect(overdue.items.some((item) => getId(item) === activityId)).toBe(true);

    const completed = await updateCrmActivity(actor, {}, activityId, { status: "COMPLETED" });
    expect(completed).toMatchObject({ isOverdue: false, status: "COMPLETED" });
  });

  it("converts a lead into account, contact, and opportunity once", async (): Promise<void> => {
    const actor = await getTenantActor();
    const lead = await createLead(
      actor,
      {},
      {
        firstName: "Convert",
        lastName: "Lead",
        email: `convert-${randomUUID()}@example.com`,
        company: `Convert Company ${randomUUID()}`,
        source: "Website",
        serviceInterest: "Salesforce team",
      },
    );
    const leadId = getId(lead);

    const opportunity = await convertLeadToOpportunity(actor, {}, leadId, {
      valueCents: 2_500_000,
      currency: "INR",
      expectedCloseDate: new Date(),
    });

    expect(opportunity).toMatchObject({
      stage: "QUALIFICATION",
      probability: 10,
      weightedForecastCents: 250_000,
    });

    const convertedLead = await prisma.lead.findUniqueOrThrow({
      where: { id: leadId },
      select: { status: true },
    });
    const opportunityId = getId(opportunity);
    const createdCounts = await Promise.all([
      prisma.account.count({ where: { opportunities: { some: { id: opportunityId } } } }),
      prisma.contact.count({ where: { opportunities: { some: { id: opportunityId } } } }),
      prisma.opportunityStageHistory.count({ where: { opportunityId } }),
    ]);

    expect(convertedLead.status).toBe("CONVERTED");
    expect(createdCounts).toEqual([1, 1, 1]);
    await expect(
      convertLeadToOpportunity(actor, {}, leadId, { valueCents: 1 }),
    ).rejects.toMatchObject({
      code: "CONFLICT",
    });
  });

  it("validates opportunity stage movement, forecast, and stagnant deals", async (): Promise<void> => {
    const actor = await getTenantActor();
    const account = await createAccount(actor, {}, { name: `Opportunity Account ${randomUUID()}` });
    const opportunity = await createOpportunity(
      actor,
      {},
      {
        accountId: getId(account),
        name: `Opportunity ${randomUUID()}`,
        valueCents: 1_000_000,
        currency: "INR",
      },
    );
    const opportunityId = getId(opportunity);

    await expect(
      updateOpportunity(actor, {}, opportunityId, { stage: "PROPOSAL" }),
    ).rejects.toMatchObject({ code: "VALIDATION_ERROR" });

    const discovery = await updateOpportunity(actor, {}, opportunityId, { stage: "DISCOVERY" });
    expect(discovery).toMatchObject({
      stage: "DISCOVERY",
      probability: 20,
      weightedForecastCents: 200_000,
    });

    await prisma.opportunity.update({
      where: { id: opportunityId },
      data: { stageChangedAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000) },
    });
    const stagnant = await listOpportunities(actor, {
      page: 1,
      pageSize: 10,
      sortDirection: "desc",
      stagnantOnly: true,
    });
    const pipeline = await listOpportunityPipeline(actor);

    expect(stagnant.items.some((item) => getId(item) === opportunityId)).toBe(true);
    expect(Array.isArray(pipeline)).toBe(true);

    await expect(
      updateOpportunity(actor, {}, opportunityId, { stage: "LOST" }),
    ).rejects.toMatchObject({ code: "VALIDATION_ERROR" });
    const lost = await updateOpportunity(actor, {}, opportunityId, {
      stage: "LOST",
      lostReason: "Budget paused",
    });
    expect(lost).toMatchObject({ stage: "LOST", probability: 0, weightedForecastCents: 0 });
  });

  it("creates, scores, updates, and soft deletes tenant-scoped leads with timeline/audit", async (): Promise<void> => {
    const actor = await getTenantActor();
    const email = `lead-service-${randomUUID()}@example.com`;
    const lead = await createLead(
      actor,
      {},
      {
        firstName: "Service",
        lastName: "Lead",
        email,
        phone: "+91 99999 10000",
        company: `Lead Company ${randomUUID()}`,
        source: "Website",
        serviceInterest: "Staff augmentation",
        budgetRange: "10L-25L",
        followUpAt: new Date(),
      },
    );
    const leadId = getId(lead);

    const listed = await listLeads(actor, {
      page: 1,
      pageSize: 10,
      search: "Service",
      sortDirection: "desc",
      status: "NEW",
    });

    expect(listed.items.length).toBeGreaterThan(0);
    expect((lead as { score?: number }).score).toBeGreaterThan(20);

    await updateLead(actor, {}, leadId, {
      status: "DISQUALIFIED",
      disqualifiedReason: "Not an ICP fit",
    });

    const timelineCount = await prisma.activityTimelineItem.count({
      where: { tenantId: actor.tenantId ?? "", leadId },
    });
    const auditCount = await prisma.auditLog.count({
      where: { tenantId: actor.tenantId, entityId: leadId, action: { startsWith: "leads." } },
    });

    expect(timelineCount).toBeGreaterThan(1);
    expect(auditCount).toBeGreaterThan(1);

    await deleteLead(actor, {}, leadId);
    const deleted = await prisma.lead.findUniqueOrThrow({
      where: { id: leadId },
      select: { deletedAt: true },
    });
    expect(deleted.deletedAt).toBeInstanceOf(Date);
  });

  it("detects duplicate leads by email, phone, and company", async (): Promise<void> => {
    const actor = await getTenantActor();
    const email = `lead-duplicate-${randomUUID()}@example.com`;
    const phone = `+91 ${randomUUID().slice(0, 8)}`;
    const company = `Lead Duplicate ${randomUUID()}`;

    await createLead(
      actor,
      {},
      { firstName: "One", lastName: "Lead", email, phone, company, source: "Referral" },
    );

    await expect(
      createLead(actor, {}, { firstName: "Two", lastName: "Lead", email, source: "Referral" }),
    ).rejects.toMatchObject({ code: "CONFLICT" });
    await expect(
      createLead(actor, {}, { firstName: "Three", lastName: "Lead", phone, source: "Referral" }),
    ).rejects.toMatchObject({ code: "CONFLICT" });
    await expect(
      createLead(actor, {}, { firstName: "Four", lastName: "Lead", company, source: "Referral" }),
    ).rejects.toMatchObject({ code: "CONFLICT" });
  });

  it("creates tenant-scoped account/contact records, timeline entries, and audit logs", async (): Promise<void> => {
    const actor = await getTenantActor();
    const name = `Service Account ${randomUUID()}`;
    const account = await createAccount(
      actor,
      {},
      { name, website: `https://${randomUUID()}.service.example.com` },
    );
    const accountId = getId(account);

    const contact = await createContact(
      actor,
      {},
      {
        accountId,
        firstName: "Service",
        lastName: "Contact",
        email: `service-${randomUUID()}@example.com`,
      },
    );

    const fetched = await listAccounts(actor, {
      page: 1,
      pageSize: 10,
      search: "Service Account",
      sortDirection: "desc",
    });

    expect(fetched.items.length).toBeGreaterThan(0);
    expect(getId(contact)).toEqual(expect.any(String));

    const timelineCount = await prisma.activityTimelineItem.count({
      where: { tenantId: actor.tenantId ?? "", accountId },
    });
    const auditCount = await prisma.auditLog.count({
      where: { tenantId: actor.tenantId, entityId: accountId, action: "accounts.created" },
    });

    expect(timelineCount).toBeGreaterThan(0);
    expect(auditCount).toBe(1);
  });

  it("rejects duplicate accounts and soft deletes accounts", async (): Promise<void> => {
    const actor = await getTenantActor();
    const name = `Duplicate Account ${randomUUID()}`;
    const account = await createAccount(actor, {}, { name, domain: "duplicate.example.com" });

    await expect(createAccount(actor, {}, { name })).rejects.toMatchObject({ code: "CONFLICT" });

    await deleteAccount(actor, {}, getId(account));

    const deleted = await prisma.account.findUniqueOrThrow({
      where: { id: getId(account) },
      select: { deletedAt: true },
    });

    expect(deleted.deletedAt).toBeInstanceOf(Date);
  });

  it("rejects contact account relations outside the actor tenant", async (): Promise<void> => {
    const actor = await getTenantActor();
    const otherTenant = await prisma.tenant.create({
      data: {
        name: `Other ${randomUUID()}`,
        slug: `other-${randomUUID().replaceAll("-", "").slice(0, 12)}`,
      },
      select: { id: true },
    });
    const otherAccount = await prisma.account.create({
      data: {
        tenantId: otherTenant.id,
        name: `Other Account ${randomUUID()}`,
      },
      select: { id: true },
    });

    await expect(
      createContact(
        actor,
        {},
        {
          accountId: otherAccount.id,
          firstName: "Cross",
          lastName: "Tenant",
        },
      ),
    ).rejects.toMatchObject({ code: "NOT_FOUND" });
  });

  it("detects duplicate contacts and updates contact timeline", async (): Promise<void> => {
    const actor = await getTenantActor();
    const email = `contact-${randomUUID()}@example.com`;
    const contact = await createContact(actor, {}, { firstName: "A", lastName: "One", email });

    await expect(
      createContact(actor, {}, { firstName: "B", lastName: "Two", email }),
    ).rejects.toMatchObject({
      code: "CONFLICT",
    });

    await updateContact(actor, {}, getId(contact), { title: "CTO" });

    const timelineCount = await prisma.activityTimelineItem.count({
      where: { tenantId: actor.tenantId ?? "", contactId: getId(contact), type: "contact.updated" },
    });

    expect(timelineCount).toBe(1);
  });
});

async function getTenantActor(): Promise<CrmActor> {
  const user = await prisma.user.findUniqueOrThrow({
    where: { email: "tenant.admin@virtualcoders.local" },
    select: { id: true, tenantId: true, email: true },
  });

  return {
    sub: user.id,
    tenantId: user.tenantId,
    email: user.email,
    isSuperAdmin: false,
    permissions: [],
    type: "access",
  };
}

function getId(value: unknown): string {
  if (
    typeof value === "object" &&
    value !== null &&
    "id" in value &&
    typeof value.id === "string"
  ) {
    return value.id;
  }

  throw new Error("Missing id");
}
