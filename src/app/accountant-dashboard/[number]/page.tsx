import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, User, Mail, Building2, GraduationCap, CalendarClock } from "lucide-react";
import { formatCents } from "@/lib/accounting/money";
import {
  ORDERS, getOrder, fmtDate, initials, hstCents, totalWithTaxCents,
  COURSE, COURSE_DATE, DELIVERY, INSTRUCTOR, CE_CREDITS, LOCATION, TAX_LABEL, TAX_PERCENTAGE,
} from "../data";

export const dynamic = "error"; // fully static; params come from generateStaticParams
export const metadata: Metadata = {
  title: "Order",
  robots: { index: false, follow: false, nocache: true },
};

export function generateStaticParams() {
  return ORDERS.map((o) => ({ number: String(o.number) }));
}

export default async function OrderDetailPage({ params }: { params: Promise<{ number: string }> }) {
  const { number } = await params;
  const order = getOrder(Number(number));
  if (!order) notFound();

  return (
    <main className="min-h-screen bg-[#f0f0f1] text-[#1d2327]">
      <div className="border-b border-[#dcdcde] bg-white">
        <div className="mx-auto flex max-w-5xl flex-wrap items-center gap-3 px-4 py-4 sm:px-6">
          <Link href="/accountant-dashboard" className="inline-flex items-center gap-1.5 text-sm font-medium text-[#2271b1] hover:underline">
            <ArrowLeft className="h-4 w-4" aria-hidden="true" /> Orders
          </Link>
          <span className="text-[#c3c4c7]">/</span>
          <h1 className="font-heading text-xl font-bold text-[#0f2150]">Order #{order.number}</h1>
          <span className="inline-flex items-center rounded-full bg-[#c6e1c6] px-2.5 py-0.5 text-xs font-semibold text-[#2c4700]">{order.status}</span>
          <span className="ml-auto text-xs text-[#646970]">Placed {fmtDate(order.date)}</span>
        </div>
      </div>

      <div className="mx-auto grid max-w-5xl gap-6 px-4 py-6 sm:px-6 lg:grid-cols-[1fr_320px]">
        {/* Order items + totals */}
        <div className="space-y-6">
          <section className="overflow-hidden rounded-lg border border-[#dcdcde] bg-white shadow-sm">
            <div className="border-b border-[#dcdcde] bg-[#f6f7f7] px-5 py-3 text-sm font-semibold text-[#1d2327]">Order items</div>
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-[12px] font-semibold text-[#646970]">
                  <th className="px-5 py-2.5">Item</th>
                  <th className="px-5 py-2.5 text-center">Qty</th>
                  <th className="px-5 py-2.5 text-right">Total</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-t border-[#f0f0f1]">
                  <td className="px-5 py-3">
                    <p className="font-medium text-[#1d2327]">{COURSE}</p>
                    <p className="text-xs text-[#646970]">{COURSE_DATE} · {DELIVERY} · {INSTRUCTOR}</p>
                    <p className="text-xs text-[#a7aaad]">Attendance: Not specified</p>
                  </td>
                  <td className="px-5 py-3 text-center text-[#50575e]">1</td>
                  <td className="px-5 py-3 text-right tabular-nums">{formatCents(order.totalCents)}</td>
                </tr>
              </tbody>
              <tfoot className="border-t border-[#dcdcde] text-sm">
                <tr>
                  <td className="px-5 py-2.5 text-right text-[#646970]" colSpan={2}>Subtotal (excl. tax)</td>
                  <td className="px-5 py-2.5 text-right tabular-nums">{formatCents(order.totalCents)}</td>
                </tr>
                <tr>
                  <td className="px-5 py-1 text-right text-[#646970]" colSpan={2}>{TAX_LABEL} ({TAX_PERCENTAGE}%)</td>
                  <td className="px-5 py-1 text-right tabular-nums">{formatCents(hstCents(order.totalCents))}</td>
                </tr>
                <tr>
                  <td className="px-5 py-2.5 text-right font-semibold text-[#1d2327]" colSpan={2}>Order total (incl. {TAX_LABEL})</td>
                  <td className="px-5 py-3 text-right font-bold tabular-nums text-[#0f2150]">{formatCents(totalWithTaxCents(order.totalCents))}</td>
                </tr>
              </tfoot>
            </table>
          </section>

          <p className="text-xs text-[#646970]">
            The order number and date are generated for display. Participant name, organization, email, fee and status
            are from the source spreadsheet. The fee is shown as listed and is not proof of payment; {TAX_LABEL} ({TAX_PERCENTAGE}%)
            is calculated treating the listed fee as tax-exclusive (Ontario).
          </p>
        </div>

        {/* Customer / billing */}
        <aside className="space-y-6">
          <section className="rounded-lg border border-[#dcdcde] bg-white p-5 shadow-sm">
            <div className="mb-3 flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-full text-sm font-bold text-white" style={{ background: "#1b3a8a" }}>
                {initials(order.name)}
              </span>
              <div>
                <p className="font-semibold text-[#0f2150]">{order.name}</p>
                <p className="text-xs text-[#646970]">Customer</p>
              </div>
            </div>
            <dl className="space-y-2 text-sm text-[#50575e]">
              <Row icon={User} label="Name" value={order.name} />
              <Row icon={Building2} label="Organization" value={order.organization ?? "—"} />
              <Row icon={Mail} label="Email" value={order.email ?? "No email provided"} danger={!order.email} />
            </dl>
          </section>

          <section className="rounded-lg border border-[#dcdcde] bg-white p-5 shadow-sm">
            <p className="mb-3 text-sm font-semibold text-[#1d2327]">Course</p>
            <dl className="space-y-2 text-sm text-[#50575e]">
              <Row icon={GraduationCap} label="CE credits" value={CE_CREDITS} />
              <Row icon={CalendarClock} label="Date" value={COURSE_DATE} />
              <Row icon={Building2} label="Location" value={LOCATION} />
            </dl>
          </section>
        </aside>
      </div>
    </main>
  );
}

function Row({ icon: Icon, label, value, danger }: { icon: typeof User; label: string; value: string; danger?: boolean }) {
  return (
    <div className="flex items-start gap-2">
      <Icon className="mt-0.5 h-4 w-4 shrink-0 text-[#c9a84c]" aria-hidden="true" />
      <div>
        <dt className="text-[11px] uppercase tracking-wide text-[#a7aaad]">{label}</dt>
        <dd className={danger ? "text-[#b32d2e]" : "text-[#1d2327]"}>{value}</dd>
      </div>
    </div>
  );
}
