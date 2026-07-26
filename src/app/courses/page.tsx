import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import { courses, categories } from "@/lib/courses";
import { BookOpen, MapPin, Calendar, User, ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Courses",
  description:
    "Browse all CanaDent dental continuing education courses — endodontics, implants, oral surgery, cosmetic dentistry, practice management, and more.",
};

export default function CoursesPage() {
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

          {/* Category pills */}
          <div className="flex flex-wrap gap-2 mt-8">
            <span
              className="rounded-full px-4 py-1.5 text-xs font-semibold cursor-default"
              style={{ background: "#c9a84c", color: "#fff" }}
            >
              All Categories
            </span>
            {categories.map((cat) => (
              <span
                key={cat}
                className="rounded-full px-4 py-1.5 text-xs font-medium text-white/70 border border-white/20 cursor-default"
              >
                {cat}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Stats bar */}
      <div className="bg-white border-b border-[#1a1a2e]/8">
        <div className="max-w-7xl mx-auto px-4 py-4 flex flex-wrap items-center gap-6">
          {[
            { icon: BookOpen, label: `${courses.length} Courses` },
            { icon: User, label: "10+ Expert Instructors" },
            { icon: MapPin, label: "Toronto, Vancouver & Online" },
          ].map(({ icon: Icon, label }) => (
            <div key={label} className="flex items-center gap-2 text-sm text-[#1a1a2e]/60">
              <Icon className="h-4 w-4" style={{ color: "#c9a84c" }} />
              {label}
            </div>
          ))}
        </div>
      </div>

      {/* Course grid */}
      <section className="py-16 px-4" style={{ background: "#f5f7fb" }}>
        <div className="max-w-7xl mx-auto">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((course) => (
              <Link
                key={course.slug}
                href={`/courses/${course.slug}`}
                className="card block overflow-hidden group"
              >
                {/* Image or category banner */}
                {course.image ? (
                  <div className="relative w-full overflow-hidden" style={{ aspectRatio: "4/3" }}>
                    <Image
                      src={course.image}
                      alt={course.title}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                ) : (
                  <div
                    className="px-5 py-3 flex items-center justify-between"
                    style={{ background: "#1b3a8a" }}
                  >
                    <span className="text-xs font-semibold tracking-wide uppercase text-white">
                      {course.category}
                    </span>
                    {course.format && (
                      <span className="text-[10px] text-white/50">{course.format}</span>
                    )}
                  </div>
                )}

                <div className="p-6">
                  <h2 className="font-heading font-bold text-[#0f2150] text-lg leading-snug mb-1 group-hover:text-[#1b3a8a] transition-colors">
                    {course.title}
                  </h2>
                  {course.subtitle && (
                    <p className="text-xs text-[#c9a84c] font-medium mb-3">{course.subtitle}</p>
                  )}

                  <p className="text-xs text-[#1a1a2e]/60 mb-5 line-clamp-3 leading-relaxed">
                    {course.description}
                  </p>

                  <div className="space-y-2 text-xs text-[#1a1a2e]/55 mb-5">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-3.5 w-3.5 shrink-0" style={{ color: "#c9a84c" }} />
                      {course.date}
                      {course.time && <span className="text-[#1a1a2e]/35">· {course.time}</span>}
                    </div>
                    <div className="flex items-start gap-2">
                      <MapPin className="h-3.5 w-3.5 shrink-0 mt-0.5" style={{ color: "#c9a84c" }} />
                      <span className="line-clamp-1">{course.location}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <User className="h-3.5 w-3.5 shrink-0" style={{ color: "#c9a84c" }} />
                      <span className="line-clamp-1">{course.instructor}</span>
                    </div>
                    {course.ceCredits && (
                      <div className="flex items-center gap-2">
                        <span style={{ color: "#c9a84c" }}>🎓</span>
                        {course.ceCredits}
                      </div>
                    )}
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-[#1a1a2e]/8">
                    <div>
                      {course.isFree ? (
                        <span className="badge-free">Free</span>
                      ) : course.priceOptions ? (
                        <div>
                          <span className="text-xs text-[#1a1a2e]/45">From </span>
                          <span className="font-bold text-[#0f2150]">
                            ${Math.min(...course.priceOptions.map((o) => o.price)).toLocaleString()}
                          </span>
                        </div>
                      ) : (
                        <div className="flex items-baseline gap-2">
                          <span className="font-bold text-[#0f2150]">
                            ${course.price?.toLocaleString()}
                          </span>
                          {course.originalPrice && (
                            <span className="text-xs text-[#1a1a2e]/35 line-through">
                              ${course.originalPrice.toLocaleString()}
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                    <div className="flex items-center gap-1.5">
                      {course.status === "sold-out" && (
                        <span className="badge-sold-out">Sold Out</span>
                      )}
                      <ArrowRight className="h-4 w-4 text-[#1b3a8a] opacity-0 group-hover:opacity-100 -translate-x-1 group-hover:translate-x-0 transition-all" />
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

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
