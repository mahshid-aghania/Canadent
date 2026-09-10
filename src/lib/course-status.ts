// ── Course timing: the single source of truth ──────────────────────────────
// One place decides whether a course offering is UPCOMING or PAST, and exposes
// a serialisable card model used by both the homepage and /courses so the two
// surfaces can never drift apart.
//
// Rules (see the product spec):
//   • "Ended" is determined by the offering's actual end date/time in the
//     America/Toronto timezone — never by whether it sold out.
//   • Registration availability (available / sold-out) is kept SEPARATE from
//     whether a course is upcoming or past. A future sold-out course is still
//     upcoming and simply shows "Sold Out".
//   • We never invent a date. A human date string with no explicit 4-digit year
//     cannot be confidently placed in time, so it is treated as PAST (all such
//     entries in the catalogue are historical) rather than guessed into the
//     future. These are reported as "needs a machine-readable date".

import { courses, type Course } from "@/lib/courses";

export const COURSE_TZ = "America/Toronto";

export type CourseTiming = "upcoming" | "past";

/** YYYY-MM-DD components of an *instant*, as observed in America/Toronto. */
function torontoDateISO(instant: Date): string {
  // en-CA formats as YYYY-MM-DD, which is also lexicographically sortable.
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: COURSE_TZ,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(instant);
}

/** Build a YYYY-MM-DD from a Date's calendar components (timezone-neutral). */
function componentsISO(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

/**
 * Parse a human course date ("Sunday, September 6, 2026", "May 16, 2026") into a
 * YYYY-MM-DD wall date. Returns null when the string lacks an explicit 4-digit
 * year or otherwise can't be understood (ranges like "6 Weekends — January &
 * February") — we do NOT guess a year.
 */
export function parseCourseDateISO(dateStr?: string): string | null {
  if (!dateStr) return null;
  if (!/\b(?:19|20)\d\d\b/.test(dateStr)) return null; // no explicit year → not datable
  // Drop a leading weekday ("Sunday, ") that Date can't parse on its own.
  const cleaned = dateStr.replace(/^\s*[A-Za-z]+,\s*/, "").trim();
  for (const candidate of [cleaned, dateStr]) {
    const d = new Date(candidate);
    if (!Number.isNaN(d.getTime())) return componentsISO(d);
  }
  return null;
}

/** The day the offering STARTS (YYYY-MM-DD, Toronto), or null if undatable. */
export function getCourseStartISO(course: Course): string | null {
  if (course.calendar?.startUtc) return torontoDateISO(new Date(course.calendar.startUtc));
  return parseCourseDateISO(course.date);
}

/**
 * The day the offering ENDS (YYYY-MM-DD, Toronto), or null if undatable. When we
 * only know a single human date, the start day doubles as the end day.
 */
export function getCourseEndISO(course: Course): string | null {
  if (course.calendar?.endUtc) return torontoDateISO(new Date(course.calendar.endUtc));
  return getCourseStartISO(course);
}

/** Today's date (YYYY-MM-DD) in America/Toronto. */
export function torontoTodayISO(now: Date = new Date()): string {
  return torontoDateISO(now);
}

/**
 * Classify an offering. Past only when its end day is strictly before today in
 * Toronto (a course running today still counts as upcoming). Undatable entries
 * are treated as past — never fabricated into the future.
 */
export function classifyCourse(course: Course, now: Date = new Date()): CourseTiming {
  const endISO = getCourseEndISO(course);
  if (!endISO) return "past";
  return endISO < torontoTodayISO(now) ? "past" : "upcoming";
}

/** True when the offering has NOT happened yet (its start day is in the future). */
export function isUpcoming(course: Course, now: Date = new Date()): boolean {
  return classifyCourse(course, now) === "upcoming";
}

/**
 * Best-effort sortable key for PAST ordering: the real end date when known, a
 * year-only fallback for entries whose exact date is unparseable, else null.
 */
function pastSortKey(course: Course): string | null {
  const end = getCourseEndISO(course);
  if (end) return end;
  const m = course.date?.match(/\b(?:19|20)\d\d\b/);
  return m ? `${m[0]}-12-31` : null;
}

/** Upcoming offerings, soonest first (undatable entries never appear here). */
export function sortUpcoming(list: Course[]): Course[] {
  return [...list].sort((a, b) => {
    const ka = getCourseStartISO(a) ?? "9999-99-99";
    const kb = getCourseStartISO(b) ?? "9999-99-99";
    return ka.localeCompare(kb);
  });
}

/** Past offerings, most recently held first; undatable entries keep list order. */
export function sortPast(list: Course[]): Course[] {
  return list
    .map((course, index) => ({ course, index, key: pastSortKey(course) }))
    .sort((a, b) => {
      if (a.key && b.key) return b.key.localeCompare(a.key);
      if (a.key) return -1;
      if (b.key) return 1;
      return a.index - b.index; // stable: preserve curated order for undatable
    })
    .map((entry) => entry.course);
}

// ── Serialisable card model shared by every course card ─────────────────────

export type CourseCardModel = {
  slug: string;
  title: string;
  subtitle: string | null;
  instructor: string;
  image: string | null;
  category: string;
  format: string | null;
  /** Original human date string, shown verbatim. */
  date: string;
  time: string | null;
  location: string;
  ceCredits: string | null;
  description: string;
  timing: CourseTiming;
  /** A visitor can register right now (upcoming AND status "available"). */
  registrationOpen: boolean;
  /** Seats are gone for this offering. */
  soldOut: boolean;
  earlyBirdDeadline: string | null;
  // Pricing (display only — mirrors the existing card logic).
  isFree: boolean;
  price: number | null;
  originalPrice: number | null;
  priceFrom: number | null;
  /** Struck-through "was" price for the cheapest option, when discounted. */
  originalPriceFrom: number | null;
  hasPriceOptions: boolean;
};

export function toCourseCard(course: Course, now: Date = new Date()): CourseCardModel {
  const timing = classifyCourse(course, now);
  // Cheapest attendance option drives the "From" price and its original.
  const cheapestOption = course.priceOptions
    ? course.priceOptions.reduce((a, b) => (b.price < a.price ? b : a))
    : null;
  return {
    slug: course.slug,
    title: course.title,
    subtitle: course.subtitle ?? null,
    instructor: course.instructor,
    image: course.image ?? null,
    category: course.category,
    format: course.format ?? null,
    date: course.date,
    time: course.time ?? null,
    location: course.location,
    ceCredits: course.ceCredits ?? null,
    description: course.description,
    timing,
    // Registration is only "open" for offerings that are still upcoming.
    registrationOpen: timing === "upcoming" && course.status === "available",
    soldOut: course.status === "sold-out",
    earlyBirdDeadline: course.earlyBirdDeadline ?? null,
    isFree: Boolean(course.isFree),
    price: course.price,
    originalPrice: course.originalPrice ?? null,
    priceFrom: cheapestOption ? cheapestOption.price : null,
    originalPriceFrom: cheapestOption?.originalPrice ?? null,
    hasPriceOptions: Boolean(course.priceOptions),
  };
}

/** Split the whole catalogue into ordered upcoming/past card models. */
export function getCourseGroups(now: Date = new Date()): {
  upcoming: CourseCardModel[];
  past: CourseCardModel[];
} {
  const upcoming = sortUpcoming(courses.filter((c) => isUpcoming(c, now)));
  const past = sortPast(courses.filter((c) => !isUpcoming(c, now)));
  return {
    upcoming: upcoming.map((c) => toCourseCard(c, now)),
    past: past.map((c) => toCourseCard(c, now)),
  };
}
