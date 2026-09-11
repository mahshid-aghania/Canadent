import Link from "next/link";
import { Download, AlertTriangle, ChevronRight } from "lucide-react";
import { getSupabaseAdmin } from "@/lib/supabase/admin";
import { listRegistrations } from "@/lib/accounting/queries";
import { parseFilters, filtersToQuery, hasActiveFilters } from "@/lib/accounting/filters";
import { formatCents } from "@/lib/accounting/money";
import { attendanceLabel, VERIFICATION_LABELS, verificationBadge, INVOICE_STATUS_LABELS, invoiceStatusBadge } from "@/lib/accounting/labels";
import { FilterBar } from "@/components/accountant/FilterBar";
import { ConnectionRequired } from "@/components/accountant/ConnectionRequired";

export const dynamic = "force-dynamic";

export default async function StudentsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const admin = getSupabaseAdmin();
  if (!admin) return <ConnectionRequired />;

  const sp = await searchParams;
  const filters = parseFilters(sp);
  const { rows, total, page, pageSize, courses } = await listRegistrations(admin, filters);
  const pages = Math.max(1, Math.ceil(total / pageSize));
  const exportHref = `/accountant/students/export${filtersToQuery(filters)}`;

  return (
    <div>
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-heading text-2xl font-bold text-[#0f2150]">Students</h1>
          <p className="mt-1 text-sm text-[#1a1a2e]/55">
            {total} record{total === 1 ? "" : "s"}{hasActiveFilters(filters) ? " (filtered)" : ""}
          </p>
        </div>
        <Link href={exportHref} className="btn-secondary inline-flex items-center gap-2 text-sm" prefetch={false}>
          <Download className="h-4 w-4" aria-hidden="true" /> Export CSV
        </Link>
      </div>

      <div className="mb-4">
        <FilterBar courses={courses} />
      </div>

      {rows.length === 0 ? (
        <div className="card p-10 text-center text-sm text-[#1a1a2e]/60">
          No records match these filters. {hasActiveFilters(filters) && (
            <Link href="/accountant/students" className="font-medium text-[#1b3a8a] underline-offset-2 hover:underline">Clear filters</Link>
          )}
        </div>
      ) : (
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1100px] text-sm">
              <thead>
                <tr className="border-b border-[#1a1a2e]/8 bg-[#f9fafb] text-left text-[11px] font-bold uppercase tracking-wide text-[#1a1a2e]/45">
                  <Th label="Student" sort="name" filters={filters} />
                  <Th label="Organization" sort="organization" filters={filters} />
                  <th className="px-4 py-3">Email</th>
                  <Th label="Course" sort="course" filters={filters} />
                  <th className="px-4 py-3">Attendance</th>
                  <Th label="Imported fee" sort="fee" filters={filters} />
                  <th className="px-4 py-3">Original status</th>
                  <Th label="Verification" sort="verification" filters={filters} />
                  <th className="px-4 py-3">Invoice</th>
                  <th className="px-4 py-3">Receipt</th>
                  <th className="px-4 py-3 text-right">Outstanding</th>
                  <th className="px-4 py-3"><span className="sr-only">Actions</span></th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r) => (
                  <tr key={r.registrationId} className="border-b border-[#1a1a2e]/6 last:border-0 hover:bg-[#f9fafb]">
                    <td className="px-4 py-3 font-medium text-[#0f2150]">
                      <Link href={`/accountant/students/${r.studentId}`} className="hover:underline">{r.name}</Link>
                    </td>
                    <td className="px-4 py-3 text-[#1a1a2e]/70">{r.organization ?? <span className="text-[#1a1a2e]/35">—</span>}</td>
                    <td className="px-4 py-3 text-[#1a1a2e]/70">
                      {r.email ?? (
                        <span className="inline-flex items-center gap-1 text-[#92400e]">
                          <AlertTriangle className="h-3.5 w-3.5" aria-hidden="true" /> Missing
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-[#1a1a2e]/70">{r.courseTitle}</td>
                    <td className="px-4 py-3 text-[#1a1a2e]/70">{attendanceLabel(r.attendance)}</td>
                    <td className="px-4 py-3 tabular-nums text-[#0f2150]">{formatCents(r.importedFeeCents, r.currency)}</td>
                    <td className="px-4 py-3 text-[#1a1a2e]/70">{r.originalStatus ?? "—"}</td>
                    <td className="px-4 py-3"><span className={verificationBadge(r.verification)}>{VERIFICATION_LABELS[r.verification] ?? r.verification}</span></td>
                    <td className="px-4 py-3">
                      {r.invoiceCount === 0
                        ? <span className="text-xs text-[#1a1a2e]/40">None</span>
                        : <span className={invoiceStatusBadge(r.invoiceStatus)}>{INVOICE_STATUS_LABELS[r.invoiceStatus ?? ""] ?? r.invoiceStatus}</span>}
                    </td>
                    <td className="px-4 py-3">
                      {r.receiptCount > 0
                        ? <span className="badge-available">{r.receiptCount}</span>
                        : <span className="text-xs text-[#1a1a2e]/40">None</span>}
                    </td>
                    <td className="px-4 py-3 text-right tabular-nums text-[#0f2150]">
                      {r.outstandingCents == null
                        ? <span className="text-xs text-[#1a1a2e]/40" title="No invoice issued">Not invoiced</span>
                        : formatCents(r.outstandingCents, r.currency)}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <Link href={`/accountant/students/${r.studentId}`} className="inline-flex items-center gap-1 text-xs font-semibold text-[#1b3a8a] hover:underline">
                        View <ChevronRight className="h-3.5 w-3.5" aria-hidden="true" />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {pages > 1 && (
        <div className="mt-4 flex items-center justify-between text-sm">
          <span className="text-[#1a1a2e]/55">Page {page} of {pages}</span>
          <div className="flex gap-2">
            {page > 1 && (
              <Link href={`/accountant/students${filtersToQuery({ ...filters, page: page - 1 }, { withPage: true })}`} className="btn-secondary text-sm">Previous</Link>
            )}
            {page < pages && (
              <Link href={`/accountant/students${filtersToQuery({ ...filters, page: page + 1 }, { withPage: true })}`} className="btn-secondary text-sm">Next</Link>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function Th({ label, sort, filters }: { label: string; sort: string; filters: ReturnType<typeof parseFilters> }) {
  const active = filters.sort === sort;
  const dir = active && filters.dir === "asc" ? "desc" : "asc";
  const href = `/accountant/students${filtersToQuery({ ...filters, sort, dir: dir as "asc" | "desc" })}`;
  return (
    <th className="px-4 py-3">
      <Link href={href} className="inline-flex items-center gap-1 hover:text-[#0f2150]">
        {label}
        {active && <span aria-hidden="true">{filters.dir === "asc" ? "▲" : "▼"}</span>}
      </Link>
    </th>
  );
}
