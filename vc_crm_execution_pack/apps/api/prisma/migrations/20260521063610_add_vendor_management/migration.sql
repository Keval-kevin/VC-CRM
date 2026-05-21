-- CreateEnum
CREATE TYPE "VendorDocumentStatus" AS ENUM ('NOT_STARTED', 'REQUESTED', 'IN_REVIEW', 'SIGNED', 'EXPIRED');

-- CreateEnum
CREATE TYPE "VendorTier" AS ENUM ('STRATEGIC', 'PREFERRED', 'STANDARD', 'WATCHLIST');

-- CreateEnum
CREATE TYPE "VendorStatus" AS ENUM ('ACTIVE', 'INACTIVE', 'ONBOARDING', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "VendorRiskStatus" AS ENUM ('CLEAR', 'WARNING', 'BLACKLISTED');

-- AlterTable
ALTER TABLE "CrmActivity" ADD COLUMN     "vendorId" UUID;

-- CreateTable
CREATE TABLE "Vendor" (
    "id" UUID NOT NULL,
    "tenantId" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "website" TEXT,
    "domain" TEXT,
    "email" TEXT,
    "phone" TEXT,
    "categories" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "expertiseSkills" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "decisionMakerName" TEXT,
    "decisionMakerTitle" TEXT,
    "decisionMakerEmail" TEXT,
    "decisionMakerPhone" TEXT,
    "city" TEXT,
    "state" TEXT,
    "country" TEXT,
    "timezone" TEXT,
    "companyOwnershipTag" TEXT NOT NULL,
    "ndaStatus" "VendorDocumentStatus" NOT NULL DEFAULT 'NOT_STARTED',
    "msaStatus" "VendorDocumentStatus" NOT NULL DEFAULT 'NOT_STARTED',
    "rateCard" JSONB,
    "tier" "VendorTier" NOT NULL DEFAULT 'STANDARD',
    "status" "VendorStatus" NOT NULL DEFAULT 'ONBOARDING',
    "riskStatus" "VendorRiskStatus" NOT NULL DEFAULT 'CLEAR',
    "riskReason" TEXT,
    "deliveryScore" INTEGER NOT NULL DEFAULT 0,
    "qualityScore" INTEGER NOT NULL DEFAULT 0,
    "responsivenessScore" INTEGER NOT NULL DEFAULT 0,
    "complianceScore" INTEGER NOT NULL DEFAULT 0,
    "overallScore" INTEGER NOT NULL DEFAULT 0,
    "portalEnabled" BOOLEAN NOT NULL DEFAULT false,
    "portalSlug" TEXT,
    "portalInviteEmail" TEXT,
    "portalLastLoginAt" TIMESTAMP(3),
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),
    "createdById" UUID,
    "updatedById" UUID,
    "deletedById" UUID,

    CONSTRAINT "Vendor_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Vendor_tenantId_idx" ON "Vendor"("tenantId");

-- CreateIndex
CREATE INDEX "Vendor_tenantId_status_idx" ON "Vendor"("tenantId", "status");

-- CreateIndex
CREATE INDEX "Vendor_tenantId_tier_idx" ON "Vendor"("tenantId", "tier");

-- CreateIndex
CREATE INDEX "Vendor_tenantId_riskStatus_idx" ON "Vendor"("tenantId", "riskStatus");

-- CreateIndex
CREATE INDEX "Vendor_tenantId_companyOwnershipTag_idx" ON "Vendor"("tenantId", "companyOwnershipTag");

-- CreateIndex
CREATE INDEX "Vendor_tenantId_domain_idx" ON "Vendor"("tenantId", "domain");

-- CreateIndex
CREATE INDEX "Vendor_tenantId_country_idx" ON "Vendor"("tenantId", "country");

-- CreateIndex
CREATE INDEX "Vendor_tenantId_createdAt_idx" ON "Vendor"("tenantId", "createdAt");

-- CreateIndex
CREATE INDEX "Vendor_tenantId_updatedAt_idx" ON "Vendor"("tenantId", "updatedAt");

-- CreateIndex
CREATE INDEX "Vendor_deletedAt_idx" ON "Vendor"("deletedAt");

-- CreateIndex
CREATE UNIQUE INDEX "Vendor_tenantId_portalSlug_key" ON "Vendor"("tenantId", "portalSlug");

-- CreateIndex
CREATE INDEX "CrmActivity_tenantId_vendorId_idx" ON "CrmActivity"("tenantId", "vendorId");

-- AddForeignKey
ALTER TABLE "CrmActivity" ADD CONSTRAINT "CrmActivity_vendorId_fkey" FOREIGN KEY ("vendorId") REFERENCES "Vendor"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Vendor" ADD CONSTRAINT "Vendor_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
