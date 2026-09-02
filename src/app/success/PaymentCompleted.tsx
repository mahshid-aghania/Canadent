"use client";
import { useEffect } from "react";
import { track } from "@/lib/analytics";

/** Fires the privacy-safe payment_completed funnel event once, on confirmation. */
export function PaymentCompleted({
  slug,
  attendance,
}: {
  slug?: string;
  attendance?: "online" | "in-person";
}) {
  useEffect(() => {
    track("payment_completed", { slug, attendance });
  }, [slug, attendance]);
  return null;
}
