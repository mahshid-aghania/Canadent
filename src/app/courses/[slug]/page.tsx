import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import { BlurImage } from "@/components/BlurImage";
import { RegisterButton } from "@/components/RegisterButton";
import { notFound } from "next/navigation";
import { courses, getCourse } from "@/lib/courses";
import {
  Calendar,
  Clock,
  MapPin,
  User,
  GraduationCap,
  CheckCircle,
  Phone,
  Mail,
  ChevronLeft,
  AlertCircle,
} from "lucide-react";

type Props = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ cancelled?: string }>;
};

export async function generateStaticParams() {
  return courses.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const course = getCourse(slug);
  if (!course) return { title: "Course Not Found" };
  return {
    title: course.title,
    description: course.description.slice(0, 160),
  };
}

export default async function CourseDetailPage({ params, searchParams }: Props) {
  const { slug } = await params;
  const { cancelled } = await searchParams;
  const course = getCourse(slug);
  if (!course) notFound();

  const minPrice = course.priceOptions
    ? Math.min(...course.priceOptions.map((o) => o.price))
    : course.price;

  return (
    <>
      {/* Header */}
      <section
        className="py-14 px-4"
        style={{ background: "linear-gradient(135deg, #0f2150, #1b3a8a)" }}
      >
        <div className="max-w-7xl mx-auto">
          <nav className="text-sm text-white/50 mb-6 flex items-center gap-1.5">
            <Link href="/" className="hover:text-[#c9a84c] transition-colors">Home</Link>
            <span>/</span>
            <Link href="/courses" className="hover:text-[#c9a84c] transition-colors">Courses</Link>
            <span>/</span>
            <span className="text-white line-clamp-1">{course.title}</span>
          </nav>

          <div className="flex flex-wrap items-center gap-3 mb-4">
            <span
              className="rounded-full px-3 py-1 text-xs font-semibold text-[#0f2150]"
              style={{ background: "#c9a84c" }}
            >
              {course.category}
            </span>
            {course.format && (
              <span className="rounded-full px-3 py-1 text-xs font-medium text-white/70 border border-white/20">
                {course.format}
              </span>
            )}
            {course.status === "sold-out" && (
              <span className="badge-sold-out">Sold Out</span>
            )}
            {course.status === "available" && (
              <span className="badge-available">Open for Registration</span>
            )}
          </div>

          <h1 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight mb-3">
            {course.title}
          </h1>
          {course.subtitle && (
            <p className="text-[#c9a84c] text-lg font-medium">{course.subtitle}</p>
          )}
        </div>
      </section>

      {/* Course image */}
      {course.image && (
        <div className="max-w-7xl mx-auto px-4 pt-10">
          <div className="relative w-full max-w-xl aspect-[4/3] rounded-2xl overflow-hidden shadow-xl">
            <BlurImage
              src={course.image}
              alt={course.title}
              priority
              sizes="(max-width: 1280px) 100vw, 576px"
            />
          </div>
        </div>
      )}

      {/* Body */}
      <div className="max-w-7xl mx-auto px-4 py-12 grid lg:grid-cols-[1fr_360px] gap-10">
        {/* Left */}
        <div>
          {/* Description */}
          <section className="mb-10">
            <h2 className="font-heading text-2xl font-bold text-[#0f2150] mb-4">About This Course</h2>
            <p className="text-[#1a1a2e]/70 leading-relaxed text-base">{course.description}</p>
          </section>

          {/* Highlights */}
          {course.highlights && (
            <section className="mb-10">
              <h2 className="font-heading text-2xl font-bold text-[#0f2150] mb-5">
                What You&apos;ll Learn
              </h2>
              <ul className="space-y-3">
                {course.highlights.map((h) => (
                  <li key={h} className="flex items-start gap-3">
                    <CheckCircle
                      className="h-5 w-5 shrink-0 mt-0.5"
                      style={{ color: "#c9a84c" }}
                    />
                    <span className="text-[#1a1a2e]/70 text-sm leading-relaxed">{h}</span>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {/* Schedule */}
          {course.schedule && (
            <section className="mb-10">
              <h2 className="font-heading text-2xl font-bold text-[#0f2150] mb-5">
                Course Schedule
              </h2>
              <div className="space-y-3">
                {course.schedule.map((s) => (
                  <div
                    key={s.day}
                    className="flex items-start gap-4 rounded-xl p-4"
                    style={{ background: "#f5f7fb" }}
                  >
                    <span
                      className="text-xs font-bold rounded-lg px-3 py-1.5 shrink-0"
                      style={{ background: "#1b3a8a", color: "#fff" }}
                    >
                      {s.day}
                    </span>
                    <span className="text-sm text-[#1a1a2e]/70 leading-relaxed">{s.topic}</span>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Instructor */}
          <section className="mb-10">
            <h2 className="font-heading text-2xl font-bold text-[#0f2150] mb-5">Instructor</h2>
            <div className="flex items-start gap-4 card p-5">
              {course.instructorPhoto ? (
                <div className="w-14 h-14 rounded-full shrink-0 overflow-hidden border-2 border-[#c9a84c]/30">
                  <Image
                    src={course.instructorPhoto}
                    alt={course.instructor}
                    width={56}
                    height={56}
                    className="w-full h-full object-cover"
                  />
                </div>
              ) : (
                <div
                  className="w-14 h-14 rounded-full shrink-0 flex items-center justify-center text-xl font-bold text-white"
                  style={{ background: "#1b3a8a" }}
                >
                  {course.instructor.charAt(0)}
                </div>
              )}
              <div>
                <div className="font-semibold text-[#0f2150] mb-1">{course.instructor}</div>
                <div className="text-xs text-[#1a1a2e]/50">Course Instructor · CanaDent Faculty</div>
              </div>
            </div>
          </section>

          {/* Back */}
          <Link
            href="/courses"
            className="inline-flex items-center gap-2 text-sm font-medium text-[#1b3a8a] hover:text-[#0f2150] transition-colors"
          >
            <ChevronLeft className="h-4 w-4" />
            Back to All Courses
          </Link>
        </div>

        {/* Sidebar */}
        <aside className="space-y-5">
          {/* Booking card */}
          <div className="card p-6 sticky top-6">
            {/* Price */}
            <div className="mb-5">
              {course.isFree ? (
                <div>
                  <span className="font-heading text-3xl font-bold text-[#0f2150]">Free</span>
                </div>
              ) : course.priceOptions ? (
                <div className="space-y-2">
                  {course.priceOptions.map((opt) => (
                    <div
                      key={opt.label}
                      className="flex items-center justify-between rounded-lg p-3"
                      style={{ background: "#f5f7fb" }}
                    >
                      <span className="text-sm text-[#1a1a2e]/70">{opt.label}</span>
                      <span className="font-bold text-[#0f2150]">${opt.price}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex items-baseline gap-3">
                  <span className="font-heading text-3xl font-bold text-[#0f2150]">
                    ${minPrice?.toLocaleString()}
                  </span>
                  {course.originalPrice && (
                    <span className="text-lg text-[#1a1a2e]/35 line-through">
                      ${course.originalPrice.toLocaleString()}
                    </span>
                  )}
                </div>
              )}
            </div>

            {/* Details */}
            <ul className="space-y-3 mb-6 text-sm text-[#1a1a2e]/65">
              <li className="flex items-start gap-3">
                <Calendar className="h-4 w-4 shrink-0 mt-0.5" style={{ color: "#c9a84c" }} />
                <div>
                  <div className="font-medium text-[#0f2150]">{course.date}</div>
                  {course.time && <div className="text-xs">{course.time}</div>}
                </div>
              </li>
              {course.duration && (
                <li className="flex items-center gap-3">
                  <Clock className="h-4 w-4 shrink-0" style={{ color: "#c9a84c" }} />
                  {course.duration}
                </li>
              )}
              <li className="flex items-start gap-3">
                <MapPin className="h-4 w-4 shrink-0 mt-0.5" style={{ color: "#c9a84c" }} />
                <span>{course.location}</span>
              </li>
              <li className="flex items-start gap-3">
                <User className="h-4 w-4 shrink-0 mt-0.5" style={{ color: "#c9a84c" }} />
                <span>{course.instructor}</span>
              </li>
              {course.ceCredits && (
                <li className="flex items-center gap-3">
                  <GraduationCap className="h-4 w-4 shrink-0" style={{ color: "#c9a84c" }} />
                  {course.ceCredits}
                </li>
              )}
            </ul>

            {/* Cancel feedback only — success now goes to /success page */}
            {cancelled === "true" && (
              <div
                className="flex items-center gap-2 rounded-xl px-4 py-3 mb-4 text-sm"
                style={{ background: "#fef9ec", color: "#92400e" }}
              >
                <AlertCircle className="h-4 w-4 shrink-0" />
                Payment was cancelled. You can try again below.
              </div>
            )}

            {/* CTA */}
            {course.status === "sold-out" ? (
              <div>
                <div
                  className="flex items-center gap-2 rounded-lg px-4 py-3 mb-3 text-sm"
                  style={{ background: "#fee2e2", color: "#b91c1c" }}
                >
                  <AlertCircle className="h-4 w-4 shrink-0" />
                  This course is currently sold out.
                </div>
                <Link href="/contact" className="btn-secondary w-full text-center block">
                  Join Waitlist / Contact Us
                </Link>
              </div>
            ) : (
              <div>
                <div
                  className="flex items-center gap-2 rounded-lg px-4 py-3 mb-3 text-sm"
                  style={{ background: "#ecfdf5", color: "#065f46" }}
                >
                  <CheckCircle className="h-4 w-4 shrink-0" />
                  Seats available — secure your spot today.
                </div>
                <RegisterButton
                  slug={course.slug}
                  title={course.title}
                  price={course.price ?? 0}
                />
              </div>
            )}

            {/* Contact */}
            <div className="mt-5 pt-5 border-t border-[#1a1a2e]/8 space-y-2">
              <a
                href="tel:14373700122"
                className="flex items-center gap-2 text-xs text-[#1a1a2e]/55 hover:text-[#1b3a8a] transition-colors"
              >
                <Phone className="h-3.5 w-3.5" style={{ color: "#c9a84c" }} />
                1.437.370.0122
              </a>
              <a
                href="mailto:canadent.edu@gmail.com"
                className="flex items-center gap-2 text-xs text-[#1a1a2e]/55 hover:text-[#1b3a8a] transition-colors"
              >
                <Mail className="h-3.5 w-3.5" style={{ color: "#c9a84c" }} />
                canadent.edu@gmail.com
              </a>
            </div>
          </div>

          {/* Enrolment agreement */}
          <div
            className="rounded-xl p-5 text-sm"
            style={{ background: "#f5f7fb", border: "1px solid #e2e8f0" }}
          >
            <h3 className="font-semibold text-[#0f2150] mb-2">Before You Register</h3>
            <p className="text-xs text-[#1a1a2e]/60 leading-relaxed mb-3">
              Please review our enrolment agreement, cancellation policy, and course terms before
              registering.
            </p>
            <Link
              href="/enrolment-agreement"
              className="text-xs font-semibold underline underline-offset-2"
              style={{ color: "#1b3a8a" }}
            >
              Read Enrolment Agreement →
            </Link>
          </div>
        </aside>
      </div>
    </>
  );
}
