import { NextResponse, type NextRequest } from "next/server";
import { isAdminAuthed } from "@/lib/admin-auth";
import { parseRegistrationFilters } from "@/lib/registrations";
import { loadRegistrations } from "@/lib/registrations-source";

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

export async function GET(request: NextRequest) {
  if (!(await isAdminAuthed())) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const filters = parseRegistrationFilters(
    Object.fromEntries(new URL(request.url).searchParams)
  );

  const { rows, source, error } = await loadRegistrations(filters, 5000);

  if (source === "none") {
    return new NextResponse("Datastore not provisioned", { status: 503 });
  }
  if (error) {
    return new NextResponse(`Export failed: ${error}`, { status: 500 });
  }
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
