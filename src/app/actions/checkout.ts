"use server";
import Stripe from "stripe";
import { redirect } from "next/navigation";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function createCheckoutSession(
  slug: string,
  title: string,
  priceCAD: number
): Promise<{ error: string } | never> {
  const baseUrl =
    process.env.NEXT_PUBLIC_BASE_URL ||
    (process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : "http://localhost:3001");

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "cad",
            product_data: {
              name: title,
              description: "CanaDent Education Center — Continuing Education Course",
            },
            unit_amount: priceCAD * 100,
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      billing_address_collection: "auto",
      success_url: `${baseUrl}/success?course=${encodeURIComponent(title)}&slug=${slug}`,
      cancel_url: `${baseUrl}/courses/${slug}?cancelled=true`,
    });

    redirect(session.url!);
  } catch (err: unknown) {
    if (
      err &&
      typeof err === "object" &&
      "digest" in err &&
      typeof (err as { digest: string }).digest === "string" &&
      (err as { digest: string }).digest.startsWith("NEXT_REDIRECT")
    ) {
      throw err;
    }
    const message = err instanceof Error ? err.message : "Payment setup failed.";
    return { error: message };
  }
}
