// ── "Request This Course Again" — server-side persistence ───────────────────
// SERVER ONLY. This defines a small storage interface (CourseRequestStore) and
// ships an in-memory adapter so the whole feature works end-to-end today without
// any infrastructure. When a database is added later, implement the same
// interface against Postgres/KV and swap `store` below — nothing else changes.
//
// ⚠️  The in-memory adapter does NOT persist across serverless invocations or
//     server restarts. It is intended for local development and UI review only.
//     See PR notes for the Postgres migration path.

// NOTE: keep this module out of client components — it is imported only by the
// API route and the admin (server) pages.
import type {
  AttendancePreference,
  CourseRequestInput,
  ProfessionalRole,
  TimingPreference,
} from "@/lib/course-requests";

/** One person's interest in one course. Dedupe key is (email, slug). */
export type CourseRequestRecord = {
  id: string;
  slug: string;
  courseTitle: string;
  name: string;
  email: string;
  phone: string;
  role: ProfessionalRole | string;
  attendance: AttendancePreference | string | null;
  timing: TimingPreference | string | null;
  message: string | null;
  consent: boolean;
  utm: Record<string, string> | null;
  createdAt: string; // ISO
  updatedAt: string; // ISO
};

export type SaveOutcome = {
  slug: string;
  courseTitle: string;
  status: "created" | "updated";
};

export interface CourseRequestStore {
  /**
   * Upsert one request per (email, slug). A repeat submission from the same
   * email for the same course updates preferences instead of inflating counts.
   */
  save(input: CourseRequestInput, titleFor: (slug: string) => string): Promise<SaveOutcome[]>;
  all(): Promise<CourseRequestRecord[]>;
  bySlug(slug: string): Promise<CourseRequestRecord[]>;
}

// ── In-memory adapter ───────────────────────────────────────────────────────

function key(email: string, slug: string): string {
  return `${email.toLowerCase()}::${slug}`;
}

class MemoryCourseRequestStore implements CourseRequestStore {
  private records = new Map<string, CourseRequestRecord>();

  async save(
    input: CourseRequestInput,
    titleFor: (slug: string) => string
  ): Promise<SaveOutcome[]> {
    const now = new Date().toISOString();
    const outcomes: SaveOutcome[] = [];

    for (const slug of input.slugs) {
      const k = key(input.email, slug);
      const existing = this.records.get(k);
      const courseTitle = titleFor(slug);

      if (existing) {
        // Update preferences in place — do NOT create a misleading new vote.
        existing.name = input.name;
        existing.phone = input.phone;
        existing.role = input.role;
        existing.attendance = input.attendance ?? null;
        existing.timing = input.timing ?? null;
        existing.message = input.message ?? existing.message;
        existing.consent = input.consent;
        existing.utm = input.utm ?? existing.utm;
        existing.updatedAt = now;
        outcomes.push({ slug, courseTitle, status: "updated" });
      } else {
        this.records.set(k, {
          id: `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`,
          slug,
          courseTitle,
          name: input.name,
          email: input.email,
          phone: input.phone,
          role: input.role,
          attendance: input.attendance ?? null,
          timing: input.timing ?? null,
          message: input.message ?? null,
          consent: input.consent,
          utm: input.utm ?? null,
          createdAt: now,
          updatedAt: now,
        });
        outcomes.push({ slug, courseTitle, status: "created" });
      }
    }
    return outcomes;
  }

  async all(): Promise<CourseRequestRecord[]> {
    return [...this.records.values()].sort((a, b) =>
      b.createdAt.localeCompare(a.createdAt)
    );
  }

  async bySlug(slug: string): Promise<CourseRequestRecord[]> {
    return (await this.all()).filter((r) => r.slug === slug);
  }
}

// The single store instance for the app. Preserved across HMR in dev via a
// global so submissions you make while reviewing don't vanish on hot reload.
const globalForStore = globalThis as unknown as {
  __canadentRequestStore?: CourseRequestStore;
};

export const store: CourseRequestStore =
  globalForStore.__canadentRequestStore ??
  (globalForStore.__canadentRequestStore = new MemoryCourseRequestStore());

// ── Aggregations for the admin dashboard ────────────────────────────────────

export type CourseDemand = {
  slug: string;
  courseTitle: string;
  totalRequests: number;
  uniqueUsers: number;
  latest: string | null;
  records: CourseRequestRecord[];
};

export async function getDemandByCourse(): Promise<CourseDemand[]> {
  const all = await store.all();
  const map = new Map<string, CourseDemand>();

  for (const r of all) {
    const d =
      map.get(r.slug) ??
      map
        .set(r.slug, {
          slug: r.slug,
          courseTitle: r.courseTitle,
          totalRequests: 0,
          uniqueUsers: 0,
          latest: null,
          records: [],
        })
        .get(r.slug)!;
    d.records.push(r);
  }

  for (const d of map.values()) {
    d.totalRequests = d.records.length;
    d.uniqueUsers = new Set(d.records.map((r) => r.email.toLowerCase())).size;
    d.latest = d.records.reduce<string | null>(
      (max, r) => (!max || r.createdAt > max ? r.createdAt : max),
      null
    );
  }

  return [...map.values()].sort((a, b) => b.totalRequests - a.totalRequests);
}

/** Public, non-identifying demand signal for one course (safe for the UI). */
export async function getPublicDemandLabel(slug: string): Promise<string | null> {
  const count = (await store.bySlug(slug)).length;
  if (count <= 0) return null;
  if (count >= 25) return "Highly requested";
  if (count >= 10) return "Popular request";
  if (count >= 3) return "Interest is growing";
  return "You're on the interest list";
}
