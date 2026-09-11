"use client";

import Link from "next/link";
import { useMemo } from "react";
import { Calendar, MapPin, User, GraduationCap, ArrowRight, Check } from "lucide-react";
import { BlurImage } from "@/components/BlurImage";
import { courseGridClass } from "@/components/CourseCard";
import { ScrollReveal } from "@/components/ScrollReveal";
import type { CourseCardModel } from "@/lib/course-status";
import type { CourseSummary } from "@/lib/course-requests";
import {
  CourseRequestProvider,
  useCourseRequest,
} from "@/components/course-request/CourseRequestProvider";
import { RequestSelectionBar } from "@/components/course-request/RequestSelectionBar";
import { RequestInterestDialog } from "@/components/course-request/RequestInterestDialog";

const DEFAULT_SIZES = "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw";

/**
 * "Previous Courses" — the course archive, rendered beneath the upcoming grid on
 * the /courses page. Every past offering appears here exactly once. Offerings
 * that CanaDent is gauging demand for (the curated request list) additionally get
 * an inline "Request This Course Again" action wired to the shared request
 * provider, so the old separate "Courses You'd Like to Attend Again" section is
 * no longer needed and a course can never be listed twice.
 *
 * Cards deliberately omit price and any register CTA and carry a "Previously
 * Offered" badge so their status reads as complete — never as open registration.
 */
