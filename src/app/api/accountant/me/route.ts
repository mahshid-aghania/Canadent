import { NextResponse } from "next/server";
import { getCurrentStaff } from "@/lib/accounting/auth";

export const dynamic = "force-dynamic";

// Tiny endpoint used by the site header to decide whether to show the
// "Accountant Dashboard" link. Returns staff status only — no PII, no records.
export async function GET() {
  const staff = await getCurrentStaff();
  return NextResponse.json(
    { staff: Boolean(staff), role: staff?.role ?? null },
    { headers: { "Cache-Control": "no-store" } },
  );
}
