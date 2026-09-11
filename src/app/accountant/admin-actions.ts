"use server";

import { revalidatePath } from "next/cache";
import { Resend } from "resend";
import { getSupabaseAdmin } from "@/lib/supabase/admin";
import { requireAdmin, requireEditor } from "@/lib/accounting/auth";
import { generateInviteToken, INVITE_TTL_DAYS } from "@/lib/accounting/invitations";
import { logAudit } from "@/lib/accounting/audit";
import { parseRegistrantsWorkbook } from "@/lib/accounting/import-parser";
import { buildImportPreview, commitImport, type ImportCourse, type ImportPreview } from "@/lib/accounting/import-service";
import { getCourse } from "@/lib/courses";

export type ActionState = { error?: string; message?: string } | null;

// ── Staff invitations (admin only) ───────────────────────────────────────────
export async function createInvite(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const admin = await requireAdmin();
  const db = getSupabaseAdmin();
  if (!db) return { error: "Service not configured." };

  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const role = String(formData.get("role") ?? "accountant");
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return { error: "Enter a valid email address." };
  if (role !== "accountant" && role !== "admin") return { error: "Invalid role." };

  const { raw, hash } = generateInviteToken();
  const expiresAt = new Date(Date.now() + INVITE_TTL_DAYS * 864e5).toISOString();

  // Supersede any existing pending invite for this email.
  await db.from("accountant_invitations").update({ status: "revoked" }).eq("status", "pending").ilike("email", email);
  const { data: invite, error } = await db
    .from("accountant_invitations")
    .insert({ email, role, token_hash: hash, invited_by: admin.id, expires_at: expiresAt })
    .select("id")
    .single();
  if (error || !invite) return { error: `Could not create invitation: ${error?.message ?? "unknown"}` };

  const base = process.env.NEXT_PUBLIC_BASE_URL ?? "";
  const link = `${base}/accountant/accept-invite?token=${raw}`;

  let emailed = false;
  if (process.env.RESEND_API_KEY) {
    try {
      const resend = new Resend(process.env.RESEND_API_KEY);
      await resend.emails.send({
        from: "CanaDent Education <noreply@canadent.net>",
        to: email,
        subject: "You've been invited to the CanaDent Accountant Dashboard",
        html: `<p>You've been invited to access the CanaDent accounting workspace as <strong>${role}</strong>.</p>
               <p><a href="${link}">Accept your invitation</a> to set a password and sign in. This link expires in ${INVITE_TTL_DAYS} days.</p>
               <p>If you weren't expecting this, you can ignore this email.</p>`,
      });
      emailed = true;
    } catch (err) {
      console.error("[invite] email send failed", err);
    }
  }

  await logAudit(db, { actorId: admin.id, actorEmail: admin.email, action: "invite.created", entity: "accountant_invitations", entityId: invite.id, meta: { email, role, emailed } });
  revalidatePath("/accountant/settings");
  return {
    message: emailed
      ? `Invitation emailed to ${email}.`
      : `Invitation created. Email isn't configured, so share this link securely: ${link}`,
  };
}

export async function revokeInvite(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const admin = await requireAdmin();
  const db = getSupabaseAdmin();
  if (!db) return { error: "Service not configured." };
  const id = String(formData.get("id") ?? "");
  await db.from("accountant_invitations").update({ status: "revoked" }).eq("id", id).eq("status", "pending");
  await logAudit(db, { actorId: admin.id, actorEmail: admin.email, action: "invite.revoked", entity: "accountant_invitations", entityId: id });
  revalidatePath("/accountant/settings");
  return { message: "Invitation revoked." };
}

// ── Staff role / permission management (admin only) ──────────────────────────
export async function setStaffRole(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const admin = await requireAdmin();
  const db = getSupabaseAdmin();
  if (!db) return { error: "Service not configured." };
  const userId = String(formData.get("userId") ?? "");
  const role = String(formData.get("role") ?? "");
  if (!["admin", "accountant", "student"].includes(role)) return { error: "Invalid role." };
  if (userId === admin.id && role !== "admin") return { error: "You can't remove your own administrator role." };

  await db.from("app_users").update({ role, updated_at: new Date().toISOString() }).eq("id", userId);
  await logAudit(db, { actorId: admin.id, actorEmail: admin.email, action: "permission.role_change", entity: "app_users", entityId: userId, meta: { role } });
  revalidatePath("/accountant/settings");
  return { message: "Role updated." };
}

