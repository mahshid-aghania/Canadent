import Link from "next/link";
import Image from "next/image";
import { courses } from "@/lib/courses";
import {
  CheckCircle,
  Award,
  Users,
  BookOpen,
  Star,
  ArrowRight,
  GraduationCap,
  Stethoscope,
  TrendingUp,
} from "lucide-react";

const stats = [
  { value: "500+", label: "Dentists Trained" },
  { value: "14+", label: "Courses Offered" },
  { value: "10+", label: "Expert Instructors" },
  { value: "7+", label: "CE Credit Categories" },
];

const values = [
  {
    icon: GraduationCap,
    title: "Ultimate Training",
    desc: "Providing theoretical and clinical training from the beginning to the top level, ensuring every participant leaves with practical, applicable skills.",
  },
  {
    icon: TrendingUp,
    title: "Practical Progress",
    desc: "We bridge the gap between academic knowledge and everyday clinical application so your skills grow in the real world.",
  },
  {
    icon: Users,
    title: "Stronger Collective",
    desc: "Building educational networks across dentistry disciplines to foster collaboration and elevate the profession across Canada.",
  },
];

const whyPoints = [
  "World-class instructors including FRCD(C)-certified specialists",
  "Hands-on workshops with real patient scenarios and extracted teeth",
  "CE-accredited courses recognized across Canada",
  "Intimate class sizes for personalized learning",
  "Courses spanning all major dentistry disciplines",
  "Convenient North York & Toronto locations",
];

const featuredCourses = courses.slice(0, 3);

