import "server-only";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { RegistrationFilters } from "./filters";

export type { RegistrationFilters } from "./filters";

// ── Read-side queries for the dashboard ──────────────────────────────────────
// All totals are computed honestly and kept SEPARATE:
//   • imported course fees are NOT treated as collected revenue;
//   • "verified payments" counts only verified, non-fee money movements
//     (refunds subtract);
//   • outstanding balance is invoiced-minus-allocated, never "fee minus zero".

export type OverviewMetrics = {
  totalRegistrants: number;
  verifiedPaymentsCents: number;
  invoicedCents: number;
  outstandingCents: number;
  awaitingVerification: number;
  missingDocuments: number;
  importedFeesCents: number; // informational only — NOT collected revenue
  currency: string;
};

export async function getOverviewMetrics(admin: SupabaseClient): Promise<OverviewMetrics> {
  const [regs, payments, invoices, allocations] = await Promise.all([
    admin.from("acct_registrations").select("id, imported_fee_cents, payment_verification"),
    admin.from("acct_payments").select("amount_cents, verified, is_fee, is_refund"),
    admin.from("acct_invoices").select("id, total_cents, status"),
    admin
      .from("acct_payment_allocations")
      .select("amount_cents, payment:acct_payments(verified)"),
  ]);

  const registrations = regs.data ?? [];
  const totalRegistrants = registrations.length;
  const importedFeesCents = registrations.reduce((s, r) => s + (r.imported_fee_cents ?? 0), 0);
  const awaitingVerification = registrations.filter((r) => r.payment_verification === "unverified").length;

  // Verified money in: verified, non-fee payments (refunds are negative amounts).
  const verifiedPaymentsCents = (payments.data ?? [])
    .filter((p) => p.verified && !p.is_fee)
    .reduce((s, p) => s + (p.amount_cents ?? 0), 0);

  // Invoiced = issued (non-draft, non-void) invoice totals.
  const invoiceable = (invoices.data ?? []).filter(
    (i) => i.status !== "draft" && i.status !== "void",
  );
  const invoicedCents = invoiceable.reduce((s, i) => s + (i.total_cents ?? 0), 0);

  // Allocated-and-verified payments reduce the outstanding invoiced balance.
  const allocatedVerifiedCents = (allocations.data ?? [])
    .filter((a) => {
      const p = a.payment as unknown as { verified?: boolean } | { verified?: boolean }[] | null;
      const verified = Array.isArray(p) ? p[0]?.verified : p?.verified;
      return Boolean(verified);
    })
    .reduce((s, a) => s + (a.amount_cents ?? 0), 0);
  const outstandingCents = Math.max(0, invoicedCents - allocatedVerifiedCents);

  // Missing documents: registrations with no invoice linked (proxy for "missing
  // invoices or receipts"). Computed from the invoice→registration links.
  const { data: invLinks } = await admin.from("acct_invoices").select("registration_id");
  const regIdsWithInvoice = new Set<string>();
  for (const l of invLinks ?? []) if (l.registration_id) regIdsWithInvoice.add(l.registration_id as string);
  const missingDocuments = registrations.filter((r) => !regIdsWithInvoice.has(r.id as string)).length;

  return {
    totalRegistrants,
    verifiedPaymentsCents,
    invoicedCents,
    outstandingCents,
    awaitingVerification,
    missingDocuments,
    importedFeesCents,
    currency: "cad",
  };
}

// ── Student / registration table ─────────────────────────────────────────────

export type RegistrationRow = {
  registrationId: string;
  studentId: string;
  name: string;
  organization: string | null;
  email: string | null;
  missingEmail: boolean;
  courseTitle: string;
  courseSlug: string | null;
  attendance: string | null; // null → "Not specified"
  importedFeeCents: number | null;
  currency: string;
  originalStatus: string | null;
  verification: string;
  invoiceStatus: string | null; // null → no invoice
  invoiceCount: number;
  receiptCount: number;
  outstandingCents: number | null; // null → no invoice (unknown)
};

export type RegistrationPage = {
  rows: RegistrationRow[];
  total: number;
  page: number;
  pageSize: number;
  courses: { slug: string | null; title: string }[];
};

