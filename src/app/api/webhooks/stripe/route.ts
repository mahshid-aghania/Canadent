import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { Resend } from "resend";
import { getCourse } from "@/lib/courses";
import type { Course } from "@/lib/courses";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
const resend = new Resend(process.env.RESEND_API_KEY!);

export async function POST(request: NextRequest) {
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
    const slug = session.metadata?.slug;
    const title = session.metadata?.title;
    const amountTotal = session.amount_total ?? 0;

    if (email && slug && title) {
      const course = getCourse(slug);
      await resend.emails.send({
        from: "CanaDent Education <onboarding@resend.dev>",
        to: email,
        subject: `Registration Confirmed — ${title}`,
        html: buildEmail(name, title, amountTotal, course),
      });
    }
  }

  return NextResponse.json({ received: true });
}

function buildEmail(
  name: string | null | undefined,
  title: string,
  amountTotal: number,
  course: Course | undefined
): string {
  const greeting = name ? `Dear ${name.split(" ")[0]},` : "Dear Participant,";
  const amountPaid = amountTotal === 0 ? "Complimentary" : `$${(amountTotal / 100).toFixed(2)} CAD`;

  const details = course
    ? `
      <tr><td style="padding:10px 0;border-bottom:1px solid #f0ebe0;color:#555;font-size:14px;">📅 Date</td><td style="padding:10px 0;border-bottom:1px solid #f0ebe0;font-weight:600;color:#0f2150;font-size:14px;">${course.date}</td></tr>
      ${course.time ? `<tr><td style="padding:10px 0;border-bottom:1px solid #f0ebe0;color:#555;font-size:14px;">🕘 Time</td><td style="padding:10px 0;border-bottom:1px solid #f0ebe0;font-weight:600;color:#0f2150;font-size:14px;">${course.time}</td></tr>` : ""}
      <tr><td style="padding:10px 0;border-bottom:1px solid #f0ebe0;color:#555;font-size:14px;">📍 Location</td><td style="padding:10px 0;border-bottom:1px solid #f0ebe0;font-weight:600;color:#0f2150;font-size:14px;">${course.location}</td></tr>
      <tr><td style="padding:10px 0;border-bottom:1px solid #f0ebe0;color:#555;font-size:14px;">👨‍⚕️ Instructor</td><td style="padding:10px 0;border-bottom:1px solid #f0ebe0;font-weight:600;color:#0f2150;font-size:14px;">${course.instructor}</td></tr>
      ${course.ceCredits ? `<tr><td style="padding:10px 0;border-bottom:1px solid #f0ebe0;color:#555;font-size:14px;">🎓 CE Credits</td><td style="padding:10px 0;border-bottom:1px solid #f0ebe0;font-weight:600;color:#0f2150;font-size:14px;">${course.ceCredits}</td></tr>` : ""}
      <tr><td style="padding:10px 0;color:#555;font-size:14px;">💳 Amount Paid</td><td style="padding:10px 0;font-weight:600;color:#0f2150;font-size:14px;">${amountPaid}</td></tr>
    `
    : `<tr><td style="padding:10px 0;color:#555;font-size:14px;">💳 Amount Paid</td><td style="padding:10px 0;font-weight:600;color:#0f2150;font-size:14px;">${amountPaid}</td></tr>`;

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

            <!-- What to expect -->
            <div style="background:#f0f4ff;border-radius:12px;padding:20px 24px;margin-bottom:28px;">
              <div style="font-size:13px;font-weight:700;color:#1b3a8a;text-transform:uppercase;letter-spacing:1.5px;margin-bottom:12px;">What to Expect</div>
              <ul style="margin:0;padding-left:18px;color:#1a1a2e;font-size:14px;line-height:1.8;">
                <li>Please arrive <strong>15 minutes early</strong> for registration and setup</li>
                <li>Bring a valid photo ID and your dental registration number</li>
                <li>Lunch and refreshments will be provided</li>
                <li>CE certificates will be distributed on the day of the course</li>
              </ul>
            </div>

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
