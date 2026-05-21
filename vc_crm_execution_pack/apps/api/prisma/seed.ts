import bcrypt from "bcrypt";
import { PrismaClient, RoleScope } from "@prisma/client";

const prisma = new PrismaClient();

const developmentPassword = "Password123!";

const permissions = [
  {
    key: "leads:read:all",
    name: "Read leads",
    category: "leads",
    description: "View all tenant leads.",
  },
  {
    key: "leads:create",
    name: "Create leads",
    category: "leads",
    description: "Create tenant leads.",
  },
  {
    key: "leads:update:all",
    name: "Update leads",
    category: "leads",
    description: "Update all tenant leads.",
  },
  {
    key: "leads:delete:all",
    name: "Delete leads",
    category: "leads",
    description: "Soft delete tenant leads.",
  },
  {
    key: "opportunities:read:all",
    name: "Read opportunities",
    category: "opportunities",
    description: "View all tenant opportunities and pipeline views.",
  },
  {
    key: "opportunities:create",
    name: "Create opportunities",
    category: "opportunities",
    description: "Create tenant opportunities and convert leads.",
  },
  {
    key: "opportunities:update:all",
    name: "Update opportunities",
    category: "opportunities",
    description: "Update tenant opportunities and move pipeline stages.",
  },
  {
    key: "opportunities:delete:all",
    name: "Delete opportunities",
    category: "opportunities",
    description: "Soft delete tenant opportunities.",
  },
  {
    key: "proposals:read:all",
    name: "Read proposals",
    category: "proposals",
    description: "View all tenant proposals and approval queues.",
  },
  {
    key: "proposals:create",
    name: "Create proposals",
    category: "proposals",
    description: "Create tenant proposals and proposal versions.",
  },
  {
    key: "proposals:update:all",
    name: "Update proposals",
    category: "proposals",
    description: "Update all tenant proposals.",
  },
  {
    key: "proposals:delete:all",
    name: "Delete proposals",
    category: "proposals",
    description: "Soft delete tenant proposals.",
  },
  {
    key: "proposals:approve",
    name: "Approve proposals",
    category: "proposals",
    description: "Approve or reject submitted tenant proposals.",
  },
  {
    key: "activities:read:all",
    name: "Read activities",
    category: "activities",
    description: "View tenant activities, tasks, reminders, and timelines.",
  },
  {
    key: "activities:create",
    name: "Create activities",
    category: "activities",
    description: "Create tenant activities, tasks, and reminders.",
  },
  {
    key: "activities:update:all",
    name: "Update activities",
    category: "activities",
    description: "Update all tenant activities and task status.",
  },
  {
    key: "activities:delete:all",
    name: "Delete activities",
    category: "activities",
    description: "Soft delete tenant activities.",
  },
  {
    key: "vendors:read:all",
    name: "Read vendors",
    category: "vendors",
    description: "View all tenant vendors, documents, scorecards, and portal readiness.",
  },
  {
    key: "vendors:create",
    name: "Create vendors",
    category: "vendors",
    description: "Create tenant vendors.",
  },
  {
    key: "vendors:update:all",
    name: "Update vendors",
    category: "vendors",
    description: "Update all tenant vendors.",
  },
  {
    key: "vendors:delete:all",
    name: "Delete vendors",
    category: "vendors",
    description: "Soft delete tenant vendors.",
  },
  {
    key: "candidates:read:all",
    name: "Read candidates",
    category: "candidates",
    description: "View all tenant candidates, resumes, consent, and vendor links.",
  },
  {
    key: "candidates:create",
    name: "Create candidates",
    category: "candidates",
    description: "Create tenant candidates and queue resume parsing placeholders.",
  },
  {
    key: "candidates:update:all",
    name: "Update candidates",
    category: "candidates",
    description: "Update all tenant candidates, consent, skills, and blacklist status.",
  },
  {
    key: "candidates:delete:all",
    name: "Delete candidates",
    category: "candidates",
    description: "Soft delete tenant candidates.",
  },
  {
    key: "requirements:read:all",
    name: "Read requirements",
    category: "requirements",
    description: "View tenant staff augmentation requirements and submission trackers.",
  },
  {
    key: "requirements:create",
    name: "Create requirements",
    category: "requirements",
    description: "Create tenant staff augmentation requirements.",
  },
  {
    key: "requirements:update:all",
    name: "Update requirements",
    category: "requirements",
    description: "Update all tenant staff augmentation requirements.",
  },
  {
    key: "requirements:delete:all",
    name: "Delete requirements",
    category: "requirements",
    description: "Soft delete tenant staff augmentation requirements.",
  },
  {
    key: "submissions:read:all",
    name: "Read submissions",
    category: "submissions",
    description: "View candidate submissions and pipeline status.",
  },
  {
    key: "submissions:create",
    name: "Create submissions",
    category: "submissions",
    description: "Submit candidates to requirements.",
  },
  {
    key: "submissions:update:all",
    name: "Update submissions",
    category: "submissions",
    description: "Update submission review, client submission, interview, and feedback status.",
  },
  {
    key: "submissions:delete:all",
    name: "Delete submissions",
    category: "submissions",
    description: "Soft delete candidate submissions.",
  },
  {
    key: "interviews:read:all",
    name: "Read interviews",
    category: "interviews",
    description: "View tenant interview schedules, feedback, and outcomes.",
  },
  {
    key: "interviews:create",
    name: "Create interviews",
    category: "interviews",
    description: "Schedule tenant candidate interviews.",
  },
  {
    key: "interviews:update:all",
    name: "Update interviews",
    category: "interviews",
    description: "Update interview schedules, feedback, and outcomes.",
  },
  {
    key: "interviews:delete:all",
    name: "Delete interviews",
    category: "interviews",
    description: "Soft delete tenant interviews.",
  },
  {
    key: "placements:read:all",
    name: "Read placements",
    category: "placements",
    description: "View tenant placements, billing status, and authorized finance fields.",
  },
  {
    key: "placements:create",
    name: "Create placements",
    category: "placements",
    description: "Create selected candidate placements.",
  },
  {
    key: "placements:update:all",
    name: "Update placements",
    category: "placements",
    description: "Update placement billing, joining, replacement, and margin fields.",
  },
  {
    key: "placements:delete:all",
    name: "Delete placements",
    category: "placements",
    description: "Soft delete tenant placements.",
  },
  {
    key: "accounts:read:all",
    name: "Read accounts",
    category: "accounts",
    description: "View all tenant accounts.",
  },
  {
    key: "accounts:create",
    name: "Create accounts",
    category: "accounts",
    description: "Create tenant accounts.",
  },
  {
    key: "accounts:update:all",
    name: "Update accounts",
    category: "accounts",
    description: "Update all tenant accounts.",
  },
  {
    key: "accounts:delete:all",
    name: "Delete accounts",
    category: "accounts",
    description: "Soft delete tenant accounts.",
  },
  {
    key: "contacts:read:all",
    name: "Read contacts",
    category: "contacts",
    description: "View all tenant contacts.",
  },
  {
    key: "contacts:create",
    name: "Create contacts",
    category: "contacts",
    description: "Create tenant contacts.",
  },
  {
    key: "contacts:update:all",
    name: "Update contacts",
    category: "contacts",
    description: "Update all tenant contacts.",
  },
  {
    key: "contacts:delete:all",
    name: "Delete contacts",
    category: "contacts",
    description: "Soft delete tenant contacts.",
  },
  {
    key: "admin-settings:manage",
    name: "Manage admin settings",
    category: "admin",
    description: "Manage tenant security and company settings.",
  },
  {
    key: "ai-settings:manage",
    name: "Manage AI settings",
    category: "ai",
    description: "Configure AI providers, models, budgets, and encrypted API key storage.",
  },
  {
    key: "tenants:manage",
    name: "Manage tenants",
    category: "tenants",
    description: "Create and manage platform tenants.",
  },
  {
    key: "users:manage",
    name: "Manage users",
    category: "users",
    description: "Invite, update, deactivate, and restore users.",
  },
  {
    key: "roles:manage",
    name: "Manage roles",
    category: "roles",
    description: "Manage role and permission assignments.",
  },
  {
    key: "audit:read",
    name: "Read audit logs",
    category: "audit",
    description: "View audit history.",
  },
] as const;

