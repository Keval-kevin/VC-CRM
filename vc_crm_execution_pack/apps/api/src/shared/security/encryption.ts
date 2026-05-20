import { createCipheriv, createHash, randomBytes } from "node:crypto";

import { env } from "../../config/env.js";

const algorithm = "aes-256-gcm";

export type EncryptedSecret = {
  encryptedValue: string;
  iv: string;
  tag: string;
  lastFour: string;
};

export function encryptSecret(value: string): EncryptedSecret {
  const iv = randomBytes(12);
  const key = createHash("sha256").update(env.AI_KEY_ENCRYPTION_SECRET).digest();
  const cipher = createCipheriv(algorithm, key, iv);
  const encrypted = Buffer.concat([cipher.update(value, "utf8"), cipher.final()]);
  const tag = cipher.getAuthTag();

  return {
    encryptedValue: encrypted.toString("base64"),
    iv: iv.toString("base64"),
    tag: tag.toString("base64"),
    lastFour: value.slice(-4),
  };
}
