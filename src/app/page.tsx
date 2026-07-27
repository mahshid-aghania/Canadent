import Link from "next/link";
import Image from "next/image";
import { courses } from "@/lib/courses";
import { BlurImage } from "@/components/BlurImage";
import { ScrollReveal } from "@/components/ScrollReveal";
import {
  CheckCircle,
  Award,
  Users,
  BookOpen,
  ArrowRight,
  GraduationCap,
  Stethoscope,
  TrendingUp,
  Target,
  Telescope,
  Settings2,
  Calendar,
  MapPin,
  User,
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

const missionItems = [
  {
    title: "Mission",
    Icon: Target,
    text: "Creating educational networks across dentistry disciplines by connecting dentists with the world's leading educators, enabling them to revisit, retrain, and optimize their knowledge.",
  },
  {
    title: "Vision",
    Icon: Telescope,
    text: "Today is tomorrow's community health education. We envision a Canada where every dentist has access to world-class continuing education regardless of location or specialty.",
  },
  {
    title: "Services",
    Icon: Settings2,
    text: "Providing theoretical and clinical training from the beginning to the top level — CE-accredited seminars, workshops, hands-on intensives, and online lectures across all dental specialties.",
  },
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

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 py-32 grid lg:grid-cols-2 gap-12 items-center">
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

          {/* Animated logo */}
          <div className="hidden lg:flex items-center justify-center hero-logo-fade">
            <div className="relative flex items-center justify-center" style={{ width: 340, height: 340 }}>
              <div
                className="glow-pulse absolute rounded-full"
                style={{
                  width: 260,
                  height: 260,
                  background: "radial-gradient(circle, rgba(201,168,76,0.3) 0%, transparent 70%)",
                }}
              />
              <svg
                className="ring-spin absolute"
                width={320}
                height={320}
                viewBox="0 0 320 320"
                style={{ top: 10, left: 10 }}
              >
                <circle cx="160" cy="160" r="150" fill="none" stroke="rgba(201,168,76,0.35)" strokeWidth="1.5" strokeDasharray="8 10" strokeLinecap="round" />
              </svg>
              <svg
                className="ring-spin-rev absolute"
                width={240}
                height={240}
                viewBox="0 0 240 240"
                style={{ top: 50, left: 50 }}
              >
                <circle cx="120" cy="120" r="110" fill="none" stroke="rgba(201,168,76,0.2)" strokeWidth="1" strokeDasharray="4 14" strokeLinecap="round" />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="dot-orbit-1 absolute">
                  <div className="w-3 h-3 rounded-full" style={{ background: "#c9a84c", boxShadow: "0 0 8px #c9a84c" }} />
                </div>
                <div className="dot-orbit-2 absolute">
                  <div className="w-2 h-2 rounded-full" style={{ background: "rgba(201,168,76,0.7)" }} />
                </div>
                <div className="dot-orbit-3 absolute">
                  <div className="w-1.5 h-1.5 rounded-full" style={{ background: "rgba(255,255,255,0.5)" }} />
                </div>
              </div>
              <div
                className="logo-float relative z-10 rounded-2xl flex items-center justify-center p-8"
                style={{
                  background: "rgba(255,255,255,0.08)",
                  border: "1px solid rgba(201,168,76,0.4)",
                  backdropFilter: "blur(12px)",
                  width: 200,
                  height: 200,
                  boxShadow: "0 20px 60px rgba(0,0,0,0.35), 0 0 40px rgba(201,168,76,0.15)",
                }}
              >
                <Image
                  src="/logo.png"
                  alt="CanaDent Education Center"
                  width={160}
                  height={60}
                  className="w-full h-auto object-contain brightness-0 invert"
                  priority
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── STATS BAR ── */}
      <div className="bg-white border-b border-[#1a1a2e]/8">
        <div className="max-w-7xl mx-auto px-4 py-10">
          <div className="grid grid-cols-2 lg:grid-cols-4 divide-x divide-[#1a1a2e]/8">
            {stats.map((s) => (
              <div key={s.label} className="flex flex-col items-center text-center px-6 py-2">
                <span className="font-heading text-4xl font-bold text-[#0f2150] leading-none">{s.value}</span>
                <span className="text-[10px] font-bold tracking-[0.18em] uppercase text-[#c9a84c] mt-2">{s.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── FEATURED COURSE BANNER ── */}
      <section className="py-14 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div
            className="grid lg:grid-cols-2 gap-0 items-stretch rounded-2xl overflow-hidden shadow-xl"
            style={{ background: "linear-gradient(135deg, #0f2150 0%, #1b3a8a 100%)" }}
          >
            {/* Blur-fill image panel */}
            <div className="relative w-full overflow-hidden" style={{ minHeight: "380px" }}>
              <BlurImage
                src="/course-financial-steps.png"
                alt="Your First Financial Steps as a New Dentist"
                sizes="(max-width: 1024px) 100vw, 50vw"
                priority
              />
            </div>
            {/* Text */}
            <div className="p-8 lg:p-12 flex flex-col justify-center">
              <span className="section-label mb-3 block">Featured Course — Free</span>
              <h2 className="font-heading text-3xl lg:text-4xl font-bold text-white leading-tight mb-4">
                Your First Financial Steps as a New Dentist
              </h2>
              <p className="text-white/70 leading-relaxed mb-6">
                Essential financial strategies for newly licensed dentists entering real-world
                practice — at no cost. 2 CE Credits included.
              </p>
              <ul className="space-y-2.5 text-sm text-white/65 mb-8">
                <li className="flex items-center gap-2.5">
                  <Calendar className="h-4 w-4 shrink-0" style={{ color: "#c9a84c" }} />
                  Sunday, May 31 · 11:00 AM – 2:00 PM
                </li>
                <li className="flex items-center gap-2.5">
                  <MapPin className="h-4 w-4 shrink-0" style={{ color: "#c9a84c" }} />
                  20 Cachet Woods Ct., Markham
                </li>
                <li className="flex items-center gap-2.5">
                  <User className="h-4 w-4 shrink-0" style={{ color: "#c9a84c" }} />
                  Mohammad Hossein Mohammadi, Financial Advisor
                </li>
                <li className="flex items-center gap-2.5">
                  <GraduationCap className="h-4 w-4 shrink-0" style={{ color: "#c9a84c" }} />
                  2 CE Credits (Type 3)
                </li>
              </ul>
              <Link
                href="/courses/your-first-financial-steps-as-a-dentist"
                className="btn-primary inline-flex self-start"
              >
                Learn More
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── WHY CHOOSE CANADENT ── */}
      <section className="py-24 px-4 bg-white">
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
                {whyPoints.map((point, i) => (
                  <ScrollReveal key={point} delay={i * 60}>
                    <li className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 shrink-0 mt-0.5" style={{ color: "#c9a84c" }} />
                      <span className="text-sm text-[#1a1a2e]/70">{point}</span>
                    </li>
                  </ScrollReveal>
                ))}
              </ul>
              <Link href="/courses" className="btn-primary mt-8 inline-flex">
                Browse All Courses
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div
                className="rounded-2xl p-6 flex flex-col gap-3 col-span-2"
                style={{ background: "linear-gradient(135deg, #0f2150, #1b3a8a)" }}
              >
                <Stethoscope className="h-8 w-8" style={{ color: "#c9a84c" }} />
                <div className="font-heading text-white text-xl font-semibold">Clinical Excellence</div>
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
      <section className="py-24 px-4" style={{ background: "#f5f0e8" }}>
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-14">
            <span className="section-label">Our Foundation</span>
            <h2 className="font-heading text-3xl sm:text-4xl font-bold text-[#0f2150] mt-3">
              Mission, Vision &amp; Services
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {missionItems.map((item, i) => (
              <ScrollReveal key={item.title} delay={i * 100}>
                <div className="card p-8 h-full">
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center mb-5"
                    style={{ background: "#f5f0e8" }}
                  >
                    <item.Icon className="h-6 w-6" style={{ color: "#c9a84c" }} />
                  </div>
                  <h3 className="font-heading text-xl font-bold text-[#0f2150] mb-3">{item.title}</h3>
                  <p className="text-sm text-[#1a1a2e]/65 leading-relaxed">{item.text}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── WORLD CLASS FACILITIES ── */}
      <section className="py-24 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-14 items-center">
            <div className="order-2 lg:order-1 space-y-6">
              {values.map(({ icon: Icon, title, desc }, i) => (
                <ScrollReveal key={title} delay={i * 100}>
                  <div className="flex items-start gap-5">
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
                </ScrollReveal>
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
      <section className="py-24 px-4" style={{ background: "#f5f0e8" }}>
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
            {featuredCourses.map((course, i) => (
              <ScrollReveal key={course.slug} delay={i * 80}>
                <Link href={`/courses/${course.slug}`} className="card block overflow-hidden group h-full">
                  {course.image ? (
                    <div className="relative w-full aspect-[4/3] overflow-hidden">
                      <BlurImage
                        src={course.image}
                        alt={course.title}
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      />
                    </div>
                  ) : (
                    <div
                      className="px-5 py-3 text-xs font-semibold tracking-wide uppercase text-white"
                      style={{ background: "#1b3a8a" }}
                    >
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
                      <div className="flex items-center gap-2">
                        <Calendar className="h-3.5 w-3.5 shrink-0" style={{ color: "#c9a84c" }} />
                        {course.date}
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="h-3.5 w-3.5 shrink-0" style={{ color: "#c9a84c" }} />
                        <span className="line-clamp-1">{course.location}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <User className="h-3.5 w-3.5 shrink-0" style={{ color: "#c9a84c" }} />
                        <span className="line-clamp-1">{course.instructor}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-3 border-t border-[#1a1a2e]/8">
                      <div>
                        {course.isFree ? (
                          <span className="badge-free">Free</span>
                        ) : (
                          <div className="flex items-baseline gap-2">
                            <span className="font-bold text-[#0f2150]">${course.price?.toLocaleString()}</span>
                            {course.originalPrice && (
                              <span className="text-xs text-[#1a1a2e]/40 line-through">
                                ${course.originalPrice.toLocaleString()}
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                      {course.status === "sold-out" && <span className="badge-sold-out">Sold Out</span>}
                    </div>
                  </div>
                </Link>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA BAND ── */}
      <section
        className="py-32 px-4 text-center relative overflow-hidden"
        style={{ background: "linear-gradient(135deg, #0f2150 0%, #1b3a8a 100%)" }}
      >
        <div
          className="absolute inset-0 opacity-10"
          style={{ backgroundImage: "radial-gradient(circle at 70% 50%, #c9a84c, transparent 60%)" }}
        />
        <div className="relative z-10 max-w-3xl mx-auto">
          <span className="section-label mb-3 block">Join Our Community</span>
          <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-5 leading-tight">
            Join Over{" "}
            <span style={{ color: "#c9a84c" }}>500 Doctors</span>{" "}
            Taking Advantage of CanaDent
          </h2>
          <p className="text-white/70 text-lg mb-10 max-w-xl mx-auto">
            Expand your skills, earn CE credits, and connect with Canada&apos;s dental education
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
