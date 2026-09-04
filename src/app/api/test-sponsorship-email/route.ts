// TEMPORARY test route — sends a sample of the sponsorship confirmation email
// to the CanaDent team so the copy/branding can be reviewed without a real
// purchase. Recipients are fixed (no arbitrary "to"), and a key is required.
// REMOVE this file after the test.
import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { buildSponsorshipEmail } from "@/lib/sponsorship-email";

export const dynamic = "force-dynamic";

const RECIPIENTS = [
  "ar.movasagh@confidentist.ca",
  "mahshid.aghania@gmail.com",
  "canadent.edu@gmail.com",
];
const TITLE =
  "CANADENT Sponsorship — Advanced Adhesive Dentistry: The Master Blueprint";
const KEY = "cd-spon-test-9f3a7c";

export async function GET(request: NextRequest) {
  if (request.nextUrl.searchParams.get("key") !== KEY) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "RESEND_API_KEY not set on this environment" }, { status: 500 });
  }

  const resend = new Resend(apiKey);
  const { data, error } = await resend.emails.send({
    from: "CanaDent Education <noreply@canadent.net>",
    to: RECIPIENTS,
    subject: `Sponsorship Confirmed — ${TITLE} (TEST)`,
    // Sample values mirroring a real $500 tax-inclusive purchase.
    html: buildSponsorshipEmail("Test", TITLE, 50000, 5752, {
      phone: "+14379622020",
      regNumber: "TEST12345678",
    }),
  });

  if (error) {
    return NextResponse.json({ error }, { status: 500 });
  }
  return NextResponse.json({ ok: true, id: data?.id, to: RECIPIENTS });
}