async function upsertPermissions(): Promise<Map<string, string>> {
  const permissionIds = new Map<string, string>();

  for (const permission of permissions) {
    const savedPermission = await prisma.permission.upsert({
      where: { key: permission.key },
      create: permission,
      update: {
        name: permission.name,
        category: permission.category,
        description: permission.description,
        deletedAt: null,
      },
    });

    permissionIds.set(savedPermission.key, savedPermission.id);
  }

  return permissionIds;
}

async function assignPermissions(roleId: string, permissionIds: Iterable<string>): Promise<void> {
  for (const permissionId of permissionIds) {
    await prisma.rolePermission.upsert({
      where: {
        roleId_permissionId: {
          roleId,
          permissionId,
        },
      },
      create: {
        roleId,
        permissionId,
      },
      update: {
        deletedAt: null,
      },
    });
  }
}

async function main(): Promise<void> {
  const developmentPasswordHash = await bcrypt.hash(developmentPassword, 12);
  const permissionIds = await upsertPermissions();

  const demoTenant = await prisma.tenant.upsert({
    where: { slug: "virtual-coders" },
    create: {
      name: "Virtual Coders",
      slug: "virtual-coders",
      timezone: "Asia/Kolkata",
      locale: "en-IN",
    },
    update: {
      name: "Virtual Coders",
      timezone: "Asia/Kolkata",
      locale: "en-IN",
      deletedAt: null,
    },
  });

  const superAdminRole = await prisma.role.upsert({
    where: { uniqueKey: "global:super-admin" },
    create: {
      scope: RoleScope.GLOBAL,
      key: "super-admin",
      uniqueKey: "global:super-admin",
      name: "Super Admin",
      description: "Platform owner with global administration permissions.",
      isSystem: true,
    },
    update: {
      name: "Super Admin",
      description: "Platform owner with global administration permissions.",
      isSystem: true,
      deletedAt: null,
    },
  });

  const tenantAdminRole = await prisma.role.upsert({
    where: { uniqueKey: `${demoTenant.slug}:tenant-admin` },
    create: {
      tenantId: demoTenant.id,
      scope: RoleScope.TENANT,
      key: "tenant-admin",
      uniqueKey: `${demoTenant.slug}:tenant-admin`,
      name: "Tenant Admin",
      description: "Tenant administrator for the demo company.",
      isSystem: true,
    },
    update: {
      tenantId: demoTenant.id,
      name: "Tenant Admin",
      description: "Tenant administrator for the demo company.",
      isSystem: true,
      deletedAt: null,
    },
  });

  await assignPermissions(superAdminRole.id, permissionIds.values());
  await assignPermissions(
    tenantAdminRole.id,
    [
      permissionIds.get("leads:read:all"),
      permissionIds.get("leads:create"),
      permissionIds.get("leads:update:all"),
      permissionIds.get("leads:delete:all"),
      permissionIds.get("opportunities:read:all"),
      permissionIds.get("opportunities:create"),
      permissionIds.get("opportunities:update:all"),
      permissionIds.get("opportunities:delete:all"),
      permissionIds.get("proposals:read:all"),
      permissionIds.get("proposals:create"),
      permissionIds.get("proposals:update:all"),
      permissionIds.get("proposals:delete:all"),
      permissionIds.get("proposals:approve"),
      permissionIds.get("activities:read:all"),
      permissionIds.get("activities:create"),
      permissionIds.get("activities:update:all"),
      permissionIds.get("activities:delete:all"),
      permissionIds.get("vendors:read:all"),
      permissionIds.get("vendors:create"),
      permissionIds.get("vendors:update:all"),
      permissionIds.get("vendors:delete:all"),
      permissionIds.get("candidates:read:all"),
      permissionIds.get("candidates:create"),
      permissionIds.get("candidates:update:all"),
      permissionIds.get("candidates:delete:all"),
      permissionIds.get("requirements:read:all"),
      permissionIds.get("requirements:create"),
      permissionIds.get("requirements:update:all"),
      permissionIds.get("requirements:delete:all"),
      permissionIds.get("submissions:read:all"),
      permissionIds.get("submissions:create"),
      permissionIds.get("submissions:update:all"),
      permissionIds.get("submissions:delete:all"),
      permissionIds.get("interviews:read:all"),
      permissionIds.get("interviews:create"),
      permissionIds.get("interviews:update:all"),
      permissionIds.get("interviews:delete:all"),
      permissionIds.get("placements:read:all"),
      permissionIds.get("placements:create"),
      permissionIds.get("placements:update:all"),
      permissionIds.get("placements:delete:all"),
      permissionIds.get("accounts:read:all"),
      permissionIds.get("accounts:create"),
      permissionIds.get("accounts:update:all"),
      permissionIds.get("accounts:delete:all"),
      permissionIds.get("contacts:read:all"),
      permissionIds.get("contacts:create"),
      permissionIds.get("contacts:update:all"),
      permissionIds.get("contacts:delete:all"),
      permissionIds.get("admin-settings:manage"),
      permissionIds.get("ai-settings:manage"),
      permissionIds.get("users:manage"),
      permissionIds.get("roles:manage"),
      permissionIds.get("audit:read"),
    ].filter((permissionId): permissionId is string => permissionId !== undefined),
  );

  const superAdmin = await prisma.user.upsert({
    where: { email: "super.admin@virtualcoders.local" },
    create: {
      email: "super.admin@virtualcoders.local",
      passwordHash: developmentPasswordHash,
      firstName: "Super",
      lastName: "Admin",
      isSuperAdmin: true,
    },
    update: {
      passwordHash: developmentPasswordHash,
      firstName: "Super",
      lastName: "Admin",
      isSuperAdmin: true,
      deletedAt: null,
    },
  });

  const tenantAdmin = await prisma.user.upsert({
    where: { email: "tenant.admin@virtualcoders.local" },
    create: {
      tenantId: demoTenant.id,
      email: "tenant.admin@virtualcoders.local",
      passwordHash: developmentPasswordHash,
      firstName: "Tenant",
      lastName: "Admin",
    },
    update: {
      tenantId: demoTenant.id,
      passwordHash: developmentPasswordHash,
      firstName: "Tenant",
      lastName: "Admin",
      deletedAt: null,
    },
  });

  await prisma.tenantSettings.upsert({
    where: { tenantId: demoTenant.id },
    create: {
      tenantId: demoTenant.id,
      companyName: demoTenant.name,
      timezone: demoTenant.timezone,
      locale: demoTenant.locale,
    },
    update: {
      companyName: demoTenant.name,
      timezone: demoTenant.timezone,
      locale: demoTenant.locale,
      deletedAt: null,
    },
  });

  for (const provider of ["openai", "anthropic", "gemini"]) {
    await prisma.aIProviderSetting.upsert({
      where: {
        tenantId_provider: {
          tenantId: demoTenant.id,
          provider,
        },
      },
      create: {
        tenantId: demoTenant.id,
        provider,
        defaultModel: provider === "openai" ? "gpt-4.1-mini" : "default",
      },
      update: {
        deletedAt: null,
      },
    });
  }

  await prisma.userRole.upsert({
    where: {
      userId_roleId: {
        userId: superAdmin.id,
        roleId: superAdminRole.id,
      },
    },
    create: {
      userId: superAdmin.id,
      roleId: superAdminRole.id,
    },
    update: {
      deletedAt: null,
    },
  });

  await prisma.userRole.upsert({
    where: {
      userId_roleId: {
        userId: tenantAdmin.id,
        roleId: tenantAdminRole.id,
      },
    },
    create: {
      userId: tenantAdmin.id,
      roleId: tenantAdminRole.id,
    },
    update: {
      deletedAt: null,
    },
  });

  await prisma.auditLog.upsert({
    where: { id: "00000000-0000-4000-8000-000000000001" },
    create: {
      id: "00000000-0000-4000-8000-000000000001",
      actorUserId: superAdmin.id,
      action: "seed.initialized",
      entityType: "database",
      entityId: demoTenant.id,
      metadata: {
        seed: "database-foundation",
        tenant: demoTenant.slug,
      },
    },
    update: {
      actorUserId: superAdmin.id,
      entityId: demoTenant.id,
      metadata: {
        seed: "database-foundation",
        tenant: demoTenant.slug,
      },
      deletedAt: null,
    },
  });
}

main()
  .catch((error: unknown) => {
    throw error;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
