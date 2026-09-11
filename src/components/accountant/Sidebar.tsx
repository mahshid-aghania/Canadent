"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard, Users, FileText, ReceiptText, BarChart3, Upload, Settings,
} from "lucide-react";
import type { Role } from "@/lib/accounting/roles";

type Item = { href: string; label: string; icon: typeof Users; adminOnly?: boolean };

const ITEMS: Item[] = [
  { href: "/accountant", label: "Overview", icon: LayoutDashboard },
  { href: "/accountant/students", label: "Students", icon: Users },
  { href: "/accountant/invoices", label: "Invoices", icon: FileText },
  { href: "/accountant/receipts", label: "Receipts & Payments", icon: ReceiptText },
  { href: "/accountant/reports", label: "Reports", icon: BarChart3 },
  { href: "/accountant/imports", label: "Imports", icon: Upload, adminOnly: true },
  { href: "/accountant/settings", label: "Settings", icon: Settings, adminOnly: true },
];

export function Sidebar({ role }: { role: Role }) {
  const pathname = usePathname();
  const items = ITEMS.filter((i) => !i.adminOnly || role === "admin");

  return (
    <nav
      aria-label="Accounting sections"
      className="flex gap-1 overflow-x-auto lg:flex-col lg:overflow-visible"
    >
      {items.map(({ href, label, icon: Icon }) => {
        const active = href === "/accountant" ? pathname === href : pathname.startsWith(href);
        return (
          <Link
            key={href}
            href={href}
            aria-current={active ? "page" : undefined}
            className={`flex shrink-0 items-center gap-3 whitespace-nowrap rounded-lg px-3 py-2.5 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#c9a84c] focus-visible:ring-offset-2 ${
              active ? "text-white" : "text-[#1a1a2e]/60 hover:bg-[#f5f7fb] hover:text-[#0f2150]"
            }`}
            style={active ? { background: "#1b3a8a" } : undefined}
          >
            <Icon className="h-4 w-4 shrink-0" aria-hidden="true" />
            {label}
          </Link>
        );
      })}
    </nav>
  );
}
