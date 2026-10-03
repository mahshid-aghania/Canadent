import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight,
  Check,
  ChevronLeft,
  Phone,
  Mail,
  User,
} from "lucide-react";
import { PackageRegisterButton } from "@/components/PackageRegisterButton";
import {
  fourCoursePackage,
  allocationSum,
} from "@/lib/package";
import { TAX_PERCENTAGE, TAX_SUFFIX, taxOn, totalWithTax } from "@/lib/tax";

const pkg = fourCoursePackage;

function money(n: number) {
  return n.toLocaleString("en-CA", { minimumFractionDigits: 0, maximumFractionDigits: 2 });
}
function money2(n: number) {
  return n.toLocaleString("en-CA", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

export const metadata: Metadata = {
  metadataBase: new URL("https://www.canadent.net"),
  title: "Four-Course Package",
  description:
    "Explore four CanaDent dental continuing education courses in one convenient package for $900 CAD (plus HST).",
  alternates: { canonical: pkg.route },
  openGraph: {
    title: "Four Courses. One Complete Learning Package. | CanaDent Education Center",
    description:
      "Four CanaDent dental continuing education courses in one package — $900 CAD (plus HST).",
    url: pkg.route,
    type: "website",
    images: [
      { url: "/course-adhesive-dentistry-poster.jpeg", width: 1080, height: 1350, alt: "CanaDent course package" },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Four Courses. One Complete Learning Package. | CanaDent",
    description: "Four CanaDent dental CE courses in one package — $900 CAD (plus HST).",
    images: ["/course-adhesive-dentistry-poster.jpeg"],
  },
};

// Structured data — breadcrumb trail plus a Product/Offer, since every course is
// confirmed and the bundle is purchasable online at the advertised price.
const breadcrumbJsonLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: "https://www.canadent.net/" },
    { "@type": "ListItem", position: 2, name: "Course Packages", item: `https://www.canadent.net${pkg.route}` },
  ],
};

const productJsonLd = {
  "@context": "https://schema.org",
  "@type": "Product",
  name: "CanaDent Four-Course Package",
  description:
    "Four CanaDent dental continuing education courses bundled into one package for a single price.",
  brand: { "@type": "Brand", name: "CanaDent Education Center" },
  url: `https://www.canadent.net${pkg.route}`,
  offers: {
    "@type": "Offer",
    price: String(pkg.totalCAD),
    priceCurrency: "CAD",
    availability: "https://schema.org/InStock",
    url: `https://www.canadent.net${pkg.route}`,
  },
};

