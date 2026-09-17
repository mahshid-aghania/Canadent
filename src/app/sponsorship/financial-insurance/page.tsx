import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { CheckCircle, BadgeCheck, Mail, MessageSquare } from "lucide-react";

export const metadata: Metadata = {
  title: "Financial & Insurance Sponsorship Partnership",
  description:
    "Connect your brand directly with dentists and dental professionals through CANADENT's continuing education events.",
};

// ── Approved content (verbatim — do not alter wording/punctuation/numbers) ──

const INTRO =
  "Connect your brand directly with dentists and dental professionals through CANADENT’s continuing education events.";

const BENEFITS: { title: string; body: string }[] = [
  {
    title: "Dedicated Sponsor Table",
    body: "A dedicated space throughout the event to showcase your services, promotional materials, brochures, giveaways, and special offers.",
  },
  {
    title: "10–15 Minute Sponsor Presentation",
    body: "An opportunity to introduce your company, services, solutions, or exclusive offers directly to participating dentists.",
  },
  {
    title: "Direct Interaction with Dentists",
    body: "Connect personally with attendees during breaks, networking periods, and other event interactions.",
  },
  {
    title: "Brand Visibility",
    body: "Sponsor recognition by CANADENT during the event and through relevant event communications.",
  },
  {
    title: "Promotional Opportunities",
    body: "Provide brochures, branded materials, giveaways, or exclusive offers to participating dental professionals.",
  },
];

const PARTNERSHIP_INTRO =
  "CANADENT offers a specialized sponsorship partnership for companies providing financial, insurance, banking, investment, accounting, or related professional services to dentists.";

const PARTNERSHIP_BODY =
  "As part of the partnership, the sponsor will have the opportunity to present a dedicated educational course focused on financial, insurance, or related topics relevant to dentists. This provides a longer-format educational environment where your experts can share valuable knowledge, demonstrate expertise, build trust, and develop meaningful relationships with dental professionals.";

const PACKAGE_INCLUDES: string[] = [
  "Sponsorship of 2 In-Person CANADENT CE Events",
  "1 Dedicated Financial & Insurance CE Course, presented by the sponsor",
];

// Pricing table — verbatim figures.
const PRICING: { tier: string; events: string; course: string; total: string }[] = [
  {
    tier: "10 attendees or fewer",
    events: "$750 per event × 2",
    course: "$3,000",
    total: "$4,500",
  },
  {
    tier: "More than 10 attendees",
    events: "$1,000 per event × 2",
    course: "$4,000",
    total: "$6,000",
  },
];

const PAYMENT =
  "Interested sponsors can make an initial payment of $2,000. Before the final session, the total sponsorship fee will be calculated based on the final number of attendees, and any remaining balance will be due before the last session.";

