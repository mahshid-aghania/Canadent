"use server";
import Stripe from "stripe";
import { redirect } from "next/navigation";
import { getHstInclusiveTaxRateId } from "@/lib/stripe-tax";
import { TAX_LABEL, TAX_PERCENTAGE } from "@/lib/tax";

// Fixed, TAX-INCLUSIVE sponsorship price. The advertised total is $500 CAD
// (Tax Included) = $442.48 net + $57.52 HST. The amount is hard-coded here and
// never accepted from the client, and HST is applied as an INCLUSIVE rate so
// Stripe never adds 13% on top of $500.
const SPONSORSHIP_TOTAL_CENTS = 50000; // $500.00 CAD, HST included
const SPONSORSHIP_SLUG = "sponsorship-advanced-adhesive-dentistry";
const SPONSORSHIP_TITLE =
  "CANADENT Sponsorship — Advanced Adhesive Dentistry: The Master Blueprint";

function getStripe(): Stripe | null {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) return null;
  return new Stripe(key);
}

export async function createSponsorshipCheckout(
  utm?: Record<string, string>
): Promise<{ error: string } | never> {
  const stripe = getStripe();
  if (!stripe) {
    console.error("[sponsorship] STRIPE_SECRET_KEY is not set");
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
    // Inclusive HST: the $500 already contains the tax; Stripe shows the HST
    // portion but does not add it on top.
    const taxRateId = await getHstInclusiveTaxRateId(stripe);

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "cad",
            product_data: {
              name: SPONSORSHIP_TITLE,
              description: `Event sponsorship package — $500 CAD total, includes ${TAX_PERCENTAGE}% ${TAX_LABEL}.`,
            },
            unit_amount: SPONSORSHIP_TOTAL_CENTS,
          },
          quantity: 1,
          tax_rates: [taxRateId],
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
      cancel_url: `${baseUrl}/sponsorship?cancelled=true${utmQuery ? `&${utmQuery}` : ""}`,
    });

    checkoutUrl = session.url!;
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Payment setup failed.";
    return { error: message };
  }

  // redirect() is called outside try/catch so Next.js can handle it cleanly.
  redirect(checkoutUrl);
}
