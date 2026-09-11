import Link from "next/link";
import type { Metadata } from "next";
import { courses } from "@/lib/courses";
import { getCourseGroups } from "@/lib/course-status";
import { getRequestCourseSummaries } from "@/lib/course-requests";
import { CourseCard, courseGridClass } from "@/components/CourseCard";
import { ScrollReveal } from "@/components/ScrollReveal";
import { PreviousCourses } from "@/components/courses/PreviousCourses";

// Re-render hourly so the date-based upcoming/past classification reflects the
// current calendar date (America/Toronto) rather than the build time.
export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Courses",
  description:
    "Browse all CanaDent dental continuing education courses — endodontics, implants, oral surgery, cosmetic dentistry, practice management, and more.",
};

const statsBar = [
  { value: `${courses.length}`, label: "Courses in Catalogue" },
  { value: "10+", label: "Expert Instructors" },
  { value: "3", label: "Cities & Online" },
];

export default async function CoursesPage() {
  // Upcoming (soonest first) and past (most recent first) come from the single
  // date-based source of truth, so nothing is mis-archived. Both render on the
  // one page — no tabs, no visibility switching.
  const { upcoming, past } = getCourseGroups();
  // Curated past courses CanaDent still wants to gauge demand for; surfaced as an
  // inline "Request This Course Again" action within their archive cards.
  const requestSummaries = getRequestCourseSummaries();

  return (
    <>
      {/* Page header */}
      <section
        className="py-16 px-4"
        style={{ background: "linear-gradient(135deg, #0f2150, #1b3a8a)" }}
      >
        <div className="max-w-7xl mx-auto">
          <nav className="text-sm text-white/50 mb-4">
            <Link href="/" className="hover:text-[#c9a84c] transition-colors">Home</Link>
            <span className="mx-2">/</span>
            <span className="text-white">Courses</span>
          </nav>
          <span className="section-label">Continuing Education</span>
          <h1 className="font-heading text-4xl sm:text-5xl font-bold text-white mt-3 mb-4">
            Our Courses
          </h1>
          <p className="text-white/70 text-lg max-w-2xl">
            CE-accredited courses designed for Canadian dental professionals. Hands-on workshops,
            seminars, and online lectures across all major dental disciplines.
          </p>
        </div>
      </section>

      {/* Stats bar */}
      <div className="bg-white border-b border-[#1a1a2e]/8">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="grid grid-cols-3 divide-x divide-[#1a1a2e]/8">
            {statsBar.map((s) => (
              <div key={s.label} className="flex flex-col items-center text-center px-6 py-1">
                <span className="font-heading text-3xl font-bold text-[#0f2150] leading-none">{s.value}</span>
                <span className="text-[10px] font-bold tracking-[0.18em] uppercase text-[#c9a84c] mt-1.5">{s.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Upcoming Courses — shown first, soonest scheduled date first */}
      <section className="py-16 sm:py-20 px-4" style={{ background: "#f5f0e8" }} aria-labelledby="upcoming-courses-heading">
        <div className="max-w-7xl mx-auto">
          <div className="mb-10 max-w-2xl">
            <span className="section-label">Register Now</span>
            <div className="flex flex-wrap items-center gap-3">
              <h2
                id="upcoming-courses-heading"
                className="font-heading text-3xl sm:text-4xl font-bold text-[#0f2150]"
              >
                Upcoming Courses
              </h2>
              {upcoming.length > 0 && (
                <span className="rounded-full bg-[#c9a84c] px-2.5 py-0.5 text-xs font-bold text-white">
                  {upcoming.length}
                </span>
              )}
            </div>
            <p className="mt-3 leading-relaxed text-[#1a1a2e]/65">
              Secure your seat in our next round of CE-accredited programs. Dates, formats and
              pricing are listed on each card.
            </p>
          </div>

          {upcoming.length === 0 ? (
            <div className="rounded-2xl border border-[#1a1a2e]/8 bg-white/60 py-16 text-center">
              <p className="text-[#1a1a2e]/65">
                No upcoming courses are scheduled right now — new dates are on the way.
                Explore our previous courses below, or{" "}
                <Link href="/contact" className="font-semibold text-[#1b3a8a] hover:text-[#0f2150] underline underline-offset-2">
                  get in touch
                </Link>{" "}
                to hear about the next one.
              </p>
            </div>
          ) : (
            <div className={courseGridClass(upcoming.length)}>
              {upcoming.map((course, i) => (
                <ScrollReveal key={course.slug} delay={Math.min(i % 3, 2) * 80}>
                  <CourseCard course={course} priority={i < 3} />
                </ScrollReveal>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Previous Courses — directly beneath, most recent first, with inline
          "Request This Course Again" on the applicable (curated) cards. */}
      <PreviousCourses past={past} requestSummaries={requestSummaries} />

      {/* CTA */}
      <section className="py-16 px-4 bg-white text-center">
        <div className="max-w-2xl mx-auto">
          <h2 className="font-heading text-3xl font-bold text-[#0f2150] mb-4">
            Don&apos;t See What You&apos;re Looking For?
          </h2>
          <p className="text-[#1a1a2e]/65 mb-8">
            Reach out to us directly — we&apos;re always planning new courses and can help point
            you to the right program.
          </p>
          <Link href="/contact" className="btn-primary">
            Contact Us
          </Link>
        </div>
      </section>
    </>
  );
}
