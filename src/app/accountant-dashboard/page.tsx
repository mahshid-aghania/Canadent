import type { Metadata } from "next";
import Link from "next/link";
import { ShoppingBag, DollarSign, ClipboardList, Receipt, Eye } from "lucide-react";
import { formatCents } from "@/lib/accounting/money";
import {
  ORDERS, COURSE, COURSE_DATE, DELIVERY, fmtDate, initials,
  hstCents, totalWithTaxCents, TAX_LABEL, TAX_PERCENTAGE,
} from "./data";

// Hidden, no-login WooCommerce-style Orders view. Reachable only via its URL and
// marked noindex — obscurity, not authentication. The secure view is /accountant.
export const metadata: Metadata = {
  title: "Orders",
  robots: { index: false, follow: false, nocache: true },
};

export default function OrdersPage() {
  const grossCents = ORDERS.reduce((s, o) => s + o.totalCents, 0);
  const taxCents = hstCents(grossCents);
  const grossWithTaxCents = totalWithTaxCents(grossCents);

  return (
    <main className="min-h-screen bg-[#f0f0f1] text-[#1d2327]">
      {/* Top bar */}
      <div className="border-b border-[#dcdcde] bg-white">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-3 px-4 py-4 sm:px-6">
          <ShoppingBag className="h-6 w-6" style={{ color: "#c9a84c" }} aria-hidden="true" />
          <h1 className="font-heading text-xl font-bold text-[#0f2150]">CanaDent — Orders</h1>
          <span className="rounded-full bg-[#eff6ff] px-2.5 py-0.5 text-xs font-bold text-[#1e40af]">{ORDERS.length}</span>
          <div className="ml-auto text-xs text-[#646970]">
            {COURSE} · {COURSE_DATE} · {DELIVERY}
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6">
        {/* Summary cards */}
        <div className="mb-5 grid gap-4 sm:grid-cols-3">
          <SummaryCard icon={DollarSign} label="Gross sales (excl. tax)" value={formatCents(grossCents)} tint="#065f46" bg="#ecfdf5" />
          <SummaryCard icon={ClipboardList} label="Orders" value={String(ORDERS.length)} tint="#1e40af" bg="#eff6ff" />
          <SummaryCard icon={Receipt} label={`Total incl. ${TAX_LABEL} (${TAX_PERCENTAGE}%)`} value={formatCents(grossWithTaxCents)} sub={`${TAX_LABEL} ${formatCents(taxCents)}`} tint="#92400e" bg="#fef3c7" />
        </div>

        {/* Status tabs (WooCommerce style) */}
        <div className="mb-3 flex flex-wrap items-center gap-2 text-sm">
          <span className="font-semibold text-[#0f2150]">All <span className="text-[#646970]">({ORDERS.length})</span></span>
          <span className="text-[#c3c4c7]">|</span>
          <span className="text-[#2271b1]">Confirmed <span className="text-[#646970]">({ORDERS.length})</span></span>
        </div>

        {/* Orders table */}
        <div className="overflow-hidden rounded-lg border border-[#dcdcde] bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[860px] text-sm">
              <thead>
                <tr className="border-b border-[#dcdcde] bg-[#f6f7f7] text-left text-[12px] font-semibold text-[#1d2327]">
                  <th className="w-10 px-4 py-3"><input type="checkbox" aria-label="Select all" disabled /></th>
                  <th className="px-4 py-3">Order</th>
                  <th className="px-4 py-3">Date</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Billing</th>
                  <th className="px-4 py-3">Ship to</th>
                  <th className="px-4 py-3 text-right">Total</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {ORDERS.map((o) => (
                  <tr key={o.number} className="border-b border-[#f0f0f1] last:border-0 hover:bg-[#f6f7f7]">
                    <td className="px-4 py-3"><input type="checkbox" aria-label={`Select order #${o.number}`} disabled /></td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white" style={{ background: "#1b3a8a" }}>
                          {initials(o.name)}
                        </span>
                        <div className="min-w-0">
                          <Link href={`/accountant-dashboard/${o.number}`} className="font-semibold text-[#2271b1] hover:underline">
                            #{o.number} {o.name}
                          </Link>
                          <p className="truncate text-xs text-[#646970]">{COURSE} × 1</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-[#50575e]">{fmtDate(o.date)}</td>
                    <td className="px-4 py-3">
                      <span className="inline-flex items-center rounded-full bg-[#c6e1c6] px-2.5 py-0.5 text-xs font-semibold text-[#2c4700]">
                        {o.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-[#50575e]">
                      {o.email ?? <span className="text-[#b32d2e]">No email provided</span>}
                    </td>
                    <td className="px-4 py-3 text-[#50575e]">
                      {o.organization ?? <span className="text-[#a7aaad]">—</span>}
                      <span className="block text-xs text-[#a7aaad]">Attendance: Not specified</span>
                    </td>
                    <td className="px-4 py-3 text-right font-semibold tabular-nums text-[#1d2327]">{formatCents(o.totalCents)}</td>
                    <td className="px-4 py-3 text-right">
                      <Link
                        href={`/accountant-dashboard/${o.number}`}
                        className="inline-flex items-center gap-1 rounded-md border border-[#dcdcde] px-2 py-1 text-xs text-[#2271b1] hover:bg-[#f6f7f7] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2271b1]"
                        aria-label={`View order #${o.number}`}
                      >
                        <Eye className="h-3.5 w-3.5" aria-hidden="true" /> View
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot className="bg-[#f6f7f7] text-sm text-[#1d2327]">
                <tr>
                  <td className="px-4 pt-3 text-right text-[#646970]" colSpan={6}>Subtotal ({ORDERS.length} orders)</td>
                  <td className="px-4 pt-3 text-right tabular-nums">{formatCents(grossCents)}</td>
                  <td />
                </tr>
                <tr>
                  <td className="px-4 py-1 text-right text-[#646970]" colSpan={6}>{TAX_LABEL} ({TAX_PERCENTAGE}%)</td>
                  <td className="px-4 py-1 text-right tabular-nums">{formatCents(taxCents)}</td>
                  <td />
                </tr>
                <tr className="font-semibold">
                  <td className="px-4 pb-3 text-right" colSpan={6}>Total incl. {TAX_LABEL}</td>
                  <td className="px-4 pb-3 text-right tabular-nums text-[#0f2150]">{formatCents(grossWithTaxCents)}</td>
                  <td />
                </tr>
              </tfoot>
            </table>
          </div>
        </div>

        <p className="mt-4 text-xs text-[#646970]">
          Order numbers and order dates on this page are generated for display. Participant names, organizations,
          emails, fees and status are taken from the source spreadsheet. Fees are shown as listed and are not proof of
          payment; {TAX_LABEL} ({TAX_PERCENTAGE}%) is calculated treating the listed fee as tax-exclusive (Ontario).
          This page is unlisted (noindex) and has no access control — anyone with the link
          can view it. For access-controlled records, use the CanaDent Accountant Dashboard.
        </p>
      </div>
    </main>
  );
}

function SummaryCard({ icon: Icon, label, value, sub, tint, bg }: { icon: typeof DollarSign; label: string; value: string; sub?: string; tint: string; bg: string }) {
  return (
    <div className="rounded-lg border border-[#dcdcde] bg-white p-4 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-wide text-[#646970]">{label}</p>
          <p className="mt-1 font-heading text-2xl font-bold text-[#0f2150]">{value}</p>
          {sub && <p className="mt-0.5 text-xs text-[#646970]">{sub}</p>}
        </div>
        <span className="flex h-9 w-9 items-center justify-center rounded-lg" style={{ background: bg, color: tint }}>
          <Icon className="h-4 w-4" aria-hidden="true" />
        </span>
      </div>
    </div>
  );
}
