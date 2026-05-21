import { randomUUID } from "node:crypto";

import bcrypt from "bcrypt";
import { RoleScope, UserStatus } from "@prisma/client";
import request from "supertest";
import { afterAll, beforeEach, describe, expect, it } from "vitest";

import { createApp } from "../src/app.js";
import { resetRateLimitBuckets } from "../src/shared/middleware/rate-limit.middleware.js";
import { prisma } from "../src/shared/prisma/client.js";

type JsonObject = Record<string, unknown>;

const app = createApp();
const seededPassword = "Password123!";
const testDomain = "crm.test";

beforeEach((): void => {
  resetRateLimitBuckets();
});

afterAll(async (): Promise<void> => {
  await prisma.placement.deleteMany({
    where: {
      OR: [
        { requirement: { roleTitle: { contains: "CRM Test" } } },
        { candidate: { email: { endsWith: `@${testDomain}` } } },
      ],
    },
  });
  await prisma.interview.deleteMany({
    where: {
      OR: [
        { requirement: { roleTitle: { contains: "CRM Test" } } },
        { candidate: { email: { endsWith: `@${testDomain}` } } },
      ],
    },
  });
  await prisma.candidateSubmission.deleteMany({
    where: {
      OR: [
        { requirement: { roleTitle: { contains: "CRM Test" } } },
        { candidate: { email: { endsWith: `@${testDomain}` } } },
      ],
    },
  });
  await prisma.staffAugRequirement.deleteMany({
    where: { roleTitle: { contains: "CRM Test" } },
  });
  await prisma.candidate.deleteMany({
    where: {
      OR: [{ email: { endsWith: `@${testDomain}` } }, { firstName: { contains: "CRM Test" } }],
    },
  });
  await prisma.vendor.deleteMany({
    where: { name: { contains: "CRM Test" } },
  });
  await prisma.crmActivity.deleteMany({
    where: { title: { contains: "CRM Test" } },
  });
  await prisma.proposal.deleteMany({
    where: { title: { contains: "CRM Test" } },
  });
  await prisma.opportunity.deleteMany({
    where: {
      OR: [{ name: { contains: "CRM Test" } }, { account: { name: { contains: "CRM Test" } } }],
    },
  });
  await prisma.lead.deleteMany({
    where: { email: { endsWith: `@${testDomain}` } },
  });
  await prisma.activityTimelineItem.deleteMany({
    where: { title: { contains: "CRM Test" } },
  });
  await prisma.contact.deleteMany({
    where: { email: { endsWith: `@${testDomain}` } },
  });
  await prisma.account.deleteMany({
    where: { name: { contains: "CRM Test" } },
  });
  await prisma.userRole.deleteMany({
    where: { user: { email: { endsWith: `@${testDomain}` } } },
  });
  await prisma.role.deleteMany({
    where: { uniqueKey: { startsWith: "crm-test:" } },
  });
  await prisma.user.deleteMany({
    where: { email: { endsWith: `@${testDomain}` } },
  });
  await prisma.$disconnect();
});

