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
  // 5% off, valid across every CanaDent course/product (no course restriction).
  CANACOLON5: { type: "percent", value: 5, label: "5% off" },
  SAVE50: { type: "percent", value: 50, label: "50% off" },
  FALL100: { type: "fixed", value: 100, label: "$100 off" },
  "CONFI-10": { type: "percent", value: 10, label: "10% off" },
  "CONFI-20": { type: "percent", value: 20, label: "20% off" },
  "CONFI-50": { type: "percent", value: 50, label: "50% off" },
  "CONFI-100": { type: "percent", value: 100, label: "100% off" },
  // Complimentary (100% off) access to the Fill Every Chair masterclass only.
  // Restricted to that course so the code can't comp any other registration.
  "FEC-VIP": {
    type: "percent",
    value: 100,
    label: "Complimentary — 100% off",
    courses: ["fill-every-chair"],
  },
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
      /** True when the code fully covers the fee (finalPrice === 0). The
       *  checkout handles this as a $0 "comped" registration — Stripe still
       *  collects the attendee's details but never asks for a card. */
      isFree: boolean;
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

  // A code that fully covers the fee is a comped registration ($0). The
  // checkout handles this with a $0 Stripe session, so it's allowed.
  const isFree = finalPrice <= 0;

  // The awkward middle band — above $0 but below Stripe's ~$0.50 card minimum —
  // can't be charged online, so it's still rejected.
  if (!isFree && finalPrice < MIN_CHARGE_CAD) {
    return {
      ok: false,
      error:
        "That code brings the total too low to pay online. Please call 1.437.370.0122 to register.",
    };
  }

  return {
    ok: true,
    code,
    label: coupon.label,
    discountAmount,
    finalPrice: isFree ? 0 : finalPrice,
    isFree,
  };
}
