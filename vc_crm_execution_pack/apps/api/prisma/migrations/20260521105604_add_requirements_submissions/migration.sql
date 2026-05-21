-- CreateEnum
CREATE TYPE "RequirementPriority" AS ENUM ('LOW', 'MEDIUM', 'HIGH', 'URGENT');

-- CreateEnum
CREATE TYPE "RequirementStatus" AS ENUM ('DRAFT', 'OPEN', 'ON_HOLD', 'FILLED', 'CANCELLED', 'CLOSED');

-- CreateEnum
CREATE TYPE "WorkMode" AS ENUM ('REMOTE', 'HYBRID', 'ONSITE');

-- CreateEnum
CREATE TYPE "SubmissionStatus" AS ENUM ('SUBMITTED', 'TECHNICAL_REVIEW', 'CLIENT_SUBMITTED', 'INTERVIEW_SCHEDULED', 'SELECTED', 'REJECTED', 'WITHDRAWN');

-- CreateTable
CREATE TABLE "StaffAugRequirement" (
    "id" UUID NOT NULL,
    "tenantId" UUID NOT NULL,
    "accountId" UUID,
    "opportunityId" UUID,
    "roleTitle" TEXT NOT NULL,
    "skills" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "minExperienceYears" DOUBLE PRECISION,
    "maxExperienceYears" DOUBLE PRECISION,
    "budgetMinCents" INTEGER,
    "budgetMaxCents" INTEGER,
    "currency" TEXT NOT NULL DEFAULT 'INR',
    "location" TEXT,
    "workMode" "WorkMode" NOT NULL DEFAULT 'REMOTE',
    "positions" INTEGER NOT NULL DEFAULT 1,
    "priority" "RequirementPriority" NOT NULL DEFAULT 'MEDIUM',
    "status" "RequirementStatus" NOT NULL DEFAULT 'OPEN',
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),
    "createdById" UUID,
    "updatedById" UUID,
    "deletedById" UUID,

    CONSTRAINT "StaffAugRequirement_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CandidateSubmission" (
    "id" UUID NOT NULL,
    "tenantId" UUID NOT NULL,
    "requirementId" UUID NOT NULL,
    "candidateId" UUID NOT NULL,
    "vendorId" UUID,
    "status" "SubmissionStatus" NOT NULL DEFAULT 'SUBMITTED',
    "technicalReviewNotes" TEXT,
    "technicalReviewedAt" TIMESTAMP(3),
    "clientSubmittedAt" TIMESTAMP(3),
    "interviewScheduledAt" TIMESTAMP(3),
    "interviewPlaceholder" TEXT,
    "feedback" TEXT,
    "feedbackRating" INTEGER,
    "submittedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),
    "createdById" UUID,
    "updatedById" UUID,
    "deletedById" UUID,

    CONSTRAINT "CandidateSubmission_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "StaffAugRequirement_tenantId_idx" ON "StaffAugRequirement"("tenantId");

-- CreateIndex
CREATE INDEX "StaffAugRequirement_tenantId_accountId_idx" ON "StaffAugRequirement"("tenantId", "accountId");

-- CreateIndex
CREATE INDEX "StaffAugRequirement_tenantId_opportunityId_idx" ON "StaffAugRequirement"("tenantId", "opportunityId");

-- CreateIndex
CREATE INDEX "StaffAugRequirement_tenantId_status_idx" ON "StaffAugRequirement"("tenantId", "status");

-- CreateIndex
CREATE INDEX "StaffAugRequirement_tenantId_priority_idx" ON "StaffAugRequirement"("tenantId", "priority");

-- CreateIndex
CREATE INDEX "StaffAugRequirement_tenantId_workMode_idx" ON "StaffAugRequirement"("tenantId", "workMode");

-- CreateIndex
CREATE INDEX "StaffAugRequirement_tenantId_location_idx" ON "StaffAugRequirement"("tenantId", "location");

-- CreateIndex
CREATE INDEX "StaffAugRequirement_tenantId_createdAt_idx" ON "StaffAugRequirement"("tenantId", "createdAt");

-- CreateIndex
CREATE INDEX "StaffAugRequirement_tenantId_updatedAt_idx" ON "StaffAugRequirement"("tenantId", "updatedAt");

-- CreateIndex
CREATE INDEX "StaffAugRequirement_deletedAt_idx" ON "StaffAugRequirement"("deletedAt");

-- CreateIndex
CREATE INDEX "CandidateSubmission_tenantId_idx" ON "CandidateSubmission"("tenantId");

-- CreateIndex
CREATE INDEX "CandidateSubmission_tenantId_requirementId_idx" ON "CandidateSubmission"("tenantId", "requirementId");

-- CreateIndex
CREATE INDEX "CandidateSubmission_tenantId_candidateId_idx" ON "CandidateSubmission"("tenantId", "candidateId");

-- CreateIndex
CREATE INDEX "CandidateSubmission_tenantId_vendorId_idx" ON "CandidateSubmission"("tenantId", "vendorId");

-- CreateIndex
CREATE INDEX "CandidateSubmission_tenantId_status_idx" ON "CandidateSubmission"("tenantId", "status");

-- CreateIndex
CREATE INDEX "CandidateSubmission_tenantId_submittedAt_idx" ON "CandidateSubmission"("tenantId", "submittedAt");

-- CreateIndex
CREATE INDEX "CandidateSubmission_tenantId_createdAt_idx" ON "CandidateSubmission"("tenantId", "createdAt");

-- CreateIndex
CREATE INDEX "CandidateSubmission_deletedAt_idx" ON "CandidateSubmission"("deletedAt");

-- AddForeignKey
ALTER TABLE "StaffAugRequirement" ADD CONSTRAINT "StaffAugRequirement_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StaffAugRequirement" ADD CONSTRAINT "StaffAugRequirement_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "Account"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StaffAugRequirement" ADD CONSTRAINT "StaffAugRequirement_opportunityId_fkey" FOREIGN KEY ("opportunityId") REFERENCES "Opportunity"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CandidateSubmission" ADD CONSTRAINT "CandidateSubmission_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CandidateSubmission" ADD CONSTRAINT "CandidateSubmission_requirementId_fkey" FOREIGN KEY ("requirementId") REFERENCES "StaffAugRequirement"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CandidateSubmission" ADD CONSTRAINT "CandidateSubmission_candidateId_fkey" FOREIGN KEY ("candidateId") REFERENCES "Candidate"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CandidateSubmission" ADD CONSTRAINT "CandidateSubmission_vendorId_fkey" FOREIGN KEY ("vendorId") REFERENCES "Vendor"("id") ON DELETE SET NULL ON UPDATE CASCADE;
