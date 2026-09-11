import type { Metadata } from "next";
import Link from "next/link";
import { ShieldCheck } from "lucide-react";

export const metadata: Metadata = {
  title: "Accountant Access — CanaDent",
  robots: { index: false, follow: false },
};

// Minimal centered shell for the accountant auth screens — no sidebar, no
// session requirement (these pages must be reachable while signed out).
export default function AccountantAuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <main
      className="min-h-screen flex flex-col items-center justify-center px-4 py-16"
      style={{ background: "linear-gradient(135deg, #0f2150, #1b3a8a)" }}
    >
      <div className="w-full max-w-md">
        <Link href="/" className="flex items-center justify-center gap-2 mb-8 text-white">
          <ShieldCheck className="h-6 w-6" style={{ color: "#c9a84c" }} aria-hidden="true" />
          <span className="font-heading text-2xl font-bold">CanaDent</span>
        </Link>
        <div className="card p-8">{children}</div>
        <p className="mt-6 text-center text-xs text-white/50">
          Staff access only. <Link href="/" className="underline hover:text-white">Return to site</Link>
        </p>
      </div>
    </main>
  );
}