export default function HomePage() {
  return (
    <>
      {/* ── HERO ── */}
      <section
        className="relative min-h-[85vh] flex items-center"
        style={{
          background: "linear-gradient(135deg, #0f2150 0%, #1b3a8a 50%, #1e4db7 100%)",
        }}
      >
        {/* Decorative circles */}
        <div
          className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full opacity-10"
          style={{
            background: "radial-gradient(circle, #c9a84c, transparent)",
            transform: "translate(30%, -30%)",
          }}
        />
        <div
          className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full opacity-8"
          style={{
            background: "radial-gradient(circle, #c9a84c, transparent)",
            transform: "translate(-40%, 40%)",
          }}
        />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 py-24 grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <span className="section-label mb-4 block">CanaDent Education Center</span>
            <h1 className="font-heading text-4xl sm:text-5xl lg:text-[3.5rem] font-bold text-white leading-tight mb-6">
              Inspired By{" "}
              <span style={{ color: "#c9a84c" }}>Excellence</span>{" "}
              &amp;{" "}
              <span style={{ color: "#c9a84c" }}>Innovation</span>
            </h1>
            <p className="text-lg text-white/75 leading-relaxed mb-8 max-w-xl">
              We offer a wide range of high-quality teaching and continuing education for dental
              professionals across Canada — from general dentists to specialists.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link href="/courses" className="btn-primary">
                <BookOpen className="h-4 w-4" />
                Explore Courses
              </Link>
              <Link href="/contact" className="btn-outline-white">
                Contact Us
              </Link>
            </div>

            {/* Trust indicators */}
            <div className="mt-10 flex items-center gap-5">
              <div className="flex -space-x-2">
                {["D", "M", "K", "A"].map((l, i) => (
                  <div
                    key={i}
                    className="w-9 h-9 rounded-full border-2 border-[#1b3a8a] flex items-center justify-center text-xs font-bold text-white"
                    style={{ background: i % 2 === 0 ? "#c9a84c" : "#1e4db7" }}
                  >
                    {l}
                  </div>
                ))}
              </div>
              <p className="text-sm text-white/70">
                <strong className="text-white">500+ dentists</strong> have taken our courses
              </p>
            </div>
          </div>

          {/* Hero card */}
          <div className="hidden lg:block">
            <div className="card p-8" style={{ background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.15)" }}>
              <div className="flex items-center gap-3 mb-6">
                <Award className="h-8 w-8" style={{ color: "#c9a84c" }} />
                <div>
                  <div className="font-heading text-white font-semibold text-lg">CE-Accredited Courses</div>
                  <div className="text-white/50 text-sm">Recognized across Canada</div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 mb-6">
                {stats.map((s) => (
                  <div key={s.label} className="rounded-xl p-4 text-center" style={{ background: "rgba(255,255,255,0.07)" }}>
                    <div className="font-heading text-2xl font-bold" style={{ color: "#c9a84c" }}>{s.value}</div>
                    <div className="text-xs text-white/55 mt-1">{s.label}</div>
                  </div>
                ))}
              </div>
              <div className="flex items-center gap-2 text-sm text-white/60">
                <Star className="h-4 w-4 fill-[#c9a84c] text-[#c9a84c]" />
                <Star className="h-4 w-4 fill-[#c9a84c] text-[#c9a84c]" />
                <Star className="h-4 w-4 fill-[#c9a84c] text-[#c9a84c]" />
                <Star className="h-4 w-4 fill-[#c9a84c] text-[#c9a84c]" />
                <Star className="h-4 w-4 fill-[#c9a84c] text-[#c9a84c]" />
                <span className="ml-1">Rated highly by our participants</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── WHY CHOOSE CANADENT ── */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-14 items-center">
            <div>
              <span className="section-label">Why Choose Us</span>
              <h2 className="font-heading text-3xl sm:text-4xl font-bold text-[#0f2150] mt-3 mb-6 leading-tight">
                Why Choose CanaDent Education Center?
              </h2>
              <p className="text-[#1a1a2e]/65 leading-relaxed mb-8">
                CanaDent Education Center services allow dentists to revisit, retrain, and
                optimize their knowledge and experience. We partner with leading specialists and
                institutions to deliver cutting-edge clinical education that translates directly
                into your practice.
              </p>
              <ul className="space-y-3">
                {whyPoints.map((point) => (
                  <li key={point} className="flex items-start gap-3">
                    <CheckCircle
                      className="h-5 w-5 shrink-0 mt-0.5"
                      style={{ color: "#c9a84c" }}
                    />
                    <span className="text-sm text-[#1a1a2e]/70">{point}</span>
                  </li>
                ))}
              </ul>
              <Link href="/courses" className="btn-primary mt-8 inline-flex">
                Browse All Courses
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            {/* Visual panel */}
            <div className="grid grid-cols-2 gap-4">
              <div
                className="rounded-2xl p-6 flex flex-col gap-3 col-span-2"
                style={{ background: "linear-gradient(135deg, #0f2150, #1b3a8a)" }}
              >
                <Stethoscope className="h-8 w-8" style={{ color: "#c9a84c" }} />
                <div className="font-heading text-white text-xl font-semibold">
                  Clinical Excellence
                </div>
                <p className="text-white/60 text-sm leading-relaxed">
                  Our faculty includes FRCD(C)-certified specialists, professors, and
                  internationally recognized clinicians committed to raising the standard of
                  dental education in Canada.
                </p>
              </div>
              {[
                { icon: BookOpen, label: "14+ Courses", sub: "Across all disciplines" },
                { icon: Award, label: "CE Accredited", sub: "Recognized credentials" },
              ].map(({ icon: Icon, label, sub }) => (
                <div key={label} className="card p-5 flex flex-col gap-2">
                  <Icon className="h-6 w-6" style={{ color: "#c9a84c" }} />
                  <div className="font-semibold text-[#0f2150]">{label}</div>
                  <div className="text-xs text-[#1a1a2e]/50">{sub}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── MISSION / VISION / SERVICES ── */}
      <section className="py-20 px-4" style={{ background: "#f5f7fb" }}>
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-14">
            <span className="section-label">Our Foundation</span>
            <h2 className="font-heading text-3xl sm:text-4xl font-bold text-[#0f2150] mt-3">
              Mission, Vision &amp; Services
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                title: "Mission",
                icon: "🎯",
                text: "Creating educational networks across dentistry disciplines by connecting dentists with the world's leading educators, enabling them to revisit, retrain, and optimize their knowledge.",
              },
              {
                title: "Vision",
                icon: "🔭",
                text: "Today is tomorrow's community health education. We envision a Canada where every dentist has access to world-class continuing education regardless of location or specialty.",
              },
              {
                title: "Services",
                icon: "⚙️",
                text: "Providing theoretical and clinical training from the beginning to the top level — CE-accredited seminars, workshops, hands-on intensives, and online lectures across all dental specialties.",
              },
            ].map((item) => (
              <div key={item.title} className="card p-8">
                <div className="text-4xl mb-5">{item.icon}</div>
                <h3 className="font-heading text-xl font-bold text-[#0f2150] mb-3">{item.title}</h3>
                <p className="text-sm text-[#1a1a2e]/65 leading-relaxed">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── WORLD CLASS FACILITIES ── */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-14 items-center">
            {/* Values */}
            <div className="order-2 lg:order-1 space-y-6">
              {values.map(({ icon: Icon, title, desc }) => (
                <div key={title} className="flex items-start gap-5">
                  <div
                    className="w-12 h-12 rounded-xl shrink-0 flex items-center justify-center"
                    style={{ background: "#1b3a8a" }}
                  >
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-heading font-bold text-[#0f2150] text-lg mb-1">{title}</h3>
                    <p className="text-sm text-[#1a1a2e]/65 leading-relaxed">{desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="order-1 lg:order-2">
              <span className="section-label">Our Core Values</span>
              <h2 className="font-heading text-3xl sm:text-4xl font-bold text-[#0f2150] mt-3 mb-6 leading-tight">
                World Class Facilities &amp; Faculty
              </h2>
              <p className="text-[#1a1a2e]/65 leading-relaxed mb-6">
                CanaDent Education Center is devoted to excellence in teaching, learning, and
                research. Our venues are equipped with state-of-the-art simulation labs, and our
                faculty are among the most respected names in Canadian and international dentistry.
              </p>
              <p className="text-[#1a1a2e]/65 leading-relaxed">
                From our North York campus to partnered facilities across the GTA, Vancouver, and
                beyond, every CanaDent course is delivered in an environment designed to maximize
                learning outcomes.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── FEATURED COURSES ── */}
      <section className="py-20 px-4" style={{ background: "#f5f7fb" }}>
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-12">
            <div>
              <span className="section-label">Continuing Education</span>
              <h2 className="font-heading text-3xl sm:text-4xl font-bold text-[#0f2150] mt-3">
                Featured Courses
              </h2>
            </div>
            <Link
              href="/courses"
              className="text-sm font-semibold flex items-center gap-1 hover:gap-2 transition-all"
              style={{ color: "#1b3a8a" }}
            >
              View All Courses <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredCourses.map((course) => (
              <Link key={course.slug} href={`/courses/${course.slug}`} className="card block overflow-hidden group">
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
                  <div className="px-5 py-3 text-xs font-semibold tracking-wide uppercase text-white" style={{ background: "#1b3a8a" }}>
                    {course.category}
                  </div>
                )}
                <div className="p-6">
                  <h3 className="font-heading font-bold text-[#0f2150] text-lg leading-snug mb-2 group-hover:text-[#1b3a8a] transition-colors">
                    {course.title}
                  </h3>
                  {course.subtitle && (
                    <p className="text-xs text-[#1b3a8a]/70 mb-3">{course.subtitle}</p>
                  )}
                  <p className="text-xs text-[#1a1a2e]/55 mb-4 line-clamp-2">{course.description}</p>

                  <div className="space-y-1.5 text-xs text-[#1a1a2e]/60 mb-4">
                    <div>📅 {course.date}</div>
                    <div>📍 {course.location}</div>
                    <div>👤 {course.instructor}</div>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-[#1a1a2e]/8">
                    <div>
                      {course.isFree ? (
                        <span className="badge-free">Free</span>
                      ) : (
                        <div className="flex items-baseline gap-2">
                          <span className="font-bold text-[#0f2150]">${course.price?.toLocaleString()}</span>
                          {course.originalPrice && (
                            <span className="text-xs text-[#1a1a2e]/40 line-through">${course.originalPrice.toLocaleString()}</span>
                          )}
                        </div>
                      )}
                    </div>
                    {course.status === "sold-out" && <span className="badge-sold-out">Sold Out</span>}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA BAND ── */}
      <section
        className="py-24 px-4 text-center relative overflow-hidden"
        style={{ background: "linear-gradient(135deg, #0f2150 0%, #1b3a8a 100%)" }}
      >
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: "radial-gradient(circle at 70% 50%, #c9a84c, transparent 60%)",
          }}
        />
        <div className="relative z-10 max-w-3xl mx-auto">
          <span className="section-label mb-3 block">Join Our Community</span>
          <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-5 leading-tight">
            Join Over{" "}
            <span style={{ color: "#c9a84c" }}>500 Doctors</span>{" "}
            Taking Advantage of CanaDent
          </h2>
          <p className="text-white/70 text-lg mb-10 max-w-xl mx-auto">
            Expand your skills, earn CE credits, and connect with Canada's dental education
            community. Apply for an upcoming course today.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/courses" className="btn-primary">
              <BookOpen className="h-4 w-4" />
              Apply Now
            </Link>
            <Link href="/contact" className="btn-outline-white">
              Get in Touch
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
