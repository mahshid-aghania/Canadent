import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { getCourse } from "@/lib/courses";
import { validateRequest, type CourseRequestInput } from "@/lib/course-requests";
import { store } from "@/lib/course-requests-store";

export const dynamic = "force-dynamic";

// Admins notified of new interest. Mirrors the Stripe webhook recipients.
const ADMIN_RECIPIENTS = [
  "ar.movasagh@confidentist.ca",
  "mahshid.aghania@gmail.com",
  "canadent.edu@gmail.com",
];

export async function POST(request: NextRequest) {
  let body: Partial<CourseRequestInput>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  // Server is the source of truth: validate, then confirm every slug exists.
  const { errors, value } = validateRequest(body);
  const unknown = value.slugs.filter((s) => !getCourse(s));
  if (unknown.length > 0) {
    errors.slugs = "One or more selected courses could not be found.";
  }
  if (Object.keys(errors).length > 0) {
    return NextResponse.json(
      { error: "Please check the highlighted fields.", fieldErrors: errors },
      { status: 400 }
    );
  }

  const titleFor = (slug: string) => getCourse(slug)?.title ?? slug;

  let outcomes;
  try {
    outcomes = await store.save(value, titleFor);
  } catch (err) {
    console.error("[course-requests] store.save failed:", err);
    return NextResponse.json(
      { error: "We couldn't save your request. Please try again." },
      { status: 500 }
    );
  }

  const anyUpdated = outcomes.some((o) => o.status === "updated");

  // Emails are best-effort — a delivery hiccup must never fail the request.
  await sendEmails(value, outcomes).catch((err) =>
    console.error("[course-requests] email error:", err)
  );

  return NextResponse.json({
    ok: true,
    anyUpdated,
    results: outcomes.map((o) => ({
      slug: o.slug,
      title: o.courseTitle,
      status: o.status,
    })),
  });
}

async function sendEmails(
  value: CourseRequestInput,
  outcomes: { slug: string; courseTitle: string; status: "created" | "updated" }[]
) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.warn(
      "[course-requests] RESEND_API_KEY not set — skipping confirmation email."
    );
    return;
  }
  const resend = new Resend(apiKey);
  const titles = outcomes.map((o) => o.courseTitle);

  await resend.emails.send({
    from: "CanaDent Education <noreply@canadent.net>",
    to: value.email,
    subject:
      titles.length === 1
        ? `We've noted your interest — ${titles[0]}`
        : `We've noted your interest in ${titles.length} CanaDent courses`,
    html: buildUserEmail(value.name, titles),
  });

  await resend.emails.send({
    from: "CanaDent Education <noreply@canadent.net>",
    to: ADMIN_RECIPIENTS,
    subject: `New course-again request (${titles.length}) — ${value.email}`,
    html: buildAdminEmail(value, outcomes),
  });
}

// ── Email templates (match the confirmation-email visual identity) ───────────

function firstNameGreeting(name: string): string {
  const parts = name.trim().split(" ");
  const last = parts.length > 1 ? parts[parts.length - 1] : parts[0];
  return last ? `Dear Dr. ${last},` : "Dear Doctor,";
}

function shell(inner: string): string {
  return `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f5f0e8;font-family:Inter,Arial,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#f5f0e8;padding:32px 16px;"><tr><td align="center">
<table width="560" cellpadding="0" cellspacing="0" style="max-width:560px;width:100%;">
<tr><td style="background:linear-gradient(135deg,#0f2150,#1b3a8a);border-radius:16px 16px 0 0;padding:36px 40px;text-align:center;">
<div style="font-family:Georgia,serif;font-size:26px;font-weight:700;color:#c9a84c;letter-spacing:1px;">CanaDent</div>
<div style="font-size:12px;color:rgba(255,255,255,0.55);letter-spacing:3px;text-transform:uppercase;margin-top:4px;">Education Center</div>
</td></tr>
${inner}
<tr><td style="background:#0f2150;border-radius:0 0 16px 16px;padding:24px 40px;text-align:center;">
<p style="margin:0 0 6px;font-size:12px;color:rgba(255,255,255,0.45);">CanaDent Education Center</p>
<p style="margin:0;font-size:12px;color:rgba(255,255,255,0.35);">265 Rimrock Rd, North York, ON · <a href="https://www.canadent.net" style="color:#c9a84c;text-decoration:none;">canadent.net</a></p>
</td></tr>
</table></td></tr></table></body></html>`;
}

