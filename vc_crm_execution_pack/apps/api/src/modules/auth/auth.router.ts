import { Router } from "express";

import { permissions } from "../../shared/auth/permissions.js";
import { asyncHandler } from "../../shared/http/async-handler.js";
import { requireAuth } from "../../shared/middleware/auth.middleware.js";
import { createRateLimit } from "../../shared/middleware/rate-limit.middleware.js";
import { requirePermission } from "../../shared/middleware/rbac.middleware.js";
import { requireTenant } from "../../shared/middleware/tenant.middleware.js";
import {
  forgotPasswordController,
  loginController,
  logoutController,
  meController,
  rbacCheckController,
  refreshController,
  resetPasswordController,
} from "./auth.controller.js";

const authRateLimit = createRateLimit({
  keyPrefix: "auth",
  maxRequests: 20,
  windowMs: 60_000,
});

export const authRouter = Router();

authRouter.post("/login", authRateLimit, asyncHandler(loginController));
authRouter.post("/refresh", authRateLimit, asyncHandler(refreshController));
authRouter.post("/logout", authRateLimit, asyncHandler(logoutController));
authRouter.post("/forgot-password", authRateLimit, asyncHandler(forgotPasswordController));
authRouter.post("/reset-password", authRateLimit, asyncHandler(resetPasswordController));
authRouter.get("/me", requireAuth, asyncHandler(meController));
authRouter.get(
  "/rbac-check",
  requireAuth,
  requireTenant,
  requirePermission(permissions.usersManage),
  asyncHandler(rbacCheckController),
);