export async function setEditPermission(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const admin = await requireAdmin();
  const db = getSupabaseAdmin();
  if (!db) return { error: "Service not configured." };
  const userId = String(formData.get("userId") ?? "");
  const canEdit = String(formData.get("canEdit") ?? "") === "on";
  await db.from("app_users").update({ can_edit_financials: canEdit, updated_at: new Date().toISOString() }).eq("id", userId);
  await logAudit(db, { actorId: admin.id, actorEmail: admin.email, action: "permission.edit_change", entity: "app_users", entityId: userId, meta: { canEdit } });
  revalidatePath("/accountant/settings");
  return { message: `Financial editing ${canEdit ? "enabled" : "disabled"}.` };
}

// ── Financial settings (admin only) ──────────────────────────────────────────
export async function updateSettings(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const admin = await requireAdmin();
  const db = getSupabaseAdmin();
  if (!db) return { error: "Service not configured." };

  const taxRatePct = String(formData.get("taxRate") ?? "").trim();
  const taxRateBps = taxRatePct ? Math.round(Number(taxRatePct) * 100) : null;
  await db.from("acct_settings").update({
    seller: {
      legalName: String(formData.get("legalName") ?? "").trim() || undefined,
      address: String(formData.get("address") ?? "").trim() || undefined,
      taxNumber: String(formData.get("taxNumber") ?? "").trim() || undefined,
      email: String(formData.get("sellerEmail") ?? "").trim() || undefined,
      phone: String(formData.get("sellerPhone") ?? "").trim() || undefined,
    },
    tax_label: String(formData.get("taxLabel") ?? "").trim() || null,
    tax_rate_bps: Number.isFinite(taxRateBps) ? taxRateBps : null,
    invoice_prefix: String(formData.get("invoicePrefix") ?? "CD").trim() || "CD",
    updated_by: admin.id,
    updated_at: new Date().toISOString(),
  }).eq("id", true);
  await logAudit(db, { actorId: admin.id, actorEmail: admin.email, action: "settings.update", entity: "acct_settings" });
  revalidatePath("/accountant/settings");
  return { message: "Settings saved." };
}

// ── Manual payment verification (editor only) ────────────────────────────────
export async function recordManualPayment(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const editor = await requireEditor();
  const db = getSupabaseAdmin();
  if (!db) return { error: "Service not configured." };

  const studentId = String(formData.get("studentId") ?? "");
  const amount = Number(String(formData.get("amount") ?? ""));
  const method = String(formData.get("method") ?? "etransfer");
  const reference = String(formData.get("reference") ?? "").trim() || null;
  const paidAt = String(formData.get("paidAt") ?? "").trim();
  if (!studentId) return { error: "Missing student." };
  if (!Number.isFinite(amount) || amount <= 0) return { error: "Enter a valid amount." };
  if (!paidAt) return { error: "Enter the payment date (evidence required to verify)." };

  const { data: payment, error } = await db.from("acct_payments").insert({
    student_id: studentId,
    amount_cents: Math.round(amount * 100),
    currency: "cad",
    method,
    source: "manual",
    paid_at: new Date(paidAt).toISOString(),
    reference,
    verified: true,
    verified_by: editor.id,
    verified_at: new Date().toISOString(),
    created_by: editor.id,
  }).select("id").single();
  if (error || !payment) return { error: `Could not record payment: ${error?.message ?? "unknown"}` };

  await logAudit(db, { actorId: editor.id, actorEmail: editor.email, action: "payment.manual_verify", entity: "acct_payments", entityId: payment.id, meta: { studentId, amount_cents: Math.round(amount * 100), method, reference } });
  revalidatePath(`/accountant/students/${studentId}`);
  return { message: "Verified payment recorded with an audit entry." };
}

// ── Document upload (editor only) ────────────────────────────────────────────
const ACCOUNTING_BUCKET = "accounting";