describe("crm API", (): void => {
  it("supports interviews and placements with finance margin calculation", async (): Promise<void> => {
    const token = await login("tenant.admin@virtualcoders.local");
    const tenantId = await getDemoTenantId();
    const requirement = await prisma.staffAugRequirement.create({
      data: {
        tenantId,
        roleTitle: `CRM Test Placement Requirement ${randomUUID()}`,
      },
      select: { id: true },
    });
    const candidate = await prisma.candidate.create({
      data: {
        tenantId,
        firstName: "CRM Test",
        lastName: "Placed Candidate",
        email: `placement-${randomUUID()}@${testDomain}`,
      },
      select: { id: true },
    });
    const submission = await prisma.candidateSubmission.create({
      data: {
        tenantId,
        requirementId: requirement.id,
        candidateId: candidate.id,
      },
      select: { id: true },
    });

    const interviewResponse = await request(app)
      .post("/api/v1/interviews")
      .set("authorization", `Bearer ${token}`)
      .send({
        submissionId: submission.id,
        roundNumber: 1,
        interviewer: "Client Panel",
        scheduledAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
      })
      .expect(201);
    const interviewId = String(getData(interviewResponse).id);
    expect(getData(interviewResponse)).toMatchObject({
      roundNumber: 1,
      outcome: "PENDING",
    });

    await request(app)
      .patch(`/api/v1/interviews/${interviewId}`)
      .set("authorization", `Bearer ${token}`)
      .send({ outcome: "PASSED", feedback: "Approved for placement" })
      .expect(200);
    await request(app)
      .get("/api/v1/interviews")
      .query({ outcome: "PASSED" })
      .set("authorization", `Bearer ${token}`)
      .expect(200);

    await request(app)
      .post("/api/v1/placements")
      .set("authorization", `Bearer ${token}`)
      .send({
        submissionId: submission.id,
        clientBillingRateCents: 200000,
        vendorCostCents: 250000,
        joiningDate: new Date().toISOString(),
      })
      .expect(400);

    const placementResponse = await request(app)
      .post("/api/v1/placements")
      .set("authorization", `Bearer ${token}`)
      .send({
        submissionId: submission.id,
        clientBillingRateCents: 320000,
        vendorCostCents: 240000,
        joiningDate: new Date().toISOString(),
        replacementPeriodDays: 60,
        billingStatus: "ACTIVE",
      })
      .expect(201);
    const placementId = String(getData(placementResponse).id);
    expect(getData(placementResponse)).toMatchObject({
      marginCents: 80000,
      marginPercentBasis: 2500,
      billingStatus: "ACTIVE",
    });

    await request(app)
      .get(`/api/v1/placements/${placementId}`)
      .set("authorization", `Bearer ${token}`)
      .expect(200);
    await request(app)
      .get("/api/v1/placements")
      .query({ billingStatus: "ACTIVE" })
      .set("authorization", `Bearer ${token}`)
      .expect(200);
    await request(app)
      .delete(`/api/v1/interviews/${interviewId}`)
      .set("authorization", `Bearer ${token}`)
      .expect(200);
    await request(app)
      .delete(`/api/v1/placements/${placementId}`)
      .set("authorization", `Bearer ${token}`)
      .expect(200);
  });

  it("supports requirement CRUD and candidate submission pipeline", async (): Promise<void> => {
    const token = await login("tenant.admin@virtualcoders.local");
    const tenantId = await getDemoTenantId();
    const account = await prisma.account.create({
      data: {
        tenantId,
        name: `CRM Test Requirement Account ${randomUUID()}`,
      },
      select: { id: true },
    });
    const candidate = await prisma.candidate.create({
      data: {
        tenantId,
        firstName: "CRM Test",
        lastName: "Submitted Candidate",
        email: `submitted-${randomUUID()}@${testDomain}`,
        primarySkills: ["React", "TypeScript"],
      },
      select: { id: true },
    });

    const created = await request(app)
      .post("/api/v1/requirements")
      .set("authorization", `Bearer ${token}`)
      .send({
        accountId: account.id,
        roleTitle: `CRM Test Senior React ${randomUUID()}`,
        skills: ["React", "TypeScript"],
        minExperienceYears: 5,
        maxExperienceYears: 8,
        budgetMinCents: 2400000,
        budgetMaxCents: 3200000,
        location: "Ahmedabad",
        workMode: "HYBRID",
        positions: 3,
        priority: "HIGH",
        status: "OPEN",
      })
      .expect(201);
    const requirement = getData(created);
    const requirementId = String(requirement.id);

    expect(requirement).toMatchObject({
      accountId: account.id,
      workMode: "HYBRID",
      positions: 3,
      priority: "HIGH",
    });

    await request(app)
      .get("/api/v1/requirements")
      .query({ search: "CRM Test Senior React", skill: "React", workMode: "HYBRID" })
      .set("authorization", `Bearer ${token}`)
      .expect(200);
    await request(app)
      .get(`/api/v1/requirements/${requirementId}`)
      .set("authorization", `Bearer ${token}`)
      .expect(200);

    const submitted = await request(app)
      .post(`/api/v1/requirements/${requirementId}/submissions`)
      .set("authorization", `Bearer ${token}`)
      .send({
        candidateId: candidate.id,
        status: "TECHNICAL_REVIEW",
        technicalReviewNotes: "Good skills match",
      })
      .expect(201);
    const submissionId = String(getData(submitted).id);
    expect(getData(submitted)).toMatchObject({ status: "TECHNICAL_REVIEW" });

    await request(app)
      .post(`/api/v1/requirements/${requirementId}/submissions`)
      .set("authorization", `Bearer ${token}`)
      .send({ candidateId: candidate.id })
      .expect(409);
    await request(app)
      .patch(`/api/v1/submissions/${submissionId}`)
      .set("authorization", `Bearer ${token}`)
      .send({
        status: "INTERVIEW_SCHEDULED",
        interviewPlaceholder: "Client panel placeholder",
        feedback: "Proceed to first round",
        feedbackRating: 4,
      })
      .expect(200);
    await request(app)
      .get(`/api/v1/requirements/${requirementId}/submissions`)
      .set("authorization", `Bearer ${token}`)
      .expect(200);
    await request(app)
      .get("/api/v1/submissions")
      .query({ requirementId, status: "INTERVIEW_SCHEDULED" })
      .set("authorization", `Bearer ${token}`)
      .expect(200);
    await request(app)
      .delete(`/api/v1/submissions/${submissionId}`)
      .set("authorization", `Bearer ${token}`)
      .expect(200);
    await request(app)
      .delete(`/api/v1/requirements/${requirementId}`)
      .set("authorization", `Bearer ${token}`)
      .expect(200);
  });

  it("enforces requirement RBAC and tenant isolation", async (): Promise<void> => {
    const token = await login(await createUserWithoutCrmPermissions());

    await request(app)
      .get("/api/v1/requirements")
      .set("authorization", `Bearer ${token}`)
      .expect(403);

    const tenantToken = await login("tenant.admin@virtualcoders.local");
    const otherTenant = await prisma.tenant.create({
      data: {
        name: `CRM Test Requirement Other ${randomUUID()}`,
        slug: `requirement-test-${randomUUID().replaceAll("-", "").slice(0, 12)}`,
      },
      select: { id: true },
    });
    const otherRequirement = await prisma.staffAugRequirement.create({
      data: {
        tenantId: otherTenant.id,
        roleTitle: `CRM Test Other Requirement ${randomUUID()}`,
      },
      select: { id: true },
    });

    await request(app)
      .get(`/api/v1/requirements/${otherRequirement.id}`)
      .set("authorization", `Bearer ${tenantToken}`)
      .expect(404);
  });

  it("supports candidate CRUD, resume metadata, consent, vendor links, and duplicate checks", async (): Promise<void> => {
    const token = await login("tenant.admin@virtualcoders.local");
    const tenantId = await getDemoTenantId();
    const vendor = await prisma.vendor.create({
      data: {
        tenantId,
        name: `CRM Test Candidate Vendor ${randomUUID()}`,
        companyOwnershipTag: "Virtual Coders",
        status: "ACTIVE",
      },
      select: { id: true },
    });
    const email = `candidate-api-${randomUUID()}@${testDomain}`;
    const phone = `+91 ${randomUUID().slice(0, 8)}`;
    const created = await request(app)
      .post("/api/v1/candidates")
      .set("authorization", `Bearer ${token}`)
      .send({
        vendorId: vendor.id,
        firstName: "CRM Test",
        lastName: "Candidate",
        email,
        phone,
        resumeFileName: "crm-test-candidate.pdf",
        resumeStorageKey: `resumes/${randomUUID()}.pdf`,
        resumeMimeType: "application/pdf",
        resumeSizeBytes: 256000,
        primarySkills: ["React", "TypeScript"],
        secondarySkills: ["Node.js"],
        experienceYears: 6,
        currentCtcCents: 1800000,
        expectedCtcCents: 2600000,
        noticePeriodDays: 30,
        city: "Ahmedabad",
        country: "India",
        availability: "NOTICE_PERIOD",
        consentStatus: true,
      })
      .expect(201);
    const candidate = getData(created);
    const candidateId = String(candidate.id);

    expect(candidate).toMatchObject({
      email,
      vendorId: vendor.id,
      resumeParseStatus: "QUEUED",
      consentStatus: true,
    });

    await request(app)
      .get("/api/v1/candidates")
      .query({ search: "CRM Test", primarySkill: "React", availability: "NOTICE_PERIOD" })
      .set("authorization", `Bearer ${token}`)
      .expect(200);
    await request(app)
      .get(`/api/v1/candidates/${candidateId}`)
      .set("authorization", `Bearer ${token}`)
      .expect(200);
    await request(app)
      .post("/api/v1/candidates")
      .set("authorization", `Bearer ${token}`)
      .send({ firstName: "Dup", lastName: "Candidate", email })
      .expect(409);
    await request(app)
      .patch(`/api/v1/candidates/${candidateId}`)
      .set("authorization", `Bearer ${token}`)
      .send({ blacklisted: true })
      .expect(400);
    await request(app)
      .patch(`/api/v1/candidates/${candidateId}`)
      .set("authorization", `Bearer ${token}`)
      .send({ blacklisted: true, blacklistReason: "Duplicate profile" })
      .expect(200);
    await request(app)
      .delete(`/api/v1/candidates/${candidateId}`)
      .set("authorization", `Bearer ${token}`)
      .expect(200);
  });

  it("enforces candidate RBAC and tenant isolation", async (): Promise<void> => {
    const token = await login(await createUserWithoutCrmPermissions());

    await request(app)
      .get("/api/v1/candidates")
      .set("authorization", `Bearer ${token}`)
      .expect(403);

    const tenantToken = await login("tenant.admin@virtualcoders.local");
    const otherTenant = await prisma.tenant.create({
      data: {
        name: `CRM Test Candidate Other ${randomUUID()}`,
        slug: `candidate-test-${randomUUID().replaceAll("-", "").slice(0, 12)}`,
      },
      select: { id: true },
    });
    const otherCandidate = await prisma.candidate.create({
      data: {
        tenantId: otherTenant.id,
        firstName: "Other",
        lastName: "Candidate",
      },
      select: { id: true },
    });

    await request(app)
      .get(`/api/v1/candidates/${otherCandidate.id}`)
      .set("authorization", `Bearer ${tenantToken}`)
      .expect(404);
  });

  it("supports vendor CRUD, scorecards, documents, portal fields, and warnings", async (): Promise<void> => {
    const token = await login("tenant.admin@virtualcoders.local");
    const name = `CRM Test Vendor ${randomUUID()}`;
    const created = await request(app)
      .post("/api/v1/vendors")
      .set("authorization", `Bearer ${token}`)
      .send({
        name,
        website: "https://crm-test-vendor.example.com",
        categories: ["staffing", "salesforce"],
        expertiseSkills: ["Salesforce", "QA automation"],
        decisionMakerName: "Vendor Leader",
        decisionMakerEmail: `vendor-${randomUUID()}@${testDomain}`,
        city: "Pune",
        country: "India",
        companyOwnershipTag: "Virtual Coders",
        ndaStatus: "SIGNED",
        msaStatus: "REQUESTED",
        rateCard: { currency: "INR", roles: [{ role: "QA Engineer", monthly: 180000 }] },
        tier: "PREFERRED",
        status: "ACTIVE",
        deliveryScore: 80,
        qualityScore: 80,
        responsivenessScore: 80,
        complianceScore: 100,
        portalEnabled: true,
        portalSlug: `crm-test-${randomUUID().replaceAll("-", "").slice(0, 10)}`,
      })
      .expect(201);
    const vendorId = String(getData(created).id);

    expect(getData(created)).toMatchObject({
      name,
      tier: "PREFERRED",
      ndaStatus: "SIGNED",
      overallScore: 85,
      portalEnabled: true,
    });

    await request(app)
      .get("/api/v1/vendors")
      .query({ search: "CRM Test Vendor", skill: "Salesforce", category: "staffing" })
      .set("authorization", `Bearer ${token}`)
      .expect(200);
    await request(app)
      .patch(`/api/v1/vendors/${vendorId}`)
      .set("authorization", `Bearer ${token}`)
      .send({ riskStatus: "BLACKLISTED" })
      .expect(400);
    await request(app)
      .patch(`/api/v1/vendors/${vendorId}`)
      .set("authorization", `Bearer ${token}`)
      .send({ riskStatus: "WARNING", riskReason: "Reference check pending" })
      .expect(200);
    await request(app)
      .get(`/api/v1/vendors/${vendorId}`)
      .set("authorization", `Bearer ${token}`)
      .expect(200);
    await request(app)
      .delete(`/api/v1/vendors/${vendorId}`)
      .set("authorization", `Bearer ${token}`)
      .expect(200);
  });

  it("enforces vendor RBAC and tenant isolation", async (): Promise<void> => {
    const token = await login(await createUserWithoutCrmPermissions());

    await request(app).get("/api/v1/vendors").set("authorization", `Bearer ${token}`).expect(403);

    const tenantToken = await login("tenant.admin@virtualcoders.local");
    const otherTenant = await prisma.tenant.create({
      data: {
        name: `CRM Test Vendor Other ${randomUUID()}`,
        slug: `vendor-test-${randomUUID().replaceAll("-", "").slice(0, 12)}`,
      },
      select: { id: true },
    });
    const otherVendor = await prisma.vendor.create({
      data: {
        tenantId: otherTenant.id,
        name: `CRM Test Other Vendor ${randomUUID()}`,
        companyOwnershipTag: "Other Co",
      },
      select: { id: true },
    });

    await request(app)
      .get(`/api/v1/vendors/${otherVendor.id}`)
      .set("authorization", `Bearer ${tenantToken}`)
      .expect(404);
  });

  it("supports proposal CRUD, versioning, approvals, and PDF export placeholder", async (): Promise<void> => {
    const token = await login("tenant.admin@virtualcoders.local");
    const account = await prisma.account.create({
      data: {
        tenantId: await getDemoTenantId(),
        name: `CRM Test Proposal Account ${randomUUID()}`,
      },
      select: { id: true },
    });

    const created = await request(app)
      .post("/api/v1/proposals")
      .set("authorization", `Bearer ${token}`)
      .send({
        accountId: account.id,
        title: `CRM Test Proposal ${randomUUID()}`,
        templateKey: "staff-augmentation",
        contentJson: { sections: ["overview"] },
        approvalRole: "sales-manager",
        valueCents: 1_250_000,
      })
      .expect(201);
    const proposalId = String(getData(created).id);

    await request(app)
      .post(`/api/v1/proposals/${proposalId}/versions`)
      .set("authorization", `Bearer ${token}`)
      .send({ contentJson: { sections: ["overview", "pricing"] }, changeNote: "Pricing added" })
      .expect(201);

    await request(app)
      .post(`/api/v1/proposals/${proposalId}/submit`)
      .set("authorization", `Bearer ${token}`)
      .send({ approvalRole: "sales-manager" })
      .expect(200);

    const queue = await request(app)
      .get("/api/v1/proposals")
      .query({ approvalQueue: true })
      .set("authorization", `Bearer ${token}`)
      .expect(200);
    expect((getData(queue).items as unknown[]).length).toBeGreaterThan(0);

    const approved = await request(app)
      .post(`/api/v1/proposals/${proposalId}/decision`)
      .set("authorization", `Bearer ${token}`)
      .send({ decision: "APPROVED", comment: "Approved for sending" })
      .expect(200);
    expect(getData(approved)).toMatchObject({ status: "APPROVED", currentVersionNumber: 2 });

    const exported = await request(app)
      .post(`/api/v1/proposals/${proposalId}/pdf-export`)
      .set("authorization", `Bearer ${token}`)
      .expect(200);
    expect(getData(exported).pdfExportRequestedAt).toEqual(expect.any(String));

    await request(app)
      .patch(`/api/v1/proposals/${proposalId}`)
      .set("authorization", `Bearer ${token}`)
      .send({ status: "SENT" })
      .expect(200);
    await request(app)
      .delete(`/api/v1/proposals/${proposalId}`)
      .set("authorization", `Bearer ${token}`)
      .expect(200);
  });

  it("supports activities, reminders, linked entities, and overdue detection", async (): Promise<void> => {
    const token = await login("tenant.admin@virtualcoders.local");
    const account = await prisma.account.create({
      data: {
        tenantId: await getDemoTenantId(),
        name: `CRM Test Activity Account ${randomUUID()}`,
      },
      select: { id: true },
    });

    const created = await request(app)
      .post("/api/v1/activities")
      .set("authorization", `Bearer ${token}`)
      .send({
        type: "TASK",
        title: `CRM Test Follow up ${randomUUID()}`,
        accountId: account.id,
        dueAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
        reminderAt: new Date().toISOString(),
        vendorRef: "vendor-placeholder",
      })
      .expect(201);
    const activityId = String(getData(created).id);
    expect(getData(created)).toMatchObject({ isOverdue: true, type: "TASK" });

    await request(app)
      .get("/api/v1/activities")
      .query({ overdueOnly: true })
      .set("authorization", `Bearer ${token}`)
      .expect(200);
    await request(app)
      .patch(`/api/v1/activities/${activityId}`)
      .set("authorization", `Bearer ${token}`)
      .send({ status: "COMPLETED" })
      .expect(200);
    await request(app)
      .delete(`/api/v1/activities/${activityId}`)
      .set("authorization", `Bearer ${token}`)
      .expect(200);
  });

  it("converts leads and supports opportunity list, detail, pipeline, stage movement, and delete", async (): Promise<void> => {
    const token = await login("tenant.admin@virtualcoders.local");
    const leadResponse = await request(app)
      .post("/api/v1/leads")
      .set("authorization", `Bearer ${token}`)
      .send({
        firstName: "CRM",
        lastName: "Opportunity",
        email: `opportunity-lead-${randomUUID()}@${testDomain}`,
        company: `CRM Test Opportunity Company ${randomUUID()}`,
        source: "Website",
        serviceInterest: "Dedicated team",
      })
      .expect(201);
    const leadId = String(getData(leadResponse).id);

    const convertResponse = await request(app)
      .post(`/api/v1/leads/${leadId}/convert`)
      .set("authorization", `Bearer ${token}`)
      .send({
        valueCents: 5_000_000,
        currency: "INR",
        expectedCloseDate: new Date().toISOString(),
      })
      .expect(201);
    const opportunity = getData(convertResponse);
    const opportunityId = String(opportunity.id);

    expect(opportunity).toMatchObject({
      leadId,
      stage: "QUALIFICATION",
      weightedForecastCents: 500_000,
    });

    await request(app)
      .post(`/api/v1/leads/${leadId}/convert`)
      .set("authorization", `Bearer ${token}`)
      .send({ valueCents: 1 })
      .expect(409);

    await request(app)
      .get("/api/v1/opportunities")
      .query({ search: "CRM Test", stage: "QUALIFICATION" })
      .set("authorization", `Bearer ${token}`)
      .expect(200);
    await request(app)
      .get("/api/v1/opportunities/pipeline")
      .set("authorization", `Bearer ${token}`)
      .expect(200);
    await request(app)
      .get(`/api/v1/opportunities/${opportunityId}`)
      .set("authorization", `Bearer ${token}`)
      .expect(200);
    await request(app)
      .patch(`/api/v1/opportunities/${opportunityId}`)
      .set("authorization", `Bearer ${token}`)
      .send({ stage: "PROPOSAL" })
      .expect(400);
    const movedResponse = await request(app)
      .patch(`/api/v1/opportunities/${opportunityId}`)
      .set("authorization", `Bearer ${token}`)
      .send({ stage: "DISCOVERY" })
      .expect(200);

    expect(getData(movedResponse)).toMatchObject({ stage: "DISCOVERY", probability: 20 });

    await request(app)
      .delete(`/api/v1/opportunities/${opportunityId}`)
      .set("authorization", `Bearer ${token}`)
      .expect(200);
  });

  it("enforces opportunity RBAC and tenant isolation", async (): Promise<void> => {
    const token = await login(await createUserWithoutCrmPermissions());

    await request(app)
      .get("/api/v1/opportunities")
      .set("authorization", `Bearer ${token}`)
      .expect(403);

    const tenantToken = await login("tenant.admin@virtualcoders.local");
    const otherTenant = await prisma.tenant.create({
      data: {
        name: `CRM Test Opportunity Other ${randomUUID()}`,
        slug: `opportunity-test-${randomUUID().replaceAll("-", "").slice(0, 12)}`,
      },
      select: { id: true },
    });
    const otherOpportunity = await prisma.opportunity.create({
      data: {
        tenantId: otherTenant.id,
        name: `CRM Test Other Opportunity ${randomUUID()}`,
        stage: "QUALIFICATION",
      },
      select: { id: true },
    });

    await request(app)
      .get(`/api/v1/opportunities/${otherOpportunity.id}`)
      .set("authorization", `Bearer ${tenantToken}`)
      .expect(404);
  });

  it("supports lead CRUD, lifecycle, filters, scoring, timeline, and audit logs", async (): Promise<void> => {
    const token = await login("tenant.admin@virtualcoders.local");
    const tenantAdmin = await prisma.user.findUniqueOrThrow({
      where: { email: "tenant.admin@virtualcoders.local" },
      select: { id: true },
    });
    const email = `lead-api-${randomUUID()}@${testDomain}`;
    const company = `CRM Test Lead Company ${randomUUID()}`;

    const createResponse = await request(app)
      .post("/api/v1/leads")
      .set("authorization", `Bearer ${token}`)
      .send({
        firstName: "API",
        lastName: "Lead",
        email,
        phone: "+91 98765 43210",
        company,
        source: "Website",
        ownerId: tenantAdmin.id,
        serviceInterest: "Dedicated team",
        budgetRange: "25L-50L",
        followUpAt: new Date().toISOString(),
        importBatchId: "test-import-batch",
        importExternalId: "row-1",
        importSourceFilename: "leads.csv",
      })
      .expect(201);
    const lead = getData(createResponse);
    const leadId = String(lead.id);

    expect(lead).toMatchObject({
      email,
      source: "Website",
      status: "NEW",
      ownerId: tenantAdmin.id,
      importBatchId: "test-import-batch",
    });
    expect(Number(lead.score)).toBeGreaterThan(20);

    const listResponse = await request(app)
      .get("/api/v1/leads")
      .query({ page: 1, pageSize: 5, search: "API", source: "Website", status: "NEW" })
      .set("authorization", `Bearer ${token}`)
      .expect(200);
    const listData = getData(listResponse);
    expect((listData.items as unknown[]).length).toBeGreaterThan(0);

    const detailResponse = await request(app)
      .get(`/api/v1/leads/${leadId}`)
      .set("authorization", `Bearer ${token}`)
      .expect(200);
    expect(getData(detailResponse).activities).toEqual(expect.any(Array));

    await request(app)
      .patch(`/api/v1/leads/${leadId}`)
      .set("authorization", `Bearer ${token}`)
      .send({ status: "LOST", lostReason: "No budget", followUpAt: new Date().toISOString() })
      .expect(200);

    await request(app)
      .delete(`/api/v1/leads/${leadId}`)
      .set("authorization", `Bearer ${token}`)
      .expect(200);

    const auditCount = await prisma.auditLog.count({
      where: {
        entityId: leadId,
        action: { in: ["leads.created", "leads.updated", "leads.deleted"] },
      },
    });
    expect(auditCount).toBe(3);
  });

  it("rejects duplicate leads and tenantId payloads", async (): Promise<void> => {
    const token = await login("tenant.admin@virtualcoders.local");
    const email = `lead-duplicate-api-${randomUUID()}@${testDomain}`;
    const company = `CRM Test Duplicate Lead ${randomUUID()}`;

    await request(app)
      .post("/api/v1/leads")
      .set("authorization", `Bearer ${token}`)
      .send({ firstName: "Dup", lastName: "Lead", email, company, source: "Referral" })
      .expect(201);

    await request(app)
      .post("/api/v1/leads")
      .set("authorization", `Bearer ${token}`)
      .send({ firstName: "Dup2", lastName: "Lead", email, source: "Referral" })
      .expect(409);

    const invalidResponse = await request(app)
      .post("/api/v1/leads")
      .set("authorization", `Bearer ${token}`)
      .send({ firstName: "Bad", lastName: "Lead", source: "Website", tenantId: randomUUID() })
      .expect(400);

    expect(invalidResponse.body).toMatchObject({ success: false, error: { code: "VAL_001" } });
  });

  it("enforces RBAC and tenant isolation for lead endpoints", async (): Promise<void> => {
    const token = await login(await createUserWithoutCrmPermissions());

    await request(app).get("/api/v1/leads").set("authorization", `Bearer ${token}`).expect(403);

    const tenantToken = await login("tenant.admin@virtualcoders.local");
    const otherTenant = await prisma.tenant.create({
      data: {
        name: `CRM Test Lead Other ${randomUUID()}`,
        slug: `lead-test-${randomUUID().replaceAll("-", "").slice(0, 12)}`,
      },
      select: { id: true },
    });
    const otherLead = await prisma.lead.create({
      data: {
        tenantId: otherTenant.id,
        firstName: "Other",
        lastName: "Lead",
        source: "Website",
      },
      select: { id: true },
    });
    const otherUser = await prisma.user.create({
      data: {
        tenantId: otherTenant.id,
        email: `other-owner-${randomUUID()}@${testDomain}`,
        passwordHash: await bcrypt.hash(seededPassword, 12),
        firstName: "Other",
        lastName: "Owner",
        status: UserStatus.ACTIVE,
      },
      select: { id: true },
    });

    await request(app)
      .get(`/api/v1/leads/${otherLead.id}`)
      .set("authorization", `Bearer ${tenantToken}`)
      .expect(404);

    await request(app)
      .post("/api/v1/leads")
      .set("authorization", `Bearer ${tenantToken}`)
      .send({
        firstName: "Cross",
        lastName: "Owner",
        company: `CRM Test Cross Owner ${randomUUID()}`,
        source: "Website",
        ownerId: otherUser.id,
      })
      .expect(400);
  });

  it("supports account CRUD, pagination, search, contacts sub-table, timeline, and audit logs", async (): Promise<void> => {
    const token = await login("tenant.admin@virtualcoders.local");
    const accountName = `CRM Test Account ${randomUUID()}`;

    const createdResponse = await request(app)
      .post("/api/v1/accounts")
      .set("authorization", `Bearer ${token}`)
      .send({
        name: accountName,
        website: "https://crm-test.example.com",
        industry: "IT Services",
        city: "Ahmedabad",
        country: "India",
      })
      .expect(201);
    const account = getData(createdResponse);
    const accountId = String(account.id);

    await request(app)
      .post("/api/v1/contacts")
      .set("authorization", `Bearer ${token}`)
      .send({
        accountId,
        firstName: "CRM",
        lastName: "Contact",
        email: `primary-${randomUUID()}@${testDomain}`,
        decisionMaker: true,
      })
      .expect(201);

    const listResponse = await request(app)
      .get("/api/v1/accounts")
      .query({ page: 1, pageSize: 5, search: "CRM Test", sortBy: "name", sortDirection: "asc" })
      .set("authorization", `Bearer ${token}`)
      .expect(200);
    const listData = getData(listResponse);

    expect((listData.items as unknown[]).length).toBeGreaterThan(0);
    expect(listData.pagination).toMatchObject({ page: 1, pageSize: 5 });

    const detailResponse = await request(app)
      .get(`/api/v1/accounts/${accountId}`)
      .set("authorization", `Bearer ${token}`)
      .expect(200);
    const detail = getData(detailResponse);

    expect(detail.contacts).toEqual(expect.any(Array));
    expect(detail.activities).toEqual(expect.any(Array));

    await request(app)
      .patch(`/api/v1/accounts/${accountId}`)
      .set("authorization", `Bearer ${token}`)
      .send({ status: "ACTIVE", notes: "Updated by API test" })
      .expect(200);

    await request(app)
      .delete(`/api/v1/accounts/${accountId}`)
      .set("authorization", `Bearer ${token}`)
      .expect(200);

    const auditCount = await prisma.auditLog.count({
      where: {
        entityId: accountId,
        action: { in: ["accounts.created", "accounts.updated", "accounts.deleted"] },
      },
    });

    expect(auditCount).toBe(3);
  });

  it("rejects duplicate accounts and tenantId payloads", async (): Promise<void> => {
    const token = await login("tenant.admin@virtualcoders.local");
    const name = `CRM Test Duplicate ${randomUUID()}`;

    await request(app)
      .post("/api/v1/accounts")
      .set("authorization", `Bearer ${token}`)
      .send({ name, domain: "crm-duplicate.example.com" })
      .expect(201);

    await request(app)
      .post("/api/v1/accounts")
      .set("authorization", `Bearer ${token}`)
      .send({ name })
      .expect(409);

    const invalidResponse = await request(app)
      .post("/api/v1/accounts")
      .set("authorization", `Bearer ${token}`)
      .send({ name: "Bad Tenant Payload", tenantId: randomUUID() })
      .expect(400);

    expect(invalidResponse.body).toMatchObject({ success: false, error: { code: "VAL_001" } });
  });

  it("supports contact CRUD, filters, duplicate detection, and soft delete", async (): Promise<void> => {
    const token = await login("tenant.admin@virtualcoders.local");
    const email = `contact-api-${randomUUID()}@${testDomain}`;

    const createResponse = await request(app)
      .post("/api/v1/contacts")
      .set("authorization", `Bearer ${token}`)
      .send({
        firstName: "API",
        lastName: "Contact",
        email,
        title: "Founder",
      })
      .expect(201);
    const contact = getData(createResponse);
    const contactId = String(contact.id);

    await request(app)
      .post("/api/v1/contacts")
      .set("authorization", `Bearer ${token}`)
      .send({ firstName: "Dup", lastName: "Contact", email })
      .expect(409);

    await request(app)
      .get("/api/v1/contacts")
      .query({ search: "API", status: "ACTIVE", sortBy: "lastName" })
      .set("authorization", `Bearer ${token}`)
      .expect(200);

    await request(app)
      .patch(`/api/v1/contacts/${contactId}`)
      .set("authorization", `Bearer ${token}`)
      .send({ influenceLevel: "High" })
      .expect(200);

    await request(app)
      .delete(`/api/v1/contacts/${contactId}`)
      .set("authorization", `Bearer ${token}`)
      .expect(200);

    const deleted = await prisma.contact.findUniqueOrThrow({
      where: { id: contactId },
      select: { deletedAt: true },
    });

    expect(deleted.deletedAt).toBeInstanceOf(Date);
  });

  it("enforces RBAC for account endpoints", async (): Promise<void> => {
    const token = await login(await createUserWithoutCrmPermissions());

    const response = await request(app)
      .get("/api/v1/accounts")
      .set("authorization", `Bearer ${token}`)
      .expect(403);

    expect(response.body).toMatchObject({ success: false, error: { code: "AUTH_003" } });
  });

  it("blocks cross-tenant account and contact access", async (): Promise<void> => {
    const token = await login("tenant.admin@virtualcoders.local");
    const otherTenant = await prisma.tenant.create({
      data: {
        name: `CRM Test Other ${randomUUID()}`,
        slug: `crm-test-${randomUUID().replaceAll("-", "").slice(0, 12)}`,
      },
      select: { id: true },
    });
    const otherAccount = await prisma.account.create({
      data: { tenantId: otherTenant.id, name: `CRM Test Other Account ${randomUUID()}` },
      select: { id: true },
    });
    const otherContact = await prisma.contact.create({
      data: { tenantId: otherTenant.id, firstName: "Other", lastName: "Contact" },
      select: { id: true },
    });

    await request(app)
      .get(`/api/v1/accounts/${otherAccount.id}`)
      .set("authorization", `Bearer ${token}`)
      .expect(404);

    await request(app)
      .get(`/api/v1/contacts/${otherContact.id}`)
      .set("authorization", `Bearer ${token}`)
      .expect(404);
  });
});

