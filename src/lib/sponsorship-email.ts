// Confirmation email for a sponsorship purchase. Same branding and recipients
// as a course registration, but with sponsorship-appropriate copy and a
// tax-INCLUSIVE price breakdown ($500 total = net + HST, not net + HST on top).
// Extracted from the Stripe webhook so it can be reused (e.g. by a test route).
import { TAX_LABEL, TAX_PERCENTAGE } from "@/lib/tax";

function maskLast4(phone: string | null): string | null {
  if (!phone) return null;
  const digits = phone.replace(/\D/g, "");
  return digits.length >= 4 ? digits.slice(-4) : null;
}

export function buildSponsorshipEmail(
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
              <div style="font-size:13px;font-weight:700;color:#1b3a8a;text-transform:uppercase;letter-spacing:1.5px;margin-bottom:12px;">What happens next:</div>
              <p style="margin:0 0 12px;color:#1a1a2e;font-size:14px;line-height:1.7;">Our Course Manager will coordinate with you regarding the event details and arrangements.</p>
              <p style="margin:0;color:#1a1a2e;font-size:14px;line-height:1.7;">If you have any questions in the meantime, please feel free to reply to this email.</p>
            </div>

            ${phoneNote}

            <p style="margin:0 0 24px;font-size:14px;color:#555;">For any urgent matters, you can reach us at <a href="tel:4379622020" style="color:#1b3a8a;text-decoration:none;">437-962-2020</a>.</p>

            <p style="margin:0;font-size:14px;color:#1a1a2e;">Best regards,<br><strong style="color:#0f2150;">CANADENT Team</strong></p>
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