export async function uploadDocument(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const editor = await requireEditor();
  const db = getSupabaseAdmin();
  if (!db) return { error: "Service not configured." };

  const file = formData.get("file");
  const kind = String(formData.get("kind") ?? "other");
  const studentId = String(formData.get("studentId") ?? "") || null;
  const invoiceId = String(formData.get("invoiceId") ?? "") || null;
  const receiptId = String(formData.get("receiptId") ?? "") || null;
  if (!(file instanceof File) || file.size === 0) return { error: "Choose a file to upload." };
  if (file.type && file.type !== "application/pdf") return { error: "Only PDF documents are supported." };
  if (!["invoice", "receipt", "evidence", "other"].includes(kind)) return { error: "Invalid document type." };

  const safeName = file.name.replace(/[^\w.\-]+/g, "_");
  const path = `${studentId ?? "unassigned"}/${kind}/${Date.now()}-${safeName}`;
  const bytes = new Uint8Array(await file.arrayBuffer());

  const { error: upErr } = await db.storage.from(ACCOUNTING_BUCKET).upload(path, bytes, {
    contentType: "application/pdf",
    upsert: false,
  });
  if (upErr) return { error: `Upload failed: ${upErr.message}. Ensure the private "accounting" storage bucket exists.` };

  const { data: doc, error } = await db.from("acct_documents").insert({
    kind, storage_path: path, filename: file.name, mime: "application/pdf",
    byte_size: file.size, student_id: studentId, invoice_id: invoiceId, receipt_id: receiptId,
    uploaded_by: editor.id,
  }).select("id").single();
  if (error || !doc) return { error: `Saved the file but could not record it: ${error?.message ?? "unknown"}` };

  await logAudit(db, { actorId: editor.id, actorEmail: editor.email, action: "document.upload", entity: "acct_documents", entityId: doc.id, meta: { kind, studentId, invoiceId, receiptId } });
  if (studentId) revalidatePath(`/accountant/students/${studentId}`);
  return { message: `${kind === "invoice" ? "Invoice" : kind === "receipt" ? "Receipt" : "Document"} uploaded.` };
}

// ── Import preview + commit (admin only) ─────────────────────────────────────
function courseFromSlug(slug: string): ImportCourse {
  const c = getCourse(slug);
  return {
    slug: c?.slug ?? slug,
    title: c?.title ?? slug,
    date: c?.date ?? null,
    delivery: c?.format ?? null,
  };
}

export async function previewImport(
  _prev: { preview?: ImportPreview; error?: string } | null,
  formData: FormData,
): Promise<{ preview?: ImportPreview; error?: string } | null> {
  await requireAdmin();
  const db = getSupabaseAdmin();
  if (!db) return { error: "Service not configured." };

  const file = formData.get("file");
  const slug = String(formData.get("courseSlug") ?? "");
  const sheet = String(formData.get("sheet") ?? "Registrants");
  if (!(file instanceof File) || file.size === 0) return { error: "Choose a spreadsheet (.xlsx) to import." };
  if (!slug) return { error: "Choose the course these registrants belong to." };

  const buffer = new Uint8Array(await file.arrayBuffer());
  const parsed = parseRegistrantsWorkbook(buffer, sheet);
  const course = courseFromSlug(slug);
  const preview = await buildImportPreview(db, parsed, course, file.name);
  return { preview };
}

export async function commitImportAction(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const admin = await requireAdmin();
  const db = getSupabaseAdmin();
  if (!db) return { error: "Service not configured." };

  const file = formData.get("file");
  const slug = String(formData.get("courseSlug") ?? "");
  const sheet = String(formData.get("sheet") ?? "Registrants");
  const includeReviewRows = String(formData.get("includeReviewRows") ?? "")
    .split(",").map((s) => Number(s.trim())).filter((n) => Number.isFinite(n));
  if (!(file instanceof File) || file.size === 0) return { error: "The file is missing — re-select it and try again." };
  if (!slug) return { error: "Missing course." };

  const buffer = new Uint8Array(await file.arrayBuffer());
  const parsed = parseRegistrantsWorkbook(buffer, sheet);
  const course = courseFromSlug(slug);
  const preview = await buildImportPreview(db, parsed, course, file.name);
  const result = await commitImport(db, preview, file.name, { id: admin.id, email: admin.email }, includeReviewRows);

  revalidatePath("/accountant/students");
  revalidatePath("/accountant");
  if (result.errors.length) {
    return { message: `Imported with issues: ${result.created} new, ${result.linked} linked, ${result.updated} updated, ${result.skipped} skipped, ${result.errors.length} error(s).` };
  }
  return { message: `Import complete: ${result.created} new, ${result.linked} linked, ${result.updated} updated, ${result.skipped} skipped.` };
}
