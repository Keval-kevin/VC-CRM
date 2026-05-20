import "dotenv/config";

import { z } from "zod";

const envSchema = z.object({
  AI_KEY_ENCRYPTION_SECRET: z.string().min(32).default("replace-with-local-ai-key-secret-32-chars"),
  API_PORT: z.coerce.number().int().positive().default(4000),
  JWT_ACCESS_SECRET: z.string().min(32).default("replace-with-local-access-secret"),
  JWT_REFRESH_SECRET: z.string().min(32).default("replace-with-local-refresh-secret"),
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
});

export const env = envSchema.parse(process.env);
