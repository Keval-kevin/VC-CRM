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
