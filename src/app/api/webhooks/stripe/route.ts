import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { Resend } from "resend";
import { getCourse } from "@/lib/courses";
import { getSupabaseAdmin } from "@/lib/supabase/admin";
import { buildSponsorshipEmail } from "@/lib/sponsorship-email";
import { buildConfirmationEmail, formatAddress } from "@/lib/confirmation-email";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
  const resend = new Resend(process.env.RESEND_API_KEY!);
  const body = await request.text();
  const sig = request.headers.get("stripe-signature");

  if (!sig) {
    return NextResponse.json({ error: "Missing stripe-signature header" }, { status: 400 });
  }

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!);
  } catch {
    return NextResponse.json({ error: "Webhook signature verification failed" }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;

    const email = session.customer_details?.email;
    const name = session.customer_details?.name;
    const phone = session.customer_details?.phone ?? null;
    const slug = session.metadata?.slug;
    const title = session.metadata?.title;

    // Full registrant details (collected as required fields on courses that ask
    // for them). Given + family name come from Checkout custom fields; the
    // mailing address comes from the billing address Stripe collected.
    const customFields = session.custom_fields ?? [];
    const fieldValue = (key: string) =>
      customFields.find((f) => f.key === key)?.text?.value?.trim() || null;
    const firstName = fieldValue("firstname");
    const lastName = fieldValue("lastname");
    const address = formatAddress(session.customer_details?.address ?? null);
    const attendance = session.metadata?.attendance ?? null;
    const amountTotal = session.amount_total ?? 0;
    const amountSubtotal = session.amount_subtotal ?? 0;
    const amountTax = session.total_details?.amount_tax ?? 0;
    const regNumber =
      typeof session.payment_intent === "string"
        ? session.payment_intent.toUpperCase().replace(/^PI_/, "").slice(-12)
        : session.id.toUpperCase().slice(-12);

    // Never log the full phone number.
    console.log("[webhook] checkout.session.completed", {
      email,
      slug,
      title,
      attendance,
      hasPhone: Boolean(phone),
      amountSubtotal,
      amountTax,
      amountTotal,
    });

    if (email && slug && title) {
      const isSponsorship = session.metadata?.type === "sponsorship";
      const course = getCourse(slug);
      const { data, error } = await resend.emails.send({
        from: "CanaDent Education <noreply@canadent.net>",
        // Same recipients as course registrations: the buyer, plus the CanaDent team.
        to: email,
        cc: ["ar.movasagh@confidentist.ca", "mahshid.aghania@gmail.com", "admin@canadent.net"],
        subject: isSponsorship
          ? `Sponsorship Confirmed — ${title}`
          : `Registration Confirmed — ${title}`,
        html: isSponsorship
          ? buildSponsorshipEmail(name, title, amountTotal, amountTax, { phone, regNumber })
          : buildConfirmationEmail(name, title, amountTotal, course, amountSubtotal, amountTax, {
              attendance,
              phone,
              regNumber,
              firstName,
              lastName,
              address,
            }),
      });
      if (error) {
        console.error("[webhook] Resend error:", error);
      } else {
        console.log("[webhook] Email sent:", data?.id);
      }
    } else {
      console.warn("[webhook] Missing fields — email:", email, "slug:", slug, "title:", title);
    }

    // Persist the registration for the admin list / exports. Idempotent on the
    // Checkout session id, so Stripe webhook retries won't create duplicates.
    // No-op until Supabase env vars are provisioned.
    const supabase = getSupabaseAdmin();
    if (supabase && email && slug && title) {
      const utm: Record<string, string> = {};
      for (const [k, v] of Object.entries(session.metadata ?? {})) {
        if (/^utm_[a-z]+$/.test(k) && typeof v === "string") utm[k] = v;
      }
      const { error: dbError } = await supabase.from("registrations").upsert(
        {
          course_slug: slug,
          course_title: title,
          attendance,
          student_name: name ?? null,
          student_email: email,
          student_phone: phone,
          amount_total_cents: amountTotal,
          currency: session.currency ?? "cad",
          stripe_session_id: session.id,
          stripe_payment_intent:
            typeof session.payment_intent === "string" ? session.payment_intent : null,
          utm,
        },
        { onConflict: "stripe_session_id" }
      );
      if (dbError) {
        console.error("[webhook] Supabase insert error:", dbError.message);
      } else {
        console.log("[webhook] Registration saved:", session.id);
      }
    }
  }

  return NextResponse.json({ received: true });
}
