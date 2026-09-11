import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase/admin";
import { getCurrentStaff } from "@/lib/accounting/auth";
import { logAudit } from "@/lib/accounting/audit";

export const dynamic = "force-dynamic";

type Row = Record<string, unknown>;
const money = (c: unknown) => (typeof c === "number" ? (c / 100).toFixed(2) : "");
function csvCell(v: unknown): string {
  const s = v == null ? "" : String(v);
  return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}

const REPORTS: Record<string, { title: string; basis: string }> = {
  "registration-fees": { title: "Course registration fees", basis: "Imported course fees — NOT collected revenue; tax status unknown." },
  invoices: { title: "Issued invoices", basis: "Amounts billed on issued (non-draft, non-void) invoices." },
  "verified-payments": { title: "Verified payments received", basis: "Verified, non-fee payments only (refunds subtract)." },
  outstanding: { title: "Outstanding invoiced balances", basis: "Issued invoice totals minus verified allocated payments." },
  refunds: { title: "Refunds", basis: "Payments flagged as refunds." },
  "missing-documents": { title: "Missing documents", basis: "Registrations with no invoice attached." },
  unverified: { title: "Unmatched / unverified records", basis: "Registrations whose payment is not yet verified." },
};

export async function GET(request: NextRequest) {
  const staff = await getCurrentStaff();
  if (!staff) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const admin = getSupabaseAdmin();
  if (!admin) return NextResponse.json({ error: "Connection required" }, { status: 503 });

  const type = request.nextUrl.searchParams.get("type") ?? "";
  const report = REPORTS[type];
  if (!report) return NextResponse.json({ error: "Unknown report" }, { status: 400 });

  let header: string[] = [];
  let body: string[][] = [];

  if (type === "registration-fees" || type === "missing-documents" || type === "unverified") {
    const { data } = await admin
      .from("acct_registrations")
      .select("id, course_title, imported_fee_cents, currency, original_import_status, payment_verification, student:acct_students(full_name, organization, email)");
    let regs = (data ?? []) as Row[];
    if (type === "unverified") regs = regs.filter((r) => r.payment_verification === "unverified");
    if (type === "missing-documents") {
      const { data: inv } = await admin.from("acct_invoices").select("registration_id");
      const withInv = new Set((inv ?? []).map((i) => (i as Row).registration_id));
      regs = regs.filter((r) => !withInv.has(r.id));
    }
    header = ["Student", "Organization", "Email", "Course", "Imported fee", "Currency", "Original status", "Verification"];
    body = regs.map((r) => {
      const st = (Array.isArray(r.student) ? r.student[0] : r.student) as Row;
      return [st?.full_name, st?.organization, st?.email ?? "(missing)", r.course_title, money(r.imported_fee_cents), String(r.currency ?? "cad").toUpperCase(), r.original_import_status, r.payment_verification].map((x) => String(x ?? ""));
    });
  } else if (type === "invoices" || type === "outstanding") {
    const { data } = await admin.from("acct_invoices").select("invoice_number, course_title, total_cents, currency, status, issue_date, student:acct_students(full_name)");
    let invoices = ((data ?? []) as Row[]).filter((i) => i.status !== "draft" && i.status !== "void");
    if (type === "outstanding") {
      const { data: allocs } = await admin.from("acct_payment_allocations").select("amount_cents, invoice_id, payment:acct_payments(verified)");
      const paidByInvoice = new Map<string, number>();
      for (const a of (allocs ?? []) as Row[]) {
        const pay = (Array.isArray(a.payment) ? a.payment[0] : a.payment) as Row;
        if (pay?.verified && a.invoice_id) paidByInvoice.set(String(a.invoice_id), (paidByInvoice.get(String(a.invoice_id)) ?? 0) + Number(a.amount_cents ?? 0));
      }
      invoices = invoices.filter((i) => (Number(i.total_cents ?? 0) - (paidByInvoice.get(String(i.invoice_number)) ?? 0)) > 0);
    }
    header = ["Invoice #", "Student", "Course", "Issued", "Total", "Currency", "Status"];
    body = invoices.map((i) => {
      const st = (Array.isArray(i.student) ? i.student[0] : i.student) as Row;
      return [i.invoice_number ?? "", st?.full_name, i.course_title, i.issue_date, money(i.total_cents), String(i.currency ?? "cad").toUpperCase(), i.status].map((x) => String(x ?? ""));
    });
  } else {
    // verified-payments | refunds
    const { data } = await admin.from("acct_payments").select("amount_cents, currency, method, source, paid_at, reference, verified, is_fee, is_refund, student:acct_students(full_name, email)");
    let pays = (data ?? []) as Row[];
    if (type === "verified-payments") pays = pays.filter((p) => p.verified && !p.is_fee && !p.is_refund);
    if (type === "refunds") pays = pays.filter((p) => p.is_refund);
    header = ["Student", "Email", "Amount", "Currency", "Method", "Source", "Date", "Reference", "Verified"];
    body = pays.map((p) => {
      const st = (Array.isArray(p.student) ? p.student[0] : p.student) as Row;
      return [st?.full_name, st?.email, money(p.amount_cents), String(p.currency ?? "cad").toUpperCase(), p.method, p.source, p.paid_at, p.reference, p.verified ? "Yes" : "No"].map((x) => String(x ?? ""));
    });
  }

  const now = new Date();
  const meta = [
    `# CanaDent — ${report.title}`,
    `# Generated: ${now.toISOString()}`,
    `# Currency: CAD`,
    `# Basis: ${report.basis}`,
    `# Rows: ${body.length}`,
    "",
  ];
  const csv = [...meta, header.map(csvCell).join(","), ...body.map((r) => r.map(csvCell).join(","))].join("\n");

  await logAudit(admin, { actorId: staff.id, actorEmail: staff.email, action: "export.report", meta: { type, rows: body.length } });

  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="canadent-${type}-${now.toISOString().slice(0, 10)}.csv"`,
      "Cache-Control": "no-store",
    },
  });
}
