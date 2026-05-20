export type AuthUser = {
  id: string;
  tenantId: string | null;
  email: string;
  firstName: string;
  lastName: string;
  isSuperAdmin: boolean;
  permissions: string[];
};

export type AuthTokens = {
  accessToken: string;
  refreshToken: string;
};

export type AuthResponse = AuthTokens & {
  user: AuthUser;
};

export type RequestContext = {
  ipAddress?: string;
  userAgent?: string;
};
