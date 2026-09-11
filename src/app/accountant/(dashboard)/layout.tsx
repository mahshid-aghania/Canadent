import type { Metadata } from "next";
import Link from "next/link";
import { ShieldCheck } from "lucide-react";
import { requireStaff } from "@/lib/accounting/auth";
import { Sidebar } from "@/components/accountant/Sidebar";
import { TopBar } from "@/components/accountant/TopBar";

export const metadata: Metadata = {
  title: "Accountant Dashboard — CanaDent",
  robots: { index: false, follow: false },
};

// Authoritative gate: only admins/accountants reach anything under here. The
// proxy already bounced anonymous visitors; this re-checks the real role
// server-side (and RLS is the final backstop).
export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const user = await requireStaff();

  return (
    <div className="min-h-screen bg-[#f5f7fb] lg:grid lg:grid-cols-[248px_1fr]">
      {/* Sidebar */}
      <aside className="border-b border-[#1a1a2e]/8 bg-white px-3 py-4 lg:border-b-0 lg:border-r">
        <Link href="/accountant" className="mb-5 flex items-center gap-2 px-2 text-[#0f2150]">
          <ShieldCheck className="h-6 w-6" style={{ color: "#c9a84c" }} aria-hidden="true" />
          <span className="font-heading text-lg font-bold leading-tight">
            CanaDent
            <span className="block text-[10px] font-bold uppercase tracking-[0.18em] text-[#c9a84c]">
              Accounting
            </span>
          </span>
        </Link>
        <Sidebar role={user.role} />
      </aside>

      {/* Main column */}
      <div className="flex min-h-screen flex-col">
        <TopBar user={user} />
        <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8">{children}</main>
      </div>
    </div>
  );
}