export function PreviousCourses({
  past,
  requestSummaries,
}: {
  past: CourseCardModel[];
  requestSummaries: CourseSummary[];
}) {
  // Only the curated, still-requestable past courses carry a request CTA; the
  // rest are view-only. Keyed by slug so cards stay in the archive's date order.
  const requestMap = useMemo(() => {
    const map = new Map<string, CourseSummary>();
    for (const summary of requestSummaries) map.set(summary.slug, summary);
    return map;
  }, [requestSummaries]);

  if (past.length === 0) return null;

  return (
    <CourseRequestProvider surface="courses">
      <section
        id="previous-courses"
        className="scroll-mt-24 border-t border-[#1a1a2e]/8 px-4 py-16 sm:py-20"
        style={{ background: "#efe7da" }}
        aria-labelledby="previous-courses-heading"
      >
        <div className="mx-auto max-w-7xl">
          <div className="mb-10 max-w-2xl">
            <span className="section-label">Course Archive</span>
            <div className="flex flex-wrap items-center gap-3">
              <h2
                id="previous-courses-heading"
                className="font-heading text-3xl font-bold text-[#0f2150] sm:text-4xl"
              >
                Previous Courses
              </h2>
              <span className="rounded-full bg-[#1a1a2e]/8 px-2.5 py-0.5 text-xs font-bold text-[#1a1a2e]/55">
                {past.length}
              </span>
            </div>
            <p className="mt-3 leading-relaxed text-[#1a1a2e]/65">
              Programs CanaDent has previously delivered. Open any course for full details — and
              for selected programs, let us know you&apos;d like us to run it again. Requesting a
              course is free and never a commitment to register.
            </p>
          </div>

          <div className={courseGridClass(past.length)}>
            {past.map((course, i) => (
              <ScrollReveal key={course.slug} delay={Math.min(i % 3, 2) * 80}>
                <PreviousCourseCard
                  course={course}
                  requestSummary={requestMap.get(course.slug)}
                  priority={i < 3}
                />
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      <RequestSelectionBar />
      <RequestInterestDialog />
    </CourseRequestProvider>
  );
}

/**
 * A single previous-course card. Visually matches the upcoming `CourseCard`
 * (same image treatment, meta layout and dimensions) so the two sections read as
 * one consistent grid, but it never shows price or a register action. When a
 * `requestSummary` is supplied, the footer gains the "Request This Course Again"
 * toggle; otherwise it simply links through to the course details.
 */
function PreviousCourseCard({
  course,
  requestSummary,
  priority = false,
}: {
  course: CourseCardModel;
  requestSummary?: CourseSummary;
  priority?: boolean;
}) {
  const { isSelected, toggle, openDialog } = useCourseRequest();
  const requestable = Boolean(requestSummary);
  const selected = requestSummary ? isSelected(requestSummary.slug) : false;
  const detailsHref = `/courses/${course.slug}`;

  function onRequest() {
    if (!requestSummary) return;
    const willSelect = !selected;
    toggle(requestSummary);
    // Opening the dialog on select gives the immediate, guided next step.
    if (willSelect) openDialog();
  }

  return (
    <article
      className={`card group flex h-full flex-col overflow-hidden rounded-2xl${
        selected ? " req-card--selected" : ""
      }`}
      aria-label={course.title}
    >
      {/* Poster — contained (never crops embedded poster text) and capped to the
          same uniform height as the upcoming cards so the grids stay aligned. */}
      <Link
        href={detailsHref}
        className="relative block overflow-hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#c9a84c] focus-visible:ring-offset-2"
        tabIndex={-1}
        aria-hidden="true"
      >
        {course.image ? (
          <div className="relative h-56 w-full overflow-hidden sm:h-64 lg:h-72">
            <BlurImage src={course.image} alt={course.title} sizes={DEFAULT_SIZES} priority={priority} />
          </div>
        ) : (
          <div
            className="flex items-center justify-between px-5 py-4"
            style={{ background: "#1b3a8a" }}
          >
            <span className="text-xs font-semibold uppercase tracking-wide text-white">
              {course.category}
            </span>
            {course.format && <span className="text-[10px] text-white/60">{course.format}</span>}
          </div>
        )}
        {/* Status — text + colour, never colour alone. */}
        <span className="req-badge-previous absolute left-3 top-3">Previously Offered</span>
        {selected && (
          <span className="req-selected-flag" aria-hidden="true">
            <Check className="h-3.5 w-3.5" strokeWidth={3} /> Selected
          </span>
        )}
      </Link>

      <div className="flex flex-1 flex-col p-6 lg:p-7">
        <span className="mb-1.5 text-[10px] font-bold uppercase tracking-[0.18em] text-[#c9a84c]">
          {course.category}
        </span>
        <h3 className="font-heading text-xl font-bold leading-snug text-[#0f2150] transition-colors group-hover:text-[#1b3a8a] lg:text-2xl">
          <Link
            href={detailsHref}
            className="rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#c9a84c] focus-visible:ring-offset-2"
          >
            {course.title}
          </Link>
        </h3>
        {course.subtitle && (
          <p className="mt-1 text-xs font-medium text-[#c9a84c]">{course.subtitle}</p>
        )}

        {/* Meta */}
        <div className="mt-4 space-y-1.5 text-xs text-[#1a1a2e]/60">
          <div className="flex items-center gap-2">
            <User className="h-3.5 w-3.5 shrink-0" style={{ color: "#c9a84c" }} aria-hidden="true" />
            <span className="line-clamp-1">{course.instructor}</span>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="h-3.5 w-3.5 shrink-0" style={{ color: "#c9a84c" }} aria-hidden="true" />
            <span>
              Originally held {course.date}
              {course.format ? <span className="text-[#1a1a2e]/40"> · {course.format}</span> : null}
            </span>
          </div>
          <div className="flex items-start gap-2">
            <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0" style={{ color: "#c9a84c" }} aria-hidden="true" />
            <span className="line-clamp-1">{course.location}</span>
          </div>
          {course.ceCredits && (
            <div className="flex items-center gap-2">
              <GraduationCap className="h-3.5 w-3.5 shrink-0" style={{ color: "#c9a84c" }} aria-hidden="true" />
              <span>{course.ceCredits}</span>
            </div>
          )}
        </div>

        {/* Preview description — 2 lines */}
        <p className="mt-4 line-clamp-2 text-sm leading-relaxed text-[#1a1a2e]/60">
          {course.description}
        </p>

        {/* Footer actions, pinned to the bottom. No price, no register CTA. */}
        <div className="mt-auto space-y-2.5 border-t border-[#1a1a2e]/8 pt-4">
          {requestable && (
            <button
              type="button"
              onClick={onRequest}
              aria-pressed={selected}
              className={`w-full ${selected ? "req-btn-selected" : "btn-primary"}`}
            >
              {selected ? (
                <>
                  <span className="req-check-pop" aria-hidden="true">
                    <Check className="h-4 w-4" strokeWidth={3} />
                  </span>
                  Course Requested
                </>
              ) : (
                "Request This Course Again"
              )}
            </button>
          )}
          <Link
            href={detailsHref}
            className="inline-flex min-h-[44px] w-full items-center justify-center gap-1.5 rounded-full text-sm font-semibold text-[#1b3a8a] transition-all hover:text-[#0f2150] group-hover:gap-2.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#c9a84c] focus-visible:ring-offset-2"
          >
            View Course Details
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </article>
  );
}