function buildUserEmail(name: string, titles: string[]): string {
  const list = titles
    .map(
      (t) =>
        `<li style="margin-bottom:8px;color:#0f2150;font-weight:600;font-size:14px;">${t}</li>`
    )
    .join("");
  return shell(`
<tr><td style="background:#c9a84c;padding:20px 40px;text-align:center;">
<div style="font-size:22px;font-weight:700;color:#0f2150;font-family:Georgia,serif;">You're on the interest list</div>
<div style="font-size:13px;color:#0f2150;opacity:0.75;margin-top:4px;">Thank you for letting us know</div>
</td></tr>
<tr><td style="background:#ffffff;padding:36px 40px;">
<p style="margin:0 0 16px;font-size:15px;color:#1a1a2e;">${firstNameGreeting(name)}</p>
<p style="margin:0 0 20px;font-size:15px;color:#1a1a2e;line-height:1.6;">
Thank you for your interest. We&rsquo;ve recorded your request for the ${titles.length > 1 ? "courses" : "course"} below.
If CanaDent announces a new date, you&rsquo;ll be among the first to know.</p>
<div style="background:#f9f7f2;border-radius:12px;padding:20px 24px;border-left:4px solid #c9a84c;margin-bottom:24px;">
<div style="font-size:13px;font-weight:700;color:#c9a84c;text-transform:uppercase;letter-spacing:1.5px;margin-bottom:12px;">Courses Requested</div>
<ul style="margin:0;padding-left:18px;">${list}</ul></div>
<p style="margin:0 0 20px;font-size:13px;color:#777;line-height:1.6;">
Submitting a request is free and does not guarantee that a course will be scheduled. We&rsquo;ll only contact you about future dates for the ${titles.length > 1 ? "courses" : "course"} above.</p>
<p style="margin:0;font-size:14px;color:#1a1a2e;">Warm regards,<br><strong style="color:#0f2150;">The CanaDent Team</strong></p>
</td></tr>`);
}

function buildAdminEmail(
  value: CourseRequestInput,
  outcomes: { courseTitle: string; status: "created" | "updated" }[]
): string {
  const rowLabel = "padding:8px 0;border-bottom:1px solid #f0ebe0;color:#555;font-size:13px;width:140px;";
  const rowValue = "padding:8px 0;border-bottom:1px solid #f0ebe0;font-weight:600;color:#0f2150;font-size:13px;";
  const courseList = outcomes
    .map(
      (o) =>
        `<li style="margin-bottom:6px;color:#0f2150;font-size:13px;">${o.courseTitle} <span style="color:#a87219;font-weight:600;">(${o.status})</span></li>`
    )
    .join("");
  return shell(`
<tr><td style="background:#ffffff;padding:32px 40px;">
<div style="font-size:18px;font-weight:700;color:#0f2150;font-family:Georgia,serif;margin-bottom:16px;">New Course-Again Request</div>
<table width="100%" cellpadding="0" cellspacing="0">
<tr><td style="${rowLabel}">Name</td><td style="${rowValue}">${value.name}</td></tr>
<tr><td style="${rowLabel}">Email</td><td style="${rowValue}">${value.email}</td></tr>
<tr><td style="${rowLabel}">Phone</td><td style="${rowValue}">${value.phone}</td></tr>
<tr><td style="${rowLabel}">Role</td><td style="${rowValue}">${value.role}</td></tr>
<tr><td style="${rowLabel}">Attendance</td><td style="${rowValue}">${value.attendance ?? "—"}</td></tr>
<tr><td style="${rowLabel}">Timing</td><td style="${rowValue}">${value.timing ?? "—"}</td></tr>
<tr><td style="${rowLabel}">Message</td><td style="${rowValue}">${value.message ? escapeHtml(value.message) : "—"}</td></tr>
</table>
<div style="margin-top:20px;font-size:13px;font-weight:700;color:#c9a84c;text-transform:uppercase;letter-spacing:1.5px;margin-bottom:8px;">Courses</div>
<ul style="margin:0;padding-left:18px;">${courseList}</ul>
</td></tr>`);
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
