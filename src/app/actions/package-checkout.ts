"use server";
import Stripe from "stripe";
import { redirect } from "next/navigation";
import { getHstTaxRateId } from "@/lib/stripe-tax";
import { TAX_LABEL, TAX_PERCENTAGE } from "@/lib/tax";
import { threeCoursePackage, isPackageComplete } from "@/lib/package";

// Fixed, TAX-EXCLUSIVE package price. The advertised total is $850 CAD plus
// 13% HST, matching the course-catalogue convention. The amount is hard-coded
// here and NEVER accepted from the client; Stripe adds HST on top as its own
// line via the exclusive tax rate.
const PACKAGE_TOTAL_CENTS = threeCoursePackage.totalCAD * 100; // $850.00 CAD, +HST
const PACKAGE_SLUG = threeCoursePackage.slug;
const PACKAGE_TITLE = "CanaDent Three-Course Package";

function getStripe(): Stripe | null {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) return null;
  return new Stripe(key);
}

export async function createPackageCheckout(
  utm?: Record<string, string>
): Promise<{ error: string } | never> {
  // Hard stop: never create a payment while the bundle is unfinished (the third
  // course is still a placeholder). This keeps the preview from ever charging.
  if (!isPackageComplete(threeCoursePackage)) {
    return {
      error:
        "This package is not yet available for online registration. Please call 1.437.370.0122 or email admin@canadent.net.",
    };
  }

  const stripe = getStripe();
  if (!stripe) {
    console.error("[package] STRIPE_SECRET_KEY is not set");
    return {
      error:
        "Online payment is temporarily unavailable. Please call 1.437.370.0122 to register.",
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

  const includedSlugs = threeCoursePackage.courses
    .map((c) => c.slug)
    .filter((s): s is string => Boolean(s))
    .join(",");

  let checkoutUrl: string;
  try {
    // Course prices are tax-exclusive — Stripe adds HST as its own line.
    const taxRateId = await getHstTaxRateId(stripe);

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "cad",
            product_data: {
              name: PACKAGE_TITLE,
              description: `Three continuing-education courses in one package — $${threeCoursePackage.totalCAD} CAD (plus ${TAX_PERCENTAGE}% ${TAX_LABEL}).`,
            },
            unit_amount: PACKAGE_TOTAL_CENTS,
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
        type: "package",
        slug: PACKAGE_SLUG,
        title: PACKAGE_TITLE,
        included_slugs: includedSlugs,
        ...utmMetadata,
      },
      success_url: `${baseUrl}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}${threeCoursePackage.route}?cancelled=true${utmQuery ? `&${utmQuery}` : ""}`,
    });

    checkoutUrl = session.url!;
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Payment setup failed.";
    return { error: message };
  }

  // redirect() is called outside try/catch so Next.js can handle it cleanly.
  redirect(checkoutUrl);
}
