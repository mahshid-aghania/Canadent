import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase/admin";
import { getCurrentStaff } from "@/lib/accounting/auth";
import { logAudit } from "@/lib/accounting/audit";

export const dynamic = "force-dynamic";

// Secure document access. Every request is authorised server-side (staff only);
// the file itself lives in a PRIVATE bucket and is never publicly reachable. We
// mint a short-lived signed URL (60s) and redirect to it, and log the access.
// Guessing or tampering with the id gets you nothing without a valid session.
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const staff = await getCurrentStaff();
  if (!staff) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const admin = getSupabaseAdmin();
  if (!admin) return NextResponse.json({ error: "Connection required" }, { status: 503 });

  const { id } = await params;
  const { data: doc } = await admin
    .from("acct_documents")
    .select("id, storage_path, filename, student_id")
    .eq("id", id)
    .maybeSingle();
  if (!doc) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const { data: signed, error } = await admin.storage
    .from("accounting")
    .createSignedUrl(doc.storage_path, 60, { download: doc.filename ?? undefined });
  if (error || !signed) return NextResponse.json({ error: "Could not generate a download link." }, { status: 500 });

  await logAudit(admin, {
    actorId: staff.id, actorEmail: staff.email, action: "document.download",
    entity: "acct_documents", entityId: doc.id, meta: { studentId: doc.student_id },
  });

  return NextResponse.redirect(signed.signedUrl);
}
