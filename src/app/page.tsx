import Link from "next/link";
import Image from "next/image";
import { getRequestCourseSummaries } from "@/lib/course-requests";
import { TAX_SUFFIX } from "@/lib/tax";
import { getAllArticles } from "@/lib/articles";
import { BlurImage } from "@/components/BlurImage";
import { ScrollReveal } from "@/components/ScrollReveal";
import { CoursesToSeeAgain } from "@/components/course-request/CoursesToSeeAgain";
import {
  BookOpen,
  ArrowRight,
  GraduationCap,
  Calendar,
  MapPin,
  User,
  Clock,
} from "lucide-react";

const stats = [
  { value: "+500", label: "Dentists Trained" },
  { value: "50+", label: "Courses Offered" },
  { value: "+20", label: "Expert Instructors" },
  { value: "Type 2 and 3", label: "CE Credit Categories" },
];

function formatArticleDate(dateString: string) {
  return new Date(dateString).toLocaleDateString("en-CA", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default function HomePage() {
  const latestArticles = getAllArticles();
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

          {/* Premium animated emblem */}
          <div className="hidden lg:flex items-center justify-center hero-logo-fade">
            <div className="relative flex items-center justify-center" style={{ width: 420, height: 420 }}>

              {/* Sonar pulse rings — energy radiating outward */}
              {[0, 2, 4].map((delay) => (
                <div
                  key={delay}
                  className="sonar-ring absolute rounded-full"
                  style={{ width: 360, height: 360, top: 30, left: 30, animationDelay: `${delay}s` }}
                />
              ))}

              {/* Multi-layer glow */}
              <div className="absolute rounded-full" style={{
                width: 290, height: 290,
                background: "radial-gradient(circle, rgba(27,58,138,0.3) 0%, rgba(201,168,76,0.18) 45%, transparent 70%)",
                filter: "blur(28px)",
              }} />
              <div className="glow-pulse absolute rounded-full" style={{
                width: 205, height: 205,
                background: "radial-gradient(circle, rgba(201,168,76,0.32) 0%, rgba(201,168,76,0.08) 60%, transparent 80%)",
                filter: "blur(14px)",
              }} />

              {/* Ring 1 — outermost, slow spin with gradient stroke */}
              <svg className="absolute" style={{ width: 400, height: 400, top: 10, left: 10, animation: "ring-spin 26s linear infinite" }} viewBox="0 0 400 400">
                <defs>
                  <linearGradient id="rg1" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%"   stopColor="#c9a84c" stopOpacity="0" />
                    <stop offset="35%"  stopColor="#c9a84c" stopOpacity="0.65" />
                    <stop offset="65%"  stopColor="#e8d278" stopOpacity="0.45" />
                    <stop offset="100%" stopColor="#c9a84c" stopOpacity="0" />
                  </linearGradient>
                </defs>
                <circle cx="200" cy="200" r="188" fill="none" stroke="url(#rg1)" strokeWidth="1.5" strokeDasharray="12 22" strokeLinecap="round" />
              </svg>

              {/* Ring 2 — mid reverse with cardinal tick marks */}
              <svg className="absolute" style={{ width: 310, height: 310, top: 55, left: 55, animation: "ring-spin-reverse 16s linear infinite" }} viewBox="0 0 310 310">
                <circle cx="155" cy="155" r="143" fill="none" stroke="rgba(201,168,76,0.22)" strokeWidth="0.75" strokeDasharray="4 16" strokeLinecap="round" />
                {[0, 90, 180, 270].map((angle) => {
                  const rad = (angle - 90) * Math.PI / 180;
                  return (
                    <line key={angle}
                      x1={155 + 136 * Math.cos(rad)} y1={155 + 136 * Math.sin(rad)}
                      x2={155 + 149 * Math.cos(rad)} y2={155 + 149 * Math.sin(rad)}
                      stroke="#c9a84c" strokeWidth="2" strokeLinecap="round" opacity="0.55" />
                  );
                })}
              </svg>

              {/* Ring 3 — inner forward */}
              <svg className="absolute" style={{ width: 220, height: 220, top: 100, left: 100, animation: "ring-spin 14s linear infinite" }} viewBox="0 0 220 220">
                <circle cx="110" cy="110" r="100" fill="none" stroke="rgba(201,168,76,0.14)" strokeWidth="1" strokeDasharray="2 9" />
              </svg>

              {/* Ring 4 — innermost reverse */}
              <svg className="absolute" style={{ width: 162, height: 162, top: 129, left: 129, animation: "ring-spin-reverse 22s linear infinite" }} viewBox="0 0 162 162">
                <circle cx="81" cy="81" r="71" fill="none" stroke="rgba(201,168,76,0.1)" strokeWidth="0.75" strokeDasharray="1 7" />
              </svg>

              {/* Orbiting particles — 6 dots at varied radii & speeds */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="dot-orbit-1 absolute">
                  <div className="w-3 h-3 rounded-full" style={{ background: "#c9a84c", boxShadow: "0 0 12px #c9a84c, 0 0 24px rgba(201,168,76,0.5)" }} />
                </div>
                <div className="dot-orbit-2 absolute">
                  <div className="w-2 h-2 rounded-full" style={{ background: "rgba(201,168,76,0.85)", boxShadow: "0 0 8px rgba(201,168,76,0.6)" }} />
                </div>
                <div className="dot-orbit-3 absolute">
                  <div className="w-2 h-2 rounded-full" style={{ background: "rgba(255,255,255,0.7)", boxShadow: "0 0 6px rgba(255,255,255,0.4)" }} />
                </div>
                <div className="dot-orbit-4 absolute">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ background: "#e8d278", boxShadow: "0 0 10px rgba(201,168,76,0.7)" }} />
                </div>
                <div className="dot-orbit-5 absolute">
                  <div className="w-1.5 h-1.5 rounded-full" style={{ background: "rgba(255,255,255,0.55)" }} />
                </div>
                <div className="dot-orbit-6 absolute">
                  <div className="w-2 h-2 rounded-full" style={{ background: "rgba(201,168,76,0.65)", boxShadow: "0 0 6px rgba(201,168,76,0.4)" }} />
                </div>
              </div>

              {/* Logo card — premium glassmorphism */}
              <div
                className="logo-float relative z-10 rounded-3xl flex items-center justify-center overflow-hidden"
                style={{
                  background: "linear-gradient(145deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.04) 100%)",
                  border: "1px solid rgba(201,168,76,0.5)",
                  backdropFilter: "blur(20px)",
                  width: 235,
                  height: 235,
                  boxShadow: "0 32px 80px rgba(0,0,0,0.55), 0 0 0 1px rgba(201,168,76,0.08), 0 0 60px rgba(201,168,76,0.14), inset 0 1px 0 rgba(255,255,255,0.14)",
                }}
              >
                {/* Top edge gold line */}
                <div className="absolute top-0 left-0 right-0 h-px" style={{ background: "linear-gradient(90deg, transparent, rgba(201,168,76,0.75), transparent)" }} />
                {/* Diagonal inner sheen */}
                <div className="absolute inset-0 rounded-3xl" style={{ background: "linear-gradient(135deg, rgba(255,255,255,0.09) 0%, transparent 55%, rgba(201,168,76,0.05) 100%)" }} />
                <Image
                  src="/logo.png"
                  alt="CanaDent Education Center"
                  width={175}
                  height={67}
                  className="relative z-10 w-[74%] h-auto object-contain brightness-0 invert"
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

      {/* ── UPCOMING COURSES ── */}
      <section className="py-20 px-4" style={{ background: "#f5f0e8" }}>
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <span className="section-label">Fall 2026</span>
            <h2 className="font-heading text-3xl sm:text-4xl font-bold text-[#0f2150] mt-3">
              Upcoming Courses
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-6 lg:gap-8">

            {/* Card 1 — Advanced Adhesive Dentistry */}
            <ScrollReveal>
              <div className="card overflow-hidden flex flex-col h-full">
                <div className="relative w-full overflow-hidden" style={{ height: 0, paddingBottom: '125%' }}>
                  <BlurImage
                    src="/course-adhesive-dentistry-poster.jpeg"
                    alt="Advanced Adhesive Dentistry: The Master Blueprint"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                </div>
                <div className="p-6 lg:p-8 flex flex-col flex-1">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="badge-enrolling">Enrolling Now</span>
                  </div>
                  <h3 className="font-heading text-xl font-bold text-[#0f2150] leading-snug mb-1">
                    Advanced Adhesive Dentistry: The Master Blueprint
                  </h3>
                  <p className="text-xs text-[#1b3a8a]/70 mb-4 leading-relaxed">
                    A comprehensive foundation in predictable, minimally invasive, and sensitivity-free restorative workflows.
                  </p>
                  <div className="space-y-1.5 text-xs text-[#1a1a2e]/60 mb-5">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-3.5 w-3.5 shrink-0" style={{ color: "#c9a84c" }} />
                      Sunday, September 6, 2026
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="h-3.5 w-3.5 shrink-0" style={{ color: "#c9a84c" }} />
                      265 Rimrock Rd, North York, ON
                    </div>
                    <div className="flex items-center gap-2">
                      <User className="h-3.5 w-3.5 shrink-0" style={{ color: "#c9a84c" }} />
                      Dr. Amin Asadollahi
                    </div>
                    <div className="flex items-center gap-2">
                      <GraduationCap className="h-3.5 w-3.5 shrink-0" style={{ color: "#c9a84c" }} />
                      6 CE Credits · Hybrid (In-Person / Online)
                    </div>
                  </div>
                  <div className="mt-auto pt-4 border-t border-[#1a1a2e]/8 flex items-end justify-between gap-4">
                    <div>
                      <div className="flex items-baseline gap-2">
                        <span className="text-xs text-[#1a1a2e]/50 w-14 shrink-0">Online</span>
                        <span className="font-heading text-lg font-bold text-[#0f2150]">$499</span>
                        <span className="text-xs text-[#1a1a2e]/50">{TAX_SUFFIX}</span>
                      </div>
                      <div className="flex items-baseline gap-2">
                        <span className="text-xs text-[#1a1a2e]/50 w-14 shrink-0">In-Person</span>
                        <span className="font-heading text-lg font-bold text-[#0f2150]">$799</span>
                        <span className="text-xs text-[#1a1a2e]/50">{TAX_SUFFIX}</span>
                      </div>
                    </div>
                    <Link
                      href="/courses/advanced-adhesive-dentistry-master-blueprint"
                      className="btn-primary"
                    >
                      Reserve Your Seat
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </div>
                </div>
              </div>
            </ScrollReveal>

            {/* Card 2 — Daily and Unique Orthodontic Techniques */}
            <ScrollReveal delay={80}>
              <div className="card overflow-hidden flex flex-col h-full">
                <div className="relative w-full overflow-hidden" style={{ height: 0, paddingBottom: '125%' }}>
                  <BlurImage
                    src="/course-orthodontic-prosthodontics-poster.jpeg"
                    alt="Daily and Unique Orthodontic Techniques for Prosthodontics"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                </div>
                <div className="p-6 lg:p-8 flex flex-col flex-1">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="badge-enrolling">Enrolling Now</span>
                    <span className="badge-early-bird">Early Bird — Until Sep 10</span>
                  </div>
                  <h3 className="font-heading text-xl font-bold text-[#0f2150] leading-snug mb-1">
                    Daily and Unique Orthodontic Techniques for Prosthodontics
                  </h3>
                  <p className="text-xs text-[#1b3a8a]/70 mb-4 leading-relaxed">
                    Evidence-based aligner therapy, advanced biomechanics, and efficient clinical workflows for predictable treatment outcomes.
                  </p>
                  <div className="space-y-1.5 text-xs text-[#1a1a2e]/60 mb-5">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-3.5 w-3.5 shrink-0" style={{ color: "#c9a84c" }} />
                      Sunday, September 27, 2026
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="h-3.5 w-3.5 shrink-0" style={{ color: "#c9a84c" }} />
                      265 Rimrock Rd, North York, ON
                    </div>
                    <div className="flex items-center gap-2">
                      <User className="h-3.5 w-3.5 shrink-0" style={{ color: "#c9a84c" }} />
                      Dr. John C. Voudouris, DDS, D.Ortho, MSc.(D)
                    </div>
                    <div className="flex items-center gap-2">
                      <GraduationCap className="h-3.5 w-3.5 shrink-0" style={{ color: "#c9a84c" }} />
                      6 CE Credits (PACE Approved) · In-Person Lecture
                    </div>
                  </div>
                  <p className="text-[0.6rem] font-bold uppercase tracking-wide mb-4" style={{ color: "#a87219" }}>
                    Early Bird valid until September 10, 2026
                  </p>
                  <div className="mt-auto pt-4 border-t border-[#1a1a2e]/8 flex items-center justify-between gap-4">
                    <div>
                      <span className="text-sm font-semibold line-through text-red-500 block leading-none mb-1">$999</span>
                      <span className="font-heading text-2xl font-bold text-green-600">$799</span>
                      <span className="text-xs text-[#1a1a2e]/50 ml-1">{TAX_SUFFIX}</span>
                      <span className="text-xs text-[#1a1a2e]/50 block">Until Sep 10</span>
                    </div>
                    <Link
                      href="/courses/daily-unique-orthodontic-techniques"
                      className="btn-primary"
                    >
                      Reserve Your Seat
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </div>
                </div>
              </div>
            </ScrollReveal>

          </div>
        </div>
      </section>

      {/* ── LATEST ARTICLES ── */}
      {latestArticles.length > 0 && (
        <section className="py-24 px-4 bg-white">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-12">
              <div>
                <span className="section-label">From Our Blog</span>
                <h2 className="font-heading text-3xl sm:text-4xl font-bold text-[#0f2150] mt-3">
                  Latest Articles
                </h2>
              </div>
              <Link
                href="/articles"
                className="text-sm font-semibold flex items-center gap-1 hover:gap-2 transition-all"
                style={{ color: "#1b3a8a" }}
              >
                View All Articles <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {latestArticles.map((article, i) => (
                <ScrollReveal key={article.slug} delay={i * 80}>
                  <article className="card overflow-hidden flex flex-col group h-full">
                    <Link
                      href={`/articles/${article.slug}`}
                      className="block relative w-full aspect-[16/9] overflow-hidden bg-[#f0ece2]"
                    >
                      <Image
                        src={article.heroImage}
                        alt={article.heroImageAlt}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    </Link>
                    <div className="p-6 flex flex-col flex-1">
                      <div className="flex items-center gap-2 mb-3">
                        <span
                          className="rounded-full px-3 py-1 text-[0.65rem] font-bold tracking-wide uppercase"
                          style={{ background: "#f5f0e8", color: "#a87219" }}
                        >
                          {article.category}
                        </span>
                      </div>
                      <Link href={`/articles/${article.slug}`}>
                        <h3 className="font-heading text-lg font-bold text-[#0f2150] leading-snug mb-2 group-hover:text-[#1b3a8a] transition-colors line-clamp-3">
                          {article.title}
                        </h3>
                      </Link>
                      <p className="text-sm text-[#1a1a2e]/60 leading-relaxed mb-4 line-clamp-2 flex-1">
                        {article.excerpt}
                      </p>
                      <div className="border-t border-[#1a1a2e]/8 pt-4 flex items-center justify-between gap-3 text-xs text-[#1a1a2e]/50">
                        <div className="flex items-center gap-1.5 min-w-0">
                          <User className="h-3.5 w-3.5 shrink-0" style={{ color: "#c9a84c" }} />
                          <span className="truncate">{article.author}</span>
                        </div>
                        <div className="flex items-center gap-3 shrink-0">
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3.5 w-3.5" style={{ color: "#c9a84c" }} />
                            {formatArticleDate(article.publishDate)}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="h-3.5 w-3.5" style={{ color: "#c9a84c" }} />
                            {article.readTimeMinutes} min
                          </span>
                        </div>
                      </div>
                      <Link
                        href={`/articles/${article.slug}`}
                        className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold transition-all hover:gap-2.5"
                        style={{ color: "#1b3a8a" }}
                      >
                        Read Article <ArrowRight className="h-4 w-4" />
                      </Link>
                    </div>
                  </article>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── Courses You'd Like to Attend Again ── */}
      <CoursesToSeeAgain courses={getRequestCourseSummaries()} surface="home" />

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
