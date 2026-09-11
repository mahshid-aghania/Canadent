"use client";

import { useState, useRef, useEffect } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Search, ChevronDown, LogOut, ExternalLink } from "lucide-react";
import Link from "next/link";
import { signOut } from "@/app/accountant/actions";
import { ROLE_LABELS, type AppUser } from "@/lib/accounting/roles";

export function TopBar({ user }: { user: AppUser }) {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  // Search routes to the Students list with the query applied.
  function onSearch(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const q = new FormData(e.currentTarget).get("q")?.toString().trim() ?? "";
    const target = new URLSearchParams();
    if (q) target.set("search", q);
    router.push(`/accountant/students${target.toString() ? `?${target}` : ""}`);
  }

  const initial = (user.fullName || user.email || "?").charAt(0).toUpperCase();

  return (
    <header className="sticky top-0 z-30 flex items-center gap-3 border-b border-[#1a1a2e]/8 bg-white/95 px-4 py-3 backdrop-blur sm:px-6">
      <form onSubmit={onSearch} className="relative flex-1 max-w-md">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#1a1a2e]/40" aria-hidden="true" />
        <input
          name="q"
          type="search"
          defaultValue={pathname.startsWith("/accountant/students") ? params.get("search") ?? "" : ""}
          placeholder="Search name, email, organization, invoice #, reference…"
          aria-label="Search records"
          className="w-full rounded-lg border border-[#e2e8f0] py-2 pl-9 pr-3 text-sm focus:border-[#1b3a8a] focus:outline-none focus:ring-2 focus:ring-[#1b3a8a]/20"
        />
      </form>

      <div className="relative ml-auto" ref={menuRef}>
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-haspopup="menu"
          className="flex items-center gap-2 rounded-lg px-2 py-1.5 hover:bg-[#f5f7fb] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#c9a84c]"
        >
          <span className="flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold text-white" style={{ background: "#1b3a8a" }}>
            {initial}
          </span>
          <span className="hidden text-left sm:block">
            <span className="block text-sm font-semibold leading-tight text-[#0f2150]">{user.fullName || user.email}</span>
            <span className="block text-[11px] leading-tight text-[#1a1a2e]/50">{ROLE_LABELS[user.role]}</span>
          </span>
          <ChevronDown className="h-4 w-4 text-[#1a1a2e]/40" aria-hidden="true" />
        </button>

        {open && (
          <div role="menu" className="absolute right-0 mt-2 w-56 overflow-hidden rounded-xl border border-[#1a1a2e]/8 bg-white shadow-lg">
            <div className="border-b border-[#1a1a2e]/8 px-4 py-3">
              <p className="truncate text-sm font-semibold text-[#0f2150]">{user.fullName || "Staff"}</p>
              <p className="truncate text-xs text-[#1a1a2e]/50">{user.email}</p>
            </div>
            <Link href="/" role="menuitem" className="flex items-center gap-2 px-4 py-2.5 text-sm text-[#1a1a2e]/70 hover:bg-[#f5f7fb]">
              <ExternalLink className="h-4 w-4" aria-hidden="true" /> View main site
            </Link>
            <form action={signOut}>
              <button type="submit" role="menuitem" className="flex w-full items-center gap-2 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50">
                <LogOut className="h-4 w-4" aria-hidden="true" /> Sign out
              </button>
            </form>
          </div>
        )}
      </div>
    </header>
  );
}
