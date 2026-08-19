"use server";
import Stripe from "stripe";
import { redirect } from "next/navigation";
import { getCourse } from "@/lib/courses";
import { getHstTaxRateId } from "@/lib/stripe-tax";
import { TAX_LABEL, TAX_PERCENTAGE } from "@/lib/tax";

// Constructed lazily: instantiating at module scope crashes the entire server
// action on import when STRIPE_SECRET_KEY is absent, which surfaces as an
// unhelpful 500 instead of a readable message on the page.
function getStripe(): Stripe | null {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) return null;
  return new Stripe(key);
}

export async function createCheckoutSession(
  slug: string,
  title: string,
  priceCAD: number,
  optionLabel?: string | null
): Promise<{ error: string } | never> {
  // Never trust the client-supplied amount — always recompute from course data.
  const course = getCourse(slug);
  if (!course) {
    return { error: "This course could not be found." };
  }

  let resolvedPrice: number | null | undefined;
  if (course.priceOptions) {
    const option = optionLabel
      ? course.priceOptions.find((o) => o.label === optionLabel)
      : undefined;
    if (!option) {
      return { error: "Please choose how you would like to attend." };
    }
    resolvedPrice = option.price;
  } else {
    resolvedPrice = course.price;
  }

  if (!resolvedPrice || resolvedPrice <= 0) {
    return { error: "This course is not available for online payment." };
  }

  const stripe = getStripe();
  if (!stripe) {
    console.error("[checkout] STRIPE_SECRET_KEY is not set");
    return {
      error:
        "Online payment is temporarily unavailable. Please call 1.437.370.0122 to register.",
    };
  }
  const baseUrl =
    process.env.NEXT_PUBLIC_BASE_URL ||
    (process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : "http://localhost:3001");

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
              name: optionLabel ? `${course.title} — ${optionLabel}` : course.title,
              description: `CanaDent Education Center — Continuing Education Course (plus ${TAX_PERCENTAGE}% ${TAX_LABEL})`,
            },
            unit_amount: resolvedPrice * 100,
          },
          quantity: 1,
          tax_rates: [taxRateId],
        },
      ],
      mode: "payment",
      allow_promotion_codes: true,
      billing_address_collection: "auto",
      metadata: { slug, title: course.title, ...(optionLabel ? { attendance: optionLabel } : {}) },
      success_url: `${baseUrl}/success?course=${encodeURIComponent(course.title)}&slug=${slug}`,
      cancel_url: `${baseUrl}/courses/${slug}?cancelled=true`,
    });

    checkoutUrl = session.url!;
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Payment setup failed.";
    return { error: message };
  }

  // redirect() is called outside try/catch so Next.js can handle it cleanly
  redirect(checkoutUrl);
}
