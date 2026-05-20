import type { AccessTokenPayload } from "../../shared/auth/jwt.js";

export type CrmActor = AccessTokenPayload;

export type CrmRequestContext = {
  ipAddress?: string;
  userAgent?: string;
};

export type PaginatedResult<TItem> = {
  items: TItem[];
  pagination: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
  };
};
