import { z } from "zod";

export const loginSchema = z
  .object({
    email: z
      .string()
      .email()
      .transform((value) => value.toLowerCase()),
    password: z.string().min(8),
  })
  .strict();

export const refreshTokenSchema = z
  .object({
    refreshToken: z.string().min(1),
  })
  .strict();

export const logoutSchema = refreshTokenSchema;

export const forgotPasswordSchema = z
  .object({
    email: z
      .string()
      .email()
      .transform((value) => value.toLowerCase()),
  })
  .strict();

export const resetPasswordSchema = z
  .object({
    token: z.string().min(1),
    password: z.string().min(8),
  })
  .strict();

export type LoginInput = z.infer<typeof loginSchema>;
export type TokenInput = z.infer<typeof refreshTokenSchema>;
export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;
