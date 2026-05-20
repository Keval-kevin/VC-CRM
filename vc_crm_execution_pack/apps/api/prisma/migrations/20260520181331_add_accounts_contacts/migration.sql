-- CreateEnum
CREATE TYPE "AccountStatus" AS ENUM ('PROSPECT', 'ACTIVE', 'INACTIVE', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "ContactStatus" AS ENUM ('ACTIVE', 'INACTIVE', 'ARCHIVED');

-- CreateTable
CREATE TABLE "Account" (
    "id" UUID NOT NULL,
    "tenantId" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "website" TEXT,
    "domain" TEXT,
    "industry" TEXT,
    "phone" TEXT,
    "city" TEXT,
    "country" TEXT,
    "status" "AccountStatus" NOT NULL DEFAULT 'PROSPECT',
    "ownerId" UUID,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),
    "createdById" UUID,
    "updatedById" UUID,
    "deletedById" UUID,

    CONSTRAINT "Account_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Contact" (
    "id" UUID NOT NULL,
    "tenantId" UUID NOT NULL,
    "accountId" UUID,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "email" TEXT,
    "phone" TEXT,
    "title" TEXT,
    "linkedinUrl" TEXT,
    "decisionMaker" BOOLEAN NOT NULL DEFAULT false,
    "influenceLevel" TEXT,
    "status" "ContactStatus" NOT NULL DEFAULT 'ACTIVE',
    "ownerId" UUID,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),
    "createdById" UUID,
    "updatedById" UUID,
    "deletedById" UUID,

    CONSTRAINT "Contact_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ActivityTimelineItem" (
    "id" UUID NOT NULL,
    "tenantId" UUID NOT NULL,
    "accountId" UUID,
    "contactId" UUID,
    "type" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "occurredAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),
    "createdById" UUID,
    "updatedById" UUID,
    "deletedById" UUID,

    CONSTRAINT "ActivityTimelineItem_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Account_tenantId_idx" ON "Account"("tenantId");

-- CreateIndex
CREATE INDEX "Account_tenantId_status_idx" ON "Account"("tenantId", "status");

-- CreateIndex
CREATE INDEX "Account_tenantId_ownerId_idx" ON "Account"("tenantId", "ownerId");

-- CreateIndex
CREATE INDEX "Account_tenantId_createdAt_idx" ON "Account"("tenantId", "createdAt");

-- CreateIndex
CREATE INDEX "Account_tenantId_updatedAt_idx" ON "Account"("tenantId", "updatedAt");

-- CreateIndex
CREATE INDEX "Account_tenantId_name_idx" ON "Account"("tenantId", "name");

-- CreateIndex
CREATE INDEX "Account_tenantId_domain_idx" ON "Account"("tenantId", "domain");

-- CreateIndex
CREATE INDEX "Account_deletedAt_idx" ON "Account"("deletedAt");

-- CreateIndex
CREATE INDEX "Contact_tenantId_idx" ON "Contact"("tenantId");

-- CreateIndex
CREATE INDEX "Contact_tenantId_accountId_idx" ON "Contact"("tenantId", "accountId");

-- CreateIndex
CREATE INDEX "Contact_tenantId_status_idx" ON "Contact"("tenantId", "status");

-- CreateIndex
CREATE INDEX "Contact_tenantId_ownerId_idx" ON "Contact"("tenantId", "ownerId");

-- CreateIndex
CREATE INDEX "Contact_tenantId_createdAt_idx" ON "Contact"("tenantId", "createdAt");

-- CreateIndex
CREATE INDEX "Contact_tenantId_updatedAt_idx" ON "Contact"("tenantId", "updatedAt");

-- CreateIndex
CREATE INDEX "Contact_tenantId_email_idx" ON "Contact"("tenantId", "email");

-- CreateIndex
CREATE INDEX "Contact_tenantId_phone_idx" ON "Contact"("tenantId", "phone");

-- CreateIndex
CREATE INDEX "Contact_deletedAt_idx" ON "Contact"("deletedAt");

-- CreateIndex
CREATE INDEX "ActivityTimelineItem_tenantId_idx" ON "ActivityTimelineItem"("tenantId");

-- CreateIndex
CREATE INDEX "ActivityTimelineItem_tenantId_accountId_idx" ON "ActivityTimelineItem"("tenantId", "accountId");

-- CreateIndex
CREATE INDEX "ActivityTimelineItem_tenantId_contactId_idx" ON "ActivityTimelineItem"("tenantId", "contactId");

-- CreateIndex
CREATE INDEX "ActivityTimelineItem_tenantId_occurredAt_idx" ON "ActivityTimelineItem"("tenantId", "occurredAt");

-- CreateIndex
CREATE INDEX "ActivityTimelineItem_deletedAt_idx" ON "ActivityTimelineItem"("deletedAt");

-- AddForeignKey
ALTER TABLE "Account" ADD CONSTRAINT "Account_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Contact" ADD CONSTRAINT "Contact_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Contact" ADD CONSTRAINT "Contact_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "Account"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ActivityTimelineItem" ADD CONSTRAINT "ActivityTimelineItem_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ActivityTimelineItem" ADD CONSTRAINT "ActivityTimelineItem_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "Account"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ActivityTimelineItem" ADD CONSTRAINT "ActivityTimelineItem_contactId_fkey" FOREIGN KEY ("contactId") REFERENCES "Contact"("id") ON DELETE CASCADE ON UPDATE CASCADE;
