import "server-only";
import * as XLSX from "xlsx";
import { parseMoneyToCents } from "./money";

// ── Registrants spreadsheet parser ───────────────────────────────────────────
// Extracts ONLY the participant table from a CanaDent registrants worksheet —
// never the title rows above it or the summary rows below. It preserves source
// values verbatim (names, organizations, emails, fees, status text), keeps blank
// fields as unknown (null), and never infers attendance format. Each row keeps
// its 1-based spreadsheet row number for traceability and idempotent re-imports.

export type Attendance = "in_person" | "online" | "not_specified";

export type ParsedRegistrant = {
  /** 1-based worksheet row number (for traceability + dedup). */
  sourceRow: number;
  no: string | null;
  name: string | null;
  organization: string | null;
  email: string | null;
  /** Exact per-row fee in integer cents; null when blank/unparseable. */
  feeCents: number | null;
  /** Original fee text, stored verbatim (e.g. "$699.00"). */
  feeRaw: string | null;
  /** Original payment-status text, verbatim (e.g. "Confirmed"). */
  originalStatus: string | null;
  attendance: Attendance;
  /** Machine codes for data-quality flags, e.g. "missing_email". */
  issues: string[];
};

export type ParseResult = {
  sheet: string;
  headerRow: number | null;
  registrants: ParsedRegistrant[];
  /** Duplicate groups *within this file* (by email, then name+org). */
  inFileDuplicates: { key: string; reason: string; rows: number[] }[];
  errors: string[];
};

const HEADER_ALIASES: Record<string, string[]> = {
  no: ["no.", "no", "#"],
  name: ["participant", "name", "student"],
  organization: ["organization", "organisation", "org", "clinic", "company"],
  email: ["email address", "email", "e-mail"],
  fee: ["course fee", "fee", "amount", "price"],
  status: ["payment status", "status"],
  inPerson: ["in person", "in-person"],
  online: ["online"],
};

function norm(v: unknown): string {
  return String(v ?? "").trim().toLowerCase();
}

function cell(v: unknown): string | null {
  if (v == null) return null;
  const s = String(v).trim();
  return s.length ? s : null;
}

/** True when a cell reads as an affirmative attendance mark (Yes / X / ✓ / true). */
function isAffirmative(v: unknown): boolean {
  const s = norm(v);
  return s === "yes" || s === "y" || s === "x" || s === "✓" || s === "true" || s === "1";
}

function findColumns(headerRow: unknown[]): Record<string, number> {
  const map: Record<string, number> = {};
  headerRow.forEach((raw, idx) => {
    const h = norm(raw);
    if (!h) return;
    for (const [key, aliases] of Object.entries(HEADER_ALIASES)) {
      if (map[key] === undefined && aliases.includes(h)) map[key] = idx;
    }
  });
  return map;
}

/**
 * Parse a workbook buffer. `sheetName` defaults to "Registrants" and falls back
 * to the first sheet. Returns the extracted participant table plus any errors.
 */
