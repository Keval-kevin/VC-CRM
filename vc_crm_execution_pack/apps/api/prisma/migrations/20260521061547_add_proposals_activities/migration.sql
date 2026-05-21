-- CreateEnum
CREATE TYPE "ProposalStatus" AS ENUM ('DRAFT', 'SUBMITTED', 'APPROVED', 'REJECTED', 'SENT', 'WON', 'LOST');

-- CreateEnum
CREATE TYPE "ProposalApprovalStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');

-- CreateEnum
CREATE TYPE "ActivityType" AS ENUM ('CALL', 'EMAIL', 'MEETING', 'TASK', 'NOTE');

-- CreateEnum
CREATE TYPE "ActivityStatus" AS ENUM ('OPEN', 'COMPLETED', 'CANCELLED');

-- CreateTable
CREATE TABLE "Proposal" (
    "id" UUID NOT NULL,
    "tenantId" UUID NOT NULL,
    "opportunityId" UUID,
    "accountId" UUID,
    "contactId" UUID,
    "title" TEXT NOT NULL,
    "templateKey" TEXT NOT NULL,
    "status" "ProposalStatus" NOT NULL DEFAULT 'DRAFT',
    "currentVersionNumber" INTEGER NOT NULL DEFAULT 1,
    "approvalRole" TEXT,
    "ownerId" UUID,
    "valueCents" INTEGER NOT NULL DEFAULT 0,
    "currency" TEXT NOT NULL DEFAULT 'INR',
    "submittedAt" TIMESTAMP(3),
    "approvedAt" TIMESTAMP(3),
    "rejectedAt" TIMESTAMP(3),
    "sentAt" TIMESTAMP(3),
    "wonAt" TIMESTAMP(3),
    "lostAt" TIMESTAMP(3),
    "pdfExportRequestedAt" TIMESTAMP(3),
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),
    "createdById" UUID,
    "updatedById" UUID,
    "deletedById" UUID,

    CONSTRAINT "Proposal_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProposalVersion" (
    "id" UUID NOT NULL,
    "tenantId" UUID NOT NULL,
    "proposalId" UUID NOT NULL,
    "versionNumber" INTEGER NOT NULL,
    "templateKey" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "contentJson" JSONB NOT NULL,
    "changeNote" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),
    "createdById" UUID,
    "updatedById" UUID,
    "deletedById" UUID,

    CONSTRAINT "ProposalVersion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProposalApproval" (
    "id" UUID NOT NULL,
    "tenantId" UUID NOT NULL,
    "proposalId" UUID NOT NULL,
    "roleKey" TEXT NOT NULL,
    "status" "ProposalApprovalStatus" NOT NULL DEFAULT 'PENDING',
    "approverUserId" UUID,
    "decidedAt" TIMESTAMP(3),
    "comment" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),
    "createdById" UUID,
    "updatedById" UUID,
    "deletedById" UUID,

    CONSTRAINT "ProposalApproval_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CrmActivity" (
    "id" UUID NOT NULL,
    "tenantId" UUID NOT NULL,
    "type" "ActivityType" NOT NULL,
    "status" "ActivityStatus" NOT NULL DEFAULT 'OPEN',
    "title" TEXT NOT NULL,
    "description" TEXT,
    "ownerId" UUID,
    "leadId" UUID,
    "accountId" UUID,
    "contactId" UUID,
    "opportunityId" UUID,
    "proposalId" UUID,
    "candidateRef" TEXT,
    "vendorRef" TEXT,
    "dueAt" TIMESTAMP(3),
    "reminderAt" TIMESTAMP(3),
    "completedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),
    "createdById" UUID,
    "updatedById" UUID,
    "deletedById" UUID,

    CONSTRAINT "CrmActivity_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Proposal_tenantId_idx" ON "Proposal"("tenantId");

-- CreateIndex
CREATE INDEX "Proposal_tenantId_opportunityId_idx" ON "Proposal"("tenantId", "opportunityId");

-- CreateIndex
CREATE INDEX "Proposal_tenantId_accountId_idx" ON "Proposal"("tenantId", "accountId");

-- CreateIndex
CREATE INDEX "Proposal_tenantId_contactId_idx" ON "Proposal"("tenantId", "contactId");

-- CreateIndex
CREATE INDEX "Proposal_tenantId_status_idx" ON "Proposal"("tenantId", "status");

-- CreateIndex
CREATE INDEX "Proposal_tenantId_ownerId_idx" ON "Proposal"("tenantId", "ownerId");

-- CreateIndex
CREATE INDEX "Proposal_tenantId_createdAt_idx" ON "Proposal"("tenantId", "createdAt");

-- CreateIndex
CREATE INDEX "Proposal_tenantId_updatedAt_idx" ON "Proposal"("tenantId", "updatedAt");

-- CreateIndex
CREATE INDEX "Proposal_deletedAt_idx" ON "Proposal"("deletedAt");

-- CreateIndex
CREATE INDEX "ProposalVersion_tenantId_idx" ON "ProposalVersion"("tenantId");

-- CreateIndex
CREATE INDEX "ProposalVersion_tenantId_proposalId_idx" ON "ProposalVersion"("tenantId", "proposalId");

-- CreateIndex
CREATE INDEX "ProposalVersion_tenantId_createdAt_idx" ON "ProposalVersion"("tenantId", "createdAt");

-- CreateIndex
CREATE INDEX "ProposalVersion_deletedAt_idx" ON "ProposalVersion"("deletedAt");

-- CreateIndex
CREATE UNIQUE INDEX "ProposalVersion_proposalId_versionNumber_key" ON "ProposalVersion"("proposalId", "versionNumber");

-- CreateIndex
CREATE INDEX "ProposalApproval_tenantId_idx" ON "ProposalApproval"("tenantId");

-- CreateIndex
CREATE INDEX "ProposalApproval_tenantId_proposalId_idx" ON "ProposalApproval"("tenantId", "proposalId");

-- CreateIndex
CREATE INDEX "ProposalApproval_tenantId_roleKey_idx" ON "ProposalApproval"("tenantId", "roleKey");

-- CreateIndex
CREATE INDEX "ProposalApproval_tenantId_status_idx" ON "ProposalApproval"("tenantId", "status");

-- CreateIndex
CREATE INDEX "ProposalApproval_deletedAt_idx" ON "ProposalApproval"("deletedAt");

-- CreateIndex
CREATE INDEX "CrmActivity_tenantId_idx" ON "CrmActivity"("tenantId");

-- CreateIndex
CREATE INDEX "CrmActivity_tenantId_type_idx" ON "CrmActivity"("tenantId", "type");

-- CreateIndex
CREATE INDEX "CrmActivity_tenantId_status_idx" ON "CrmActivity"("tenantId", "status");

-- CreateIndex
CREATE INDEX "CrmActivity_tenantId_ownerId_idx" ON "CrmActivity"("tenantId", "ownerId");

-- CreateIndex
CREATE INDEX "CrmActivity_tenantId_dueAt_idx" ON "CrmActivity"("tenantId", "dueAt");

-- CreateIndex
CREATE INDEX "CrmActivity_tenantId_reminderAt_idx" ON "CrmActivity"("tenantId", "reminderAt");

-- CreateIndex
CREATE INDEX "CrmActivity_tenantId_leadId_idx" ON "CrmActivity"("tenantId", "leadId");

-- CreateIndex
CREATE INDEX "CrmActivity_tenantId_accountId_idx" ON "CrmActivity"("tenantId", "accountId");

-- CreateIndex
CREATE INDEX "CrmActivity_tenantId_contactId_idx" ON "CrmActivity"("tenantId", "contactId");

-- CreateIndex
CREATE INDEX "CrmActivity_tenantId_opportunityId_idx" ON "CrmActivity"("tenantId", "opportunityId");

-- CreateIndex
CREATE INDEX "CrmActivity_tenantId_proposalId_idx" ON "CrmActivity"("tenantId", "proposalId");

-- CreateIndex
CREATE INDEX "CrmActivity_deletedAt_idx" ON "CrmActivity"("deletedAt");

-- AddForeignKey
ALTER TABLE "Proposal" ADD CONSTRAINT "Proposal_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Proposal" ADD CONSTRAINT "Proposal_opportunityId_fkey" FOREIGN KEY ("opportunityId") REFERENCES "Opportunity"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Proposal" ADD CONSTRAINT "Proposal_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "Account"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Proposal" ADD CONSTRAINT "Proposal_contactId_fkey" FOREIGN KEY ("contactId") REFERENCES "Contact"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProposalVersion" ADD CONSTRAINT "ProposalVersion_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProposalVersion" ADD CONSTRAINT "ProposalVersion_proposalId_fkey" FOREIGN KEY ("proposalId") REFERENCES "Proposal"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProposalApproval" ADD CONSTRAINT "ProposalApproval_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProposalApproval" ADD CONSTRAINT "ProposalApproval_proposalId_fkey" FOREIGN KEY ("proposalId") REFERENCES "Proposal"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CrmActivity" ADD CONSTRAINT "CrmActivity_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CrmActivity" ADD CONSTRAINT "CrmActivity_leadId_fkey" FOREIGN KEY ("leadId") REFERENCES "Lead"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CrmActivity" ADD CONSTRAINT "CrmActivity_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "Account"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CrmActivity" ADD CONSTRAINT "CrmActivity_contactId_fkey" FOREIGN KEY ("contactId") REFERENCES "Contact"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CrmActivity" ADD CONSTRAINT "CrmActivity_opportunityId_fkey" FOREIGN KEY ("opportunityId") REFERENCES "Opportunity"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CrmActivity" ADD CONSTRAINT "CrmActivity_proposalId_fkey" FOREIGN KEY ("proposalId") REFERENCES "Proposal"("id") ON DELETE SET NULL ON UPDATE CASCADE;
