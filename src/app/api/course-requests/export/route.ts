import { NextRequest, NextResponse } from "next/server";
import { store } from "@/lib/course-requests-store";

export const dynamic = "force-dynamic";

/**
 * CSV export of the interest list for admins.
 * If ADMIN_DASHBOARD_TOKEN is set, a matching `?token=` is required; otherwise
 * (e.g. local development) the export is open. Add real auth before production.
 */
export async function GET(request: NextRequest) {
  const token = process.env.ADMIN_DASHBOARD_TOKEN;
  if (token) {
    const provided = request.nextUrl.searchParams.get("token");
    if (provided !== token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  }

  const records = await store.all();
  const headers = [
    "Submitted",
    "Updated",
    "Course",
    "Slug",
    "Name",
    "Email",
    "Phone",
    "Role",
    "Attendance",
    "Timing",
    "Message",
    "Consent",
  ];

  const rows = records.map((r) =>
    [
      r.createdAt,
      r.updatedAt,
      r.courseTitle,
      r.slug,
      r.name,
      r.email,
      r.phone,
      r.role,
      r.attendance ?? "",
      r.timing ?? "",
      r.message ?? "",
      r.consent ? "yes" : "no",
    ]
      .map(csvCell)
      .join(",")
  );

  const csv = [headers.map(csvCell).join(","), ...rows].join("\r\n");
  const stamp = new Date().toISOString().slice(0, 10);

  return new NextResponse(csv, {
    status: 200,
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="canadent-interest-list-${stamp}.csv"`,
    },
  });
}

// Quote per RFC 4180; guard against CSV-injection in spreadsheet apps.
function csvCell(value: string): string {
  let v = value ?? "";
  if (/^[=+\-@]/.test(v)) v = `'${v}`;
  if (/[",\r\n]/.test(v)) v = `"${v.replace(/"/g, '""')}"`;
  return v;
}
