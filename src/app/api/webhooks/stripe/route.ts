import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { Resend } from "resend";
import { getCourse } from "@/lib/courses";
import type { Course } from "@/lib/courses";
import { TAX_LABEL, TAX_PERCENTAGE } from "@/lib/tax";

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
        cc: ["ar.movasagh@confidentist.ca", "mahshid.aghania@gmail.com", "canadent.edu@gmail.com"],
        subject: isSponsorship
          ? `Sponsorship Confirmed — ${title}`
          : `Registration Confirmed — ${title}`,
        html: isSponsorship
          ? buildSponsorshipEmail(name, title, amountTotal, amountTax, { phone, regNumber })
          : buildEmail(name, title, amountTotal, course, amountSubtotal, amountTax, {
              attendance,
              phone,
              regNumber,
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
  }

  return NextResponse.json({ received: true });
}

function maskLast4(phone: string | null): string | null {
  if (!phone) return null;
  const digits = phone.replace(/\D/g, "");
  return digits.length >= 4 ? digits.slice(-4) : null;
}

function compactUtc(iso: string): string {
  return iso.replace(/[-:]/g, "").replace(/\.\d+/, "");
}

function calendarUrl(course: Course | undefined): string | null {
  if (!course?.calendar) return null;
  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: `${course.title} — CanaDent`,
    dates: `${compactUtc(course.calendar.startUtc)}/${compactUtc(course.calendar.endUtc)}`,
    details: `Instructor: ${course.instructor}. Continuing education with CanaDent Education Center.`,
    location: course.location,
  });
  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