export default function FourCoursePackagePage() {
  const subtotal = pkg.totalCAD;
  const tax = taxOn(subtotal);
  const grandTotal = totalWithTax(subtotal);
  const totalsMatch = allocationSum(pkg) === pkg.totalCAD;

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }}
      />

      {/* ── Hero ── */}
      <section className="px-4 pt-14 pb-16" style={{ background: "linear-gradient(135deg, #0f2150, #1b3a8a)" }}>
        <div className="max-w-7xl mx-auto">
          <nav className="text-sm text-white/50 mb-6 flex items-center gap-1.5" aria-label="Breadcrumb">
            <Link href="/" className="hover:text-[#c9a84c] transition-colors">Home</Link>
            <span aria-hidden="true">/</span>
            <span className="text-white">Course Packages</span>
          </nav>

          <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-10 lg:gap-16 items-center">
            <div>
              <span className="section-label">{pkg.eyebrow}</span>
              <h1 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight mb-5">
                {pkg.title}
              </h1>
              <p className="text-white/75 text-lg leading-relaxed max-w-2xl mb-7">
                Explore four dental education courses in one convenient package.
              </p>

              <div className="flex flex-wrap items-end gap-x-4 gap-y-1 mb-2">
                <span className="font-heading text-5xl font-bold text-white">
                  ${money(pkg.totalCAD)} <span className="text-2xl align-middle text-white/70">CAD</span>
                </span>
                <span className="text-white/60 text-sm pb-1.5">{TAX_SUFFIX}</span>
              </div>
              <p className="text-[#c9a84c] font-medium mb-8">Includes all four courses</p>

              <div className="flex flex-wrap items-center gap-3">
                <a href="#register" className="btn-primary">Register for the Package</a>
                <a href="#courses" className="btn-outline-white">Explore Included Courses</a>
              </div>
            </div>

            {/* Compact price card */}
            <div className="w-full max-w-[300px] mx-auto lg:mx-0">
              <div
                className="rounded-2xl p-6 text-center"
                style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(201,168,76,0.3)", boxShadow: "0 24px 60px rgba(0,0,0,0.4)" }}
              >
                <div className="section-label !mb-1">Package Price</div>
                <div className="font-heading text-4xl font-bold text-white mt-2">${money(pkg.totalCAD)} CAD</div>
                <div className="text-white/55 text-sm mt-1">{TAX_SUFFIX} · {TAX_PERCENTAGE}% at checkout</div>
                <div className="h-px my-4" style={{ background: "rgba(255,255,255,0.12)" }} aria-hidden="true" />
                <ul className="text-sm text-white/75 space-y-2 text-left">
                  <li className="flex items-center gap-2"><Check className="h-4 w-4 shrink-0" style={{ color: "#c9a84c" }} aria-hidden="true" />Four courses, one package</li>
                  <li className="flex items-center gap-2"><Check className="h-4 w-4 shrink-0" style={{ color: "#c9a84c" }} aria-hidden="true" />One single payment</li>
                  <li className="flex items-center gap-2"><Check className="h-4 w-4 shrink-0" style={{ color: "#c9a84c" }} aria-hidden="true" />Secure Stripe checkout</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Combined banner composition ── */}
      <section className="px-4 py-16" style={{ background: "#f5f7fb" }}>
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center mb-8">
            <span
              className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-bold tracking-wide"
              style={{ background: "#0f2150", color: "#fff" }}
            >
              <span className="pulse-dot" aria-hidden="true" />
              4 Courses • ${money(pkg.totalCAD)} CAD
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
            {pkg.courses.map((course, i) => (
              <figure key={i} className="flex flex-col">
                <div
                  className="relative w-full rounded-2xl overflow-hidden"
                  style={{ aspectRatio: "4 / 5", background: "#0f2150", boxShadow: "0 18px 50px rgba(15,33,80,0.22)" }}
                >
                  {course.image && (
                    <Image
                      src={course.image}
                      alt={`${course.title} course poster`}
                      fill
                      className="object-contain"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    />
                  )}
                </div>
                <figcaption className="mt-3 text-center text-sm font-medium text-[#0f2150]/70 px-2">
                  {course.title}
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      {/* ── Included courses ── */}
      <section id="courses" className="px-4 py-16 scroll-mt-20 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <span className="section-label">What&apos;s Included</span>
            <h2 className="font-heading text-3xl sm:text-4xl font-bold text-[#0f2150] mt-2">
              The Four Included Courses
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {pkg.courses.map((course, i) => (
              <article key={i} className="card overflow-hidden flex flex-col">
                <div className="relative w-full" style={{ aspectRatio: "4 / 5", background: "#0f2150" }}>
                  {course.image && (
                    <Image
                      src={course.image}
                      alt={`${course.title} course poster`}
                      fill
                      className="object-contain"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    />
                  )}
                </div>

                <div className="p-6 flex flex-col flex-1">
                  <h3 className="font-heading text-lg font-bold text-[#0f2150] leading-snug mb-2">
                    {course.title}
                  </h3>

                  {course.instructor && (
                    <div className="flex items-center gap-2 text-sm text-[#1a1a2e]/60 mb-3">
                      <User className="h-4 w-4 shrink-0" style={{ color: "#c9a84c" }} aria-hidden="true" />
                      {course.instructor}
                    </div>
                  )}

                  {course.summary && (
                    <p className="text-sm text-[#1a1a2e]/70 leading-relaxed mb-5">{course.summary}</p>
                  )}

                  <div className="mt-auto pt-4 border-t border-[#1a1a2e]/8">
                    <div className="text-xs uppercase tracking-wide text-[#1a1a2e]/45 font-semibold mb-0.5">
                      Included course price
                    </div>
                    <div className="font-heading text-2xl font-bold text-[#0f2150] mb-4">
                      ${money(course.allocationCAD)} <span className="text-sm font-normal text-[#1a1a2e]/50">CAD</span>
                    </div>
                    {course.href && (
                      <Link
                        href={course.href}
                        className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#1b3a8a] hover:text-[#0f2150] transition-colors"
                      >
                        View Course Details <ArrowRight className="h-4 w-4" />
                      </Link>
                    )}
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ── Package pricing summary ── */}
      <section className="px-4 py-16" style={{ background: "#f5f7fb" }}>
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-10">
            <span className="section-label">Pricing</span>
            <h2 className="font-heading text-3xl sm:text-4xl font-bold text-[#0f2150] mt-2">
              What You Pay
            </h2>
          </div>

          <div className="card p-6 sm:p-8">
            <ul>
              {pkg.courses.map((course, i) => (
                <li
                  key={i}
                  className="flex items-start justify-between gap-4 py-4 border-b border-[#1a1a2e]/8"
                >
                  <span className="text-[15px] text-[#1a1a2e]/75 leading-snug">
                    {course.title}
                  </span>
                  <span className="font-heading text-lg font-bold text-[#0f2150] whitespace-nowrap">
                    ${money(course.allocationCAD)} CAD
                  </span>
                </li>
              ))}
            </ul>

            <div className="flex items-center justify-between pt-5 mt-1">
              <span className="font-heading text-xl font-bold text-[#0f2150]">Total package price</span>
              <span className="font-heading text-3xl font-bold text-[#0f2150] whitespace-nowrap">
                ${money(pkg.totalCAD)} CAD
              </span>
            </div>

            <div className="mt-5 pt-5 border-t border-[#1a1a2e]/8 text-sm text-[#1a1a2e]/60 space-y-1.5">
              <div className="flex items-center justify-between">
                <span>Subtotal</span>
                <span>${money2(subtotal)} CAD</span>
              </div>
              <div className="flex items-center justify-between">
                <span>{TAX_PERCENTAGE}% HST (added at checkout)</span>
                <span>${money2(tax)} CAD</span>
              </div>
              <div className="flex items-center justify-between font-semibold text-[#0f2150]">
                <span>Total due at checkout</span>
                <span>${money2(grandTotal)} CAD</span>
              </div>
            </div>

            <p className="text-xs text-[#1a1a2e]/50 mt-4 leading-relaxed">
              Prices are in Canadian dollars and exclude {TAX_PERCENTAGE}% Ontario HST, which is
              calculated and added at checkout. You are charged once for the complete package.
            </p>
          </div>
        </div>
      </section>

      {/* ── Registration ── */}
      <section id="register" className="px-4 py-16 scroll-mt-20 bg-white">
        <div className="max-w-xl mx-auto">
          <div className="card p-6 sm:p-8 text-center">
            <span className="section-label">Registration</span>
            <h2 className="font-heading text-3xl font-bold text-[#0f2150] mt-2 mb-2">
              Register for the Package
            </h2>
            <div className="font-heading text-4xl font-bold text-[#0f2150] mt-4">
              ${money(pkg.totalCAD)} CAD <span className="text-lg font-normal text-[#1a1a2e]/50">{TAX_SUFFIX}</span>
            </div>
            <p className="text-sm text-[#1a1a2e]/55 mt-1 mb-6">
              ${money2(grandTotal)} CAD total including {TAX_PERCENTAGE}% HST · one single payment
            </p>

            <PackageRegisterButton slug={pkg.slug} priceCAD={pkg.totalCAD} enabled />

            <div className="mt-6 pt-6 border-t border-[#1a1a2e]/8 text-left">
              <div className="text-xs font-semibold text-[#0f2150] mb-2">Questions about registration?</div>
              <a href="tel:14373700122" className="flex items-center gap-2 text-sm text-[#1a1a2e]/60 hover:text-[#1b3a8a] transition-colors mb-1.5">
                <Phone className="h-4 w-4" style={{ color: "#c9a84c" }} />1.437.370.0122
              </a>
              <a href="mailto:admin@canadent.net" className="flex items-center gap-2 text-sm text-[#1a1a2e]/60 hover:text-[#1b3a8a] transition-colors">
                <Mail className="h-4 w-4" style={{ color: "#c9a84c" }} />admin@canadent.net
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ── FAQ ── (verified answers only) */}
      <section className="px-4 py-16" style={{ background: "#f5f7fb" }}>
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-10">
            <span className="section-label">FAQ</span>
            <h2 className="font-heading text-3xl sm:text-4xl font-bold text-[#0f2150] mt-2">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="space-y-4">
            <details className="card p-5 sm:p-6 group" open>
              <summary className="font-heading text-lg font-bold text-[#0f2150] cursor-pointer list-none flex items-center justify-between">
                Which courses are included?
                <ArrowRight className="h-4 w-4 text-[#c9a84c] group-open:rotate-90 transition-transform" aria-hidden="true" />
              </summary>
              <div className="text-sm text-[#1a1a2e]/70 leading-relaxed mt-3">
                The package includes{" "}
                {pkg.courses.map((c, i) => (
                  <span key={i}>
                    <strong>{c.title}</strong>
                    {i < pkg.courses.length - 1 ? (i === pkg.courses.length - 2 ? ", and " : ", ") : ""}
                  </span>
                ))}
                .
              </div>
            </details>

            <details className="card p-5 sm:p-6 group">
              <summary className="font-heading text-lg font-bold text-[#0f2150] cursor-pointer list-none flex items-center justify-between">
                What is the total package price?
                <ArrowRight className="h-4 w-4 text-[#c9a84c] group-open:rotate-90 transition-transform" aria-hidden="true" />
              </summary>
              <div className="text-sm text-[#1a1a2e]/70 leading-relaxed mt-3">
                The complete package is <strong>${money(pkg.totalCAD)} CAD</strong> (plus HST). You are charged
                once for all four courses together — not per course.
              </div>
            </details>

            <details className="card p-5 sm:p-6 group">
              <summary className="font-heading text-lg font-bold text-[#0f2150] cursor-pointer list-none flex items-center justify-between">
                Are taxes included?
                <ArrowRight className="h-4 w-4 text-[#c9a84c] group-open:rotate-90 transition-transform" aria-hidden="true" />
              </summary>
              <div className="text-sm text-[#1a1a2e]/70 leading-relaxed mt-3">
                No — the ${money(pkg.totalCAD)} CAD price is before tax. {TAX_PERCENTAGE}% Ontario HST
                (${money2(tax)} CAD) is added at checkout, for a total of <strong>${money2(grandTotal)} CAD</strong>.
              </div>
            </details>

            <details className="card p-5 sm:p-6 group">
              <summary className="font-heading text-lg font-bold text-[#0f2150] cursor-pointer list-none flex items-center justify-between">
                Who should I contact with registration questions?
                <ArrowRight className="h-4 w-4 text-[#c9a84c] group-open:rotate-90 transition-transform" aria-hidden="true" />
              </summary>
              <div className="text-sm text-[#1a1a2e]/70 leading-relaxed mt-3">
                Call <a href="tel:14373700122" className="underline" style={{ color: "#1b3a8a" }}>1.437.370.0122</a> or
                email <a href="mailto:admin@canadent.net" className="underline" style={{ color: "#1b3a8a" }}>admin@canadent.net</a>,
                Monday–Friday, 10:00 AM–4:00 PM ET.
              </div>
            </details>
          </div>

          <div className="text-center mt-10">
            <Link href="/courses" className="inline-flex items-center gap-2 text-sm font-medium text-[#1b3a8a] hover:text-[#0f2150] transition-colors">
              <ChevronLeft className="h-4 w-4" />
              Browse all CanaDent courses
            </Link>
          </div>

          {/* Build-time guard: surfaces a visible warning if allocations drift
              away from the advertised total. Never shown when they match. */}
          {!totalsMatch && (
            <p className="mt-6 text-center text-xs" style={{ color: "#b91c1c" }} role="alert">
              Configuration error: course allocations (${money(allocationSum(pkg))}) do not sum to the
              package total (${money(pkg.totalCAD)}).
            </p>
          )}
        </div>
      </section>
    </>
  );
}
