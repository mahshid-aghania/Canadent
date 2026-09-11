import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase/admin";
import { getCurrentStaff } from "@/lib/accounting/auth";
import { listRegistrations } from "@/lib/accounting/queries";
import { parseFilters } from "@/lib/accounting/filters";
import { attendanceLabel, VERIFICATION_LABELS, INVOICE_STATUS_LABELS } from "@/lib/accounting/labels";
import { logAudit } from "@/lib/accounting/audit";

export const dynamic = "force-dynamic";

function csvCell(v: unknown): string {
  const s = v == null ? "" : String(v);
  return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}

// Exports the CURRENTLY FILTERED students list as CSV. Amounts are exact and
// labelled; imported fees are clearly distinct from any collected payment.
export async function GET(request: NextRequest) {
  const staff = await getCurrentStaff();
  if (!staff) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const admin = getSupabaseAdmin();
  if (!admin) return NextResponse.json({ error: "Connection required" }, { status: 503 });

  const sp = Object.fromEntries(request.nextUrl.searchParams.entries());
  const filters = { ...parseFilters(sp), page: 1, pageSize: 100000 };
  const { rows } = await listRegistrations(admin, filters);

  const header = [
    "Student", "Organization", "Email", "Course", "Attendance format",
    "Imported course fee", "Currency", "Original imported status",
    "Payment verification", "Invoice status", "Invoice count",
    "Receipt count", "Outstanding balance",
  ];
  const lines = [header.map(csvCell).join(",")];
  for (const r of rows) {
    lines.push([
      r.name,
      r.organization ?? "",
      r.email ?? "(missing)",
      r.courseTitle,
      attendanceLabel(r.attendance),
      r.importedFeeCents == null ? "" : (r.importedFeeCents / 100).toFixed(2),
      r.currency.toUpperCase(),
      r.originalStatus ?? "",
      VERIFICATION_LABELS[r.verification] ?? r.verification,
      r.invoiceCount === 0 ? "None" : INVOICE_STATUS_LABELS[r.invoiceStatus ?? ""] ?? r.invoiceStatus ?? "",
      String(r.invoiceCount),
      String(r.receiptCount),
      r.outstandingCents == null ? "Not invoiced" : (r.outstandingCents / 100).toFixed(2),
    ].map(csvCell).join(","));
  }

  await logAudit(admin, {
    actorId: staff.id, actorEmail: staff.email, action: "export.students",
    meta: { count: rows.length, filters: sp },
  });

  const stamp = new Date().toISOString().slice(0, 10);
  return new NextResponse(lines.join("\n"), {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="canadent-students-${stamp}.csv"`,
      "Cache-Control": "no-store",
    },
  });
}
