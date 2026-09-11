import Link from "next/link";
import {
  Users, BadgeCheck, FileText, Scale, Clock, FileWarning, Info,
} from "lucide-react";
import { getSupabaseAdmin } from "@/lib/supabase/admin";
import { getOverviewMetrics } from "@/lib/accounting/queries";
import { formatCents, currencyCode } from "@/lib/accounting/money";
import { StatCard } from "@/components/accountant/StatCard";
import { ConnectionRequired } from "@/components/accountant/ConnectionRequired";

export const dynamic = "force-dynamic";

export default async function OverviewPage() {
  const admin = getSupabaseAdmin();
  if (!admin) return <ConnectionRequired detail="Supabase isn't configured. Add NEXT_PUBLIC_SUPABASE_URL, the anon key, and SUPABASE_SERVICE_ROLE_KEY to enable the dashboard." />;

  const m = await getOverviewMetrics(admin);
  const cur = currencyCode(m.currency);

  return (
    <div>
      <div className="mb-6">
        <h1 className="font-heading text-2xl font-bold text-[#0f2150]">Overview</h1>
        <p className="mt-1 text-sm text-[#1a1a2e]/55">
          Figures in {cur}. Imported course fees are shown separately and are <strong>not</strong> counted as collected revenue.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <StatCard label="Total registrants" value={String(m.totalRegistrants)} icon={Users} />
        <StatCard
          label="Verified payments received"
          value={formatCents(m.verifiedPaymentsCents, m.currency)}
          sub={m.verifiedPaymentsCents === 0 ? "No verified payments matched yet" : undefined}
          icon={BadgeCheck}
          tone="positive"
        />
        <StatCard
          label="Invoiced amount"
          value={formatCents(m.invoicedCents, m.currency)}
          sub={m.invoicedCents === 0 ? "No invoices issued yet" : undefined}
          icon={FileText}
          tone="info"
        />
        <StatCard
          label="Outstanding invoiced balance"
          value={m.invoicedCents === 0 ? "—" : formatCents(m.outstandingCents, m.currency)}
          sub={m.invoicedCents === 0 ? "Not applicable until invoices are issued" : "Issued invoices minus verified, allocated payments"}
          icon={Scale}
          tone="warning"
        />
        <StatCard
          label="Records awaiting verification"
          value={String(m.awaitingVerification)}
          sub="Imported fee present, payment not yet verified"
          icon={Clock}
          tone="warning"
        />
        <StatCard
          label="Missing invoices or receipts"
          value={String(m.missingDocuments)}
          sub="Registrations with no invoice attached"
          icon={FileWarning}
          tone="warning"
        />
      </div>

      {/* Honesty note: fees are not revenue */}
      <div className="card mt-4 flex items-start gap-3 p-5">
        <Info className="mt-0.5 h-5 w-5 shrink-0 text-[#1b3a8a]" aria-hidden="true" />
        <div className="text-sm text-[#1a1a2e]/70">
          <p>
            <span className="font-semibold text-[#0f2150]">Imported course fees: {formatCents(m.importedFeesCents, m.currency)}</span>{" "}
            across {m.totalRegistrants} registrant{m.totalRegistrants === 1 ? "" : "s"}.
          </p>
          <p className="mt-1 text-[#1a1a2e]/55">
            This is the sum of fees listed in imported spreadsheets. It is <strong>not</strong> money received and does
            not indicate whether tax was included. Collected revenue only appears once a payment is matched and verified.{" "}
            <Link href="/accountant/students" className="font-medium text-[#1b3a8a] underline-offset-2 hover:underline">
              Review registrants →
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
