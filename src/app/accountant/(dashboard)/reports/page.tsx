import { Download, BarChart3 } from "lucide-react";
import { requireStaff } from "@/lib/accounting/auth";

export const dynamic = "force-dynamic";

const REPORTS: { type: string; title: string; desc: string }[] = [
  { type: "registration-fees", title: "Course registration fees", desc: "Imported fees per registrant — not collected revenue." },
  { type: "invoices", title: "Issued invoices", desc: "Amounts billed on issued invoices." },
  { type: "verified-payments", title: "Verified payments received", desc: "Verified, non-fee payments only." },
  { type: "outstanding", title: "Outstanding invoiced balances", desc: "Issued invoices minus verified allocated payments." },
  { type: "refunds", title: "Refunds", desc: "Payments flagged as refunds." },
  { type: "missing-documents", title: "Missing documents", desc: "Registrations with no invoice attached." },
  { type: "unverified", title: "Unmatched / unverified records", desc: "Payments not yet verified." },
];

export default async function ReportsPage() {
  await requireStaff();
  return (
    <div>
      <div className="mb-5">
        <h1 className="font-heading text-2xl font-bold text-[#0f2150]">Reports</h1>
        <p className="mt-1 text-sm text-[#1a1a2e]/55">
          CSV exports in CAD. Each file states its reporting basis and generation time. Registration fees, billed
          amounts, and collected payments are kept separate and never double-counted.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {REPORTS.map((r) => (
          <div key={r.type} className="card flex flex-col p-5">
            <span className="mb-3 flex h-9 w-9 items-center justify-center rounded-lg bg-[#eff6ff] text-[#1e40af]">
              <BarChart3 className="h-4 w-4" aria-hidden="true" />
            </span>
            <h2 className="font-heading text-base font-bold text-[#0f2150]">{r.title}</h2>
            <p className="mt-1 flex-1 text-xs text-[#1a1a2e]/55">{r.desc}</p>
            <a
              href={`/accountant/reports/export?type=${r.type}`}
              className="btn-secondary mt-4 inline-flex items-center justify-center gap-2 text-sm"
            >
              <Download className="h-4 w-4" aria-hidden="true" /> Export CSV
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}