function buildEmail(
  name: string | null | undefined,
  title: string,
  amountTotal: number,
  course: Course | undefined,
  amountSubtotal = 0,
  amountTax = 0,
  extra: { attendance?: string | null; phone?: string | null; regNumber?: string } = {}
): string {
  const { attendance = null, phone = null, regNumber } = extra;
  const isOnline = (attendance ?? "").toLowerCase().includes("online");
  const last4 = maskLast4(phone);
  const calLink = calendarUrl(course);
  const nameParts = name ? name.trim().split(" ") : [];
  const lastName = nameParts.length > 1 ? nameParts[nameParts.length - 1] : nameParts[0];
  const greeting = lastName ? `Dear Dr. ${lastName},` : "Dear Doctor,";
  const amountPaid = amountTotal === 0 ? "Complimentary" : `$${(amountTotal / 100).toFixed(2)} CAD`;

  const rowLabel =
    "padding:10px 0;border-bottom:1px solid #f0ebe0;color:#555;font-size:14px;";
  const rowValue =
    "padding:10px 0;border-bottom:1px solid #f0ebe0;font-weight:600;color:#0f2150;font-size:14px;";

  // Only show the breakdown when tax was actually charged.
  const taxRows =
    amountTax > 0
      ? `
      <tr><td style="${rowLabel}">🧾 Course Fee</td><td style="${rowValue}">$${(amountSubtotal / 100).toFixed(2)} CAD</td></tr>
      <tr><td style="${rowLabel}">${TAX_LABEL} (${TAX_PERCENTAGE}%)</td><td style="${rowValue}">$${(amountTax / 100).toFixed(2)} CAD</td></tr>
    `
      : "";

  const locationValue = isOnline
    ? "Online — joining link emailed before the session"
    : course?.attendanceModes?.find((m) => m.kind === "in-person")?.location ?? course?.location ?? "";

  const attendanceRow = attendance
    ? `<tr><td style="${rowLabel}">${isOnline ? "💻" : "🏛️"} Attendance</td><td style="${rowValue}">${attendance}</td></tr>`
    : "";
  const regRow = regNumber
    ? `<tr><td style="${rowLabel}">🔖 Registration #</td><td style="${rowValue}">${regNumber}</td></tr>`
    : "";

  const details = course
    ? `
      ${attendanceRow}
      ${regRow}
      <tr><td style="${rowLabel}">📅 Date</td><td style="${rowValue}">${course.date}</td></tr>
      ${course.time ? `<tr><td style="${rowLabel}">🕘 Time</td><td style="${rowValue}">${course.time} ET (Toronto)</td></tr>` : ""}
      <tr><td style="${rowLabel}">📍 ${isOnline ? "Format" : "Location"}</td><td style="${rowValue}">${locationValue}</td></tr>
      <tr><td style="${rowLabel}">👨‍⚕️ Instructor</td><td style="${rowValue}">${course.instructor}</td></tr>
      ${course.ceCredits ? `<tr><td style="${rowLabel}">🎓 CE Credits</td><td style="${rowValue}">${course.ceCredits}</td></tr>` : ""}
      ${taxRows}
      <tr><td style="padding:10px 0;color:#555;font-size:14px;">💳 Total Paid</td><td style="padding:10px 0;font-weight:600;color:#0f2150;font-size:14px;">${amountPaid}</td></tr>
    `
    : `${attendanceRow}${regRow}${taxRows}<tr><td style="padding:10px 0;color:#555;font-size:14px;">💳 Total Paid</td><td style="padding:10px 0;font-weight:600;color:#0f2150;font-size:14px;">${amountPaid}</td></tr>`;

  // Next steps differ by attendance type — only confirmed facts are stated.
  const nextSteps = isOnline
    ? `
        <li>Your <strong>joining link and access details</strong> will be emailed to you before the course date.</li>
        <li>The live session is <strong>recorded</strong>, and the recording will be shared with you afterward.</li>
        <li>CE certificates are issued approximately one week after the course.</li>
      `
    : `
        <li>Please arrive <strong>15 minutes early</strong> to check in and get settled.</li>
        <li><strong>Lunch and refreshments</strong> will be provided.</li>
        <li>CE certificates are issued approximately one week after the course.</li>
      `;

  const phoneNote = last4
    ? `<p style="margin:0 0 20px;font-size:13px;color:#777;">We&rsquo;ll use the mobile number ending in <strong>${last4}</strong> only for important course-related updates.</p>`
    : "";

  const calendarButton = calLink
    ? `<div style="text-align:center;margin:0 0 28px;"><a href="${calLink}" style="display:inline-block;background:#1b3a8a;color:#fff;text-decoration:none;font-size:14px;font-weight:600;padding:12px 24px;border-radius:8px;">📅 Add to Calendar</a></div>`
    : "";

  return `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f5f0e8;font-family:Inter,Arial,sans-serif;">

  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f5f0e8;padding:32px 16px;">
    <tr><td align="center">
      <table width="560" cellpadding="0" cellspacing="0" style="max-width:560px;width:100%;">

        <!-- Header -->
        <tr>
          <td style="background:linear-gradient(135deg,#0f2150,#1b3a8a);border-radius:16px 16px 0 0;padding:36px 40px;text-align:center;">
            <div style="font-family:Georgia,serif;font-size:26px;font-weight:700;color:#c9a84c;letter-spacing:1px;">CanaDent</div>
            <div style="font-size:12px;color:rgba(255,255,255,0.55);letter-spacing:3px;text-transform:uppercase;margin-top:4px;">Education Center</div>
          </td>
        </tr>

        <!-- Gold banner -->
        <tr>
          <td style="background:#c9a84c;padding:20px 40px;text-align:center;">
            <div style="font-size:22px;font-weight:700;color:#0f2150;font-family:Georgia,serif;">Registration Confirmed</div>
            <div style="font-size:13px;color:#0f2150;opacity:0.7;margin-top:4px;">Your seat has been reserved</div>
          </td>
        </tr>

        <!-- Body -->
        <tr>
          <td style="background:#ffffff;padding:36px 40px;">
            <p style="margin:0 0 16px;font-size:15px;color:#1a1a2e;">${greeting}</p>
            <p style="margin:0 0 24px;font-size:15px;color:#1a1a2e;line-height:1.6;">
              Thank you for registering for <strong style="color:#0f2150;">${title}</strong>.
              We look forward to seeing you there!
            </p>

            <!-- Course details box -->
            <div style="background:#f9f7f2;border-radius:12px;padding:24px;border-left:4px solid #c9a84c;margin-bottom:28px;">
              <div style="font-size:13px;font-weight:700;color:#c9a84c;text-transform:uppercase;letter-spacing:1.5px;margin-bottom:16px;">Course Details</div>
              <table width="100%" cellpadding="0" cellspacing="0">
                ${details}
              </table>
            </div>

            <!-- What happens next -->
            <div style="background:#f0f4ff;border-radius:12px;padding:20px 24px;margin-bottom:20px;">
              <div style="font-size:13px;font-weight:700;color:#1b3a8a;text-transform:uppercase;letter-spacing:1.5px;margin-bottom:12px;">What Happens Next</div>
              <ul style="margin:0;padding-left:18px;color:#1a1a2e;font-size:14px;line-height:1.8;">
                ${nextSteps}
              </ul>
            </div>

            ${phoneNote}
            ${calendarButton}

            <p style="margin:0 0 8px;font-size:14px;color:#555;">Questions? We're here to help:</p>
            <p style="margin:0 0 4px;font-size:14px;color:#1b3a8a;">📞 <a href="tel:14373700122" style="color:#1b3a8a;text-decoration:none;">1.437.370.0122</a></p>
            <p style="margin:0 0 24px;font-size:14px;color:#1b3a8a;">✉️ <a href="mailto:canadent.edu@gmail.com" style="color:#1b3a8a;text-decoration:none;">canadent.edu@gmail.com</a></p>

            <p style="margin:0;font-size:14px;color:#1a1a2e;">We look forward to welcoming you,<br><strong style="color:#0f2150;">The CanaDent Team</strong></p>
          </td>
        </tr>

        <!-- Footer -->
        <tr>
          <td style="background:#0f2150;border-radius:0 0 16px 16px;padding:24px 40px;text-align:center;">
            <p style="margin:0 0 6px;font-size:12px;color:rgba(255,255,255,0.45);">CanaDent Education Center</p>
            <p style="margin:0;font-size:12px;color:rgba(255,255,255,0.35);">265 Rimrock Rd, North York, ON · <a href="https://www.canadent.net" style="color:#c9a84c;text-decoration:none;">canadent.net</a></p>
          </td>
        </tr>

      </table>
    </td></tr>
  </table>

</body>
</html>`;
}

