import "server-only";
import { redirect } from "next/navigation";
import { getSupabaseServer } from "@/lib/supabase/server";
import { getSupabaseAdmin } from "@/lib/supabase/admin";
import { canEditFinancials, isAdmin, isStaff, type AppUser, type Role } from "./roles";

// ── Server-side auth/role resolution ─────────────────────────────────────────
// Every protected route and server action resolves the *real* logged-in user
// here (from the Supabase session cookie) and loads their role from app_users.
// This is the authoritative gate; RLS in Postgres is the backstop. We never
// trust a role passed from the client.

export type AuthState =
  | { configured: false } // env not provisioned → "Connection required"
  | { configured: true; user: AppUser | null };

/** Resolve the current user + their app role, or a not-configured signal. */
export async function getAuthState(): Promise<AuthState> {
  const supabase = await getSupabaseServer();
  const admin = getSupabaseAdmin();
  if (!supabase || !admin) return { configured: false };

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { configured: true, user: null };

  // Read the role with the service-role client (authoritative, RLS-independent).
  const { data: row } = await admin
    .from("app_users")
    .select("id, email, full_name, role, can_edit_financials")
    .eq("id", user.id)
    .maybeSingle();

  const appUser: AppUser = {
    id: user.id,
    email: row?.email ?? user.email ?? "",
    fullName: row?.full_name ?? null,
    role: (row?.role as Role) ?? "student",
    canEditFinancials: Boolean(row?.can_edit_financials),
  };
  return { configured: true, user: appUser };
}

/** Convenience: the current staff user or null (no redirect). */
export async function getCurrentStaff(): Promise<AppUser | null> {
  const state = await getAuthState();
  if (!state.configured || !state.user) return null;
  return isStaff(state.user) ? state.user : null;
}

/**
 * Require a signed-in staff member. Redirects to the login page (not found /
 * not authorised are deliberately indistinguishable to avoid leaking which
 * accounts are staff).
 */
export async function requireStaff(): Promise<AppUser> {
  const state = await getAuthState();
  if (!state.configured) redirect("/accountant/login?e=unconfigured");
  if (!state.user) redirect("/accountant/login");
  if (!isStaff(state.user)) redirect("/accountant/login?e=forbidden");
  return state.user;
}

export async function requireAdmin(): Promise<AppUser> {
  const user = await requireStaff();
  if (!isAdmin(user)) redirect("/accountant?e=forbidden");
  return user;
}

/** Require a staff member allowed to modify financial records. */
export async function requireEditor(): Promise<AppUser> {
  const user = await requireStaff();
  if (!canEditFinancials(user)) redirect("/accountant?e=readonly");
  return user;
}
