export const permissions = {
  accountsCreate: "accounts:create",
  accountsDelete: "accounts:delete:all",
  accountsRead: "accounts:read:all",
  accountsUpdate: "accounts:update:all",
  aiSettingsManage: "ai-settings:manage",
  adminSettingsManage: "admin-settings:manage",
  auditRead: "audit:read",
  contactsCreate: "contacts:create",
  contactsDelete: "contacts:delete:all",
  contactsRead: "contacts:read:all",
  contactsUpdate: "contacts:update:all",
  rolesManage: "roles:manage",
  tenantsManage: "tenants:manage",
  usersManage: "users:manage",
} as const;

export type PermissionKey = (typeof permissions)[keyof typeof permissions];
