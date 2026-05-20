-- CreateTable
CREATE TABLE "TenantSettings" (
    "id" UUID NOT NULL,
    "tenantId" UUID NOT NULL,
    "companyName" TEXT NOT NULL,
    "timezone" TEXT NOT NULL DEFAULT 'Asia/Kolkata',
    "locale" TEXT NOT NULL DEFAULT 'en-IN',
    "sessionTimeoutMinutes" INTEGER NOT NULL DEFAULT 480,
    "passwordMinLength" INTEGER NOT NULL DEFAULT 8,
    "requireStrongPassword" BOOLEAN NOT NULL DEFAULT true,
    "ipAllowlist" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),
    "createdById" UUID,
    "updatedById" UUID,
    "deletedById" UUID,

    CONSTRAINT "TenantSettings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AIProviderSetting" (
    "id" UUID NOT NULL,
    "tenantId" UUID NOT NULL,
    "provider" TEXT NOT NULL,
    "defaultModel" TEXT NOT NULL,
    "enabled" BOOLEAN NOT NULL DEFAULT false,
    "monthlyBudgetCents" INTEGER NOT NULL DEFAULT 0,
    "encryptedApiKey" TEXT,
    "apiKeyIv" TEXT,
    "apiKeyTag" TEXT,
    "keyLastFour" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),
    "createdById" UUID,
    "updatedById" UUID,
    "deletedById" UUID,

    CONSTRAINT "AIProviderSetting_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "TenantSettings_tenantId_key" ON "TenantSettings"("tenantId");

-- CreateIndex
CREATE INDEX "TenantSettings_tenantId_idx" ON "TenantSettings"("tenantId");

-- CreateIndex
CREATE INDEX "TenantSettings_deletedAt_idx" ON "TenantSettings"("deletedAt");

-- CreateIndex
CREATE INDEX "AIProviderSetting_tenantId_idx" ON "AIProviderSetting"("tenantId");

-- CreateIndex
CREATE INDEX "AIProviderSetting_provider_idx" ON "AIProviderSetting"("provider");

-- CreateIndex
CREATE INDEX "AIProviderSetting_deletedAt_idx" ON "AIProviderSetting"("deletedAt");

-- CreateIndex
CREATE UNIQUE INDEX "AIProviderSetting_tenantId_provider_key" ON "AIProviderSetting"("tenantId", "provider");

-- AddForeignKey
ALTER TABLE "TenantSettings" ADD CONSTRAINT "TenantSettings_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AIProviderSetting" ADD CONSTRAINT "AIProviderSetting_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE CASCADE ON UPDATE CASCADE;
