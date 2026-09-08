import Link from "next/link";
import type { Metadata } from "next";
import { courses } from "@/lib/courses";
import { getCourseGroups } from "@/lib/course-status";
import { getRequestCourseSummaries } from "@/lib/course-requests";
import { CoursesToSeeAgain } from "@/components/course-request/CoursesToSeeAgain";
import { CourseBrowser } from "@/components/courses/CourseBrowser";

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

export default async function CoursesPage({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string; category?: string }>;
}) {
  const { upcoming, past } = getCourseGroups();
  const { tab, category } = await searchParams;
  const initialTab = tab === "past" ? "past" : "upcoming";
  // Only honour a category that exists in the selected group; otherwise show all.
  const groupCategories = new Set(
    (initialTab === "past" ? past : upcoming).map((c) => c.category),
  );
  const initialCategory = category && groupCategories.has(category) ? category : "all";

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

      {/* Tabbed, filterable course grid */}
      <section className="py-16 px-4" style={{ background: "#f5f0e8" }}>
        <div className="max-w-7xl mx-auto">
          <CourseBrowser
            upcoming={upcoming}
            past={past}
            initialTab={initialTab}
            initialCategory={initialCategory}
          />
        </div>
      </section>

      {/* Courses You'd Like to Attend Again — demand collection */}
      <CoursesToSeeAgain courses={getRequestCourseSummaries()} surface="courses" />

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