export default function FinancialInsurancePartnershipPage() {
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
            <span className="text-white">Financial &amp; Insurance</span>
          </nav>
          <h1 className="font-heading text-4xl sm:text-5xl font-bold text-white leading-tight mb-4 max-w-4xl">
            Financial &amp; Insurance Sponsorship Partnership
          </h1>
          <p className="text-[#c9a84c] font-medium text-lg mb-6">by the end of 2026</p>
          {/* Gold accent rule */}
          <div className="h-1 w-16 rounded-full" style={{ background: "#c9a84c" }} aria-hidden="true" />
        </div>
      </section>

      {/* ── Hero image ── */}
      <div className="relative w-full aspect-[16/9] max-h-[420px] overflow-hidden">
        <Image
          src="/sponsorship-financial-insurance.jpg"
          alt="CANADENT Financial & Insurance Sponsorship Partnership"
          fill
          sizes="100vw"
          className="object-cover"
          priority
        />
      </div>

      {/* ── Body ── */}
      <section className="py-16 px-4" style={{ background: "#f5f7fb" }}>
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Introduction */}
          <p className="text-[#1a1a2e]/75 text-lg leading-relaxed">{INTRO}</p>

          {/* Sponsorship Benefits */}
          <div className="card p-8">
            <h2 className="font-heading text-2xl font-bold text-[#0f2150] leading-snug mb-6">
              Sponsorship Benefits
            </h2>
            <ul className="space-y-4">
              {BENEFITS.map((b) => (
                <li
                  key={b.title}
                  className="flex items-start gap-3 rounded-xl bg-white p-5 border border-[#1a1a2e]/8"
                >
                  <CheckCircle
                    className="h-5 w-5 shrink-0 mt-0.5"
                    style={{ color: "#c9a84c" }}
                    aria-hidden="true"
                  />
                  <div>
                    <p className="font-heading font-semibold text-[#0f2150] mb-1">{b.title}</p>
                    <p className="text-[15px] text-[#1a1a2e]/75 leading-relaxed">{b.body}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* Partnership overview */}
          <div className="card p-8">
            <p className="text-[#1a1a2e]/75 leading-relaxed mb-4">{PARTNERSHIP_INTRO}</p>
            <p className="text-[#1a1a2e]/75 leading-relaxed mb-6">{PARTNERSHIP_BODY}</p>

            <h3 className="font-heading text-xl font-bold text-[#0f2150] mb-4">
              The partnership package includes:
            </h3>
            <ul className="space-y-3">
              {PACKAGE_INCLUDES.map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <BadgeCheck
                    className="h-5 w-5 shrink-0 mt-0.5"
                    style={{ color: "#a87219" }}
                    aria-hidden="true"
                  />
                  <span className="text-[15px] text-[#1a1a2e]/80 leading-relaxed">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Partnership Pricing */}
          <div className="card p-8" style={{ background: "#fffdf7", border: "1px solid #f0dc9d" }}>
            <h2 className="font-heading text-2xl font-bold text-[#0f2150] leading-snug mb-6">
              Partnership Pricing
            </h2>

            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-left">
                <thead>
                  <tr className="border-b border-[#1a1a2e]/12">
                    <th className="py-3 pr-4 text-[13px] font-semibold uppercase tracking-wide text-[#0f2150]">
                      Event Attendance
                    </th>
                    <th className="py-3 px-4 text-[13px] font-semibold uppercase tracking-wide text-[#0f2150]">
                      2 In-Person CE Events
                    </th>
                    <th className="py-3 px-4 text-[13px] font-semibold uppercase tracking-wide text-[#0f2150]">
                      Dedicated Financial / Insurance Course
                    </th>
                    <th className="py-3 pl-4 text-[13px] font-semibold uppercase tracking-wide text-[#0f2150]">
                      Total Partnership
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {PRICING.map((row) => (
                    <tr key={row.tier} className="border-b border-[#1a1a2e]/8 align-top">
                      <td className="py-4 pr-4 text-[15px] font-medium text-[#0f2150]">{row.tier}</td>
                      <td className="py-4 px-4 text-[15px] text-[#1a1a2e]/75">{row.events}</td>
                      <td className="py-4 px-4 text-[15px] text-[#1a1a2e]/75">{row.course}</td>
                      <td className="py-4 pl-4 text-[15px] font-bold text-[#0f2150]">{row.total}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Payment */}
            <div
              className="mt-8 rounded-xl p-5"
              style={{ background: "#fff", border: "1px solid #f0dc9d" }}
            >
              <h3 className="font-heading text-lg font-bold text-[#0f2150] mb-2">Payment:</h3>
              <p className="text-[15px] text-[#1a1a2e]/75 leading-relaxed">{PAYMENT}</p>
            </div>
          </div>

          {/* Contact CTA */}
          <div
            className="card p-8 text-center"
            style={{ background: "#0f2150", border: "1px solid #0f2150" }}
          >
            <h2 className="font-heading text-2xl font-bold text-white leading-snug mb-3">
              Interested in becoming a CANADENT Financial &amp; Insurance Partner?
            </h2>
            <p className="text-white/70 leading-relaxed mb-6 max-w-2xl mx-auto">
              For more information or to discuss sponsorship opportunities, please email us at
              admin@canadent.net or text us at 437-962-2020.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <a
                href="mailto:admin@canadent.net"
                className="btn-green inline-flex items-center justify-center gap-2 w-full sm:w-auto"
              >
                <Mail className="h-4 w-4" aria-hidden="true" />
                admin@canadent.net
              </a>
              <a
                href="sms:+14379622020"
                className="inline-flex items-center justify-center gap-2 w-full sm:w-auto rounded-lg px-5 py-3 font-medium text-white transition-colors"
                style={{ background: "rgba(255,255,255,0.12)", border: "1px solid rgba(255,255,255,0.25)" }}
              >
                <MessageSquare className="h-4 w-4" aria-hidden="true" />
                437-962-2020
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
