export const permissions = {
  aiSettingsManage: "ai-settings:manage",
  adminSettingsManage: "admin-settings:manage",
  auditRead: "audit:read",
  rolesManage: "roles:manage",
  tenantsManage: "tenants:manage",
  usersManage: "users:manage",
} as const;

export type PermissionKey = (typeof permissions)[keyof typeof permissions];
