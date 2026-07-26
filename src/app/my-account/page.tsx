import type { Metadata } from "next";
import Link from "next/link";
import { User, BookOpen, Award } from "lucide-react";
import { LoginForm, AccountSidebar } from "@/components/ContactForm";

export const metadata: Metadata = {
  title: "My Account",
  description: "Manage your CanaDent Education Center account, view enrolled courses and CE certificates.",
};

export default function MyAccountPage() {
  return (
    <>
      <section
        className="py-14 px-4"
        style={{ background: "linear-gradient(135deg, #0f2150, #1b3a8a)" }}
      >
        <div className="max-w-7xl mx-auto">
          <nav className="text-sm text-white/50 mb-4">
            <Link href="/" className="hover:text-[#c9a84c] transition-colors">Home</Link>
            <span className="mx-2">/</span>
            <span className="text-white">My Account</span>
          </nav>
          <span className="section-label">Portal</span>
          <h1 className="font-heading text-4xl sm:text-5xl font-bold text-white mt-3">
            My Account
          </h1>
        </div>
      </section>

      <section className="py-16 px-4" style={{ background: "#f5f7fb" }}>
        <div className="max-w-5xl mx-auto grid lg:grid-cols-[260px_1fr] gap-8">
          {/* Sidebar */}
          <aside className="card p-5 h-fit">
            <div className="flex items-center gap-3 mb-6 pb-5 border-b border-[#1a1a2e]/8">
              <div
                className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg"
                style={{ background: "#1b3a8a" }}
              >
                D
              </div>
              <div>
                <div className="font-semibold text-[#0f2150] text-sm">Dr. Jane Smith</div>
                <div className="text-xs text-[#1a1a2e]/50">jane@example.com</div>
              </div>
            </div>
            <AccountSidebar />
          </aside>

          {/* Main */}
          <div className="space-y-6">
            <div className="card p-8 text-center">
              <div
                className="w-16 h-16 rounded-full mx-auto mb-5 flex items-center justify-center"
                style={{ background: "#f5f7fb" }}
              >
                <User className="h-8 w-8" style={{ color: "#1b3a8a" }} />
              </div>
              <h2 className="font-heading text-2xl font-bold text-[#0f2150] mb-2">
                Sign In to Your Account
              </h2>
              <p className="text-sm text-[#1a1a2e]/60 mb-8 max-w-md mx-auto">
                Access your enrolled courses, download CE certificates, and manage your CanaDent account.
              </p>
              <LoginForm />
            </div>

            <div className="grid sm:grid-cols-3 gap-4">
              {[
                { icon: BookOpen, label: "Browse Courses", href: "/courses", desc: "Find your next CE course" },
                { icon: Award, label: "Enrolment Agreement", href: "/enrolment-agreement", desc: "Review terms & policies" },
                { icon: User, label: "Contact Support", href: "/contact", desc: "Get help from our team" },
              ].map(({ icon: Icon, label, href, desc }) => (
                <Link key={label} href={href} className="card p-5 flex flex-col gap-2 hover:shadow-lg">
                  <Icon className="h-5 w-5" style={{ color: "#c9a84c" }} />
                  <div className="font-semibold text-[#0f2150] text-sm">{label}</div>
                  <div className="text-xs text-[#1a1a2e]/50">{desc}</div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
