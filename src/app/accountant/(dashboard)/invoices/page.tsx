import Link from "next/link";
import { FileText } from "lucide-react";
import { getSupabaseAdmin } from "@/lib/supabase/admin";
import { formatCents } from "@/lib/accounting/money";
import { INVOICE_STATUS_LABELS, invoiceStatusBadge } from "@/lib/accounting/labels";
import { ConnectionRequired } from "@/components/accountant/ConnectionRequired";

export const dynamic = "force-dynamic";

type Row = Record<string, unknown>;

export default async function InvoicesPage() {
  const admin = getSupabaseAdmin();
  if (!admin) return <ConnectionRequired />;

  const { data } = await admin
    .from("acct_invoices")
    .select("id, invoice_number, course_title, total_cents, currency, status, issue_date, student:acct_students(id, full_name)")
    .order("created_at", { ascending: false });
  const invoices = (data ?? []) as Row[];

  return (
    <div>
      <div className="mb-5">
        <h1 className="font-heading text-2xl font-bold text-[#0f2150]">Invoices</h1>
        <p className="mt-1 text-sm text-[#1a1a2e]/55">Amounts billed. Distinct from payments received.</p>
      </div>

      {invoices.length === 0 ? (
        <div className="card flex flex-col items-center gap-2 p-10 text-center">
          <FileText className="h-8 w-8 text-[#1a1a2e]/30" aria-hidden="true" />
          <p className="text-sm text-[#1a1a2e]/60">No invoices yet.</p>
          <p className="max-w-md text-xs text-[#1a1a2e]/45">
            Existing invoice PDFs can be uploaded and linked from a student&apos;s detail page. Imported course fees are
            not invoices and are never auto-billed or auto-taxed.
          </p>
        </div>
      ) : (
        <div className="card overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#1a1a2e]/8 bg-[#f9fafb] text-left text-[11px] font-bold uppercase tracking-wide text-[#1a1a2e]/45">
                <th className="px-4 py-3">Invoice #</th>
                <th className="px-4 py-3">Student</th>
                <th className="px-4 py-3">Course</th>
                <th className="px-4 py-3">Issued</th>
                <th className="px-4 py-3 text-right">Total</th>
                <th className="px-4 py-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {invoices.map((i) => {
                const student = Array.isArray(i.student) ? (i.student[0] as Row) : (i.student as Row);
                return (
                  <tr key={String(i.id)} className="border-b border-[#1a1a2e]/6 last:border-0 hover:bg-[#f9fafb]">
                    <td className="px-4 py-3 font-medium text-[#0f2150]">{(i.invoice_number as string) ?? "(no number)"}</td>
                    <td className="px-4 py-3">
                      {student?.id ? <Link href={`/accountant/students/${student.id}`} className="text-[#1b3a8a] hover:underline">{student.full_name as string}</Link> : "—"}
                    </td>
                    <td className="px-4 py-3 text-[#1a1a2e]/70">{(i.course_title as string) ?? "—"}</td>
                    <td className="px-4 py-3 text-[#1a1a2e]/60">{i.issue_date ? new Date(String(i.issue_date)).toLocaleDateString("en-CA") : "—"}</td>
                    <td className="px-4 py-3 text-right tabular-nums text-[#0f2150]">{formatCents(i.total_cents as number, (i.currency as string) ?? "cad")}</td>
                    <td className="px-4 py-3"><span className={invoiceStatusBadge(i.status as string)}>{INVOICE_STATUS_LABELS[String(i.status)] ?? String(i.status)}</span></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
