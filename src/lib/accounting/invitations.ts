import "server-only";
import { createHash, randomBytes } from "node:crypto";

// Invitation tokens: we email a random raw token and persist only its SHA-256
// hash, so a database leak never yields usable invite links.
export function generateInviteToken(): { raw: string; hash: string } {
  const raw = randomBytes(32).toString("base64url");
  return { raw, hash: hashInviteToken(raw) };
}

export function hashInviteToken(raw: string): string {
  return createHash("sha256").update(raw).digest("hex");
}

export const INVITE_TTL_DAYS = 7;
