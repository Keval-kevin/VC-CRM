import type { Request, Response } from "express";

import { createSuccessResponse } from "../../shared/http/response.js";
import {
  forgotPasswordSchema,
  loginSchema,
  logoutSchema,
  refreshTokenSchema,
  resetPasswordSchema,
} from "./auth.schema.js";
import { forgotPassword, login, logout, refresh, resetPassword } from "./auth.service.js";

export async function loginController(request: Request, response: Response): Promise<void> {
  const input = loginSchema.parse(request.body);
  const result = await login(input, {
    ipAddress: request.ip,
    userAgent: request.header("user-agent"),
  });

  response.status(200).json(createSuccessResponse(result));
}

export async function refreshController(request: Request, response: Response): Promise<void> {
  const input = refreshTokenSchema.parse(request.body);
  const result = await refresh(input);

  response.status(200).json(createSuccessResponse(result));
}

export async function logoutController(request: Request, response: Response): Promise<void> {
  const input = logoutSchema.parse(request.body);
  const result = await logout(input);

  response.status(200).json(createSuccessResponse(result));
}

export async function forgotPasswordController(
  request: Request,
  response: Response,
): Promise<void> {
  const input = forgotPasswordSchema.parse(request.body);
  const result = await forgotPassword(input);

  response.status(200).json(createSuccessResponse(result));
}

export async function resetPasswordController(request: Request, response: Response): Promise<void> {
  const input = resetPasswordSchema.parse(request.body);
  const result = await resetPassword(input);

  response.status(200).json(createSuccessResponse(result));
}

export async function meController(request: Request, response: Response): Promise<void> {
  response.status(200).json(createSuccessResponse({ user: request.auth }));
}

export async function rbacCheckController(request: Request, response: Response): Promise<void> {
  response.status(200).json(
    createSuccessResponse({
      allowed: true,
      tenantId: request.tenantId,
    }),
  );
}
