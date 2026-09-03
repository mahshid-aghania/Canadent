// ── "Request This Course Again" — shared types, config & validation ─────────
// This module is import-safe on both the client and the server. It contains NO
// database or email code (see course-requests-store.ts for persistence). It
// exposes: the curated list of request-eligible courses, a serialisable
// CourseSummary used by the UI, and a single validation routine reused by both
// the client form and the API route so the rules can never drift apart.

import { getCourse, type Course } from "@/lib/courses";

/**
 * Courses featured in the "Courses You'd Like to See Again" experience, in
 * display order. These are the programs CanaDent most wants to gauge demand for.
 * Add or remove slugs here — the section, cards, and per-course panels all read
 * from this list.
 */
export const REQUEST_COURSE_SLUGS = [
  "advanced-adhesive-dentistry-master-blueprint",
  "daily-unique-orthodontic-techniques",
  "overcoming-severe-curvatures-and-ledges-in-endodontics",
  "post-extraction-site-management",
] as const;

/** Professional roles offered in the interest form (value === label). */
export const PROFESSIONAL_ROLES = [
  "General Dentist",
  "Specialist",
  "Dental Hygienist",
  "Dental Assistant",
  "Dental Student",
  "Other",
] as const;
export type ProfessionalRole = (typeof PROFESSIONAL_ROLES)[number];

export const ATTENDANCE_PREFERENCES = [
  "In Person",
  "Live Online",
  "Hybrid",
  "No Preference",
] as const;
export type AttendancePreference = (typeof ATTENDANCE_PREFERENCES)[number];

export const TIMING_PREFERENCES = ["Weekday", "Weekend", "No Preference"] as const;
export type TimingPreference = (typeof TIMING_PREFERENCES)[number];

/**
 * A course is "currently enrolling" when a visitor can still register for it.
 * These courses are never made to look unavailable — the request card links
 * them to registration instead of showing a request CTA.
 */
export function isCurrentlyEnrolling(course: Course): boolean {
  return course.status === "available" || course.status === "upcoming";
}

/** A course is requestable when it has ended or sold out. */
export function isRequestable(course: Course): boolean {
  return !isCurrentlyEnrolling(course);
}

/**
 * Lightweight, serialisable view of a course for the request UI. We deliberately
 * omit price and expired dates from the card face; `previouslyHeld` is included
 * only so the UI can label it clearly ("Previously held on …") rather than
 * presenting it as an active date.
 */
export type CourseSummary = {
  slug: string;
  title: string;
  category: string;
  instructor: string;
  format: string | null;
  ceCredits: string | null;
  image: string | null;
  /** Real registration state — drives the badge and CTA, never faked. */
  enrolling: boolean;
  /** Human date the course last ran, for a "Previously held on" label only. */
  previouslyHeld: string | null;
};

export function toCourseSummary(course: Course): CourseSummary {
  const enrolling = isCurrentlyEnrolling(course);
  return {
    slug: course.slug,
    title: course.title,
    category: course.category,
    instructor: course.instructor,
    format: course.format ?? null,
    ceCredits: course.ceCredits ?? null,
    image: course.image ?? null,
    enrolling,
    // Only surface a past date for courses that are no longer enrolling.
    previouslyHeld: !enrolling && course.date ? course.date : null,
  };
}

/** The curated request courses as UI summaries, preserving configured order. */
export function getRequestCourseSummaries(): CourseSummary[] {
  return REQUEST_COURSE_SLUGS.map((slug) => getCourse(slug))
    .filter((c): c is Course => Boolean(c))
    .map(toCourseSummary);
}

// ── Submission shape & validation ───────────────────────────────────────────

export type CourseRequestInput = {
  name: string;
  email: string;
  phone: string;
  role: string;
  attendance?: string;
  timing?: string;
  message?: string;
  consent: boolean;
  /** Slugs the person is expressing interest in (at least one). */
  slugs: string[];
  /** UTM attribution only — never other PII. */
  utm?: Record<string, string>;
};

export type FieldErrors = Partial<Record<
  "name" | "email" | "phone" | "role" | "consent" | "slugs",
  string
>>;

// Pragmatic email check — matches the browser's own validity heuristic without
// pretending to fully implement RFC 5322.
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Validate a submission. Returns the set of field errors (empty === valid) plus
 * a normalised copy with trimmed strings and a de-duplicated slug list. Used by
 * both the client (for inline errors) and the server (as the source of truth).
 */
export function validateRequest(raw: Partial<CourseRequestInput>): {
  errors: FieldErrors;
  value: CourseRequestInput;
} {
  const value: CourseRequestInput = {
    name: (raw.name ?? "").trim(),
    email: (raw.email ?? "").trim(),
    phone: (raw.phone ?? "").trim(),
    role: (raw.role ?? "").trim(),
    attendance: raw.attendance?.trim() || undefined,
    timing: raw.timing?.trim() || undefined,
    message: raw.message?.trim() || undefined,
    consent: Boolean(raw.consent),
    slugs: Array.from(new Set((raw.slugs ?? []).filter(Boolean))),
    utm: raw.utm,
  };

  const errors: FieldErrors = {};
  if (!value.name) errors.name = "Please enter your full name.";
  if (!value.email) errors.email = "Please enter your email address.";
  else if (!EMAIL_RE.test(value.email))
    errors.email = "Please enter a valid email address.";
  if (!value.phone) errors.phone = "Please enter a phone number.";
  else if (value.phone.replace(/\D/g, "").length < 7)
    errors.phone = "Please enter a valid phone number.";
  if (!value.role) errors.role = "Please select your professional role.";
  else if (!PROFESSIONAL_ROLES.includes(value.role as ProfessionalRole))
    errors.role = "Please select a valid role.";
  if (!value.consent)
    errors.consent = "Please agree to be contacted about future dates.";
  // Existence of each slug is verified server-side (see the API route), so the
  // heavy course dataset is never pulled into the client bundle for validation.
  if (value.slugs.length === 0)
    errors.slugs = "Please select at least one course.";

  return { errors, value };
}
