"use server";
import Stripe from "stripe";
import { redirect } from "next/navigation";

// Fixed INITIAL sponsorship payment for the Financial & Insurance partnership.
// Charged as a flat $2,000 CAD with NO tax added — the amount is hard-coded here
// and never accepted from the client. This is the initial payment only; the
// remaining balance is handled separately (see the page's Payment box copy).
const INITIAL_PAYMENT_CENTS = 200000; // $2,000.00 CAD, no tax
const SPONSORSHIP_SLUG = "sponsorship-financial-insurance-initial";
const SPONSORSHIP_TITLE =
  "CANADENT Financial & Insurance Sponsorship — Initial Payment";

function getStripe(): Stripe | null {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) return null;
  return new Stripe(key);
}

export async function createFinancialInsuranceCheckout(
  utm?: Record<string, string>
): Promise<{ error: string } | never> {
  const stripe = getStripe();
  if (!stripe) {
    console.error("[financial-insurance] STRIPE_SECRET_KEY is not set");
    return {
      error:
        "Online payment is temporarily unavailable. Please call 1.437.370.0122 to sponsor.",
    };
  }

  const baseUrl =
    process.env.NEXT_PUBLIC_BASE_URL ||
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000");

  // Whitelist UTM keys only — attribution data, never PII.
  const utmMetadata: Record<string, string> = {};
  if (utm) {
    for (const [key, value] of Object.entries(utm)) {
      if (/^utm_[a-z]+$/.test(key) && typeof value === "string") {
        utmMetadata[key] = value.slice(0, 200);
      }
    }
  }
  const utmQuery = new URLSearchParams(utmMetadata).toString();

  let checkoutUrl: string;
  try {
    // No tax_rates: the $2,000 initial payment is charged flat, with no HST.
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "cad",
            product_data: {
              name: SPONSORSHIP_TITLE,
              description:
                "Initial payment toward the CANADENT Financial & Insurance sponsorship partnership — $2,000 CAD.",
            },
            unit_amount: INITIAL_PAYMENT_CENTS,
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      allow_promotion_codes: true,
      billing_address_collection: "auto",
      phone_number_collection: { enabled: true },
      metadata: {
        type: "sponsorship",
        slug: SPONSORSHIP_SLUG,
        title: SPONSORSHIP_TITLE,
        ...utmMetadata,
      },
      success_url: `${baseUrl}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/sponsorship/financial-insurance?cancelled=true${utmQuery ? `&${utmQuery}` : ""}`,
    });

    checkoutUrl = session.url!;
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Payment setup failed.";
    return { error: message };
  }

  // redirect() is called outside try/catch so Next.js can handle it cleanly.
  redirect(checkoutUrl);
}
