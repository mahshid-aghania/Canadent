import type { Metadata } from "next";
import Link from "next/link";
import { CheckCircle, BadgeCheck } from "lucide-react";
import { SponsorshipCheckoutButton } from "@/components/SponsorshipCheckoutButton";

export const metadata: Metadata = {
  title: "Sponsorship",
  description:
    "CANADENT sponsorship opportunity — connect with dentists and dental professionals across the GTA and Canada at our continuing education events.",
};

// ── Approved content (verbatim — do not alter wording/punctuation/numbers) ──

const INTRO =
  "With our strong and growing network of dentists, dental professionals, instructors, and industry partners across the GTA and Canada, our events provide an excellent opportunity for companies looking to increase brand visibility, introduce their products and services, and build meaningful relationships with practicing dentists.";

const EVENT = {
  title: "Things I Wish Someone Had Told Me – Series 01",
  meta: [
    "📅 October 23, 2026",
    "📍 265 Rimrock Road, North York, ON",
    "⏱ Hybrid CE Course (In-Person / Online) · 2 CE Credits",
  ],
  description:
    "A New Dentist's Guide to the Real World, presented by Dr. Fatemeh Hosseinkhani. This practice-management session brings together newly licensed and internationally trained dentists entering Canadian practice, giving sponsors direct access to an engaged and professionally relevant audience.",
};

// `lead` is an existing opening phrase that may be emphasised; `rest` is the
// remainder. Concatenated (lead + rest) they reproduce the approved text exactly.
const BENEFITS: { lead: string; rest: string }[] = [
  {
    lead: "Dedicated Sponsor Table",
    rest: " throughout the event to showcase products, services, samples, brochures, and promotional materials.",
  },
  {
    lead: "10–15 Minute Sponsor Presentation",
    rest: " to introduce your company, products, services, or special offers directly to attendees.",
  },
  {
    lead: "Direct Interaction with Dentists",
    rest: " during breaks and networking periods.",
  },
  {
    lead: "Brand Visibility at the Event",
    rest: ", including sponsor recognition by CANADENT.",
  },
  {
    lead: "",
    rest: "Opportunity to provide promotional materials, samples, giveaways, or exclusive attendee offers.",
  },
  {
    lead: "",
    rest: "Opportunity to build relationships and generate potential leads among participating dental professionals.",
  },
];

const EXCLUSIVITY = {
  lead: "Category Exclusivity:",
  rest: " CANADENT protects the exclusivity of each sponsor by not accepting another sponsor offering directly competing products or services within the same category for the event.",
};

export default function SponsorshipPage() {
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
            <span className="text-white">Sponsorship</span>
          </nav>
          <h1 className="font-heading text-4xl sm:text-5xl font-bold text-white leading-tight mb-6 max-w-4xl">
            CANADENT Sponsorship Opportunity
          </h1>
          {/* Gold accent rule */}
          <div className="h-1 w-16 rounded-full" style={{ background: "#c9a84c" }} aria-hidden="true" />
        </div>
      </section>

      {/* ── Intro + Event + Package ── */}
      <section className="py-16 px-4" style={{ background: "#f5f7fb" }}>
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Introduction — first row of the white area */}
          <p className="text-[#1a1a2e]/75 text-lg leading-relaxed">{INTRO}</p>

          {/* Upcoming Event */}
          <div className="card p-8">
            <h2 className="section-label" style={{ marginBottom: "0.35rem" }}>
              Upcoming Event
            </h2>
            <h3 className="font-heading text-2xl font-bold text-[#0f2150] mb-6 leading-snug">
              {EVENT.title}
            </h3>
            <ul className="divide-y divide-[#1a1a2e]/8 border-y border-[#1a1a2e]/8 mb-6">
              {EVENT.meta.map((row) => (
                <li key={row} className="py-3 text-[#1a1a2e]/75 text-[15px]">
                  {row}
                </li>
              ))}
            </ul>
            <p className="text-[#1a1a2e]/70 leading-relaxed">{EVENT.description}</p>
          </div>

          {/* Sponsorship Package — heading, price, and benefits (moved below) */}
          <div className="card p-8" style={{ background: "#fffdf7", border: "1px solid #f0dc9d" }}>
            <h2 className="font-heading text-2xl font-bold text-[#0f2150] leading-snug mb-5">
              Sponsorship Package — $250 CAD (Tax Included)
            </h2>
            <dl
              className="rounded-xl p-5 mb-8"
              style={{ background: "#fff", border: "1px solid #f0dc9d" }}
            >
              <div className="flex items-baseline justify-between gap-3 py-1">
                <dt className="text-[#1a1a2e]/70 text-[15px]">Sponsorship Fee</dt>
                <dd className="text-[#1a1a2e]/80 text-[15px] font-medium">$221.24</dd>
              </div>
              <div className="flex items-baseline justify-between gap-3 py-1 pb-3 mb-3 border-b border-[#1a1a2e]/8">
                <dt className="text-[#1a1a2e]/70 text-[15px]">HST (13%)</dt>
                <dd className="text-[#1a1a2e]/80 text-[15px] font-medium">+ $28.76</dd>
              </div>
              <div className="flex items-baseline justify-between gap-3">
                <dt className="font-heading text-lg font-bold text-[#0f2150]">Total</dt>
                <dd className="font-heading text-2xl font-bold text-[#0f2150]">$250 CAD</dd>
              </div>
            </dl>

            <h3 className="font-heading text-xl font-bold text-[#0f2150] mb-6">
              The package includes:
            </h3>
            <ul className="grid sm:grid-cols-2 gap-4">
              {BENEFITS.map((b) => (
                <li
                  key={b.rest}
                  className="flex items-start gap-3 rounded-xl bg-white p-5 border border-[#1a1a2e]/8"
                >
                  <CheckCircle
                    className="h-5 w-5 shrink-0 mt-0.5"
                    style={{ color: "#c9a84c" }}
                    aria-hidden="true"
                  />
                  <p className="text-[15px] text-[#1a1a2e]/75 leading-relaxed">
                    {b.lead && <strong className="text-[#0f2150] font-semibold">{b.lead}</strong>}
                    {b.rest}
                  </p>
                </li>
              ))}

              {/* Category Exclusivity — additional emphasis */}
              <li
                className="sm:col-span-2 flex items-start gap-3 rounded-xl p-5"
                style={{ background: "#f8efd0", border: "1.5px solid #e8c765" }}
              >
                <BadgeCheck
                  className="h-5 w-5 shrink-0 mt-0.5"
                  style={{ color: "#a87219" }}
                  aria-hidden="true"
                />
                <p className="text-[15px] text-[#1a1a2e]/80 leading-relaxed">
                  <strong className="text-[#0f2150] font-semibold">{EXCLUSIVITY.lead}</strong>
                  {EXCLUSIVITY.rest}
                </p>
              </li>
            </ul>

            {/* Purchase — Stripe Checkout (tax-inclusive $250 CAD) */}
            <SponsorshipCheckoutButton />
          </div>
        </div>
      </section>
    </>
  );
}
