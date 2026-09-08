import Link from "next/link";
import { BlurImage } from "@/components/BlurImage";
import { TAX_SUFFIX } from "@/lib/tax";
import type { CourseCardModel } from "@/lib/course-status";
import { Calendar, MapPin, User, GraduationCap, ArrowRight } from "lucide-react";

const DEFAULT_SIZES =
  "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw";

/**
 * Grid classes for a course row. One or two cards keep their natural width
 * (centered) instead of stretching across a full three-column row.
 */
export function courseGridClass(count: number): string {
  if (count === 1) return "grid gap-6 sm:gap-8 max-w-md mx-auto";
  if (count === 2) return "grid gap-6 sm:gap-8 sm:grid-cols-2 max-w-4xl mx-auto";
  return "grid gap-6 sm:gap-8 sm:grid-cols-2 lg:grid-cols-3";
}

/**
 * Shared course card used by the homepage "Upcoming Courses" grid and the
 * /courses browser so both surfaces stay visually identical. The whole card is
 * a single link to the course detail page — the "View Course" pill is a styled
 * span (not a nested button/anchor) to keep one interactive target per card.
 */
export function CourseCard({
  course,
  priority = false,
  sizes = DEFAULT_SIZES,
}: {
  course: CourseCardModel;
  priority?: boolean;
  sizes?: string;
}) {
  const isPast = course.timing === "past";
  const action = isPast ? "View Course Details" : "View Course";

  return (
    <Link
      href={`/courses/${course.slug}`}
      className={`card group flex h-full flex-col overflow-hidden rounded-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#c9a84c] focus-visible:ring-offset-2${
        course.registrationOpen ? " ring-1 ring-[#c9a84c]/50" : ""
      }`}
    >
      {/* Image — contained (never crops embedded poster text or faces) */}
      {course.image ? (
        <div
          className="relative w-full overflow-hidden"
          style={{ height: 0, paddingBottom: "125%" }}
        >
          <BlurImage src={course.image} alt={course.title} sizes={sizes} priority={priority} />
        </div>
      ) : (
        <div
          className="flex items-center justify-between px-5 py-4"
          style={{ background: "#1b3a8a" }}
        >
          <span className="text-xs font-semibold uppercase tracking-wide text-white">
            {course.category}
          </span>
          {course.format && (
            <span className="text-[10px] text-white/60">{course.format}</span>
          )}
        </div>
      )}

      <div className="flex flex-1 flex-col p-6 lg:p-7">
        {/* Status badges */}
        <div className="mb-3 flex flex-wrap items-center gap-2">
          {isPast ? (
            <span className="badge-past">Past Course</span>
          ) : course.registrationOpen ? (
            <span className="badge-available">Registration Open</span>
          ) : course.soldOut ? (
            <span className="badge-sold-out">Sold Out</span>
          ) : (
            <span className="badge-upcoming">Upcoming</span>
          )}
          {!isPast && course.earlyBirdDeadline && (
            <span className="badge-early-bird">Early Bird — Until {course.earlyBirdDeadline}</span>
          )}
        </div>

        {/* Title — allowed to wrap fully */}
        <h3 className="font-heading text-xl font-bold leading-snug text-[#0f2150] transition-colors group-hover:text-[#1b3a8a] lg:text-2xl">
          {course.title}
        </h3>
        {course.subtitle && (
          <p className="mt-1 text-xs font-medium text-[#c9a84c]">{course.subtitle}</p>
        )}

        {/* Meta */}
        <div className="mt-4 space-y-1.5 text-xs text-[#1a1a2e]/60">
          <div className="flex items-center gap-2">
            <User className="h-3.5 w-3.5 shrink-0" style={{ color: "#c9a84c" }} />
            <span className="line-clamp-1">{course.instructor}</span>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="h-3.5 w-3.5 shrink-0" style={{ color: "#c9a84c" }} />
            <span>
              {course.date}
              {course.format ? <span className="text-[#1a1a2e]/40"> · {course.format}</span> : null}
            </span>
          </div>
          <div className="flex items-start gap-2">
            <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0" style={{ color: "#c9a84c" }} />
            <span className="line-clamp-1">{course.location}</span>
          </div>
          {course.ceCredits && (
            <div className="flex items-center gap-2">
              <GraduationCap className="h-3.5 w-3.5 shrink-0" style={{ color: "#c9a84c" }} />
              <span>{course.ceCredits}</span>
            </div>
          )}
        </div>

        {/* Preview description — 2–3 lines */}
        <p className="mt-4 line-clamp-2 text-sm leading-relaxed text-[#1a1a2e]/60">
          {course.description}
        </p>

        {/* Footer: price (upcoming only) + primary action, pinned to bottom */}
        <div className="mt-auto flex items-end justify-between gap-4 border-t border-[#1a1a2e]/8 pt-4">
          {!isPast ? (
            <PriceBlock course={course} />
          ) : (
            <span className="text-xs font-medium uppercase tracking-wide text-[#1a1a2e]/40">
              Completed
            </span>
          )}
          <span
            className={`inline-flex min-h-[44px] shrink-0 items-center gap-1.5 rounded-full px-4 text-sm font-semibold transition-all group-hover:gap-2.5 ${
              isPast
                ? "text-[#1b3a8a]"
                : "bg-[#c9a84c] px-5 text-white group-hover:bg-[#b8963d]"
            }`}
          >
            {action}
            <ArrowRight className="h-4 w-4" />
          </span>
        </div>
      </div>
    </Link>
  );
}

function PriceBlock({ course }: { course: CourseCardModel }) {
  if (course.isFree) return <span className="badge-free">Free</span>;

  if (course.hasPriceOptions && course.priceFrom != null) {
    return (
      <div>
        <span className="text-xs text-[#1a1a2e]/45">From </span>
        <span className="font-heading text-lg font-bold text-[#0f2150]">
          ${course.priceFrom.toLocaleString()}
        </span>
        <span className="text-xs text-[#1a1a2e]/45"> {TAX_SUFFIX}</span>
      </div>
    );
  }

  if (course.price != null) {
    return (
      <div className="flex items-baseline gap-2">
        <span className="font-heading text-lg font-bold text-[#0f2150]">
          ${course.price.toLocaleString()}
        </span>
        {course.originalPrice && (
          <span className="text-xs text-[#1a1a2e]/35 line-through">
            ${course.originalPrice.toLocaleString()}
          </span>
        )}
        <span className="text-xs text-[#1a1a2e]/45">{TAX_SUFFIX}</span>
      </div>
    );
  }

  // No price data — say so explicitly rather than invent one.
  return <span className="text-xs text-[#1a1a2e]/45">Contact us for pricing</span>;
}
