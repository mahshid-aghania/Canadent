// ── Single source of truth for tax on course registrations ────────────────
// All course prices in `courses.ts` are stored TAX-EXCLUSIVE. Ontario HST is
// added on top at checkout, so every price shown in the UI must be labelled.

export const TAX_LABEL = "HST";
export const TAX_PERCENTAGE = 13;

/** Short suffix for inline price display, e.g. "$699 + HST". */
export const TAX_SUFFIX = `+ ${TAX_LABEL}`;

/** Fine print for cards and the booking sidebar. */
export const TAX_NOTE = `Prices exclude ${TAX_PERCENTAGE}% ${TAX_LABEL}, calculated at checkout.`;

/** Tax owed on a tax-exclusive amount, rounded to the cent. */
export function taxOn(subtotal: number): number {
  return Math.round(subtotal * TAX_PERCENTAGE) / 100;
}

/** Tax-inclusive total for a tax-exclusive amount, rounded to the cent. */
export function totalWithTax(subtotal: number): number {
  return Math.round(subtotal * (100 + TAX_PERCENTAGE)) / 100;
}
