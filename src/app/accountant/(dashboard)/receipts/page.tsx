import Link from "next/link";
import { Wallet, RefreshCw } from "lucide-react";
import { getSupabaseAdmin } from "@/lib/supabase/admin";
import { formatCents } from "@/lib/accounting/money";
import { ConnectionRequired } from "@/components/accountant/ConnectionRequired";

export const dynamic = "force-dynamic";

type Row = Record<string, unknown>;

const stripeConfigured = () => Boolean(process.env.STRIPE_SECRET_KEY);

export default async function ReceiptsPage() {
  const admin = getSupabaseAdmin();
  if (!admin) return <ConnectionRequired />;

  const { data } = await admin
    .from("acct_payments")
    .select("id, amount_cents, currency, method, source, paid_at, reference, verified, is_refund, student:acct_students(id, full_name)")
    .order("created_at", { ascending: false });
  const payments = (data ?? []) as Row[];
  const unverified = payments.filter((p) => !p.verified);

  return (
    <div>
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-heading text-2xl font-bold text-[#0f2150]">Receipts &amp; Payments</h1>
          <p className="mt-1 text-sm text-[#1a1a2e]/55">Actual money movements. Only verified payments count as received.</p>
        </div>
      </div>

      {/* Stripe reconciliation boundary */}
      <div className="card mb-6 flex flex-wrap items-center justify-between gap-3 p-5">
        <div className="flex items-center gap-3">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#eff6ff] text-[#1e40af]"><RefreshCw className="h-4 w-4" aria-hidden="true" /></span>
          <div>
            <p className="text-sm font-semibold text-[#0f2150]">Stripe reconciliation</p>
            <p className="text-xs text-[#1a1a2e]/55">
              {stripeConfigured()
                ? "Connected. Only transactions explicitly attributable to CanaDent are imported. Use Sync to pull recent payments into the review queue."
                : "Connection required — add STRIPE_SECRET_KEY to enable automatic reconciliation. Manual verification is available in the meantime."}
            </p>
          </div>
        </div>
        <span className={stripeConfigured() ? "badge-available" : "badge-past"}>{stripeConfigured() ? "Connected" : "Not connected"}</span>
      </div>

      {unverified.length > 0 && (
        <div className="mb-6 rounded-lg bg-[#fef3c7] px-4 py-3 text-sm text-[#92400e]">
          {unverified.length} payment{unverified.length === 1 ? "" : "s"} awaiting verification in the review queue below.
        </div>
      )}

      {payments.length === 0 ? (
        <div className="card flex flex-col items-center gap-2 p-10 text-center">
          <Wallet className="h-8 w-8 text-[#1a1a2e]/30" aria-hidden="true" />
          <p className="text-sm text-[#1a1a2e]/60">No payments recorded yet.</p>
          <p className="max-w-md text-xs text-[#1a1a2e]/45">
            Record a verified e-transfer/cheque from a student&apos;s detail page, or connect Stripe to import card payments.
          </p>
        </div>
      ) : (
        <div className="card overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#1a1a2e]/8 bg-[#f9fafb] text-left text-[11px] font-bold uppercase tracking-wide text-[#1a1a2e]/45">
                <th className="px-4 py-3">Student</th>
                <th className="px-4 py-3 text-right">Amount</th>
                <th className="px-4 py-3">Method</th>
                <th className="px-4 py-3">Source</th>
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {payments.map((p) => {
                const student = Array.isArray(p.student) ? (p.student[0] as Row) : (p.student as Row);
                return (
                  <tr key={String(p.id)} className="border-b border-[#1a1a2e]/6 last:border-0 hover:bg-[#f9fafb]">
                    <td className="px-4 py-3">
                      {student?.id ? <Link href={`/accountant/students/${student.id}`} className="text-[#1b3a8a] hover:underline">{student.full_name as string}</Link> : "—"}
                    </td>
                    <td className="px-4 py-3 text-right tabular-nums text-[#0f2150]">
                      {formatCents(p.amount_cents as number, (p.currency as string) ?? "cad")}
                      {p.is_refund ? <span className="ml-2 badge-sold-out">Refund</span> : null}
                    </td>
                    <td className="px-4 py-3 text-[#1a1a2e]/70">{(p.method as string) ?? "—"}</td>
                    <td className="px-4 py-3 text-[#1a1a2e]/70">{(p.source as string) ?? "manual"}</td>
                    <td className="px-4 py-3 text-[#1a1a2e]/60">{p.paid_at ? new Date(String(p.paid_at)).toLocaleDateString("en-CA") : "—"}</td>
                    <td className="px-4 py-3"><span className={p.verified ? "badge-available" : "badge-past"}>{p.verified ? "Verified" : "Unverified"}</span></td>
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