async function login(email: string): Promise<string> {
  const response = await request(app)
    .post("/api/v1/auth/login")
    .send({ email, password: seededPassword })
    .expect(200);
  const token = getData(response).accessToken;

  if (typeof token !== "string") {
    throw new Error("Missing access token");
  }

  return token;
}

async function createUserWithoutCrmPermissions(): Promise<string> {
  const tenant = await prisma.tenant.findUniqueOrThrow({
    where: { slug: "virtual-coders" },
    select: { id: true },
  });
  const email = `no-crm-${randomUUID()}@${testDomain}`;
  const user = await prisma.user.create({
    data: {
      tenantId: tenant.id,
      email,
      passwordHash: await bcrypt.hash(seededPassword, 12),
      firstName: "No",
      lastName: "CRM",
      status: UserStatus.ACTIVE,
    },
    select: { id: true },
  });
  const role = await prisma.role.create({
    data: {
      tenantId: tenant.id,
      scope: RoleScope.TENANT,
      key: "no-crm",
      uniqueKey: `crm-test:${randomUUID()}`,
      name: "CRM Test No CRM",
    },
    select: { id: true },
  });
  await prisma.userRole.create({ data: { userId: user.id, roleId: role.id } });

  return email;
}

async function getDemoTenantId(): Promise<string> {
  const tenant = await prisma.tenant.findUniqueOrThrow({
    where: { slug: "virtual-coders" },
    select: { id: true },
  });

  return tenant.id;
}

function getData(response: request.Response): JsonObject {
  const body = response.body as JsonObject;

  if (typeof body.data !== "object" || body.data === null || Array.isArray(body.data)) {
    throw new Error("Expected response data object");
  }

  return body.data as JsonObject;
}
