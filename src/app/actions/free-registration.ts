"use server";
import { randomUUID } from "crypto";
import { Resend } from "resend";
import { getCourse } from "@/lib/courses";
import { applyCoupon } from "@/lib/coupons";
import { getSupabaseAdmin } from "@/lib/supabase/admin";
import {
  buildConfirmationEmail,
  formatAddressParts,
  type AddressParts,
} from "@/lib/confirmation-email";

// Same recipients as paid registrations (the Stripe webhook): the registrant,
// plus the CanaDent team on CC.
const ADMIN_CC = [
  "ar.movasagh@confidentist.ca",
  "mahshid.aghania@gmail.com",
  "admin@canadent.net",
];

export type FreeRegistrationInput = {
  slug: string;
  couponCode: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: AddressParts;
  optionLabel?: string | null;
  utm?: Record<string, string>;
};

export type FreeRegistrationResult =
  | { ok: true; regNumber: string }
  | { ok: false; error: string; fieldErrors?: Record<string, string> };

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** Recompute the tax-exclusive fee for a course + optional attendance option. */
function resolveCoursePrice(
  slug: string,
  optionLabel?: string | null
): { ok: true; price: number; title: string } | { ok: false; error: string } {
  const course = getCourse(slug);
  if (!course) return { ok: false, error: "This course could not be found." };

  let price: number | null | undefined;
  if (course.priceOptions) {
    const option = optionLabel
      ? course.priceOptions.find((o) => o.label === optionLabel)
      : undefined;
    if (!option) {
      return { ok: false, error: "Please choose how you would like to attend." };
    }
    price = option.price;
  } else {
    price = course.price;
  }

  if (!price || price <= 0) {
    return { ok: false, error: "This course is not available for online registration." };
  }
  return { ok: true, price, title: course.title };
}

/**
 * Complete a fully-comped ($0) registration WITHOUT Stripe.
 *
 * This is the front-end path for a coupon that brings the total to $0: there is
 * no payment, so we never touch Stripe. We re-validate the coupon server-side
 * (it MUST resolve to free for this course — the client is never trusted),
 * collect the attendee's details, email the same confirmation a paid
 * registration gets, and record the registration in Supabase.
 */
export async function registerFree(
  input: FreeRegistrationInput
): Promise<FreeRegistrationResult> {
  const slug = (input.slug ?? "").trim();
  const optionLabel = input.optionLabel ?? null;

  // 1. Resolve the real course fee server-side.
  const resolved = resolveCoursePrice(slug, optionLabel);
  if (!resolved.ok) return { ok: false, error: resolved.error };

  // 2. Re-validate the coupon. This endpoint is ONLY for $0 registrations, so a
  //    code that doesn't fully comp the fee is rejected — a paid order must go
  //    through Stripe checkout instead.
  const coupon = applyCoupon(input.couponCode ?? "", resolved.price, slug);
  if (!coupon.ok) return { ok: false, error: coupon.error };
  if (!coupon.isFree) {
    return {
      ok: false,
      error: "This code doesn’t make the course free. Please continue to secure payment.",
    };
  }

  // 3. Validate the attendee details.
  const firstName = (input.firstName ?? "").trim();
  const lastName = (input.lastName ?? "").trim();
  const email = (input.email ?? "").trim();
  const phone = (input.phone ?? "").trim();
  const address: AddressParts = {
    line1: (input.address?.line1 ?? "").trim(),
    line2: (input.address?.line2 ?? "").trim() || null,
    city: (input.address?.city ?? "").trim(),
    province: (input.address?.province ?? "").trim(),
    postalCode: (input.address?.postalCode ?? "").trim(),
    country: (input.address?.country ?? "").trim() || "Canada",
  };

  const fieldErrors: Record<string, string> = {};
  if (!firstName) fieldErrors.firstName = "Please enter your first name.";
  if (!lastName) fieldErrors.lastName = "Please enter your last (family) name.";
  if (!email || !EMAIL_RE.test(email)) fieldErrors.email = "Please enter a valid email address.";
  if (phone.replace(/\D/g, "").length < 7) fieldErrors.phone = "Please enter a valid phone number.";
  if (!address.line1) fieldErrors.line1 = "Please enter your street address.";
  if (!address.city) fieldErrors.city = "Please enter your city.";
  if (!address.province) fieldErrors.province = "Please enter your province.";
  if (!address.postalCode) fieldErrors.postalCode = "Please enter your postal code.";
  if (Object.keys(fieldErrors).length > 0) {
    return { ok: false, error: "Please check the highlighted fields.", fieldErrors };
  }

  const course = getCourse(slug);
  const title = resolved.title;
  const fullName = `${firstName} ${lastName}`;
  const addressLine = formatAddressParts(address);
  const regNumber = `FEC-${randomUUID().replace(/-/g, "").toUpperCase().slice(0, 10)}`;

  // Whitelist UTM keys only (attribution data, never PII).
  const utm: Record<string, string> = {};
  for (const [k, v] of Object.entries(input.utm ?? {})) {
    if (/^utm_[a-z]+$/.test(k) && typeof v === "string") utm[k] = v.slice(0, 200);
  }

  // 4. Send the confirmation email (best-effort — a delivery hiccup must not
  //    lose the registration, which is already recorded below).
  const resendKey = process.env.RESEND_API_KEY;
  if (resendKey) {
    try {
      const resend = new Resend(resendKey);
      const { error } = await resend.emails.send({
        from: "CanaDent Education <noreply@canadent.net>",
        to: email,
        cc: ADMIN_CC,
        subject: `Registration Confirmed — ${title}`,
        html: buildConfirmationEmail(fullName, title, 0, course, 0, 0, {
          attendance: optionLabel,
          phone,
          regNumber,
          firstName,
          lastName,
          address: addressLine,
        }),
      });
      if (error) console.error("[free-registration] Resend error:", error);
    } catch (err) {
      console.error("[free-registration] email send failed:", err);
    }
  } else {
    console.warn("[free-registration] RESEND_API_KEY not set — skipping confirmation email.");
  }

  // 5. Record the registration (no-op until Supabase is provisioned). We store a
  //    synthetic `free_<regNumber>` id in stripe_session_id so the row is unique
  //    and idempotent in the admin list, even though no Stripe session exists.
  const supabase = getSupabaseAdmin();
  if (supabase) {
    const { error: dbError } = await supabase.from("registrations").upsert(
      {
        course_slug: slug,
        course_title: title,
        attendance: optionLabel,
        student_name: fullName,
        student_email: email,
        student_phone: phone,
        amount_total_cents: 0,
        currency: "cad",
        stripe_session_id: `free_${regNumber}`,
        stripe_payment_intent: null,
        utm,
      },
      { onConflict: "stripe_session_id" }
    );
    if (dbError) {
      console.error("[free-registration] Supabase insert error:", dbError.message);
    } else {
      console.log("[free-registration] Registration saved:", regNumber);
    }
  }

  return { ok: true, regNumber };
}
