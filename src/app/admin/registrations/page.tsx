import type { Metadata } from "next";
import { Lock, Download, LogOut, Users, AlertCircle, Inbox } from "lucide-react";
import { isAdminAuthed, adminTokenConfigured } from "@/lib/admin-auth";
import { getSupabaseAdmin } from "@/lib/supabase/admin";
import { AdminLoginForm } from "../AdminLoginForm";
import { logout } from "../actions";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Registrations — Admin",
  robots: { index: false, follow: false },
};

type Registration = {
  id: string;
  created_at: string;
  course_title: string;
  attendance: string | null;
  student_name: string | null;
  student_email: string;
  student_phone: string | null;
  amount_total_cents: number | null;
  currency: string | null;
  stripe_payment_intent: string | null;
  utm: Record<string, string> | null;
};

function money(cents: number | null, currency: string | null): string {
  if (cents == null) return "—";
  return `$${(cents / 100).toLocaleString("en-CA", { minimumFractionDigits: 2 })} ${(currency ?? "cad").toUpperCase()}`;
}

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <>
      <section className="py-10 px-4" style={{ background: "linear-gradient(135deg, #0f2150, #1b3a8a)" }}>
        <div className="max-w-6xl mx-auto flex items-center gap-3">
          <Users className="h-6 w-6" style={{ color: "#c9a84c" }} aria-hidden="true" />
          <h1 className="font-heading text-2xl sm:text-3xl font-bold text-white">Registrations</h1>
        </div>
      </section>
      <section className="py-10 px-4" style={{ background: "#f5f7fb", minHeight: "60vh" }}>
        <div className="max-w-6xl mx-auto">{children}</div>
      </section>
    </>
  );
}

export default async function AdminRegistrationsPage() {
  // ── Gate 1: no token configured → area is closed ──
  if (!adminTokenConfigured()) {
    return (
      <Shell>
        <div className="card p-8 max-w-md mx-auto text-center">
          <Lock className="h-8 w-8 mx-auto mb-4" style={{ color: "#1b3a8a" }} />
          <h2 className="font-heading text-xl font-bold text-[#0f2150] mb-2">Admin area not configured</h2>
          <p className="text-sm text-[#1a1a2e]/60">
            Set an <code className="text-xs bg-[#f5f7fb] px-1.5 py-0.5 rounded">ADMIN_ACCESS_TOKEN</code> environment
            variable to enable this page.
          </p>
        </div>
      </Shell>
    );
  }

  // ── Gate 2: not signed in → login form ──
  if (!(await isAdminAuthed())) {
    return (
      <Shell>
        <div className="card p-8 max-w-md mx-auto">
          <div className="text-center mb-6">
            <Lock className="h-8 w-8 mx-auto mb-3" style={{ color: "#1b3a8a" }} />
            <h2 className="font-heading text-xl font-bold text-[#0f2150]">Staff sign in</h2>
            <p className="text-sm text-[#1a1a2e]/55 mt-1">This area contains registrant contact details.</p>
          </div>
          <AdminLoginForm />
        </div>
      </Shell>
    );
  }

  // ── Signed in ──
  const supabase = getSupabaseAdmin();
  if (!supabase) {
    return (
      <Shell>
        <div className="card p-8 max-w-md mx-auto text-center">
          <AlertCircle className="h-8 w-8 mx-auto mb-4" style={{ color: "#b45309" }} />
          <h2 className="font-heading text-xl font-bold text-[#0f2150] mb-2">Datastore not provisioned</h2>
          <p className="text-sm text-[#1a1a2e]/60">
            Add the Supabase environment variables and run <code className="text-xs bg-[#f5f7fb] px-1.5 py-0.5 rounded">supabase/schema.sql</code> to
            start collecting registrations.
          </p>
        </div>
      </Shell>
    );
  }

  const { data, error } = await supabase
    .from("registrations")
    .select("id, created_at, course_title, attendance, student_name, student_email, student_phone, amount_total_cents, currency, stripe_payment_intent, utm")
    .order("created_at", { ascending: false })
    .limit(500);

  const rows = (data ?? []) as Registration[];

  return (
    <Shell>
      <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
        <p className="text-sm text-[#1a1a2e]/60">
          {rows.length} registration{rows.length === 1 ? "" : "s"}{rows.length === 500 ? " (showing latest 500)" : ""}
        </p>
        <div className="flex items-center gap-3">
          <a href="/admin/registrations/export" className="btn-secondary text-sm" style={{ padding: "0.5rem 1rem" }}>
            <Download className="h-4 w-4" />
            Export CSV
          </a>
          <form action={logout}>
            <button type="submit" className="inline-flex items-center gap-1.5 text-sm text-[#1a1a2e]/55 hover:text-[#b91c1c] transition-colors">
              <LogOut className="h-4 w-4" />
              Sign out
            </button>
          </form>
        </div>
      </div>

      {error ? (
        <div className="card p-6 text-sm" style={{ color: "#b91c1c" }}>
          Could not load registrations: {error.message}
        </div>
      ) : rows.length === 0 ? (
        <div className="card p-10 text-center">
          <Inbox className="h-8 w-8 mx-auto mb-3" style={{ color: "#94a3b8" }} />
          <p className="text-sm text-[#1a1a2e]/55">No registrations yet. New paid registrations will appear here.</p>
        </div>
      ) : (
        <div className="card overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="text-left" style={{ background: "#f5f7fb" }}>
                {["Date", "Course", "Attendance", "Name", "Email", "Phone", "Amount", "Source"].map((h) => (
                  <th key={h} className="px-4 py-3 font-semibold text-[#0f2150] whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.id} className="border-t border-[#eef1f6] align-top">
                  <td className="px-4 py-3 whitespace-nowrap text-[#1a1a2e]/60">
                    {new Date(r.created_at).toLocaleDateString("en-CA", { year: "numeric", month: "short", day: "numeric" })}
                  </td>
                  <td className="px-4 py-3 text-[#0f2150] max-w-[220px]">{r.course_title}</td>
                  <td className="px-4 py-3 whitespace-nowrap text-[#1a1a2e]/70">{r.attendance ?? "—"}</td>
                  <td className="px-4 py-3 whitespace-nowrap text-[#1a1a2e]/70">{r.student_name ?? "—"}</td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <a href={`mailto:${r.student_email}`} className="text-[#1b3a8a] hover:underline">{r.student_email}</a>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    {r.student_phone ? <a href={`tel:${r.student_phone}`} className="text-[#1b3a8a] hover:underline">{r.student_phone}</a> : "—"}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap font-medium text-[#0f2150]">{money(r.amount_total_cents, r.currency)}</td>
                  <td className="px-4 py-3 whitespace-nowrap text-xs text-[#1a1a2e]/50">
                    {r.utm?.utm_source ? `${r.utm.utm_source}${r.utm.utm_medium ? ` / ${r.utm.utm_medium}` : ""}` : "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </Shell>
  );
}
