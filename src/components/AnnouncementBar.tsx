"use client";
import { useState } from "react";
import Link from "next/link";
import { X } from "lucide-react";

export type AnnouncementItem = {
  slug: string;
  /** Short label shown in the bar. */
  label: string;
  /** Short date, e.g. "Nov 24" or "Mar 7, 2027". */
  dateLabel: string;
};

/**
 * The gold "Now enrolling" bar. Items are the real upcoming courses (soonest
 * first), computed server-side in the root layout, so the bar never advertises
 * a course whose date has passed.
 */
export function AnnouncementBar({ items }: { items: AnnouncementItem[] }) {
  const [dismissed, setDismissed] = useState(false);
  if (dismissed || items.length === 0) return null;

  return (
    <div
      className="relative py-2.5 px-10 text-center"
      style={{ background: "#c9a84c" }}
    >
      <p className="text-sm font-semibold text-[#0f2150] leading-snug">
        <span className="font-normal opacity-75">Now enrolling: </span>
        {items.map((item, i) => (
          <span key={item.slug} className={i === 0 ? "" : "hidden sm:inline"}>
            {i > 0 && <span className="opacity-40 mx-2">·</span>}
            <Link
              href={`/courses/${item.slug}`}
              className="underline underline-offset-2 hover:opacity-70 transition-opacity"
            >
              {item.label} — {item.dateLabel}
            </Link>
          </span>
        ))}
      </p>
      <button
        onClick={() => setDismissed(true)}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-[#0f2150]/50 hover:text-[#0f2150] transition-colors"
        aria-label="Dismiss announcement"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}