// Confirmation email for a sponsorship purchase. Same branding and recipients
// as a course registration, but with sponsorship-appropriate copy and a
// tax-INCLUSIVE price breakdown ($500 total = net + HST, not net + HST on top).
function buildSponsorshipEmail(
  name: string | null | undefined,
  title: string,
  amountTotal: number,
  amountTax: number,
  extra: { phone?: string | null; regNumber?: string } = {}
): string {
  const { phone = null, regNumber } = extra;
  const last4 = maskLast4(phone);
  const firstName = name ? name.trim().split(" ")[0] : null;
  const greeting = firstName ? `Dear ${firstName},` : "Dear Sponsor,";

  const net = ((amountTotal - amountTax) / 100).toFixed(2);
  const tax = (amountTax / 100).toFixed(2);
  const total = (amountTotal / 100).toFixed(2);

  const rowLabel = "padding:10px 0;border-bottom:1px solid #f0ebe0;color:#555;font-size:14px;";
  const rowValue = "padding:10px 0;border-bottom:1px solid #f0ebe0;font-weight:600;color:#0f2150;font-size:14px;";

  const regRow = regNumber
    ? `<tr><td style="${rowLabel}">🔖 Reference #</td><td style="${rowValue}">${regNumber}</td></tr>`
    : "";

  // Show the HST breakdown only when tax was recorded on the session.
  const taxRows =
    amountTax > 0
      ? `
      <tr><td style="${rowLabel}">Sponsorship Fee</td><td style="${rowValue}">$${net} CAD</td></tr>
      <tr><td style="${rowLabel}">${TAX_LABEL} (${TAX_PERCENTAGE}%)</td><td style="${rowValue}">$${tax} CAD</td></tr>
    `
      : "";

  const phoneNote = last4
    ? `<p style="margin:0 0 20px;font-size:13px;color:#777;">We&rsquo;ll use the mobile number ending in <strong>${last4}</strong> only for important updates about your sponsorship.</p>`
    : "";

  return `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f5f0e8;font-family:Inter,Arial,sans-serif;">

  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f5f0e8;padding:32px 16px;">
    <tr><td align="center">
      <table width="560" cellpadding="0" cellspacing="0" style="max-width:560px;width:100%;">

        <!-- Header -->
        <tr>
          <td style="background:linear-gradient(135deg,#0f2150,#1b3a8a);border-radius:16px 16px 0 0;padding:36px 40px;text-align:center;">
            <div style="font-family:Georgia,serif;font-size:26px;font-weight:700;color:#c9a84c;letter-spacing:1px;">CanaDent</div>
            <div style="font-size:12px;color:rgba(255,255,255,0.55);letter-spacing:3px;text-transform:uppercase;margin-top:4px;">Education Center</div>
          </td>
        </tr>

        <!-- Gold banner -->
        <tr>
          <td style="background:#c9a84c;padding:20px 40px;text-align:center;">
            <div style="font-size:22px;font-weight:700;color:#0f2150;font-family:Georgia,serif;">Sponsorship Confirmed</div>
            <div style="font-size:13px;color:#0f2150;opacity:0.7;margin-top:4px;">Thank you for sponsoring</div>
          </td>
        </tr>

        <!-- Body -->
        <tr>
          <td style="background:#ffffff;padding:36px 40px;">
            <p style="margin:0 0 16px;font-size:15px;color:#1a1a2e;">${greeting}</p>
            <p style="margin:0 0 24px;font-size:15px;color:#1a1a2e;line-height:1.6;">
              Thank you for sponsoring <strong style="color:#0f2150;">${title}</strong>. Your sponsorship is confirmed.
            </p>

            <!-- Details box -->
            <div style="background:#f9f7f2;border-radius:12px;padding:24px;border-left:4px solid #c9a84c;margin-bottom:28px;">
              <div style="font-size:13px;font-weight:700;color:#c9a84c;text-transform:uppercase;letter-spacing:1.5px;margin-bottom:16px;">Sponsorship Details</div>
              <table width="100%" cellpadding="0" cellspacing="0">
                ${regRow}
                <tr><td style="${rowLabel}">📅 Date</td><td style="${rowValue}">September 6, 2026</td></tr>
                <tr><td style="${rowLabel}">📍 Location</td><td style="${rowValue}">265 Rimrock Road, Toronto, ON</td></tr>
                ${taxRows}
                <tr><td style="padding:10px 0;color:#555;font-size:14px;">💳 Total Paid</td><td style="padding:10px 0;font-weight:600;color:#0f2150;font-size:14px;">$${total} CAD (Tax Included)</td></tr>
              </table>
            </div>

            <!-- What happens next -->
            <div style="background:#f0f4ff;border-radius:12px;padding:20px 24px;margin-bottom:20px;">
              <div style="font-size:13px;font-weight:700;color:#1b3a8a;text-transform:uppercase;letter-spacing:1.5px;margin-bottom:12px;">What Happens Next</div>
              <ul style="margin:0;padding-left:18px;color:#1a1a2e;font-size:14px;line-height:1.8;">
                <li>A member of the CanaDent team will contact you to coordinate your sponsor table and presentation.</li>
                <li>You can reply to this email with any promotional materials or questions ahead of the event.</li>
              </ul>
            </div>

            ${phoneNote}

            <p style="margin:0 0 24px;font-size:14px;color:#555;">For any urgent matters, you can reach us at <a href="tel:4379622020" style="color:#1b3a8a;text-decoration:none;">437-962-2020</a>.</p>

            <p style="margin:0;font-size:14px;color:#1a1a2e;">We are here to welcome you,<br><strong style="color:#0f2150;">The CanaDent Team</strong></p>
          </td>
        </tr>

        <!-- Footer -->
        <tr>
          <td style="background:#0f2150;border-radius:0 0 16px 16px;padding:24px 40px;text-align:center;">
            <p style="margin:0 0 6px;font-size:12px;color:rgba(255,255,255,0.45);">CanaDent Education Center</p>
            <p style="margin:0;font-size:12px;color:rgba(255,255,255,0.35);">265 Rimrock Rd, North York, ON · <a href="https://www.canadent.net" style="color:#c9a84c;text-decoration:none;">canadent.net</a></p>
          </td>
        </tr>

      </table>
    </td></tr>
  </table>

</body>
</html>`;
}
