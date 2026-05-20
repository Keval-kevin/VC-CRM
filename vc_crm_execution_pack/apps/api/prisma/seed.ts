import bcrypt from "bcrypt";
import { PrismaClient, RoleScope } from "@prisma/client";

const prisma = new PrismaClient();

const developmentPassword = "Password123!";

const permissions = [
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
