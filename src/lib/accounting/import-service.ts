import "server-only";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { ParsedRegistrant, ParseResult } from "./import-parser";
import { logAudit } from "./audit";

// ── Import preview + commit ──────────────────────────────────────────────────
// Turns parsed spreadsheet rows into a reviewable plan, then commits it safely:
//   • Idempotent by SOURCE IDENTITY (file + sheet + row). Re-importing the same
//     spreadsheet changes nothing (rows already present are "unchanged").
//   • Students are matched by normalised email. A name-only collision is never
//     auto-merged — it is flagged "review".
//   • A fee is not payment: every new registration is created "unverified".

export type ImportCourse = {
  slug: string | null;
  title: string;
  date: string | null;
  delivery: string | null;
};

export type PreviewAction = "create" | "link" | "update" | "unchanged" | "review";

export type PreviewItem = {
  sourceRow: number;
  registrant: ParsedRegistrant;
  action: PreviewAction;
  /** Existing student matched by email, if any. */
  matchedStudentId: string | null;
  /** Human notes: why it's a review, what will change, etc. */
  notes: string[];
};

export type ImportPreview = {
  course: ImportCourse;
  sheet: string;
  items: PreviewItem[];
  counts: Record<PreviewAction, number>;
  inFileDuplicates: ParseResult["inFileDuplicates"];
  parseErrors: string[];
};

function emailKey(email: string | null): string | null {
  return email ? email.trim().toLowerCase() : null;
}

/**
 * Build a dry-run preview against the current database. Performs no writes.
 */
export async function buildImportPreview(
  admin: SupabaseClient,
  parse: ParseResult,
  course: ImportCourse,
  sourceFile: string,
): Promise<ImportPreview> {
  const emails = parse.registrants.map((r) => emailKey(r.email)).filter((e): e is string => Boolean(e));

  // Existing students by email (for linking / duplicate detection).
  const studentsByEmail = new Map<string, { id: string; full_name: string }>();
  if (emails.length) {
    const { data } = await admin
      .from("acct_students")
      .select("id, full_name, email_normalized")
      .in("email_normalized", emails);
    for (const s of data ?? []) {
      if (s.email_normalized) studentsByEmail.set(s.email_normalized, { id: s.id, full_name: s.full_name });
    }
  }

  // Registrations already imported from THIS source file+sheet (idempotency).
  const { data: existingSource } = await admin
    .from("acct_registrations")
    .select("source_row, imported_fee_cents, original_import_status, course_title")
    .eq("source_file", sourceFile)
    .eq("source_sheet", parse.sheet);
  const existingBySourceRow = new Map<number, { fee: number | null; status: string | null }>();
  for (const r of existingSource ?? []) {
    existingBySourceRow.set(r.source_row as number, {
      fee: r.imported_fee_cents as number | null,
      status: r.original_import_status as string | null,
    });
  }

  // Existing registrations for matched students in THIS course (cross-source
  // duplicate signal).
  const studentIds = [...studentsByEmail.values()].map((s) => s.id);
  const courseRegByStudent = new Set<string>();
  if (studentIds.length && course.slug) {
    const { data } = await admin
      .from("acct_registrations")
      .select("student_id")
      .eq("course_slug", course.slug)
      .in("student_id", studentIds);
    for (const r of data ?? []) courseRegByStudent.add(r.student_id as string);
  }

  const items: PreviewItem[] = parse.registrants.map((r) => {
    const notes: string[] = [];
    if (r.issues.includes("missing_email")) notes.push("No email — flagged; cannot de-duplicate by email.");
    if (r.issues.includes("missing_fee")) notes.push("No course fee in source.");
    if (r.issues.includes("attendance_ambiguous")) notes.push("Both attendance columns marked — left as Not specified for review.");

    const priorSource = existingBySourceRow.get(r.sourceRow);
    if (priorSource) {
      const changed =
        priorSource.fee !== r.feeCents || priorSource.status !== r.originalStatus;
      return {
        sourceRow: r.sourceRow,
        registrant: r,
        action: changed ? "update" : "unchanged",
        matchedStudentId: null,
        notes: changed
          ? [...notes, "Already imported from this row — values differ; will update."]
          : [...notes, "Already imported from this row — no change."],
      };
    }

    const key = emailKey(r.email);
    const matched = key ? studentsByEmail.get(key) : undefined;

    if (matched) {
      const dupCourse = courseRegByStudent.has(matched.id);
      if (dupCourse) {
        return {
          sourceRow: r.sourceRow,
          registrant: r,
          action: "review",
          matchedStudentId: matched.id,
          notes: [...notes, `${matched.full_name} is already registered for this course from another source — review before importing.`],
        };
      }
      return {
        sourceRow: r.sourceRow,
        registrant: r,
        action: "link",
        matchedStudentId: matched.id,
        notes: [...notes, `Links to existing student ${matched.full_name} (matched by email).`],
      };
    }

    // No email match. If there's no email at all, we cannot safely dedup — still
    // create, but surface the caveat (handled in notes above). Never name-merge.
    return {
      sourceRow: r.sourceRow,
      registrant: r,
      action: "create",
      matchedStudentId: null,
      notes: [...notes, "New student + registration."],
    };
  });

  const counts: Record<PreviewAction, number> = {
    create: 0, link: 0, update: 0, unchanged: 0, review: 0,
  };
  for (const it of items) counts[it.action]++;

  return {
    course,
    sheet: parse.sheet,
    items,
    counts,
    inFileDuplicates: parse.inFileDuplicates,
    parseErrors: parse.errors,
  };
}

