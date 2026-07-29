import Link from "next/link";
import Image from "next/image";
import { courses } from "@/lib/courses";
import { getAllArticles } from "@/lib/articles";
import { BlurImage } from "@/components/BlurImage";
import { ScrollReveal } from "@/components/ScrollReveal";
import {
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
  CheckCircle,
  Clock,
  FileText,
} from "lucide-react";

const stats = [
  { value: "+500", label: "Dentists Trained" },
  { value: "50+", label: "Courses Offered" },
  { value: "+20", label: "Expert Instructors" },
  { value: "Type 2 and 3", label: "CE Credit Categories" },
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

function formatArticleDate(dateString: string) {
  return new Date(dateString).toLocaleDateString("en-CA", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default function HomePage() {
  const latestArticles = getAllArticles().slice(0, 3);
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
                <div className="relative w-full overflow-hidden" style={{ height: 0, paddingBottom: '100%' }}>
                  <BlurImage
                    src="/course-advanced-adhesive.png"
                    alt="Advanced Adhesive Dentistry: The Master Blueprint"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                </div>
                <div className="p-6 lg:p-8 flex flex-col flex-1">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="badge-enrolling">Enrolling Now</span>
                    <span className="badge-early-bird">Early Bird — Until Aug 10</span>
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
                      6 CE Credits · In-Person Lecture
                    </div>
                  </div>
                  <div className="mt-auto pt-4 border-t border-[#1a1a2e]/8 flex items-center justify-between gap-4">
                    <div>
                      <span className="text-sm font-semibold line-through text-red-500 block leading-none mb-1">$799</span>
                      <span className="font-heading text-2xl font-bold text-green-600">$699</span>
                      <span className="text-xs text-[#1a1a2e]/50 block">Until Aug 10</span>
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
                <div className="relative w-full overflow-hidden" style={{ height: 0, paddingBottom: '100%' }}>
                  <BlurImage
                    src="/course-daily-orthodontic.jpeg"
                    alt="Daily and Unique Orthodontic Techniques"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                </div>
                <div className="p-6 lg:p-8 flex flex-col flex-1">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="badge-enrolling">Enrolling Now</span>
                    <span className="badge-early-bird">Early Bird — Until Aug 10</span>
                  </div>
                  <h3 className="font-heading text-xl font-bold text-[#0f2150] leading-snug mb-1">
                    Daily and Unique Orthodontic Techniques
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
                    Early Bird valid until August 10, 2026
                  </p>
                  <div className="mt-auto pt-4 border-t border-[#1a1a2e]/8 flex items-center justify-between gap-4">
                    <div>
                      <span className="text-sm font-semibold line-through text-red-500 block leading-none mb-1">$999</span>
                      <span className="font-heading text-2xl font-bold text-green-600">$799</span>
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

            <div className="grid lg:grid-cols-3 gap-6">
              {/* Featured article — spans 2 columns on large screens */}
              {latestArticles[0] && (
                <ScrollReveal>
                  <article className="card overflow-hidden flex flex-col group lg:col-span-2">
                    <Link
                      href={`/articles/${latestArticles[0].slug}`}
                      className="block relative w-full overflow-hidden bg-[#f0ece2]"
                      style={{ aspectRatio: "16/9" }}
                    >
                      <Image
                        src={latestArticles[0].heroImage}
                        alt={latestArticles[0].heroImageAlt}
                        fill
                        sizes="(max-width: 1024px) 100vw, 66vw"
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    </Link>
                    <div className="p-6 lg:p-8 flex flex-col flex-1">
                      <div className="flex items-center gap-2 mb-3">
                        <span
                          className="rounded-full px-3 py-1 text-[0.65rem] font-bold tracking-wide uppercase"
                          style={{ background: "#f5f0e8", color: "#a87219" }}
                        >
                          {latestArticles[0].category}
                        </span>
                      </div>
                      <Link href={`/articles/${latestArticles[0].slug}`}>
                        <h3 className="font-heading text-xl lg:text-2xl font-bold text-[#0f2150] leading-snug mb-3 group-hover:text-[#1b3a8a] transition-colors">
                          {latestArticles[0].title}
                        </h3>
                      </Link>
                      <p className="text-sm text-[#1a1a2e]/60 leading-relaxed mb-5 flex-1 line-clamp-3">
                        {latestArticles[0].excerpt}
                      </p>
                      <div className="flex items-center justify-between gap-4 border-t border-[#1a1a2e]/8 pt-4">
                        <div className="flex items-center gap-3 text-xs text-[#1a1a2e]/50">
                          <span className="flex items-center gap-1.5">
                            <User className="h-3.5 w-3.5" style={{ color: "#c9a84c" }} />
                            {latestArticles[0].author}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="h-3.5 w-3.5" style={{ color: "#c9a84c" }} />
                            {latestArticles[0].readTimeMinutes} min
                          </span>
                        </div>
                        <Link
                          href={`/articles/${latestArticles[0].slug}`}
                          className="text-sm font-semibold flex items-center gap-1 hover:gap-2 transition-all"
                          style={{ color: "#1b3a8a" }}
                        >
                          Read Article <ArrowRight className="h-4 w-4" />
                        </Link>
                      </div>
                    </div>
                  </article>
                </ScrollReveal>
              )}

              {/* Smaller article cards */}
              <div className="flex flex-col gap-6">
                {latestArticles.slice(1, 3).map((article, i) => (
                  <ScrollReveal key={article.slug} delay={(i + 1) * 80}>
                    <article className="card overflow-hidden flex flex-col sm:flex-row lg:flex-col group">
                      <Link
                        href={`/articles/${article.slug}`}
                        className="block relative shrink-0 overflow-hidden bg-[#f0ece2] sm:w-40 lg:w-full"
                        style={{ aspectRatio: "16/9" }}
                      >
                        <Image
                          src={article.heroImage}
                          alt={article.heroImageAlt}
                          fill
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 160px, 33vw"
                          className="object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      </Link>
                      <div className="p-5 flex flex-col flex-1">
                        <span
                          className="inline-block rounded-full px-2.5 py-0.5 text-[0.6rem] font-bold tracking-wide uppercase mb-2 self-start"
                          style={{ background: "#f5f0e8", color: "#a87219" }}
                        >
                          {article.category}
                        </span>
                        <Link href={`/articles/${article.slug}`}>
                          <h3 className="font-heading text-base font-bold text-[#0f2150] leading-snug mb-2 group-hover:text-[#1b3a8a] transition-colors line-clamp-2">
                            {article.title}
                          </h3>
                        </Link>
                        <p className="text-xs text-[#1a1a2e]/55 leading-relaxed line-clamp-2 mb-3 flex-1">
                          {article.excerpt}
                        </p>
                        <div className="flex items-center justify-between gap-2 text-xs text-[#1a1a2e]/45">
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" style={{ color: "#c9a84c" }} />
                            {formatArticleDate(article.publishDate)}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" style={{ color: "#c9a84c" }} />
                            {article.readTimeMinutes} min
                          </span>
                        </div>
                      </div>
                    </article>
                  </ScrollReveal>
                ))}

                {/* Placeholder card if only 1 article */}
                {latestArticles.length === 1 && (
                  <div
                    className="card p-8 flex flex-col items-center justify-center text-center gap-4 border-2 border-dashed"
                    style={{ borderColor: "rgba(201,168,76,0.3)", minHeight: 180 }}
                  >
                    <FileText className="h-8 w-8" style={{ color: "#c9a84c", opacity: 0.5 }} />
                    <p className="text-sm text-[#1a1a2e]/40">More articles coming soon.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      )}

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
                { icon: BookOpen, label: "50+ Courses", sub: "Across all disciplines" },
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
            {featuredCourses.map((course, i) => {
              const isEnrolling = course.slug === "advanced-adhesive-dentistry-master-blueprint";
              const isUpcoming = course.slug === "daily-unique-orthodontic-techniques";
              const hasRing = isEnrolling || isUpcoming;
              return (
              <ScrollReveal key={course.slug} delay={i * 80}>
                <Link
                  href={`/courses/${course.slug}`}
                  className={`card block overflow-hidden group h-full${hasRing ? " ring-2 ring-[#c9a84c]/40" : ""}`}
                >
                  {course.image ? (
                    <div className="relative w-full overflow-hidden" style={{ height: 0, paddingBottom: '100%' }}>
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
                          <div>
                            <div className="flex items-baseline gap-2">
                              <span className="font-bold text-[#0f2150]">${course.price?.toLocaleString()}</span>
                              {course.originalPrice && (
                                <span className="text-xs text-[#1a1a2e]/40 line-through">
                                  ${course.originalPrice.toLocaleString()}
                                </span>
                              )}
                            </div>
                            {course.earlyBirdDeadline && (
                              <p className="text-[0.6rem] font-bold uppercase tracking-wide mt-0.5" style={{ color: "#a87219" }}>
                                Early Bird · Until {course.earlyBirdDeadline}
                              </p>
                            )}
                          </div>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        {(isEnrolling || isUpcoming) && <span className="badge-enrolling">Enrolling Now</span>}
                        {course.status === "sold-out" && <span className="badge-sold-out">Sold Out</span>}
                      </div>
                    </div>
                  </div>
                </Link>
              </ScrollReveal>
              );
            })}
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
