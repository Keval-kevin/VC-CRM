-- CreateEnum
CREATE TYPE "CandidateStatus" AS ENUM ('ACTIVE', 'INACTIVE', 'PLACED', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "CandidateAvailability" AS ENUM ('IMMEDIATE', 'NOTICE_PERIOD', 'NOT_AVAILABLE', 'UNKNOWN');

-- AlterTable
ALTER TABLE "CrmActivity" ADD COLUMN     "candidateId" UUID;

-- CreateTable
CREATE TABLE "Candidate" (
    "id" UUID NOT NULL,
    "tenantId" UUID NOT NULL,
    "vendorId" UUID,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "email" TEXT,
    "phone" TEXT,
    "resumeFileName" TEXT,
    "resumeStorageKey" TEXT,
    "resumeMimeType" TEXT,
    "resumeSizeBytes" INTEGER,
    "resumeUploadedAt" TIMESTAMP(3),
    "primarySkills" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "secondarySkills" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "experienceYears" DOUBLE PRECISION,
    "currentCtcCents" INTEGER,
    "expectedCtcCents" INTEGER,
    "currency" TEXT NOT NULL DEFAULT 'INR',
    "noticePeriodDays" INTEGER,
    "city" TEXT,
    "state" TEXT,
    "country" TEXT,
    "timezone" TEXT,
    "availability" "CandidateAvailability" NOT NULL DEFAULT 'UNKNOWN',
    "availableFrom" TIMESTAMP(3),
    "consentStatus" BOOLEAN NOT NULL DEFAULT false,
    "consentCapturedAt" TIMESTAMP(3),
    "consentSource" TEXT,
    "blacklisted" BOOLEAN NOT NULL DEFAULT false,
    "blacklistReason" TEXT,
    "status" "CandidateStatus" NOT NULL DEFAULT 'ACTIVE',
    "resumeParsed" BOOLEAN NOT NULL DEFAULT false,
    "resumeParseStatus" TEXT NOT NULL DEFAULT 'PENDING',
    "parsedResumeJson" JSONB,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),
    "createdById" UUID,
    "updatedById" UUID,
    "deletedById" UUID,

    CONSTRAINT "Candidate_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Candidate_tenantId_idx" ON "Candidate"("tenantId");

-- CreateIndex
CREATE INDEX "Candidate_tenantId_vendorId_idx" ON "Candidate"("tenantId", "vendorId");

-- CreateIndex
CREATE INDEX "Candidate_tenantId_status_idx" ON "Candidate"("tenantId", "status");

-- CreateIndex
CREATE INDEX "Candidate_tenantId_availability_idx" ON "Candidate"("tenantId", "availability");

-- CreateIndex
CREATE INDEX "Candidate_tenantId_email_idx" ON "Candidate"("tenantId", "email");

-- CreateIndex
CREATE INDEX "Candidate_tenantId_phone_idx" ON "Candidate"("tenantId", "phone");

-- CreateIndex
CREATE INDEX "Candidate_tenantId_country_idx" ON "Candidate"("tenantId", "country");

-- CreateIndex
CREATE INDEX "Candidate_tenantId_city_idx" ON "Candidate"("tenantId", "city");

-- CreateIndex
CREATE INDEX "Candidate_tenantId_blacklisted_idx" ON "Candidate"("tenantId", "blacklisted");

-- CreateIndex
CREATE INDEX "Candidate_tenantId_createdAt_idx" ON "Candidate"("tenantId", "createdAt");

-- CreateIndex
CREATE INDEX "Candidate_tenantId_updatedAt_idx" ON "Candidate"("tenantId", "updatedAt");

-- CreateIndex
CREATE INDEX "Candidate_deletedAt_idx" ON "Candidate"("deletedAt");

-- CreateIndex
CREATE INDEX "CrmActivity_tenantId_candidateId_idx" ON "CrmActivity"("tenantId", "candidateId");

-- AddForeignKey
ALTER TABLE "CrmActivity" ADD CONSTRAINT "CrmActivity_candidateId_fkey" FOREIGN KEY ("candidateId") REFERENCES "Candidate"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Candidate" ADD CONSTRAINT "Candidate_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Candidate" ADD CONSTRAINT "Candidate_vendorId_fkey" FOREIGN KEY ("vendorId") REFERENCES "Vendor"("id") ON DELETE SET NULL ON UPDATE CASCADE;