export type CommitResult = {
  importId: string | null;
  created: number;
  linked: number;
  updated: number;
  skipped: number;
  errors: { sourceRow: number; message: string }[];
};

/**
 * Commit a preview. Applies create/link/update; skips unchanged and (by default)
 * review items unless their source row is listed in `includeReviewRows`.
 * Re-running with the same file is safe: source identity prevents duplicates.
 */
export async function commitImport(
  admin: SupabaseClient,
  preview: ImportPreview,
  sourceFile: string,
  actor: { id: string; email: string },
  includeReviewRows: number[] = [],
): Promise<CommitResult> {
  const result: CommitResult = { importId: null, created: 0, linked: 0, updated: 0, skipped: 0, errors: [] };
  const include = new Set(includeReviewRows);

  const { data: imp, error: impErr } = await admin
    .from("acct_imports")
    .insert({
      filename: sourceFile,
      sheet: preview.sheet,
      course_slug: preview.course.slug,
      course_title: preview.course.title,
      imported_by: actor.id,
      row_count: preview.items.length,
      summary: preview.counts,
    })
    .select("id")
    .single();
  if (impErr || !imp) {
    result.errors.push({ sourceRow: 0, message: `Could not create import record: ${impErr?.message ?? "unknown"}` });
    return result;
  }
  result.importId = imp.id;

  for (const item of preview.items) {
    const r = item.registrant;
    try {
      if (item.action === "unchanged") { result.skipped++; continue; }
      if (item.action === "review" && !include.has(r.sourceRow)) { result.skipped++; continue; }

      // Resolve the student id (existing by email, or create).
      let studentId = item.matchedStudentId;
      if (!studentId) {
        const key = r.email ? r.email.trim().toLowerCase() : null;
        if (key) {
          const { data: existing } = await admin
            .from("acct_students").select("id").eq("email_normalized", key).maybeSingle();
          studentId = existing?.id ?? null;
        }
        if (!studentId) {
          const { data: created, error } = await admin
            .from("acct_students")
            .insert({
              full_name: r.name ?? "(unknown)",
              organization: r.organization,
              email: r.email,
              flags: r.issues.includes("missing_email") ? { missing_email: true } : {},
            })
            .select("id").single();
          if (error || !created) throw new Error(error?.message ?? "student insert failed");
          studentId = created.id;
        }
      }

      // Upsert the registration by source identity (idempotent).
      const registrationRow = {
        student_id: studentId,
        course_slug: preview.course.slug,
        course_title: preview.course.title,
        course_date: preview.course.date,
        delivery: preview.course.delivery,
        attendance_format: r.attendance === "not_specified" ? null : r.attendance,
        imported_fee_cents: r.feeCents,
        currency: "cad",
        original_import_status: r.originalStatus,
        // Never auto-promote an imported status to paid/verified.
        payment_verification: "unverified",
        import_id: result.importId,
        source_file: sourceFile,
        source_sheet: preview.sheet,
        source_row: r.sourceRow,
        updated_at: new Date().toISOString(),
      };
      const { error: upErr } = await admin
        .from("acct_registrations")
        .upsert(registrationRow, { onConflict: "source_file,source_sheet,source_row" });
      if (upErr) throw new Error(upErr.message);

      if (item.action === "update") result.updated++;
      else if (item.action === "link") result.linked++;
      else result.created++;
    } catch (err) {
      result.errors.push({ sourceRow: r.sourceRow, message: err instanceof Error ? err.message : String(err) });
    }
  }

  await admin.from("acct_imports").update({
    created_count: result.created,
    updated_count: result.updated,
    skipped_count: result.skipped,
  }).eq("id", result.importId);

  await logAudit(admin, {
    actorId: actor.id,
    actorEmail: actor.email,
    action: "import.commit",
    entity: "acct_imports",
    entityId: result.importId,
    meta: { file: sourceFile, sheet: preview.sheet, ...result, errors: result.errors.length },
  });

  return result;
}
