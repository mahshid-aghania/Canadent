// ── Money helpers — exact integer minor units (cents) ───────────────────────
// Financial amounts are always integer cents with an explicit currency. We never
// use floats for storage/maths. Client-safe (no server-only imports).

/**
 * Parse a human money string ("$699.00", "1,250.50", "249.5") into integer
 * cents. Returns null when the value is blank or not a recognisable number — we
 * never guess a fee. Accepts an optional leading currency symbol and thousands
 * separators.
 */
export function parseMoneyToCents(input: unknown): number | null {
  if (input == null) return null;
  if (typeof input === "number") {
    if (!Number.isFinite(input)) return null;
    return Math.round(input * 100);
  }
  const raw = String(input).trim();
  if (!raw) return null;
  // Strip currency symbols/codes and thousands separators, keep sign + decimal.
  const cleaned = raw.replace(/[^0-9.\-]/g, "");
  if (!cleaned || cleaned === "-" || cleaned === ".") return null;
  const value = Number(cleaned);
  if (!Number.isFinite(value)) return null;
  return Math.round(value * 100);
}

/** Format integer cents for display, e.g. 69900 → "$699.00". */
export function formatCents(
  cents: number | null | undefined,
  currency: string = "cad",
): string {
  if (cents == null) return "—";
  return new Intl.NumberFormat("en-CA", {
    style: "currency",
    currency: (currency || "cad").toUpperCase(),
    currencyDisplay: "narrowSymbol",
  }).format(cents / 100);
}

/** Uppercase currency code for labels, e.g. "cad" → "CAD". */
export function currencyCode(currency: string | null | undefined): string {
  return (currency || "cad").toUpperCase();
}
