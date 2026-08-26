"use client";
import { useState } from "react";
import Link from "next/link";
import { X } from "lucide-react";

export function AnnouncementBar() {
  const [dismissed, setDismissed] = useState(false);
  if (dismissed) return null;

  return (
    <div
      className="relative py-2.5 px-10 text-center"
      style={{ background: "#c9a84c" }}
    >
      <p className="text-sm font-semibold text-[#0f2150] leading-snug">
        <span className="font-normal opacity-75">Upcoming: </span>
        <Link
          href="/courses/advanced-adhesive-dentistry-master-blueprint"
          className="underline underline-offset-2 hover:opacity-70 transition-opacity"
        >
          Advanced Adhesive Dentistry — Sept 6
        </Link>
        <span className="opacity-40 mx-2">·</span>
        <Link
          href="/courses/daily-unique-orthodontic-techniques"
          className="underline underline-offset-2 hover:opacity-70 transition-opacity"
        >
          Orthodontic Techniques — Sept 27
        </Link>
        <span className="opacity-60 mx-1 text-[#0f2150] font-normal">(Early Bird $799 + HST · Until Sep 10)</span>
        <span className="opacity-40 mx-2">·</span>
        <Link
          href="/courses/advanced-adhesive-dentistry-master-blueprint"
          className="underline underline-offset-2 hover:opacity-70 transition-opacity"
        >
          Reserve your seat →
        </Link>
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
