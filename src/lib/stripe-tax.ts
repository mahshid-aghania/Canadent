import "server-only";
import type Stripe from "stripe";
import { TAX_LABEL, TAX_PERCENTAGE } from "./tax";

// Stable key stored on the Stripe Tax Rate so we always reuse the same one
// instead of creating a duplicate on every cold start.
const TAX_RATE_KEY = "canadent-hst-on-13";

let cachedTaxRateId: string | null = null;

/**
 * Returns the ID of the reusable 13% Ontario HST tax rate in the Stripe
 * dashboard, creating it on first use. Prices are tax-exclusive, so Stripe
 * adds HST on top and shows it as its own line in Checkout.
 */
export async function getHstTaxRateId(stripe: Stripe): Promise<string> {
  if (cachedTaxRateId) return cachedTaxRateId;

  // Reuse an existing rate if one already exists in the dashboard.
  const existing = await stripe.taxRates.list({ active: true, limit: 100 });
  const match = existing.data.find(
    (rate) =>
      rate.metadata?.key === TAX_RATE_KEY ||
      (rate.display_name === TAX_LABEL &&
        rate.percentage === TAX_PERCENTAGE &&
        rate.inclusive === false)
  );

  if (match) {
    cachedTaxRateId = match.id;
    return match.id;
  }

  const created = await stripe.taxRates.create({
    display_name: TAX_LABEL,
    description: `Ontario ${TAX_LABEL} (${TAX_PERCENTAGE}%)`,
    jurisdiction: "CA-ON",
    country: "CA",
    state: "ON",
    percentage: TAX_PERCENTAGE,
    inclusive: false,
    metadata: { key: TAX_RATE_KEY },
  });

  cachedTaxRateId = created.id;
  return created.id;
}

// ── Tax-INCLUSIVE HST ────────────────────────────────────────────────────────
// Used for prices that are advertised tax-included (e.g. the sponsorship
// package: $500 CAD total = $442.48 net + $57.52 HST). Stripe treats the
// unit_amount as already containing HST and shows the HST portion as its own
// line — it does NOT add 13% on top.
const TAX_RATE_INCLUSIVE_KEY = "canadent-hst-inclusive-13";

let cachedInclusiveTaxRateId: string | null = null;

export async function getHstInclusiveTaxRateId(stripe: Stripe): Promise<string> {
  if (cachedInclusiveTaxRateId) return cachedInclusiveTaxRateId;

  const existing = await stripe.taxRates.list({ active: true, limit: 100 });
  const match = existing.data.find(
    (rate) =>
      rate.metadata?.key === TAX_RATE_INCLUSIVE_KEY ||
      (rate.display_name === TAX_LABEL &&
        rate.percentage === TAX_PERCENTAGE &&
        rate.inclusive === true)
  );

  if (match) {
    cachedInclusiveTaxRateId = match.id;
    return match.id;
  }

  const created = await stripe.taxRates.create({
    display_name: TAX_LABEL,
    description: `Ontario ${TAX_LABEL} (${TAX_PERCENTAGE}%) — tax inclusive`,
    jurisdiction: "CA-ON",
    country: "CA",
    state: "ON",
    percentage: TAX_PERCENTAGE,
    inclusive: true,
    metadata: { key: TAX_RATE_INCLUSIVE_KEY },
  });

  cachedInclusiveTaxRateId = created.id;
  return created.id;
}
