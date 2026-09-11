"use server";

import { redirect } from "next/navigation";
import { getSupabaseServer } from "@/lib/supabase/server";
import { getSupabaseAdmin } from "@/lib/supabase/admin";
import { hashInviteToken } from "@/lib/accounting/invitations";
import { logAudit } from "@/lib/accounting/audit";

// ── Accountant auth: sign in / out, password recovery, invite acceptance ─────
// All flows use Supabase Auth. Role is NEVER set from the client — it is applied
// server-side from a validated invitation (see acceptInvite).

export type FormState = { error?: string; message?: string } | null;

export async function signIn(_prev: FormState, formData: FormData): Promise<FormState> {
  const supabase = await getSupabaseServer();
  if (!supabase) return { error: "Sign-in is not available yet — the authentication service is not configured." };

  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const next = String(formData.get("next") ?? "/accountant");

  if (!email || !password) return { error: "Enter your email and password." };

  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) return { error: "Incorrect email or password." };

  redirect(next.startsWith("/accountant") ? next : "/accountant");
}

export async function signOut(): Promise<void> {
  const supabase = await getSupabaseServer();
  if (supabase) await supabase.auth.signOut();
  redirect("/accountant/login");
}

export async function requestPasswordReset(_prev: FormState, formData: FormData): Promise<FormState> {
  const supabase = await getSupabaseServer();
  if (!supabase) return { error: "Password recovery is not available yet." };
  const email = String(formData.get("email") ?? "").trim();
  if (!email) return { error: "Enter your email address." };

  const base = process.env.NEXT_PUBLIC_BASE_URL ?? "";
  await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${base}/accountant/reset-password`,
  });
  // Always report success — never reveal whether an account exists.
  return { message: "If that email belongs to a staff account, a password-reset link is on its way." };
}

export async function updatePassword(_prev: FormState, formData: FormData): Promise<FormState> {
  const supabase = await getSupabaseServer();
  if (!supabase) return { error: "Password update is not available yet." };
  const password = String(formData.get("password") ?? "");
  if (password.length < 10) return { error: "Choose a password of at least 10 characters." };

  const { error } = await supabase.auth.updateUser({ password });
  if (error) return { error: "That reset link has expired or is invalid. Request a new one." };
  redirect("/accountant");
}

/**
 * Accept a staff invitation: validate the token, create (or update) the auth
 * user with the email pre-confirmed, apply the invited role, mark the invite
 * accepted, then sign in.
 */
export async function acceptInvite(_prev: FormState, formData: FormData): Promise<FormState> {
  const admin = getSupabaseAdmin();
  const supabase = await getSupabaseServer();
  if (!admin || !supabase) return { error: "Accounts are not available yet — the service is not configured." };

  const token = String(formData.get("token") ?? "").trim();
  const fullName = String(formData.get("fullName") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  if (!token) return { error: "This invitation link is missing its token." };
  if (password.length < 10) return { error: "Choose a password of at least 10 characters." };

  const { data: invite } = await admin
    .from("accountant_invitations")
    .select("id, email, role, expires_at, status")
    .eq("token_hash", hashInviteToken(token))
    .maybeSingle();

  if (!invite || invite.status !== "pending") {
    return { error: "This invitation is no longer valid. Ask an administrator to resend it." };
  }
  if (new Date(invite.expires_at).getTime() < Date.now()) {
    await admin.from("accountant_invitations").update({ status: "expired" }).eq("id", invite.id);
    return { error: "This invitation has expired. Ask an administrator to send a new one." };
  }

  // Create the auth user with email pre-confirmed (they proved control via the
  // emailed link). If they already exist, set their password instead.
  let userId: string | null = null;
  const created = await admin.auth.admin.createUser({
    email: invite.email,
    password,
    email_confirm: true,
    user_metadata: { full_name: fullName || null },
  });
  if (created.data?.user) {
    userId = created.data.user.id;
  } else {
    // Likely already exists — find and update.
    const { data: list } = await admin.auth.admin.listUsers();
    const existing = list?.users.find((u) => u.email?.toLowerCase() === invite.email.toLowerCase());
    if (!existing) return { error: created.error?.message ?? "Could not create your account." };
    userId = existing.id;
    await admin.auth.admin.updateUserById(userId, { password, email_confirm: true });
  }

  // Apply the invited role (authoritative, server-side only).
  await admin.from("app_users").upsert({
    id: userId,
    email: invite.email,
    full_name: fullName || null,
    role: invite.role,
    can_edit_financials: false,
    updated_at: new Date().toISOString(),
  });
  await admin.from("accountant_invitations").update({ status: "accepted", accepted_at: new Date().toISOString() }).eq("id", invite.id);
  await logAudit(admin, {
    actorId: userId,
    actorEmail: invite.email,
    action: "invite.accepted",
    entity: "app_users",
    entityId: userId,
    meta: { role: invite.role },
  });

  const { error: signInErr } = await supabase.auth.signInWithPassword({ email: invite.email, password });
  if (signInErr) redirect("/accountant/login?m=invite-accepted");
  redirect("/accountant");
}
