-- CreateEnum
CREATE TYPE "InterviewOutcome" AS ENUM ('PENDING', 'PASSED', 'FAILED', 'NO_SHOW', 'RESCHEDULED');

-- CreateEnum
CREATE TYPE "PlacementBillingStatus" AS ENUM ('NOT_STARTED', 'ACTIVE', 'ON_HOLD', 'COMPLETED', 'CANCELLED');

-- CreateTable
CREATE TABLE "Interview" (
    "id" UUID NOT NULL,
    "tenantId" UUID NOT NULL,
    "submissionId" UUID NOT NULL,
    "candidateId" UUID NOT NULL,
    "requirementId" UUID NOT NULL,
    "roundNumber" INTEGER NOT NULL,
    "interviewer" TEXT NOT NULL,
    "scheduledAt" TIMESTAMP(3) NOT NULL,
    "feedback" TEXT,
    "outcome" "InterviewOutcome" NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),
    "createdById" UUID,
    "updatedById" UUID,
    "deletedById" UUID,
    "vendorId" UUID,

    CONSTRAINT "Interview_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Placement" (
    "id" UUID NOT NULL,
    "tenantId" UUID NOT NULL,
    "submissionId" UUID NOT NULL,
    "candidateId" UUID NOT NULL,
    "requirementId" UUID NOT NULL,
    "vendorId" UUID,
    "clientBillingRateCents" INTEGER NOT NULL,
    "vendorCostCents" INTEGER NOT NULL,
    "marginCents" INTEGER NOT NULL,
    "marginPercentBasis" INTEGER NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'INR',
    "joiningDate" TIMESTAMP(3) NOT NULL,
    "replacementPeriodDays" INTEGER NOT NULL DEFAULT 0,
    "billingStatus" "PlacementBillingStatus" NOT NULL DEFAULT 'NOT_STARTED',
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),
    "createdById" UUID,
    "updatedById" UUID,
    "deletedById" UUID,

    CONSTRAINT "Placement_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Interview_tenantId_idx" ON "Interview"("tenantId");

-- CreateIndex
CREATE INDEX "Interview_tenantId_submissionId_idx" ON "Interview"("tenantId", "submissionId");

-- CreateIndex
CREATE INDEX "Interview_tenantId_candidateId_idx" ON "Interview"("tenantId", "candidateId");

-- CreateIndex
CREATE INDEX "Interview_tenantId_requirementId_idx" ON "Interview"("tenantId", "requirementId");

-- CreateIndex
CREATE INDEX "Interview_tenantId_scheduledAt_idx" ON "Interview"("tenantId", "scheduledAt");

-- CreateIndex
CREATE INDEX "Interview_tenantId_outcome_idx" ON "Interview"("tenantId", "outcome");

-- CreateIndex
CREATE INDEX "Interview_deletedAt_idx" ON "Interview"("deletedAt");

-- CreateIndex
CREATE UNIQUE INDEX "Placement_submissionId_key" ON "Placement"("submissionId");

-- CreateIndex
CREATE INDEX "Placement_tenantId_idx" ON "Placement"("tenantId");

-- CreateIndex
CREATE INDEX "Placement_tenantId_candidateId_idx" ON "Placement"("tenantId", "candidateId");

-- CreateIndex
CREATE INDEX "Placement_tenantId_requirementId_idx" ON "Placement"("tenantId", "requirementId");

-- CreateIndex
CREATE INDEX "Placement_tenantId_vendorId_idx" ON "Placement"("tenantId", "vendorId");

-- CreateIndex
CREATE INDEX "Placement_tenantId_billingStatus_idx" ON "Placement"("tenantId", "billingStatus");

-- CreateIndex
CREATE INDEX "Placement_tenantId_joiningDate_idx" ON "Placement"("tenantId", "joiningDate");

-- CreateIndex
CREATE INDEX "Placement_deletedAt_idx" ON "Placement"("deletedAt");

-- AddForeignKey
ALTER TABLE "Interview" ADD CONSTRAINT "Interview_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Interview" ADD CONSTRAINT "Interview_submissionId_fkey" FOREIGN KEY ("submissionId") REFERENCES "CandidateSubmission"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Interview" ADD CONSTRAINT "Interview_candidateId_fkey" FOREIGN KEY ("candidateId") REFERENCES "Candidate"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Interview" ADD CONSTRAINT "Interview_requirementId_fkey" FOREIGN KEY ("requirementId") REFERENCES "StaffAugRequirement"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Interview" ADD CONSTRAINT "Interview_vendorId_fkey" FOREIGN KEY ("vendorId") REFERENCES "Vendor"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Placement" ADD CONSTRAINT "Placement_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Placement" ADD CONSTRAINT "Placement_submissionId_fkey" FOREIGN KEY ("submissionId") REFERENCES "CandidateSubmission"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Placement" ADD CONSTRAINT "Placement_candidateId_fkey" FOREIGN KEY ("candidateId") REFERENCES "Candidate"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Placement" ADD CONSTRAINT "Placement_requirementId_fkey" FOREIGN KEY ("requirementId") REFERENCES "StaffAugRequirement"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Placement" ADD CONSTRAINT "Placement_vendorId_fkey" FOREIGN KEY ("vendorId") REFERENCES "Vendor"("id") ON DELETE SET NULL ON UPDATE CASCADE;
