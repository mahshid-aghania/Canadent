import "server-only";

// Shared filter parsing + application for the admin registrations list and its
// CSV export, so the two can never drift apart.

export type RegistrationFilters = {
  course: string | null; // course_slug
  from: string | null; // YYYY-MM-DD (inclusive)
  to: string | null; // YYYY-MM-DD (inclusive)
};

function one(v: string | string[] | undefined): string | null {
  const s = Array.isArray(v) ? v[0] : v;
  return s && s.length ? s : null;
}

function isoDate(v: string | null): string | null {
  return v && /^\d{4}-\d{2}-\d{2}$/.test(v) ? v : null;
}

export function parseRegistrationFilters(
  sp: Record<string, string | string[] | undefined>
): RegistrationFilters {
  return {
    course: one(sp.course),
    from: isoDate(one(sp.from)),
    to: isoDate(one(sp.to)),
  };
}

/** Serialize active filters back into a query string (for the export link). */
export function filtersToQuery(f: RegistrationFilters): string {
  const params = new URLSearchParams();
  if (f.course) params.set("course", f.course);
  if (f.from) params.set("from", f.from);
  if (f.to) params.set("to", f.to);
  const s = params.toString();
  return s ? `?${s}` : "";
}

export function hasActiveFilters(f: RegistrationFilters): boolean {
  return Boolean(f.course || f.from || f.to);
}

// Minimal structural shape of a Supabase filter builder — lets us apply filters
// without importing Postgrest's heavy generics or resorting to `any`. Kept
// non-recursive (methods return the same interface, not the caller's `Q`) so
// TypeScript never has to check Postgrest's deep generics against a
// self-referential constraint, which triggers TS2589.
interface Filterable {
  eq(column: string, value: string): Filterable;
  gte(column: string, value: string): Filterable;
  lte(column: string, value: string): Filterable;
}

export function applyRegistrationFilters<Q>(query: Q, f: RegistrationFilters): Q {
  let q = query as Filterable;
  if (f.course) q = q.eq("course_slug", f.course);
  if (f.from) q = q.gte("created_at", `${f.from}T00:00:00.000Z`);
  if (f.to) q = q.lte("created_at", `${f.to}T23:59:59.999Z`);
  // Cast back to the caller's builder type so downstream `.order()`/`.limit()`
  // chaining stays fully typed.
  return q as Q;
}
