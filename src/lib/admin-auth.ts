import "server-only";
import { cookies } from "next/headers";
import { timingSafeEqual } from "node:crypto";

// Lightweight gate for the internal admin area. Not a full auth system — it
// checks a single shared secret (ADMIN_ACCESS_TOKEN) so the registrations view,
// which exposes PII, is never publicly reachable. Replace with Supabase Auth +
// roles when the student/admin account system is built.

export const ADMIN_COOKIE = "cd_admin";

function safeEqual(a: string, b: string): boolean {
  const ab = Buffer.from(a);
  const bb = Buffer.from(b);
  if (ab.length !== bb.length) return false;
  return timingSafeEqual(ab, bb);
}

/** True when an ADMIN_ACCESS_TOKEN is configured; otherwise the area stays closed. */
export function adminTokenConfigured(): boolean {
  return Boolean(process.env.ADMIN_ACCESS_TOKEN);
}

export function verifyAdminToken(input: string): boolean {
  const token = process.env.ADMIN_ACCESS_TOKEN;
  if (!token) return false;
  return safeEqual(input, token);
}

export async function isAdminAuthed(): Promise<boolean> {
  const token = process.env.ADMIN_ACCESS_TOKEN;
  if (!token) return false;
  const value = (await cookies()).get(ADMIN_COOKIE)?.value;
  return typeof value === "string" && safeEqual(value, token);
}