export async function listRegistrations(
  admin: SupabaseClient,
  f: RegistrationFilters,
): Promise<RegistrationPage> {
  // Base rows: registration + embedded student.
  let q = admin
    .from("acct_registrations")
    .select(
      "id, course_slug, course_title, attendance_format, imported_fee_cents, currency, original_import_status, payment_verification, student:acct_students(id, full_name, organization, email, email_normalized, flags)",
    );
  if (f.course) q = q.eq("course_slug", f.course);
  if (f.verification) q = q.eq("payment_verification", f.verification);
  const { data: regData } = await q;
  const regs = regData ?? [];

  type Student = { id: string; full_name: string; organization: string | null; email: string | null; flags: Record<string, unknown> | null };
  const student = (r: { student: unknown }): Student | null => {
    const s = r.student as Student | Student[] | null;
    return Array.isArray(s) ? (s[0] ?? null) : s;
  };

  // Text search across name / email / organization (+ invoice#/txn handled below).
  const term = f.search?.trim().toLowerCase();
  let invoiceMatchIds: Set<string> | null = null;
  if (term) {
    // Search invoices + payments so invoice number / transaction reference work.
    const [inv, pay] = await Promise.all([
      admin.from("acct_invoices").select("registration_id").ilike("invoice_number", `%${term}%`),
      admin.from("acct_payments").select("student_id").or(`reference.ilike.%${term}%,provider_ref.ilike.%${term}%`),
    ]);
    invoiceMatchIds = new Set<string>();
    for (const i of inv.data ?? []) if (i.registration_id) invoiceMatchIds.add(`reg:${i.registration_id}`);
    for (const p of pay.data ?? []) if (p.student_id) invoiceMatchIds.add(`stu:${p.student_id}`);
  }

  // Gather invoice + receipt info for the candidate registrations/students.
  const regIds = regs.map((r) => r.id as string);
  const studentIds = [...new Set(regs.map((r) => student(r)?.id).filter(Boolean) as string[])];

  const [invoicesRes, receiptsRes, allocRes] = await Promise.all([
    regIds.length ? admin.from("acct_invoices").select("id, registration_id, status, total_cents").in("registration_id", regIds) : Promise.resolve({ data: [] as unknown[] }),
    studentIds.length ? admin.from("acct_receipts").select("id, student_id").in("student_id", studentIds) : Promise.resolve({ data: [] as unknown[] }),
    regIds.length ? admin.from("acct_payment_allocations").select("amount_cents, invoice:acct_invoices(registration_id), payment:acct_payments(verified)") : Promise.resolve({ data: [] as unknown[] }),
  ]);

  const invByReg = new Map<string, { status: string; total: number }[]>();
  for (const i of (invoicesRes.data ?? []) as { registration_id: string | null; status: string; total_cents: number }[]) {
    if (!i.registration_id) continue;
    invByReg.set(i.registration_id, [...(invByReg.get(i.registration_id) ?? []), { status: i.status, total: i.total_cents ?? 0 }]);
  }
  const receiptsByStudent = new Map<string, number>();
  for (const r of (receiptsRes.data ?? []) as { student_id: string | null }[]) {
    if (r.student_id) receiptsByStudent.set(r.student_id, (receiptsByStudent.get(r.student_id) ?? 0) + 1);
  }
  const allocByReg = new Map<string, number>();
  for (const a of (allocRes.data ?? []) as { amount_cents: number; invoice: { registration_id: string | null } | { registration_id: string | null }[] | null; payment: { verified: boolean } | { verified: boolean }[] | null }[]) {
    const inv = Array.isArray(a.invoice) ? a.invoice[0] : a.invoice;
    const pay = Array.isArray(a.payment) ? a.payment[0] : a.payment;
    if (inv?.registration_id && pay?.verified) {
      allocByReg.set(inv.registration_id, (allocByReg.get(inv.registration_id) ?? 0) + (a.amount_cents ?? 0));
    }
  }

  // Build rows.
  let rows: RegistrationRow[] = regs.map((r) => {
    const s = student(r);
    const invoices = invByReg.get(r.id as string) ?? [];
    const invoicedTotal = invoices.filter((i) => i.status !== "draft" && i.status !== "void").reduce((x, i) => x + i.total, 0);
    const allocated = allocByReg.get(r.id as string) ?? 0;
    const outstanding = invoices.length ? Math.max(0, invoicedTotal - allocated) : null;
    const flags = (s?.flags ?? {}) as Record<string, unknown>;
    return {
      registrationId: r.id as string,
      studentId: s?.id ?? "",
      name: s?.full_name ?? "(unknown)",
      organization: s?.organization ?? null,
      email: s?.email ?? null,
      missingEmail: Boolean(flags.missing_email) || !s?.email,
      courseTitle: r.course_title as string,
      courseSlug: (r.course_slug as string) ?? null,
      attendance: (r.attendance_format as string) ?? null,
      importedFeeCents: (r.imported_fee_cents as number) ?? null,
      currency: (r.currency as string) ?? "cad",
      originalStatus: (r.original_import_status as string) ?? null,
      verification: (r.payment_verification as string) ?? "unverified",
      invoiceStatus: invoices[0]?.status ?? null,
      invoiceCount: invoices.length,
      receiptCount: s ? receiptsByStudent.get(s.id) ?? 0 : 0,
      outstandingCents: outstanding,
    };
  });

  // In-memory filters that depend on joined data.
  if (term) {
    rows = rows.filter((r) => {
      const hay = `${r.name} ${r.email ?? ""} ${r.organization ?? ""} ${r.courseTitle}`.toLowerCase();
      if (hay.includes(term)) return true;
      return invoiceMatchIds?.has(`reg:${r.registrationId}`) || invoiceMatchIds?.has(`stu:${r.studentId}`) || false;
    });
  }
  if (f.invoiceStatus === "none") rows = rows.filter((r) => r.invoiceCount === 0);
  else if (f.invoiceStatus) rows = rows.filter((r) => r.invoiceStatus === f.invoiceStatus);
  if (f.receipt === "has") rows = rows.filter((r) => r.receiptCount > 0);
  else if (f.receipt === "none") rows = rows.filter((r) => r.receiptCount === 0);
  if (f.missing === "email") rows = rows.filter((r) => r.missingEmail);
  else if (f.missing === "fee") rows = rows.filter((r) => r.importedFeeCents == null);

  // Sort.
  const dir = f.dir === "desc" ? -1 : 1;
  rows.sort((a, b) => {
    switch (f.sort) {
      case "fee": return ((a.importedFeeCents ?? -1) - (b.importedFeeCents ?? -1)) * dir;
      case "course": return a.courseTitle.localeCompare(b.courseTitle) * dir;
      case "verification": return a.verification.localeCompare(b.verification) * dir;
      case "organization": return (a.organization ?? "").localeCompare(b.organization ?? "") * dir;
      default: return a.name.localeCompare(b.name) * dir;
    }
  });

  const total = rows.length;
  const start = (f.page - 1) * f.pageSize;
  const paged = rows.slice(start, start + f.pageSize);

  // Distinct courses for the filter dropdown.
  const courseMap = new Map<string, string>();
  for (const r of regs) courseMap.set((r.course_slug as string) ?? "", r.course_title as string);
  const courses = [...courseMap.entries()].map(([slug, title]) => ({ slug: slug || null, title }));

  return { rows: paged, total, page: f.page, pageSize: f.pageSize, courses };
}

