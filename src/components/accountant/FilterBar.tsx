"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { VERIFICATION_LABELS, INVOICE_STATUS_LABELS } from "@/lib/accounting/labels";

// URL-driven filter controls for the Students list. Changing any control pushes
// a new query string (resetting to page 1); the server re-renders the table.
export function FilterBar({ courses }: { courses: { slug: string | null; title: string }[] }) {
  const router = useRouter();
  const params = useSearchParams();

  function set(key: string, value: string) {
    const next = new URLSearchParams(params.toString());
    if (value) next.set(key, value);
    else next.delete(key);
    next.delete("page");
    router.push(`/accountant/students${next.toString() ? `?${next}` : ""}`);
  }

  const sel = "rounded-lg border border-[#e2e8f0] bg-white px-3 py-2 text-sm focus:border-[#1b3a8a] focus:outline-none focus:ring-2 focus:ring-[#1b3a8a]/20";

  return (
    <div className="flex flex-wrap items-center gap-2">
      <select aria-label="Course" className={sel} value={params.get("course") ?? ""} onChange={(e) => set("course", e.target.value)}>
        <option value="">All courses</option>
        {courses.map((c) => (
          <option key={c.slug ?? c.title} value={c.slug ?? ""}>{c.title}</option>
        ))}
      </select>

      <select aria-label="Payment verification" className={sel} value={params.get("verification") ?? ""} onChange={(e) => set("verification", e.target.value)}>
        <option value="">Any verification</option>
        {Object.entries(VERIFICATION_LABELS).map(([v, l]) => <option key={v} value={v}>{l}</option>)}
      </select>

      <select aria-label="Invoice status" className={sel} value={params.get("invoiceStatus") ?? ""} onChange={(e) => set("invoiceStatus", e.target.value)}>
        <option value="">Any invoice</option>
        <option value="none">No invoice</option>
        {Object.entries(INVOICE_STATUS_LABELS).map(([v, l]) => <option key={v} value={v}>{l}</option>)}
      </select>

      <select aria-label="Receipt availability" className={sel} value={params.get("receipt") ?? ""} onChange={(e) => set("receipt", e.target.value)}>
        <option value="">Any receipt</option>
        <option value="has">Has receipt</option>
        <option value="none">No receipt</option>
      </select>

      <select aria-label="Missing information" className={sel} value={params.get("missing") ?? ""} onChange={(e) => set("missing", e.target.value)}>
        <option value="">All records</option>
        <option value="email">Missing email</option>
        <option value="fee">Missing fee</option>
      </select>
    </div>
  );
}
