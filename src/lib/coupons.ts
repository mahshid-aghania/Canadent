// ── In-app coupon codes (no Stripe coupon objects required) ────────────────
// Discounts are applied to the TAX-EXCLUSIVE course fee *before* the Stripe
// Checkout session is created, so HST is charged on the already-discounted
// amount. This file is imported only by server code (checkout action), so the
// codes below never ship to the browser — validation is always server-side.
//
// To add / change / expire a coupon, edit COUPONS and redeploy.

export type Coupon = {
  /** "percent" = % off the course fee; "fixed" = CAD amount off the fee. */
  type: "percent" | "fixed";
  /** For "percent": 0–100. For "fixed": CAD off, pre-tax. */
  value: number;
  /** Shown to the customer + stored on the order, e.g. "Early-bird 20% off". */
  label: string;
  /** Optional ISO date (YYYY-MM-DD). After this date the code stops working. */
  expiresAt?: string;
  /** Optional allow-list of course slugs. Omit to allow every course. */
  courses?: string[];
};

// Codes are matched case-insensitively; define them in UPPERCASE here.
export const COUPONS: Record<string, Coupon> = {
  SAVE50: { type: "percent", value: 50, label: "50% off" },
  FALL100: { type: "fixed", value: 100, label: "$100 off" },
};

// Stripe rejects card charges below ~$0.50 CAD; keep a small floor so a coupon
// can't produce an uncharcheable amount. A free course should be handled offline.
const MIN_CHARGE_CAD = 0.5;

export type CouponResult =
  | {
      ok: true;
      /** Normalised code, e.g. "SAVE50". */
      code: string;
      label: string;
      /** CAD discount applied to the course fee, rounded to the cent. */
      discountAmount: number;
      /** Course fee after the discount, rounded to the cent (pre-tax). */
      finalPrice: number;
    }
  | { ok: false; error: string };

/**
 * Validate a coupon code against a tax-exclusive price and return the
 * discounted price. Pure and side-effect free so it can back both the live
 * preview and the authoritative checkout calculation.
 *
 * @param rawCode  The code as typed by the customer (any case / whitespace).
 * @param price    Tax-exclusive course fee in CAD.
 * @param slug     Course slug, used to enforce per-course restrictions.
 * @param today    ISO date (YYYY-MM-DD) for expiry checks; defaults to now.
 */
export function applyCoupon(
  rawCode: string,
  price: number,
  slug: string,
  today: string = new Date().toISOString().slice(0, 10)
): CouponResult {
  const code = rawCode.trim().toUpperCase();
  if (!code) return { ok: false, error: "Please enter a discount code." };

  const coupon = COUPONS[code];
  if (!coupon) return { ok: false, error: "That discount code isn’t valid." };

  if (coupon.expiresAt && today > coupon.expiresAt) {
    return { ok: false, error: "That discount code has expired." };
  }

  if (coupon.courses && !coupon.courses.includes(slug)) {
    return { ok: false, error: "That code doesn’t apply to this course." };
  }

  const rawDiscount =
    coupon.type === "percent"
      ? (price * coupon.value) / 100
      : coupon.value;

  // Never discount below zero, and round to the cent.
  const discountAmount = Math.round(Math.min(rawDiscount, price) * 100) / 100;
  const finalPrice = Math.round((price - discountAmount) * 100) / 100;

  if (finalPrice < MIN_CHARGE_CAD) {
    return {
      ok: false,
      error:
        "That code brings the total too low to pay online. Please call 1.437.370.0122 to register.",
    };
  }

  return { ok: true, code, label: coupon.label, discountAmount, finalPrice };
}
