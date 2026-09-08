import type { Metadata } from "next";
import { getDemandByCourse, store } from "@/lib/course-requests-store";
import { Download, Users, Inbox, Clock } from "lucide-react";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Course Demand — Admin",
  robots: { index: false, follow: false },
};

type Props = { searchParams: Promise<{ token?: string }> };

function fmt(iso: string | null): string {
  if (!iso) return "—";
  return new Date(iso).toLocaleString("en-CA", {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

export default async function AdminCourseRequestsPage({ searchParams }: Props) {
  const { token } = await searchParams;
  const required = process.env.ADMIN_DASHBOARD_TOKEN;

  if (required && token !== required) {
    return (
      <main className="max-w-md mx-auto px-4 py-24 text-center">
        <h1 className="font-heading text-2xl font-bold text-[#0f2150] mb-2">
          Restricted
        </h1>
        <p className="text-sm text-[#1a1a2e]/60">
          Add a valid <code>?token=</code> to view the demand dashboard.
        </p>
      </main>
    );
  }

  const demand = await getDemandByCourse();
  const records = await store.all();
  const totalRequests = records.length;
  const uniqueUsers = new Set(records.map((r) => r.email.toLowerCase())).size;
  const exportHref = required
    ? `/api/course-requests/export?token=${encodeURIComponent(required)}`
    : "/api/course-requests/export";

  return (
    <main className="min-h-screen" style={{ background: "#f5f0e8" }}>
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="flex flex-wrap items-end justify-between gap-4 mb-8">
          <div>
            <span className="section-label">Admin · Demand</span>
            <h1 className="font-heading text-3xl font-bold text-[#0f2150] mt-1">
              Course Interest List
            </h1>
            <p className="text-sm text-[#1a1a2e]/60 mt-1">
              Requests to bring previously offered courses back.
            </p>
          </div>
          <a href={exportHref} className="btn-primary">
            <Download className="h-4 w-4" aria-hidden="true" />
            Export CSV
          </a>
        </div>

        {/* Summary tiles */}
        <div className="grid sm:grid-cols-3 gap-4 mb-10">
          <SummaryTile icon={Inbox} label="Total Requests" value={totalRequests} />
          <SummaryTile icon={Users} label="Unique Interested Users" value={uniqueUsers} />
          <SummaryTile icon={Clock} label="Courses With Demand" value={demand.length} />
        </div>

        {records.length === 0 ? (
          <div className="card p-12 text-center">
            <Inbox className="h-8 w-8 mx-auto mb-3 text-[#c9a84c]" aria-hidden="true" />
            <h2 className="font-heading text-xl font-bold text-[#0f2150] mb-1">
              No requests yet
            </h2>
            <p className="text-sm text-[#1a1a2e]/55">
              When dentists request a course again, they&apos;ll appear here.
            </p>
          </div>
        ) : (
          <>
            {/* Demand per course */}
            <h2 className="font-heading text-xl font-bold text-[#0f2150] mb-4">
              Demand by Course
            </h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-12">
              {demand.map((d) => (
                <div key={d.slug} className="card p-5">
                  <div className="font-semibold text-[#0f2150] leading-snug mb-3 line-clamp-2">
                    {d.courseTitle}
                  </div>
                  <div className="flex items-center gap-6 text-sm">
                    <div>
                      <div className="font-heading text-2xl font-bold text-[#0f2150] leading-none">
                        {d.totalRequests}
                      </div>
                      <div className="text-[10px] font-bold uppercase tracking-wide text-[#c9a84c] mt-1">
                        Requests
                      </div>
                    </div>
                    <div>
                      <div className="font-heading text-2xl font-bold text-[#0f2150] leading-none">
                        {d.uniqueUsers}
                      </div>
                      <div className="text-[10px] font-bold uppercase tracking-wide text-[#c9a84c] mt-1">
                        Unique Users
                      </div>
                    </div>
                  </div>
                  <div className="text-xs text-[#1a1a2e]/45 mt-3">
                    Latest: {fmt(d.latest)}
                  </div>
                </div>
              ))}
            </div>

            {/* Full contact table */}
            <h2 className="font-heading text-xl font-bold text-[#0f2150] mb-4">
              All Requests
            </h2>
            <div className="card overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left" style={{ background: "#0f2150" }}>
                    {["Submitted", "Course", "Name", "Email", "Phone", "Role", "Attendance", "Timing"].map(
                      (h) => (
                        <th
                          key={h}
                          className="px-4 py-3 text-[11px] font-semibold uppercase tracking-wide text-white/85 whitespace-nowrap"
                        >
                          {h}
                        </th>
                      )
                    )}
                  </tr>
                </thead>
                <tbody>
                  {records.map((r, i) => (
                    <tr
                      key={r.id}
                      style={{ background: i % 2 ? "#f7f4ed" : "#fff" }}
                      className="align-top"
                    >
                      <td className="px-4 py-3 text-[#1a1a2e]/60 whitespace-nowrap">{fmt(r.createdAt)}</td>
                      <td className="px-4 py-3 text-[#0f2150] font-medium max-w-[220px]">{r.courseTitle}</td>
                      <td className="px-4 py-3 text-[#1a1a2e]/75 whitespace-nowrap">{r.name}</td>
                      <td className="px-4 py-3 text-[#1b3a8a] whitespace-nowrap">
                        <a href={`mailto:${r.email}`} className="underline underline-offset-2">
                          {r.email}
                        </a>
                      </td>
                      <td className="px-4 py-3 text-[#1a1a2e]/70 whitespace-nowrap">{r.phone}</td>
                      <td className="px-4 py-3 text-[#1a1a2e]/70 whitespace-nowrap">{r.role}</td>
                      <td className="px-4 py-3 text-[#1a1a2e]/70 whitespace-nowrap">{r.attendance ?? "—"}</td>
                      <td className="px-4 py-3 text-[#1a1a2e]/70 whitespace-nowrap">{r.timing ?? "—"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-xs text-[#1a1a2e]/45 mt-4">
              Tip: use the email links or Export CSV to notify interested users when a new
              date is announced.
            </p>
          </>
        )}
      </div>
    </main>
  );
}

function SummaryTile({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ElementType;
  label: string;
  value: number;
}) {
  return (
    <div className="card p-5 flex items-center gap-4">
      <span
        className="flex items-center justify-center w-11 h-11 rounded-xl shrink-0"
        style={{ background: "#eef2fb" }}
      >
        <Icon className="h-5 w-5" style={{ color: "#1b3a8a" }} aria-hidden="true" />
      </span>
      <div>
        <div className="font-heading text-2xl font-bold text-[#0f2150] leading-none">{value}</div>
        <div className="text-[10px] font-bold uppercase tracking-wide text-[#c9a84c] mt-1.5">
          {label}
        </div>
      </div>
    </div>
  );
}
