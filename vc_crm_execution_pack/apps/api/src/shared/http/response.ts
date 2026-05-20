export type SuccessResponse<TData> = {
  success: true;
  data: TData;
  meta?: Record<string, unknown>;
};

export type ErrorResponse = {
  success: false;
  error: {
    code: string;
    message: string;
    details?: unknown;
  };
};

export function createSuccessResponse<TData>(
  data: TData,
  meta?: Record<string, unknown>,
): SuccessResponse<TData> {
  return meta === undefined ? { success: true, data } : { success: true, data, meta };
}

export function createErrorResponse(
  code: string,
  message: string,
  details?: unknown,
): ErrorResponse {
  return details === undefined
    ? { success: false, error: { code, message } }
    : { success: false, error: { code, message, details } };
}
