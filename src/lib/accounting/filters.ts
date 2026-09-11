// Client-safe filter parsing/serialization for the Students list + its export,
// so the table, filter bar, and CSV export can never drift apart.

export type RegistrationFilters = {
  search: string | null;
  course: string | null;
  verification: string | null;
  invoiceStatus: string | null; // status value, or "none"
  receipt: string | null; // "has" | "none"
  missing: string | null; // "email" | "fee"
  sort: string;
  dir: "asc" | "desc";
  page: number;
  pageSize: number;
};

export const DEFAULT_FILTERS: RegistrationFilters = {
  search: null, course: null, verification: null, invoiceStatus: null,
  receipt: null, missing: null, sort: "name", dir: "asc", page: 1, pageSize: 25,
};

function one(v: string | string[] | undefined): string | null {
  const s = Array.isArray(v) ? v[0] : v;
  return s && s.length ? s : null;
}

export function parseFilters(
  sp: Record<string, string | string[] | undefined>,
): RegistrationFilters {
  const page = Number(one(sp.page) ?? "1");
  const dir = one(sp.dir) === "desc" ? "desc" : "asc";
  return {
    search: one(sp.search),
    course: one(sp.course),
    verification: one(sp.verification),
    invoiceStatus: one(sp.invoiceStatus),
    receipt: one(sp.receipt),
    missing: one(sp.missing),
    sort: one(sp.sort) ?? "name",
    dir,
    page: Number.isFinite(page) && page > 0 ? page : 1,
    pageSize: 25,
  };
}

/** Serialize active filters to a query string (pagination optional). */
export function filtersToQuery(f: RegistrationFilters, opts: { withPage?: boolean } = {}): string {
  const p = new URLSearchParams();
  if (f.search) p.set("search", f.search);
  if (f.course) p.set("course", f.course);
  if (f.verification) p.set("verification", f.verification);
  if (f.invoiceStatus) p.set("invoiceStatus", f.invoiceStatus);
  if (f.receipt) p.set("receipt", f.receipt);
  if (f.missing) p.set("missing", f.missing);
  if (f.sort && f.sort !== "name") p.set("sort", f.sort);
  if (f.dir !== "asc") p.set("dir", f.dir);
  if (opts.withPage && f.page > 1) p.set("page", String(f.page));
  const s = p.toString();
  return s ? `?${s}` : "";
}

export function hasActiveFilters(f: RegistrationFilters): boolean {
  return Boolean(f.search || f.course || f.verification || f.invoiceStatus || f.receipt || f.missing);
}
