import { requireAdmin } from "@/lib/accounting/auth";
import { getSupabaseAdmin } from "@/lib/supabase/admin";
import { courses } from "@/lib/courses";
import { ImportWizard } from "@/components/accountant/ImportWizard";
import { ConnectionRequired } from "@/components/accountant/ConnectionRequired";

export const dynamic = "force-dynamic";

export default async function ImportsPage() {
  await requireAdmin(); // admin-only surface (re-checked server-side)
  const admin = getSupabaseAdmin();
  if (!admin) return <ConnectionRequired />;

  const courseList = courses.map((c) => ({ slug: c.slug, title: c.title }));

  // Recent imports for context.
  const { data: recent } = await admin
    .from("acct_imports")
    .select("id, filename, sheet, course_title, created_at, created_count, updated_count, skipped_count, row_count")
    .order("created_at", { ascending: false })
    .limit(10);

  return (
    <div className="mx-auto max-w-5xl">
      <div className="mb-5">
        <h1 className="font-heading text-2xl font-bold text-[#0f2150]">Imports</h1>
        <p className="mt-1 text-sm text-[#1a1a2e]/55">
          Import a registrants spreadsheet. Only the participant table is read — title and summary rows are ignored.
          Fees are preserved exactly and never treated as payments. Re-importing the same file is safe.
        </p>
      </div>

      <ImportWizard courses={courseList} />

      <div className="mt-8">
        <h2 className="mb-3 font-heading text-base font-bold text-[#0f2150]">Recent imports</h2>
        {!recent || recent.length === 0 ? (
          <p className="text-sm text-[#1a1a2e]/50">No imports yet.</p>
        ) : (
          <div className="card overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[#1a1a2e]/8 bg-[#f9fafb] text-left text-[11px] font-bold uppercase tracking-wide text-[#1a1a2e]/45">
                  <th className="px-4 py-3">File</th>
                  <th className="px-4 py-3">Course</th>
                  <th className="px-4 py-3">When</th>
                  <th className="px-4 py-3 text-right">New / Updated / Skipped</th>
                </tr>
              </thead>
              <tbody>
                {recent.map((r) => (
                  <tr key={r.id} className="border-b border-[#1a1a2e]/6 last:border-0">
                    <td className="px-4 py-3 text-[#0f2150]">{r.filename}<span className="block text-xs text-[#1a1a2e]/45">{r.sheet}</span></td>
                    <td className="px-4 py-3 text-[#1a1a2e]/70">{r.course_title}</td>
                    <td className="px-4 py-3 text-[#1a1a2e]/60">{new Date(r.created_at).toLocaleString("en-CA")}</td>
                    <td className="px-4 py-3 text-right tabular-nums text-[#1a1a2e]/70">{r.created_count} / {r.updated_count} / {r.skipped_count}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
