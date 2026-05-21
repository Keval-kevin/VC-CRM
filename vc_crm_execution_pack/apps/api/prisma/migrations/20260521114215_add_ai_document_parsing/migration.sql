-- CreateEnum
CREATE TYPE "AIProvider" AS ENUM ('OPENAI', 'ANTHROPIC', 'GEMINI');

-- CreateEnum
CREATE TYPE "AIJobType" AS ENUM ('RESUME_PARSE', 'PROPOSAL_SOW_PARSE', 'VENDOR_WEBSITE_INTELLIGENCE');

-- CreateEnum
CREATE TYPE "AIJobStatus" AS ENUM ('PENDING', 'REVIEW_READY', 'APPROVED', 'REJECTED', 'SAVED', 'FAILED', 'RETRY_WAITING');

-- CreateEnum
CREATE TYPE "AIUsageStatus" AS ENUM ('SUCCESS', 'FAILED', 'SKIPPED');

-- CreateTable
CREATE TABLE "AIUsageLog" (
    "id" UUID NOT NULL,
    "tenantId" UUID NOT NULL,
    "parsingJobId" UUID,
    "provider" "AIProvider" NOT NULL,
    "model" TEXT NOT NULL,
    "feature" TEXT NOT NULL,
    "promptTokens" INTEGER NOT NULL DEFAULT 0,
    "completionTokens" INTEGER NOT NULL DEFAULT 0,
    "totalTokens" INTEGER NOT NULL DEFAULT 0,
    "estimatedCostCents" INTEGER NOT NULL DEFAULT 0,
    "status" "AIUsageStatus" NOT NULL DEFAULT 'SKIPPED',
    "failureReason" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "AIUsageLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DocumentParsingJob" (
    "id" UUID NOT NULL,
    "tenantId" UUID NOT NULL,
    "provider" "AIProvider" NOT NULL,
    "jobType" "AIJobType" NOT NULL,
    "status" "AIJobStatus" NOT NULL DEFAULT 'PENDING',
    "sourceEntityType" TEXT NOT NULL,
    "sourceEntityId" UUID NOT NULL,
    "sourceDocumentName" TEXT,
    "sourceDocumentUrl" TEXT,
    "model" TEXT NOT NULL,
    "parsedDataJson" JSONB,
    "approvedDataJson" JSONB,
    "rejectionReason" TEXT,
    "failureReason" TEXT,
    "attempts" INTEGER NOT NULL DEFAULT 0,
    "maxAttempts" INTEGER NOT NULL DEFAULT 3,
    "retryAt" TIMESTAMP(3),
    "promptTokens" INTEGER NOT NULL DEFAULT 0,
    "completionTokens" INTEGER NOT NULL DEFAULT 0,
    "totalTokens" INTEGER NOT NULL DEFAULT 0,
    "estimatedCostCents" INTEGER NOT NULL DEFAULT 0,
    "approvedAt" TIMESTAMP(3),
    "approvedById" UUID,
    "savedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),
    "createdById" UUID,
    "updatedById" UUID,
    "deletedById" UUID,

    CONSTRAINT "DocumentParsingJob_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "AIUsageLog_tenantId_idx" ON "AIUsageLog"("tenantId");

-- CreateIndex
CREATE INDEX "AIUsageLog_tenantId_provider_idx" ON "AIUsageLog"("tenantId", "provider");

-- CreateIndex
CREATE INDEX "AIUsageLog_tenantId_feature_idx" ON "AIUsageLog"("tenantId", "feature");

-- CreateIndex
CREATE INDEX "AIUsageLog_tenantId_status_idx" ON "AIUsageLog"("tenantId", "status");

-- CreateIndex
CREATE INDEX "AIUsageLog_tenantId_createdAt_idx" ON "AIUsageLog"("tenantId", "createdAt");

-- CreateIndex
CREATE INDEX "AIUsageLog_parsingJobId_idx" ON "AIUsageLog"("parsingJobId");

-- CreateIndex
CREATE INDEX "AIUsageLog_deletedAt_idx" ON "AIUsageLog"("deletedAt");

-- CreateIndex
CREATE INDEX "DocumentParsingJob_tenantId_idx" ON "DocumentParsingJob"("tenantId");

-- CreateIndex
CREATE INDEX "DocumentParsingJob_tenantId_provider_idx" ON "DocumentParsingJob"("tenantId", "provider");

-- CreateIndex
CREATE INDEX "DocumentParsingJob_tenantId_jobType_idx" ON "DocumentParsingJob"("tenantId", "jobType");

-- CreateIndex
CREATE INDEX "DocumentParsingJob_tenantId_status_idx" ON "DocumentParsingJob"("tenantId", "status");

-- CreateIndex
CREATE INDEX "DocumentParsingJob_tenantId_sourceEntityType_sourceEntityId_idx" ON "DocumentParsingJob"("tenantId", "sourceEntityType", "sourceEntityId");

-- CreateIndex
CREATE INDEX "DocumentParsingJob_tenantId_createdAt_idx" ON "DocumentParsingJob"("tenantId", "createdAt");

-- CreateIndex
CREATE INDEX "DocumentParsingJob_deletedAt_idx" ON "DocumentParsingJob"("deletedAt");

-- AddForeignKey
ALTER TABLE "AIUsageLog" ADD CONSTRAINT "AIUsageLog_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AIUsageLog" ADD CONSTRAINT "AIUsageLog_parsingJobId_fkey" FOREIGN KEY ("parsingJobId") REFERENCES "DocumentParsingJob"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DocumentParsingJob" ADD CONSTRAINT "DocumentParsingJob_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE CASCADE ON UPDATE CASCADE;
