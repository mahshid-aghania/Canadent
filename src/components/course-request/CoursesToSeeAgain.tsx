"use client";

import type { CourseSummary } from "@/lib/course-requests";
import { CourseRequestProvider } from "./CourseRequestProvider";
import { RequestCourseCard } from "./RequestCourseCard";
import { RequestSelectionBar } from "./RequestSelectionBar";
import { RequestInterestDialog } from "./RequestInterestDialog";

/**
 * "Courses You'd Like to Attend Again" — the multi-select demand section.
 * Rendered inside a server page that passes serialisable course summaries.
 */
export function CoursesToSeeAgain({
  courses,
  surface = "courses",
  heading = "Courses You'd Like to Attend Again",
}: {
  courses: CourseSummary[];
  surface?: string;
  heading?: string;
}) {
  if (courses.length === 0) return null;

  return (
    <CourseRequestProvider surface={surface}>
      <section className="py-16 px-4" style={{ background: "#f5f0e8" }} aria-labelledby="see-again-heading">
        <div className="max-w-7xl mx-auto">
          <div className="max-w-2xl mb-10">
            <span className="section-label">Previously Offered</span>
            <h2
              id="see-again-heading"
              className="font-heading text-3xl sm:text-4xl font-bold text-[#0f2150] mt-2 mb-3"
            >
              {heading}
            </h2>
            <p className="text-[#1a1a2e]/65 leading-relaxed">
              Missed one of our previous courses? Tell us which programs you would like
              CanaDent to offer again. Your interest helps us plan future course dates —
              it&apos;s free and never a commitment to register.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {courses.map((course) => (
              <RequestCourseCard key={course.slug} course={course} />
            ))}
          </div>
        </div>
      </section>

      <RequestSelectionBar />
      <RequestInterestDialog />
    </CourseRequestProvider>
  );
}
