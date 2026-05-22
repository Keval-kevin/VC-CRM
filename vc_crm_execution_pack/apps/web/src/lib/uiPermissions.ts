export type UiPermissions = {
  canViewAuditLog: boolean;
  canViewFinancials: boolean;
};

export function getUiPermissions(): UiPermissions {
  return {
    canViewAuditLog: true,
    canViewFinancials: true,
  };
}
