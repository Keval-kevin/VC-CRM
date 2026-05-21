-- CreateEnum
CREATE TYPE "OpportunityStage" AS ENUM ('QUALIFICATION', 'DISCOVERY', 'REQUIREMENT', 'PROPOSAL', 'NEGOTIATION', 'VERBAL_COMMIT', 'CONTRACTING', 'WON', 'LOST');

-- AlterTable
ALTER TABLE "ActivityTimelineItem" ADD COLUMN     "opportunityId" UUID;

-- CreateTable
CREATE TABLE "Opportunity" (
    "id" UUID NOT NULL,
    "tenantId" UUID NOT NULL,
    "accountId" UUID,
    "primaryContactId" UUID,
    "leadId" UUID,
    "name" TEXT NOT NULL,
    "stage" "OpportunityStage" NOT NULL DEFAULT 'QUALIFICATION',
    "probability" INTEGER NOT NULL DEFAULT 10,
    "valueCents" INTEGER NOT NULL DEFAULT 0,
    "currency" TEXT NOT NULL DEFAULT 'INR',
    "expectedCloseDate" TIMESTAMP(3),
    "weightedForecastCents" INTEGER NOT NULL DEFAULT 0,
    "ownerId" UUID,
    "stageChangedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "wonAt" TIMESTAMP(3),
    "lostAt" TIMESTAMP(3),
    "lostReason" TEXT,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),
    "createdById" UUID,
    "updatedById" UUID,
    "deletedById" UUID,

    CONSTRAINT "Opportunity_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OpportunityStageHistory" (
    "id" UUID NOT NULL,
    "tenantId" UUID NOT NULL,
    "opportunityId" UUID NOT NULL,
    "fromStage" "OpportunityStage",
    "toStage" "OpportunityStage" NOT NULL,
    "changedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "changedById" UUID,
    "note" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "OpportunityStageHistory_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Opportunity_tenantId_idx" ON "Opportunity"("tenantId");

-- CreateIndex
CREATE INDEX "Opportunity_tenantId_accountId_idx" ON "Opportunity"("tenantId", "accountId");

-- CreateIndex
CREATE INDEX "Opportunity_tenantId_primaryContactId_idx" ON "Opportunity"("tenantId", "primaryContactId");

-- CreateIndex
CREATE INDEX "Opportunity_tenantId_leadId_idx" ON "Opportunity"("tenantId", "leadId");

-- CreateIndex
CREATE INDEX "Opportunity_tenantId_ownerId_idx" ON "Opportunity"("tenantId", "ownerId");

-- CreateIndex
CREATE INDEX "Opportunity_tenantId_stage_idx" ON "Opportunity"("tenantId", "stage");

-- CreateIndex
CREATE INDEX "Opportunity_tenantId_expectedCloseDate_idx" ON "Opportunity"("tenantId", "expectedCloseDate");

-- CreateIndex
CREATE INDEX "Opportunity_tenantId_stageChangedAt_idx" ON "Opportunity"("tenantId", "stageChangedAt");

-- CreateIndex
CREATE INDEX "Opportunity_tenantId_createdAt_idx" ON "Opportunity"("tenantId", "createdAt");

-- CreateIndex
CREATE INDEX "Opportunity_tenantId_updatedAt_idx" ON "Opportunity"("tenantId", "updatedAt");

-- CreateIndex
CREATE INDEX "Opportunity_deletedAt_idx" ON "Opportunity"("deletedAt");

-- CreateIndex
CREATE INDEX "OpportunityStageHistory_tenantId_idx" ON "OpportunityStageHistory"("tenantId");

-- CreateIndex
CREATE INDEX "OpportunityStageHistory_tenantId_opportunityId_idx" ON "OpportunityStageHistory"("tenantId", "opportunityId");

-- CreateIndex
CREATE INDEX "OpportunityStageHistory_tenantId_toStage_idx" ON "OpportunityStageHistory"("tenantId", "toStage");

-- CreateIndex
CREATE INDEX "OpportunityStageHistory_tenantId_changedAt_idx" ON "OpportunityStageHistory"("tenantId", "changedAt");

-- CreateIndex
CREATE INDEX "OpportunityStageHistory_deletedAt_idx" ON "OpportunityStageHistory"("deletedAt");

-- CreateIndex
CREATE INDEX "ActivityTimelineItem_tenantId_opportunityId_idx" ON "ActivityTimelineItem"("tenantId", "opportunityId");

-- AddForeignKey
ALTER TABLE "Opportunity" ADD CONSTRAINT "Opportunity_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Opportunity" ADD CONSTRAINT "Opportunity_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "Account"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Opportunity" ADD CONSTRAINT "Opportunity_primaryContactId_fkey" FOREIGN KEY ("primaryContactId") REFERENCES "Contact"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Opportunity" ADD CONSTRAINT "Opportunity_leadId_fkey" FOREIGN KEY ("leadId") REFERENCES "Lead"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OpportunityStageHistory" ADD CONSTRAINT "OpportunityStageHistory_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OpportunityStageHistory" ADD CONSTRAINT "OpportunityStageHistory_opportunityId_fkey" FOREIGN KEY ("opportunityId") REFERENCES "Opportunity"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ActivityTimelineItem" ADD CONSTRAINT "ActivityTimelineItem_opportunityId_fkey" FOREIGN KEY ("opportunityId") REFERENCES "Opportunity"("id") ON DELETE CASCADE ON UPDATE CASCADE;
