import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

export const dynamic = "force-dynamic";

// TEMPORARY diagnostic route — verifies Resend delivery in production.
// Guarded by a token so it can't be abused while it exists. Remove after use.
const TEST_TOKEN = "cd-mail-check-9f3a2";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  if (searchParams.get("token") !== TEST_TOKEN) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const to = searchParams.get("to");
  if (!to || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(to)) {
    return NextResponse.json({ error: "Provide a valid ?to= address." }, { status: 400 });
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "RESEND_API_KEY not set" }, { status: 500 });
  }

  const resend = new Resend(apiKey);
  const { data, error } = await resend.emails.send({
    from: "CanaDent Education <noreply@canadent.net>",
    to,
    subject: "CanaDent email test ✅",
    html: `<div style="font-family:sans-serif;color:#0f2150">
      <h2>CanaDent email delivery works</h2>
      <p>This is a diagnostic message confirming that Resend is configured
      correctly on the production environment.</p>
      <p style="color:#555;font-size:13px">Sent from noreply@canadent.net via Resend.</p>
    </div>`,
  });

  if (error) {
    return NextResponse.json({ ok: false, error }, { status: 502 });
  }
  return NextResponse.json({ ok: true, id: data?.id });
}