// ── Student detail ───────────────────────────────────────────────────────────

export async function getStudentDetail(admin: SupabaseClient, studentId: string) {
  const { data: studentRow } = await admin
    .from("acct_students")
    .select("id, full_name, organization, email, flags, notes, created_at")
    .eq("id", studentId)
    .maybeSingle();
  if (!studentRow) return null;

  const [registrations, invoices, payments, receipts, documents, audit] = await Promise.all([
    admin.from("acct_registrations").select("*").eq("student_id", studentId).order("created_at", { ascending: false }),
    admin.from("acct_invoices").select("*").eq("student_id", studentId).order("created_at", { ascending: false }),
    admin.from("acct_payments").select("*").eq("student_id", studentId).order("created_at", { ascending: false }),
    admin.from("acct_receipts").select("*").eq("student_id", studentId).order("created_at", { ascending: false }),
    admin.from("acct_documents").select("*").eq("student_id", studentId).order("created_at", { ascending: false }),
    admin.from("acct_audit_events").select("*").eq("entity_id", studentId).order("created_at", { ascending: false }).limit(50),
  ]);

  return {
    student: studentRow,
    registrations: registrations.data ?? [],
    invoices: invoices.data ?? [],
    payments: payments.data ?? [],
    receipts: receipts.data ?? [],
    documents: documents.data ?? [],
    audit: audit.data ?? [],
  };
}