export function parseRegistrantsWorkbook(
  data: ArrayBuffer | Uint8Array | Buffer,
  sheetName = "Registrants",
): ParseResult {
  const errors: string[] = [];
  let wb: XLSX.WorkBook;
  try {
    wb = XLSX.read(data, { type: "array" });
  } catch {
    return { sheet: sheetName, headerRow: null, registrants: [], inFileDuplicates: [], errors: ["Could not read the spreadsheet file."] };
  }

  const resolvedSheet = wb.SheetNames.includes(sheetName) ? sheetName : wb.SheetNames[0];
  const ws = resolvedSheet ? wb.Sheets[resolvedSheet] : undefined;
  if (!ws) {
    return { sheet: sheetName, headerRow: null, registrants: [], inFileDuplicates: [], errors: ["Worksheet not found."] };
  }

  const rows = XLSX.utils.sheet_to_json<unknown[]>(ws, { header: 1, raw: false, defval: null, blankrows: true });

  // Locate the header row: the first row containing both a "Participant"-style
  // column and an "Email Address"-style column.
  let headerIdx = -1;
  for (let i = 0; i < rows.length; i++) {
    const cols = findColumns(rows[i] ?? []);
    if (cols.name !== undefined && cols.email !== undefined) {
      headerIdx = i;
      break;
    }
  }
  if (headerIdx === -1) {
    return { sheet: resolvedSheet, headerRow: null, registrants: [], inFileDuplicates: [], errors: ["Could not find the participant table header (expected columns like \"Participant\" and \"Email Address\")."] };
  }

  const cols = findColumns(rows[headerIdx]!);
  const registrants: ParsedRegistrant[] = [];

  // Read data rows until the table ends (a blank row or a summary block).
  for (let i = headerIdx + 1; i < rows.length; i++) {
    const row = rows[i] ?? [];
    const name = cols.name !== undefined ? cell(row[cols.name]) : null;
    const email = cols.email !== undefined ? cell(row[cols.email]) : null;
    const feeRaw = cols.fee !== undefined ? cell(row[cols.fee]) : null;
    const org = cols.organization !== undefined ? cell(row[cols.organization]) : null;
    const status = cols.status !== undefined ? cell(row[cols.status]) : null;
    const no = cols.no !== undefined ? cell(row[cols.no]) : null;

    const isEmpty = !name && !email && !feeRaw && !org && !status;
    // A summary block ("REGISTRATION OVERVIEW", "Total Registrants") has no
    // participant/email/fee — stop at the first such row after the table.
    if (isEmpty) break;

    const inPerson = cols.inPerson !== undefined ? row[cols.inPerson] : null;
    const online = cols.online !== undefined ? row[cols.online] : null;
    const pMark = isAffirmative(inPerson);
    const oMark = isAffirmative(online);

    const issues: string[] = [];
    let attendance: Attendance = "not_specified";
    if (pMark && oMark) {
      attendance = "not_specified";
      issues.push("attendance_ambiguous");
    } else if (pMark) attendance = "in_person";
    else if (oMark) attendance = "online";
    // both blank → not_specified (no issue; common for this catalogue)

    const feeCents = parseMoneyToCents(feeRaw);
    if (!name) issues.push("missing_name");
    if (!email) issues.push("missing_email");
    if (feeCents == null) issues.push("missing_fee");

    registrants.push({
      sourceRow: i + 1, // 1-based worksheet row
      no,
      name,
      organization: org,
      email,
      feeCents,
      feeRaw,
      originalStatus: status,
      attendance,
      issues,
    });
  }

  if (registrants.length === 0) errors.push("No participant rows found beneath the table header.");

  // In-file duplicate detection (reported for review; never auto-merged).
  const inFileDuplicates = findInFileDuplicates(registrants);

  return { sheet: resolvedSheet, headerRow: headerIdx + 1, registrants, inFileDuplicates, errors };
}

function findInFileDuplicates(list: ParsedRegistrant[]): ParseResult["inFileDuplicates"] {
  const byEmail = new Map<string, number[]>();
  const byNameOrg = new Map<string, number[]>();
  for (const r of list) {
    if (r.email) {
      const k = r.email.trim().toLowerCase();
      byEmail.set(k, [...(byEmail.get(k) ?? []), r.sourceRow]);
    }
    if (r.name) {
      const k = `${r.name.trim().toLowerCase()}|${(r.organization ?? "").trim().toLowerCase()}`;
      byNameOrg.set(k, [...(byNameOrg.get(k) ?? []), r.sourceRow]);
    }
  }
  const out: ParseResult["inFileDuplicates"] = [];
  for (const [key, rowsAt] of byEmail) {
    if (rowsAt.length > 1) out.push({ key, reason: "same email", rows: rowsAt });
  }
  for (const [key, rowsAt] of byNameOrg) {
    if (rowsAt.length > 1) out.push({ key, reason: "same name + organization", rows: rowsAt });
  }
  return out;
}
