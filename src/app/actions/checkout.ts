"use server";
import Stripe from "stripe";
import { redirect } from "next/navigation";
import { getCourse } from "@/lib/courses";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

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
  const baseUrl =
    process.env.NEXT_PUBLIC_BASE_URL ||
    (process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : "http://localhost:3001");

  let checkoutUrl: string;

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "cad",
            product_data: {
              name: optionLabel ? `${course.title} — ${optionLabel}` : course.title,
              description: "CanaDent Education Center — Continuing Education Course",
            },
            unit_amount: resolvedPrice * 100,
          },
          quantity: 1,
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
