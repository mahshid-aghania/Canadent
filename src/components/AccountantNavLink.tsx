"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ShieldCheck } from "lucide-react";

// Shows an "Accountant Dashboard" link in the header ONLY for authenticated
// staff. Access is enforced server-side regardless — this just avoids showing a
// link that would bounce ordinary visitors to a login screen.
export function AccountantNavLink({ variant = "icon" }: { variant?: "icon" | "menu" }) {
  const [staff, setStaff] = useState(false);

  useEffect(() => {
    let active = true;
    fetch("/api/accountant/me", { cache: "no-store" })
      .then((r) => r.json())
      .then((d) => { if (active) setStaff(Boolean(d?.staff)); })
      .catch(() => {});
    return () => { active = false; };
  }, []);

  if (!staff) return null;

  if (variant === "menu") {
    return (
      <Link
        href="/accountant"
        className="block px-3 py-3 text-sm font-medium rounded-md text-[#c9a84c] hover:bg-white/5 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#c9a84c]"
      >
        Accountant Dashboard
      </Link>
    );
  }

  return (
    <Link
      href="/accountant"
      className="hidden lg:flex text-[#c9a84c] hover:text-white transition-colors"
      aria-label="Accountant Dashboard"
      title="Accountant Dashboard"
    >
      <ShieldCheck className="h-5 w-5" />
    </Link>
  );
}
