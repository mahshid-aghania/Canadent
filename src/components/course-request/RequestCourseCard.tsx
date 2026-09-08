"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { Check, User, GraduationCap, ArrowRight, CalendarClock } from "lucide-react";
import { BlurImage } from "@/components/BlurImage";
import type { CourseSummary } from "@/lib/course-requests";
import { track } from "@/lib/analytics";
import { useCourseRequest } from "./CourseRequestProvider";

export function RequestCourseCard({ course }: { course: CourseSummary }) {
  const { isSelected, toggle, openDialog, surface } = useCourseRequest();
  const selected = isSelected(course.slug);
  const cardRef = useRef<HTMLElement>(null);
  const viewedRef = useRef(false);

  // Fire a one-time "card viewed" event when the card scrolls into view.
  useEffect(() => {
    const el = cardRef.current;
    if (!el || viewedRef.current) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !viewedRef.current) {
          viewedRef.current = true;
          track("request_card_viewed", { slug: course.slug, surface });
          io.disconnect();
        }
      },
      { threshold: 0.4 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [course.slug, surface]);

  function onRequest() {
    const willSelect = !selected;
    toggle(course);
    // Opening the dialog on select gives the immediate, guided next step.
    if (willSelect) openDialog();
  }

  const detailsHref = `/courses/${course.slug}`;
  const statusLabel = course.enrolling ? "Currently Enrolling" : "Previously Offered";

  return (
    <article
      ref={cardRef}
      className={`card block overflow-hidden h-full flex flex-col${
        selected ? " req-card--selected" : ""
      }`}
      aria-label={course.title}
    >
      {/* Poster */}
      <Link href={detailsHref} className="group relative block" tabIndex={-1} aria-hidden="true">
        {course.image ? (
          <div className="relative w-full overflow-hidden" style={{ height: 0, paddingBottom: "125%" }}>
            <BlurImage
              src={course.image}
              alt=""
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            />
          </div>
        ) : (
          <div className="px-5 py-3" style={{ background: "#1b3a8a" }}>
            <span className="text-xs font-semibold tracking-wide uppercase text-white">
              {course.category}
            </span>
          </div>
        )}
        {/* Status badge — text + colour, never colour alone */}
        <span
          className={`absolute top-3 left-3 ${
            course.enrolling ? "badge-available" : "req-badge-previous"
          }`}
        >
          {statusLabel}
        </span>
        {selected && (
          <span className="req-selected-flag" aria-hidden="true">
            <Check className="h-3.5 w-3.5" strokeWidth={3} /> Selected
          </span>
        )}
      </Link>

      <div className="p-6 flex flex-col flex-1">
        <span className="text-[10px] font-bold tracking-[0.18em] uppercase text-[#c9a84c] mb-1.5">
          {course.category}
        </span>
        <h3 className="font-heading font-bold text-[#0f2150] text-lg leading-snug mb-3">
          <Link href={detailsHref} className="hover:text-[#1b3a8a] transition-colors">
            {course.title}
          </Link>
        </h3>

        <div className="space-y-2 text-xs text-[#1a1a2e]/60 mb-5">
          <div className="flex items-center gap-2">
            <User className="h-3.5 w-3.5 shrink-0" style={{ color: "#c9a84c" }} aria-hidden="true" />
            <span className="line-clamp-1">{course.instructor}</span>
          </div>
          {course.format && (
            <div className="flex items-center gap-2">
              <CalendarClock className="h-3.5 w-3.5 shrink-0" style={{ color: "#c9a84c" }} aria-hidden="true" />
              <span className="line-clamp-1">{course.format}</span>
            </div>
          )}
          {course.ceCredits && (
            <div className="flex items-center gap-2">
              <GraduationCap className="h-3.5 w-3.5 shrink-0" style={{ color: "#c9a84c" }} aria-hidden="true" />
              {course.ceCredits}
            </div>
          )}
          {course.previouslyHeld && (
            <div className="text-[11px] text-[#1a1a2e]/40">
              Previously held on {course.previouslyHeld.replace(/^\w+day, /, "")}
            </div>
          )}
        </div>

        {/* CTAs */}
        <div className="mt-auto pt-4 border-t border-[#1a1a2e]/8 space-y-2.5">
          {course.enrolling ? (
            <Link
              href={detailsHref}
              className="btn-primary w-full"
              aria-label={`Register for ${course.title} — currently enrolling`}
            >
              Register Now
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          ) : (
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
            className="block text-center text-sm font-medium text-[#1b3a8a] hover:text-[#0f2150] transition-colors"
          >
            View Course Details
          </Link>
        </div>
      </div>
    </article>
  );
}
