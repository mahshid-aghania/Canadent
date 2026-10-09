// One-off: re-send Katayoon Shojaei's registration confirmation email.
// Reproduces the exact template + recipients from
// src/app/api/webhooks/stripe/route.ts (buildEmail) so the email is identical
// to what the webhook should have sent on checkout.session.completed.
//
// Usage:
//   RESEND_API_KEY=re_xxx node scripts/resend-confirmation.mjs
//   (add DRY_RUN=1 to print the HTML/recipients without sending)

const TAX_LABEL = "HST";
const TAX_PERCENTAGE = 13;

// ── Her registration (pulled live from Stripe) ────────────────────────────
const reg = {
  email: "katayoon.shojaei@gmail.com",
  name: "katayoon shojeai",
  phone: "+16477089176",
  title: "Daily and Unique Orthodontic Techniques for Prosthodontics",
  attendance: "Online Attendance",
  amountTotal: 45087,   // cents
  amountSubtotal: 39900, // cents
  amountTax: 5187,       // cents
  paymentIntent: "pi_3UH4gRHLT2kr8NXW04WVBbgY",
};

// ── Her course (from src/lib/courses.ts) ──────────────────────────────────
const course = {
  title: "Daily and Unique Orthodontic Techniques for Prosthodontics",
  instructor: "Dr. John C. Voudouris, DDS, D.Ortho, MSc.(D)",
  date: "Sunday, September 27, 2026",
  time: "9:00 AM – 4:00 PM",
  location: "Hybrid — Online + In-Person (265 Rimrock Rd, North York, ON)",
  ceCredits: "6 CE Credits (PACE Approved)",
  attendanceModes: [
    { kind: "online" },
    { kind: "in-person", location: "265 Rimrock Road, North York, Ontario" },
  ],
  // no `calendar` field on this course → no "Add to Calendar" button (matches prod)
};

const regNumber = reg.paymentIntent.toUpperCase().replace(/^PI_/, "").slice(-12);

// ── Verbatim helpers from route.ts ────────────────────────────────────────
function maskLast4(phone) {
  if (!phone) return null;
  const digits = phone.replace(/\D/g, "");
  return digits.length >= 4 ? digits.slice(-4) : null;
}

function compactUtc(iso) {
  return iso.replace(/[-:]/g, "").replace(/\.\d+/, "");
}

function calendarUrl(course) {
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

function buildEmail(name, title, amountTotal, course, amountSubtotal = 0, amountTax = 0, extra = {}) {
  const { attendance = null, phone = null, regNumber } = extra;
  const isOnline = (attendance ?? "").toLowerCase().includes("online");
  const last4 = maskLast4(phone);
  const calLink = calendarUrl(course);
  const nameParts = name ? name.trim().split(" ") : [];
  const lastName = nameParts.length > 1 ? nameParts[nameParts.length - 1] : nameParts[0];
  const greeting = lastName ? `Dear Dr. ${lastName},` : "Dear Doctor,";
  const amountPaid = amountTotal === 0 ? "Complimentary" : `$${(amountTotal / 100).toFixed(2)} CAD`;

  const rowLabel = "padding:10px 0;border-bottom:1px solid #f0ebe0;color:#555;font-size:14px;";
  const rowValue = "padding:10px 0;border-bottom:1px solid #f0ebe0;font-weight:600;color:#0f2150;font-size:14px;";

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

// ── Send (or dry-run) ─────────────────────────────────────────────────────
const html = buildEmail(reg.name, reg.title, reg.amountTotal, course, reg.amountSubtotal, reg.amountTax, {
  attendance: reg.attendance,
  phone: reg.phone,
  regNumber,
});

const payload = {
  from: "CanaDent Education <noreply@canadent.net>",
  to: reg.email,
  cc: ["ar.movasagh@confidentist.ca", "mahshid.aghania@gmail.com", "canadent.edu@gmail.com"],
  subject: `Registration Confirmed — ${reg.title}`,
  html,
};

console.log("To:      ", payload.to);
console.log("Cc:      ", payload.cc.join(", "));
console.log("Subject: ", payload.subject);
console.log("Reg #:   ", regNumber);

if (process.env.DRY_RUN) {
  console.log("\n[DRY_RUN] Not sending. HTML length:", html.length);
  process.exit(0);
}

// Prefer an explicit env var; otherwise fall back to RESEND_API_KEY in .env.local.
import { readFileSync } from "node:fs";
function keyFromEnvLocal() {
  try {
    const txt = readFileSync(new URL("../.env.local", import.meta.url), "utf8");
    const m = txt.match(/^\s*RESEND_API_KEY\s*=\s*"?([^"\r\n]+)"?/m);
    return m && m[1].trim() ? m[1].trim() : null;
  } catch {
    return null;
  }
}
const key = process.env.RESEND_API_KEY || keyFromEnvLocal();
if (!key) {
  console.error("\nERROR: RESEND_API_KEY not found.\n  Option A: RESEND_API_KEY=re_xxx node scripts/resend-confirmation.mjs\n  Option B: add a line  RESEND_API_KEY=re_xxx  to .env.local, then re-run.");
  process.exit(1);
}

const res = await fetch("https://api.resend.com/emails", {
  method: "POST",
  headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
  body: JSON.stringify(payload),
});
const out = await res.json();
if (!res.ok) {
  console.error("\nResend error:", res.status, out);
  process.exit(1);
}
console.log("\n✅ Sent. Resend id:", out.id);
