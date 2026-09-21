import type { Metadata } from "next";
import Link from "next/link";
import { Check, Minus } from "lucide-react";

export const metadata: Metadata = {
  title: "Sponsorship Packages",
  description:
    "Partner with CANADENT to connect your brand directly with dentists and dental professionals through our continuing education events. Compare our Basic and Featured sponsorship packages.",
};

// ── Approved content (verbatim — do not alter wording/punctuation/numbers) ──

const INTRO = [
  "Partner with CANADENT to connect your brand directly with dentists and dental professionals through our continuing education events.",
  "Our sponsorship packages are designed to provide different levels of brand exposure, direct engagement, product presentation, and exclusivity.",
];

type Cell = boolean | string;

const BENEFITS: { label: string; basic: Cell; featured: Cell }[] = [
  { label: "Dedicated Exhibitor Table", basic: true, featured: true },
  { label: "Display Products & Promotional Materials", basic: true, featured: true },
  { label: "Direct Networking with Attendees", basic: true, featured: true },
  { label: "Logo on Event Sponsor Materials", basic: true, featured: true },
  { label: "Recognition by CANADENT During Event", basic: true, featured: true },
  { label: "Samples / Giveaways / Special Offers", basic: true, featured: true },
  { label: "Verbal Product/Service Presentation", basic: false, featured: "15 min" },
  { label: "Product Demonstration Opportunity", basic: false, featured: true },
  { label: "Promotional Material in Attendee Package", basic: false, featured: true },
  { label: "Pre-Event Social Media Recognition", basic: false, featured: true },
  { label: "Inclusion in Event Email Communication", basic: false, featured: true },
  { label: "Access to Networking / Break Periods", basic: true, featured: true },
  { label: "Category Exclusivity", basic: false, featured: true },
  { label: "Competing Sponsors at Event", basic: "Possible", featured: "No direct category competitor" },
  {
    label:
      "Sharing the sponsor’s contact information through CANADENT’s social media channels and post-event follow-up communications",
    basic: false,
    featured: "Yes",
  },
];

const PRICING: { tier: string; basic: string; featured: string }[] = [
  { tier: "10 attendees or fewer", basic: "$750", featured: "$1000" },
  { tier: "More than 10 attendees", basic: "$1000", featured: "$1500" },
];

function CellValue({ value }: { value: Cell }) {
  if (value === true) {
    return (
      <span className="inline-flex" title="Included" aria-label="Included">
        <Check className="h-5 w-5" style={{ color: "#2f8f5b" }} aria-hidden="true" />
      </span>
    );
  }
  if (value === false) {
    return (
      <span className="inline-flex" title="Not included" aria-label="Not included">
        <Minus className="h-5 w-5 text-[#1a1a2e]/25" aria-hidden="true" />
      </span>
    );
  }
  return <span className="text-[15px] font-medium text-[#0f2150]">{value}</span>;
}

export default function SponsorshipPackagesPage() {
  return (
    <>
      {/* ── Opening ── */}
      <section
        className="py-16 px-4"
        style={{ background: "linear-gradient(135deg, #0f2150, #1b3a8a)" }}
      >
        <div className="max-w-7xl mx-auto">
          <nav className="text-sm text-white/50 mb-5" aria-label="Breadcrumb">
            <Link href="/" className="hover:text-[#c9a84c] transition-colors">Home</Link>
            <span className="mx-2" aria-hidden="true">/</span>
            <span className="text-white">Sponsorship Packages</span>
          </nav>
          <h1 className="font-heading text-4xl sm:text-5xl font-bold text-white leading-tight mb-6 max-w-4xl">
            CANADENT Sponsorship Packages
          </h1>
          <div className="h-1 w-16 rounded-full" style={{ background: "#c9a84c" }} aria-hidden="true" />
        </div>
      </section>

      {/* ── Intro + Table + Pricing ── */}
      <section className="py-16 px-4" style={{ background: "#f5f7fb" }}>
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Introduction */}
          <div className="space-y-4">
            {INTRO.map((p) => (
              <p key={p} className="text-[#1a1a2e]/75 text-lg leading-relaxed">
                {p}
              </p>
            ))}
          </div>

          {/* Sponsorship Benefits — comparison table */}
          <div className="card p-6 sm:p-8">
            <h2 className="font-heading text-2xl font-bold text-[#0f2150] leading-snug mb-6">
              Sponsorship Benefits
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-left">
                <thead>
                  <tr className="border-b-2 border-[#0f2150]/15">
                    <th scope="col" className="py-3 pr-4 text-[13px] uppercase tracking-wide text-[#1a1a2e]/55 font-semibold">
                      Benefit
                    </th>
                    <th scope="col" className="py-3 px-4 text-center text-[15px] font-heading font-bold text-[#0f2150] whitespace-nowrap">
                      Basic Sponsor
                    </th>
                    <th scope="col" className="py-3 pl-4 text-center text-[15px] font-heading font-bold text-[#0f2150] whitespace-nowrap">
                      Featured Sponsor
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {BENEFITS.map((b) => (
                    <tr key={b.label} className="border-b border-[#1a1a2e]/8 align-top">
                      <th scope="row" className="py-3 pr-4 text-[15px] font-normal text-[#1a1a2e]/75 leading-relaxed">
                        {b.label}
                      </th>
                      <td className="py-3 px-4 text-center">
                        <CellValue value={b.basic} />
                      </td>
                      <td className="py-3 pl-4 text-center">
                        <CellValue value={b.featured} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Sponsorship fee */}
          <div className="card p-6 sm:p-8" style={{ background: "#fffdf7", border: "1px solid #f0dc9d" }}>
            <h2 className="font-heading text-2xl font-bold text-[#0f2150] leading-snug mb-6">
              Sponsorship Fee
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-left">
                <thead>
                  <tr className="border-b-2 border-[#0f2150]/15">
                    <th scope="col" className="py-3 pr-4 text-[13px] uppercase tracking-wide text-[#1a1a2e]/55 font-semibold" />
                    <th scope="col" className="py-3 px-4 text-center text-[15px] font-heading font-bold text-[#0f2150] whitespace-nowrap">
                      Basic Sponsor
                    </th>
                    <th scope="col" className="py-3 pl-4 text-center text-[15px] font-heading font-bold text-[#0f2150] whitespace-nowrap">
                      Featured Sponsor
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {PRICING.map((row) => (
                    <tr key={row.tier} className="border-b border-[#1a1a2e]/8">
                      <th scope="row" className="py-3 pr-4 text-[15px] font-normal text-[#1a1a2e]/75">
                        {row.tier}
                      </th>
                      <td className="py-3 px-4 text-center font-heading text-lg font-bold text-[#0f2150]">
                        {row.basic}
                      </td>
                      <td className="py-3 pl-4 text-center font-heading text-lg font-bold text-[#0f2150]">
                        {row.featured}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Contact CTA */}
          <div className="card p-8 text-center">
            <h2 className="font-heading text-2xl font-bold text-[#0f2150] leading-snug mb-3">
              Interested in becoming a CANADENT Financial &amp; Insurance Partner?
            </h2>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-6 mt-5">
              <a
                href="mailto:admin@canadent.net"
                className="text-[#0f2150] font-medium hover:text-[#c9a84c] transition-colors"
              >
                📧 Email: admin@canadent.net
              </a>
              <a
                href="tel:14379622020"
                className="text-[#0f2150] font-medium hover:text-[#c9a84c] transition-colors"
              >
                📱 Text or Call: 437-962-2020
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
