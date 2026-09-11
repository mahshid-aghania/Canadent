import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft, Mail, Building2, AlertTriangle, FileText, ReceiptText, Download,
  Wallet, ClipboardList, History, CircleDollarSign,
} from "lucide-react";
import { getSupabaseAdmin } from "@/lib/supabase/admin";
import { getStudentDetail } from "@/lib/accounting/queries";
import { getCurrentStaff } from "@/lib/accounting/auth";
import { canEditFinancials } from "@/lib/accounting/roles";
import { formatCents } from "@/lib/accounting/money";
import { attendanceLabel, VERIFICATION_LABELS, verificationBadge, INVOICE_STATUS_LABELS, invoiceStatusBadge } from "@/lib/accounting/labels";
import { ConnectionRequired } from "@/components/accountant/ConnectionRequired";
import { ManualPaymentForm } from "@/components/accountant/ManualPaymentForm";
import { DocumentUpload } from "@/components/accountant/DocumentUpload";

export const dynamic = "force-dynamic";

type Row = Record<string, unknown>;
const n = (v: unknown): number | null => (typeof v === "number" ? v : null);
const s = (v: unknown): string | null => (typeof v === "string" && v.length ? v : null);

export default async function StudentDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const admin = getSupabaseAdmin();
  if (!admin) return <ConnectionRequired />;
  const { id } = await params;

  const [detail, staff] = await Promise.all([getStudentDetail(admin, id), getCurrentStaff()]);
  if (!detail) notFound();
  const canEdit = canEditFinancials(staff);

  const student = detail.student as Row;
  const flags = (student.flags ?? {}) as Record<string, unknown>;
  const missingEmail = Boolean(flags.missing_email) || !student.email;

  // Reconciliation (honest): verified, non-fee payments (refunds subtract).
  const verifiedReceived = detail.payments
    .filter((p) => (p as Row).verified && !(p as Row).is_fee)
    .reduce((sum, p) => sum + (n((p as Row).amount_cents) ?? 0), 0);
  const invoicedTotal = detail.invoices
    .filter((i) => (i as Row).status !== "draft" && (i as Row).status !== "void")
    .reduce((sum, i) => sum + (n((i as Row).total_cents) ?? 0), 0);
  const importedFees = detail.registrations.reduce((sum, r) => sum + (n((r as Row).imported_fee_cents) ?? 0), 0);

  const docsFor = (kind: string, key: "invoice_id" | "receipt_id", idVal: string) =>
    detail.documents.filter((d) => (d as Row).kind === kind && (d as Row)[key] === idVal);

  return (
    <div className="mx-auto max-w-6xl">
      <Link href="/accountant/students" className="mb-4 inline-flex items-center gap-1.5 text-sm font-medium text-[#1b3a8a] hover:underline">
        <ArrowLeft className="h-4 w-4" aria-hidden="true" /> Back to students
      </Link>

      {/* Header */}
      <div className="card mb-6 p-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="font-heading text-2xl font-bold text-[#0f2150]">{s(student.full_name) ?? "(unknown)"}</h1>
            <div className="mt-2 flex flex-wrap items-center gap-x-5 gap-y-1 text-sm text-[#1a1a2e]/65">
              {s(student.organization) && <span className="inline-flex items-center gap-1.5"><Building2 className="h-4 w-4 text-[#c9a84c]" aria-hidden="true" />{s(student.organization)}</span>}
              {missingEmail ? (
                <span className="inline-flex items-center gap-1.5 text-[#92400e]"><AlertTriangle className="h-4 w-4" aria-hidden="true" /> No email on file</span>
              ) : (
                <span className="inline-flex items-center gap-1.5"><Mail className="h-4 w-4 text-[#c9a84c]" aria-hidden="true" />{s(student.email)}</span>
              )}
            </div>
          </div>
          {!canEdit && (
            <span className="badge-past" title="Your role is read-only for financial records">Read-only</span>
          )}
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        {/* Main column */}
        <div className="space-y-6">
          {/* Registrations + original imported values */}
          <Section icon={ClipboardList} title="Course registrations">
            {detail.registrations.length === 0 ? (
              <Empty>No registrations on file.</Empty>
            ) : (
              <ul className="divide-y divide-[#1a1a2e]/8">
                {detail.registrations.map((r) => {
                  const row = r as Row;
                  return (
                    <li key={String(row.id)} className="py-3 first:pt-0 last:pb-0">
                      <div className="flex flex-wrap items-start justify-between gap-2">
                        <div>
                          <p className="font-medium text-[#0f2150]">{s(row.course_title)}</p>
                          <p className="text-xs text-[#1a1a2e]/55">
                            {s(row.course_date) ?? "Date n/a"} · {s(row.delivery) ?? "—"} · Attendance: {attendanceLabel(s(row.attendance_format))}
                          </p>
                          <p className="mt-1 text-xs text-[#1a1a2e]/45">
                            Imported from {s(row.source_file) ?? "—"}
                            {row.source_sheet ? ` · ${s(row.source_sheet)}` : ""}
                            {row.source_row ? ` · row ${String(row.source_row)}` : ""}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="tabular-nums font-semibold text-[#0f2150]">{formatCents(n(row.imported_fee_cents), s(row.currency) ?? "cad")}</p>
                          <p className="text-xs text-[#1a1a2e]/55">Original status: {s(row.original_import_status) ?? "—"}</p>
                          <span className={`${verificationBadge(String(row.payment_verification))} mt-1`}>
                            {VERIFICATION_LABELS[String(row.payment_verification)] ?? String(row.payment_verification)}
                          </span>
                        </div>
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}
          </Section>

          {/* Invoices */}
          <Section icon={FileText} title="Invoices">
            {detail.invoices.length === 0 ? (
              <Empty>
                No invoice attached.{" "}
                {canEdit ? "Upload one below or create an invoice record." : "Ask an administrator to attach one."}
              </Empty>
            ) : (
              <ul className="divide-y divide-[#1a1a2e]/8">
                {detail.invoices.map((i) => {
                  const inv = i as Row;
                  const docs = docsFor("invoice", "invoice_id", String(inv.id));
                  return (
                    <li key={String(inv.id)} className="flex flex-wrap items-center justify-between gap-2 py-3 first:pt-0 last:pb-0">
                      <div>
                        <p className="font-medium text-[#0f2150]">{s(inv.invoice_number) ?? "(no number)"}</p>
                        <p className="text-xs text-[#1a1a2e]/55">
                          {s(inv.course_title) ?? ""} · Total {formatCents(n(inv.total_cents), s(inv.currency) ?? "cad")}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={invoiceStatusBadge(s(inv.status))}>{INVOICE_STATUS_LABELS[String(inv.status)] ?? String(inv.status)}</span>
                        {docs.length > 0 ? (
                          <a href={`/api/accountant/documents/${String(docs[0].id)}`} className="btn-secondary inline-flex items-center gap-1 text-xs">
                            <Download className="h-3.5 w-3.5" aria-hidden="true" /> PDF
                          </a>
                        ) : (
                          <span className="text-xs text-[#1a1a2e]/40">No PDF</span>
                        )}
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}
          </Section>

          {/* Payments & refunds */}
          <Section icon={Wallet} title="Payments & refunds">
            {detail.payments.length === 0 ? (
              <Empty>No payments recorded. A course fee is not a payment.</Empty>
            ) : (
              <ul className="divide-y divide-[#1a1a2e]/8">
                {detail.payments.map((p) => {
                  const pay = p as Row;
                  return (
                    <li key={String(pay.id)} className="flex flex-wrap items-center justify-between gap-2 py-3 first:pt-0 last:pb-0">
                      <div>
                        <p className="tabular-nums font-medium text-[#0f2150]">
                          {formatCents(n(pay.amount_cents), s(pay.currency) ?? "cad")}
                          {pay.is_refund ? <span className="ml-2 badge-sold-out">Refund</span> : null}
                        </p>
                        <p className="text-xs text-[#1a1a2e]/55">
                          {s(pay.method) ?? "—"} · {s(pay.source) ?? "manual"} · {pay.paid_at ? new Date(String(pay.paid_at)).toLocaleDateString("en-CA") : "date n/a"}
                          {s(pay.reference) ? ` · ref ${s(pay.reference)}` : ""}
                        </p>
                      </div>
                      <span className={pay.verified ? "badge-available" : "badge-past"}>{pay.verified ? "Verified" : "Unverified"}</span>
                    </li>
                  );
                })}
              </ul>
            )}
          </Section>

          {/* Receipts */}
          <Section icon={ReceiptText} title="Receipts">
            {detail.receipts.length === 0 ? (
              <Empty>
                No receipt attached.{" "}
                {canEdit ? "Receipts are generated only from verified payments; you can upload an existing PDF below." : "Ask an administrator to attach one."}
              </Empty>
            ) : (
              <ul className="divide-y divide-[#1a1a2e]/8">
                {detail.receipts.map((rc) => {
                  const r = rc as Row;
                  const docs = docsFor("receipt", "receipt_id", String(r.id));
                  return (
                    <li key={String(r.id)} className="flex flex-wrap items-center justify-between gap-2 py-3 first:pt-0 last:pb-0">
                      <div>
                        <p className="font-medium text-[#0f2150]">{s(r.receipt_number) ?? "(no number)"}</p>
                        <p className="text-xs text-[#1a1a2e]/55">{formatCents(n(r.amount_cents), s(r.currency) ?? "cad")} · {s(r.method) ?? "—"}</p>
                      </div>
                      {docs.length > 0 ? (
                        <a href={`/api/accountant/documents/${String(docs[0].id)}`} className="btn-secondary inline-flex items-center gap-1 text-xs">
                          <Download className="h-3.5 w-3.5" aria-hidden="true" /> PDF
                        </a>
                      ) : (
                        <span className="text-xs text-[#1a1a2e]/40">No PDF</span>
                      )}
                    </li>
                  );
                })}
              </ul>
            )}
          </Section>

          {/* Activity */}
          <Section icon={History} title="Activity history">
            {detail.audit.length === 0 ? (
              <Empty>No recorded activity yet.</Empty>
            ) : (
              <ul className="space-y-2 text-xs text-[#1a1a2e]/60">
                {detail.audit.map((a) => {
                  const ev = a as Row;
                  return (
                    <li key={String(ev.id)} className="flex items-center justify-between gap-3">
                      <span className="font-medium text-[#1a1a2e]/75">{s(ev.action)}</span>
                      <span>{s(ev.actor_email) ?? "system"} · {ev.created_at ? new Date(String(ev.created_at)).toLocaleString("en-CA") : ""}</span>
                    </li>
                  );
                })}
              </ul>
            )}
          </Section>
        </div>

        {/* Right rail */}
        <div className="space-y-6">
          <Section icon={CircleDollarSign} title="Reconciliation">
            <dl className="space-y-2 text-sm">
              <Line label="Imported course fees" value={formatCents(importedFees)} muted note="not revenue" />
              <Line label="Invoiced (issued)" value={invoicedTotal === 0 ? "—" : formatCents(invoicedTotal)} />
              <Line label="Verified received" value={formatCents(verifiedReceived)} strong />
              <Line
                label="Outstanding (invoiced)"
                value={invoicedTotal === 0 ? "Not invoiced" : formatCents(Math.max(0, invoicedTotal - verifiedReceived))}
              />
            </dl>
            <p className="mt-3 text-[11px] leading-relaxed text-[#1a1a2e]/45">
              Outstanding is based on issued invoices, not imported fees. A blank invoice total means nothing has been billed yet.
            </p>
          </Section>

          {/* Internal notes (read-only view) */}
          <Section icon={ClipboardList} title="Internal notes">
            {s(student.notes) ? (
              <p className="whitespace-pre-wrap text-sm text-[#1a1a2e]/70">{s(student.notes)}</p>
            ) : (
              <Empty>No internal notes.</Empty>
            )}
          </Section>

          {canEdit && (
            <>
              <Section icon={Wallet} title="Record a verified payment">
                <ManualPaymentForm studentId={id} />
              </Section>
              <Section icon={FileText} title="Upload a document">
                <DocumentUpload studentId={id} />
              </Section>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function Section({ icon: Icon, title, children }: { icon: typeof FileText; title: string; children: React.ReactNode }) {
  return (
    <section className="card p-5">
      <h2 className="mb-3 flex items-center gap-2 font-heading text-base font-bold text-[#0f2150]">
        <Icon className="h-4 w-4 text-[#c9a84c]" aria-hidden="true" /> {title}
      </h2>
      {children}
    </section>
  );
}

function Empty({ children }: { children: React.ReactNode }) {
  return <p className="text-sm text-[#1a1a2e]/50">{children}</p>;
}

function Line({ label, value, strong, muted, note }: { label: string; value: string; strong?: boolean; muted?: boolean; note?: string }) {
  return (
    <div className="flex items-baseline justify-between gap-2">
      <dt className="text-[#1a1a2e]/60">{label}{note && <span className="ml-1 text-[10px] uppercase tracking-wide text-[#1a1a2e]/35">{note}</span>}</dt>
      <dd className={`tabular-nums ${strong ? "font-bold text-[#0f2150]" : muted ? "text-[#1a1a2e]/50" : "text-[#0f2150]"}`}>{value}</dd>
    </div>
  );
}
