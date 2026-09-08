import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import { RegistrationPanel } from "@/components/RegistrationPanel";
import { CourseRequestPanel } from "@/components/course-request/CourseRequestPanel";
import { CourseViewed } from "@/components/CourseViewed";
import { notFound } from "next/navigation";
import { courses, getCourse } from "@/lib/courses";
import { toCourseSummary } from "@/lib/course-requests";
import { TAX_SUFFIX } from "@/lib/tax";
import {
  Calendar,
  Clock,
  MapPin,
  User,
  GraduationCap,
  CheckCircle,
  Users,
  Phone,
  Mail,
  ChevronLeft,
  ArrowRight,
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

/** Split a "Lead: detail" highlight into a bold lead + plain detail. */
function splitOutcome(text: string): { lead: string; detail: string } {
  const idx = text.indexOf(":");
  if (idx === -1) return { lead: "", detail: text };
  return { lead: text.slice(0, idx).trim(), detail: text.slice(idx + 1).trim() };
}

export default async function CourseDetailPage({ params, searchParams }: Props) {
  const { slug } = await params;
  const { cancelled } = await searchParams;
  const course = getCourse(slug);
  if (!course) notFound();

  const minPrice = course.priceOptions
    ? Math.min(...course.priceOptions.map((o) => o.price))
    : course.price;

  const snapshot: { icon: React.ElementType; label: string }[] = [
    ...(course.date ? [{ icon: Calendar, label: course.date.replace(/^\w+day, /, "") }] : []),
    ...(course.time ? [{ icon: Clock, label: `${course.time} ET` }] : []),
    ...(course.duration ? [{ icon: Clock, label: course.duration }] : []),
    ...(course.ceCredits ? [{ icon: GraduationCap, label: course.ceCredits }] : []),
    ...(course.format ? [{ icon: Users, label: course.format }] : []),
  ];

  return (
    <>
      <CourseViewed slug={course.slug} />

      {/* ── Hero ── */}
      <section className="px-4 pt-14 pb-12" style={{ background: "linear-gradient(135deg, #0f2150, #1b3a8a)" }}>
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_260px] gap-10 lg:gap-16 items-center">
            <div>
              <nav className="text-sm text-white/50 mb-6 flex items-center gap-1.5">
                <Link href="/" className="hover:text-[#c9a84c] transition-colors">Home</Link>
                <span>/</span>
                <Link href="/courses" className="hover:text-[#c9a84c] transition-colors">Courses</Link>
                <span>/</span>
                <span className="text-white line-clamp-1">{course.title}</span>
              </nav>

              <div className="flex flex-wrap items-center gap-3 mb-4">
                <span className="rounded-full px-3 py-1 text-xs font-semibold text-[#0f2150]" style={{ background: "#c9a84c" }}>
                  {course.category}
                </span>
                {course.format && (
                  <span className="rounded-full px-3 py-1 text-xs font-medium text-white/70 border border-white/20">
                    {course.format}
                  </span>
                )}
                {course.status === "sold-out" && <span className="badge-sold-out">Sold Out</span>}
                {course.status === "available" && <span className="badge-available">Open for Registration</span>}
              </div>

              <h1 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight mb-4">
                {course.title}
              </h1>
              {course.subtitle && <p className="text-[#c9a84c] text-lg font-medium mb-5">{course.subtitle}</p>}

              {/* Key facts */}
              <ul className="flex flex-wrap gap-x-5 gap-y-2 text-sm text-white/75 mb-7">
                <li className="flex items-center gap-2"><User className="h-4 w-4" style={{ color: "#c9a84c" }} />{course.instructor}</li>
                {course.date && <li className="flex items-center gap-2"><Calendar className="h-4 w-4" style={{ color: "#c9a84c" }} />{course.date.replace(/^\w+day, /, "")}</li>}
                {course.ceCredits && <li className="flex items-center gap-2"><GraduationCap className="h-4 w-4" style={{ color: "#c9a84c" }} />{course.ceCredits}</li>}
              </ul>

              {course.status !== "sold-out" && (
                <div className="flex flex-wrap items-center gap-3">
                  {minPrice != null && (
                    <span className="text-white/80 text-sm mr-1">
                      From <span className="font-heading text-2xl font-bold text-white align-middle">${minPrice.toLocaleString()}</span>{" "}
                      <span className="text-white/55">CAD {TAX_SUFFIX}</span>
                    </span>
                  )}
                  <a href="#register" className="btn-primary">Choose Your Attendance</a>
                  <a href="#curriculum" className="btn-outline-white">View Course Curriculum</a>
                </div>
              )}
            </div>

            {course.image && (
              <div className="w-full max-w-[260px] mx-auto lg:mx-0 lg:w-[260px] shrink-0">
                <div className="relative w-full rounded-2xl overflow-hidden" style={{ paddingBottom: "125%", background: "#0f2150", boxShadow: "0 32px 80px rgba(0,0,0,0.55), 0 0 0 1px rgba(201,168,76,0.25)" }}>
                  <Image src={course.image} alt={`${course.title} course poster`} fill priority className="object-contain z-10" sizes="(max-width: 1024px) 260px, 260px" />
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ── Snapshot bar ── */}
      {snapshot.length > 0 && (
        <section className="px-4 border-b" style={{ background: "#fff", borderColor: "#e2e8f0" }}>
          <div className="max-w-7xl mx-auto py-4 flex flex-wrap items-center justify-center sm:justify-between gap-4 text-sm">
            {snapshot.map(({ icon: Icon, label }, i) => (
              <div key={i} className="flex items-center gap-2 text-[#1a1a2e]/70">
                <Icon className="h-4 w-4 shrink-0" style={{ color: "#c9a84c" }} aria-hidden="true" />
                <span className="font-medium">{label}</span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ── Body ── */}
      <div className="max-w-7xl mx-auto px-4 py-12 grid lg:grid-cols-[1fr_360px] gap-10">
        <div>
          {/* About */}
          <section className="mb-12">
            <h2 className="font-heading text-2xl font-bold text-[#0f2150] mb-4">About This Course</h2>
            <div className="space-y-4">
              {course.description.split("\n\n").map((para, i) => (
                <p key={i} className="text-[#1a1a2e]/70 leading-relaxed text-base">{para}</p>
              ))}
            </div>
          </section>

          {/* Who this is for */}
          {course.audience && course.audience.length > 0 && (
            <section className="mb-12">
              <h2 className="font-heading text-2xl font-bold text-[#0f2150] mb-5">Who This Course Is For</h2>
              <div className="grid sm:grid-cols-3 gap-4">
                {course.audience.map((a) => (
                  <div key={a} className="card p-5">
                    <Users className="h-5 w-5 mb-3" style={{ color: "#c9a84c" }} aria-hidden="true" />
                    <p className="text-sm text-[#1a1a2e]/70 leading-relaxed">{a}</p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* What you'll be able to do — outcome cards */}
          {course.highlights && (
            <section id="curriculum" className="mb-12 scroll-mt-24">
              <h2 className="font-heading text-2xl font-bold text-[#0f2150] mb-2">
                What You&apos;ll Be Able to Do
              </h2>
              {course.outcomeIntro && (
                <p className="text-[#1a1a2e]/60 text-sm mb-5 max-w-2xl">{course.outcomeIntro}</p>
              )}
              <div className="grid sm:grid-cols-2 gap-4">
                {course.highlights.map((h) => {
                  const { lead, detail } = splitOutcome(h);
                  return (
                    <div key={h} className="card p-5 flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 shrink-0 mt-0.5" style={{ color: "#c9a84c" }} aria-hidden="true" />
                      <div>
                        {lead && <div className="font-semibold text-[#0f2150] text-sm mb-1">{lead}</div>}
                        <p className="text-[#1a1a2e]/65 text-sm leading-relaxed">{detail}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          )}

          {/* Course roadmap */}
          {course.modules && course.modules.length > 0 && (
            <section className="mb-12">
              <h2 className="font-heading text-2xl font-bold text-[#0f2150] mb-2">Course Roadmap</h2>
              <p className="text-[#1a1a2e]/60 text-sm mb-6 max-w-2xl">
                Over {course.duration ?? "the session"}, the course moves through the modules below. This program is the
                foundational blueprint for future advanced, hands-on sessions.
              </p>
              <ol className="relative border-l-2 pl-6 space-y-5" style={{ borderColor: "#e2e8f0" }}>
                {course.modules.map((m, i) => (
                  <li key={m.title} className="relative">
                    <span
                      className="absolute -left-[2.15rem] top-0 flex items-center justify-center w-7 h-7 rounded-full text-xs font-bold text-white"
                      style={{ background: "#1b3a8a" }}
                      aria-hidden="true"
                    >
                      {i + 1}
                    </span>
                    <div className="card p-4">
                      <div className="font-semibold text-[#0f2150] mb-1">{m.title}</div>
                      <p className="text-sm text-[#1a1a2e]/65 leading-relaxed">{m.detail}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </section>
          )}

          {/* Schedule (legacy multi-day courses) */}
          {course.schedule && (
            <section className="mb-12">
              <h2 className="font-heading text-2xl font-bold text-[#0f2150] mb-5">Course Schedule</h2>
              <div className="space-y-3">
                {course.schedule.map((s) => (
                  <div key={s.day} className="flex items-start gap-4 rounded-xl p-4" style={{ background: "#f5f7fb" }}>
                    <span className="text-xs font-bold rounded-lg px-3 py-1.5 shrink-0" style={{ background: "#1b3a8a", color: "#fff" }}>{s.day}</span>
                    <span className="text-sm text-[#1a1a2e]/70 leading-relaxed">{s.topic}</span>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Instructor */}
          <section className="mb-12">
            <h2 className="font-heading text-2xl font-bold text-[#0f2150] mb-5">Your Instructor</h2>
            <div className="card p-6 flex flex-col sm:flex-row items-start gap-5">
              {course.instructorPhoto ? (
                <div className="w-24 h-24 rounded-2xl shrink-0 overflow-hidden border-2 border-[#c9a84c]/30">
                  <Image src={course.instructorPhoto} alt={`Portrait of ${course.instructor}`} width={96} height={96} className="w-full h-full object-cover" />
                </div>
              ) : (
                <div className="w-24 h-24 rounded-2xl shrink-0 flex items-center justify-center text-3xl font-bold text-white" style={{ background: "#1b3a8a" }}>
                  {course.instructor.charAt(0)}
                </div>
              )}
              <div>
                <div className="font-heading text-xl font-bold text-[#0f2150]">{course.instructor}</div>
                <div className="text-xs font-semibold uppercase tracking-wide mt-1 mb-3" style={{ color: "#c9a84c" }}>
                  {course.instructorTitle ?? "Course Instructor · CanaDent Faculty"}
                </div>
                {course.instructorBio && (
                  <p className="text-sm text-[#1a1a2e]/70 leading-relaxed">{course.instructorBio}</p>
                )}
              </div>
            </div>
          </section>

          <Link href="/courses" className="inline-flex items-center gap-2 text-sm font-medium text-[#1b3a8a] hover:text-[#0f2150] transition-colors">
            <ChevronLeft className="h-4 w-4" />
            Back to All Courses
          </Link>
        </div>

        {/* ── Sidebar ── */}
        <aside className="space-y-5">
          <div className="card p-6 lg:sticky lg:top-6">
            {cancelled === "true" && (
              <div className="flex items-center gap-2 rounded-xl px-4 py-3 mb-4 text-sm" style={{ background: "#fef9ec", color: "#92400e" }}>
                <AlertCircle className="h-4 w-4 shrink-0" />
                Payment was cancelled. You can try again below.
              </div>
            )}

            {course.status === "sold-out" ? (
              <CourseRequestPanel course={toCourseSummary(course)} />
            ) : course.isFree ? (
              <div>
                <div className="mb-4"><span className="font-heading text-3xl font-bold text-[#0f2150]">Free</span></div>
                <RegistrationPanel slug={course.slug} title={course.title} price={0} />
              </div>
            ) : (
              <RegistrationPanel
                slug={course.slug}
                title={course.title}
                price={course.price ?? 0}
                options={course.priceOptions}
                modes={course.attendanceModes}
              />
            )}

            {/* Snapshot details */}
            <ul className="space-y-3 mt-6 pt-6 border-t border-[#1a1a2e]/8 text-sm text-[#1a1a2e]/65">
              <li className="flex items-start gap-3">
                <Calendar className="h-4 w-4 shrink-0 mt-0.5" style={{ color: "#c9a84c" }} />
                <div>
                  <div className="font-medium text-[#0f2150]">{course.date}</div>
                  {course.time && <div className="text-xs">{course.time} ET</div>}
                </div>
              </li>
              <li className="flex items-start gap-3"><MapPin className="h-4 w-4 shrink-0 mt-0.5" style={{ color: "#c9a84c" }} /><span>{course.location}</span></li>
              {course.ceCredits && (
                <li className="flex items-center gap-3"><GraduationCap className="h-4 w-4 shrink-0" style={{ color: "#c9a84c" }} />{course.ceCredits}</li>
              )}
            </ul>

            {/* Help */}
            <div className="mt-5 pt-5 border-t border-[#1a1a2e]/8">
              <div className="text-xs font-semibold text-[#0f2150] mb-2">Need help choosing?</div>
              <a href="tel:14373700122" className="flex items-center gap-2 text-xs text-[#1a1a2e]/55 hover:text-[#1b3a8a] transition-colors mb-1.5">
                <Phone className="h-3.5 w-3.5" style={{ color: "#c9a84c" }} />1.437.370.0122
              </a>
              <a href="mailto:canadent.edu@gmail.com" className="flex items-center gap-2 text-xs text-[#1a1a2e]/55 hover:text-[#1b3a8a] transition-colors mb-1.5">
                <Mail className="h-3.5 w-3.5" style={{ color: "#c9a84c" }} />canadent.edu@gmail.com
              </a>
              <p className="text-xs text-[#1a1a2e]/45">Monday–Friday, 10:00 AM–4:00 PM ET</p>
            </div>
          </div>

          {/* Policies */}
          <div className="rounded-xl p-5 text-sm" style={{ background: "#f5f7fb", border: "1px solid #e2e8f0" }}>
            <h3 className="font-semibold text-[#0f2150] mb-2">Before You Register</h3>
            <p className="text-xs text-[#1a1a2e]/60 leading-relaxed mb-3">
              Please review our enrolment agreement, cancellation policy, and course terms before registering.
            </p>
            <Link href="/enrolment-agreement" className="text-xs font-semibold underline underline-offset-2 inline-flex items-center gap-1" style={{ color: "#1b3a8a" }}>
              Read Enrolment Agreement <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
        </aside>
      </div>
    </>
  );
}
