// ── Roles & permissions (client-safe types + pure helpers) ──────────────────
// The authoritative checks live on the server (see auth.ts) and in Postgres RLS
// (see the migration). These helpers are shared so the UI and server agree on
// the vocabulary.

export type Role = "admin" | "accountant" | "student";

export type AppUser = {
  id: string;
  email: string;
  fullName: string | null;
  role: Role;
  canEditFinancials: boolean;
};

/** Staff = anyone who may view the accounting workspace. */
export function isStaff(user: Pick<AppUser, "role"> | null | undefined): boolean {
  return user?.role === "admin" || user?.role === "accountant";
}

export function isAdmin(user: Pick<AppUser, "role"> | null | undefined): boolean {
  return user?.role === "admin";
}

/**
 * May this user create/modify financial records? Admins always can; accountants
 * only when an admin has explicitly granted it. Students never can.
 */
export function canEditFinancials(
  user: Pick<AppUser, "role" | "canEditFinancials"> | null | undefined,
): boolean {
  if (!user) return false;
  if (user.role === "admin") return true;
  return user.role === "accountant" && user.canEditFinancials === true;
}

export const ROLE_LABELS: Record<Role, string> = {
  admin: "Administrator",
  accountant: "Accountant",
  student: "Student",
};
