import "server-only";
import { cookies } from "next/headers";
import { createHmac, scryptSync, timingSafeEqual } from "node:crypto";

// Username + password gate for the internal admin area (the registrations view
// exposes PII, so it must never be publicly reachable). Credentials live in the
// environment — no database required:
//   ADMIN_USERNAME       the login name
//   ADMIN_PASSWORD_HASH  scrypt hash, format  scrypt$<saltHex>$<hashHex>
//   ADMIN_PASSWORD       (optional) plaintext fallback if no hash is set
//   ADMIN_SESSION_SECRET (optional) explicit cookie-signing key
// The session cookie stores a signed value (username + HMAC), never the
// password. The signing key is derived from the password hash, so rotating the
// password automatically invalidates existing sessions.

export const ADMIN_COOKIE = "cd_admin";

function bufEq(a: string, b: string): boolean {
  const ab = Buffer.from(a);
  const bb = Buffer.from(b);
  if (ab.length !== bb.length) return false;
  return timingSafeEqual(ab, bb);
}

function creds() {
  return {
    username: process.env.ADMIN_USERNAME ?? "",
    passwordHash: process.env.ADMIN_PASSWORD_HASH ?? "",
    password: process.env.ADMIN_PASSWORD ?? "",
  };
}

/** True when a username and a password (hash or plaintext) are configured. */
export function adminAuthConfigured(): boolean {
  const c = creds();
  return Boolean(c.username && (c.passwordHash || c.password));
}

// Cookie-signing key. Tying it to the password hash means changing the password
// invalidates every previously issued session cookie.
function sessionKey(): string {
  const c = creds();
  return process.env.ADMIN_SESSION_SECRET || c.passwordHash || c.password || "unconfigured";
}

function verifyPassword(input: string): boolean {
  const c = creds();
  if (c.passwordHash) {
    const parts = c.passwordHash.split("$");
    if (parts.length !== 3 || parts[0] !== "scrypt") return false;
    let salt: Buffer;
    let expected: Buffer;
    try {
      salt = Buffer.from(parts[1], "hex");
      expected = Buffer.from(parts[2], "hex");
    } catch {
      return false;
    }
    let derived: Buffer;
    try {
      derived = scryptSync(input, salt, expected.length);
    } catch {
      return false;
    }
    return expected.length === derived.length && timingSafeEqual(expected, derived);
  }
  if (c.password) return bufEq(input, c.password);
  return false;
}

/** Verify a submitted username + password against the configured credentials. */
export function verifyCredentials(username: string, password: string): boolean {
  if (!adminAuthConfigured()) return false;
  // Evaluate both sides regardless of the username result to keep timing stable.
  const okUser = bufEq(username, creds().username);
  const okPass = verifyPassword(password);
  return okUser && okPass;
}

/** Build the signed value stored in the session cookie. */
export function createSession(username: string): string {
  const sig = createHmac("sha256", sessionKey()).update(username).digest("hex");
  return `${username}.${sig}`;
}

export async function isAdminAuthed(): Promise<boolean> {
  if (!adminAuthConfigured()) return false;
  const value = (await cookies()).get(ADMIN_COOKIE)?.value;
  if (!value) return false;
  const idx = value.lastIndexOf(".");
  if (idx <= 0) return false;
  const username = value.slice(0, idx);
  const sig = value.slice(idx + 1);
  if (!bufEq(username, creds().username)) return false;
  const expected = createHmac("sha256", sessionKey()).update(username).digest("hex");
  return bufEq(sig, expected);
}
