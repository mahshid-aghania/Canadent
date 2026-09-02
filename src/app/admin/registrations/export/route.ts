import { NextResponse } from "next/server";
import { isAdminAuthed } from "@/lib/admin-auth";
import { getSupabaseAdmin } from "@/lib/supabase/admin";

export const dynamic = "force-dynamic";

const COLUMNS = [
  "created_at",
  "course_slug",
  "course_title",
  "attendance",
  "student_name",
  "student_email",
  "student_phone",
  "amount_total_cents",
  "currency",
  "stripe_session_id",
  "stripe_payment_intent",
  "marketing_consent",
  "marketing_consent_at",
  "utm_source",
  "utm_medium",
  "utm_campaign",
] as const;

function csvCell(value: unknown): string {
  if (value == null) return "";
  const s = String(value);
  // Quote if it contains a comma, quote, or newline; escape embedded quotes.
  // Guard against CSV/formula injection in spreadsheet apps.
  const safe = /^[=+\-@]/.test(s) ? `'${s}` : s;
  return /[",\n]/.test(safe) ? `"${safe.replace(/"/g, '""')}"` : safe;
}

export async function GET() {
  if (!(await isAdminAuthed())) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const supabase = getSupabaseAdmin();
  if (!supabase) {
    return new NextResponse("Datastore not provisioned", { status: 503 });
  }

  const { data, error } = await supabase
    .from("registrations")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(5000);

  if (error) {
    return new NextResponse(`Export failed: ${error.message}`, { status: 500 });
  }

  const rows = data ?? [];
  const lines = [COLUMNS.join(",")];
  for (const r of rows) {
    const utm = (r.utm ?? {}) as Record<string, string>;
    const record: Record<string, unknown> = { ...r, ...utm };
    lines.push(COLUMNS.map((c) => csvCell(record[c])).join(","));
  }

  const filename = `canadent-registrations-${new Date().toISOString().slice(0, 10)}.csv`;
  return new NextResponse(lines.join("\r\n"), {
    status: 200,
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="${filename}"`,
      "Cache-Control": "no-store",
    },
  });
}
