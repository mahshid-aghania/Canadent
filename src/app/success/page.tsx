import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import { BookOpen, Mail, Phone, ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Payment Successful — CanaDent Education Center",
  description: "Your registration is confirmed. Thank you for enrolling with CanaDent Education Center.",
};

type Props = {
  searchParams: Promise<{ course?: string; slug?: string }>;
};

export default async function SuccessPage({ searchParams }: Props) {
  const { course, slug } = await searchParams;
  const courseTitle = course ? decodeURIComponent(course) : null;

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ background: "linear-gradient(160deg, #0f2150 0%, #1b3a8a 55%, #1e4db7 100%)" }}
    >
      {/* Subtle background glows */}
      <div
        className="fixed top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] rounded-full pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(201,168,76,0.12) 0%, transparent 65%)" }}
      />
      <div
        className="fixed bottom-0 right-0 w-[400px] h-[400px] rounded-full pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(201,168,76,0.08) 0%, transparent 70%)", transform: "translate(30%, 30%)" }}
      />

      {/* Minimal header */}
      <header className="relative z-10 max-w-7xl mx-auto w-full px-6 py-6">
        <Link href="/">
          <Image
            src="/logo.png"
            alt="CanaDent Education Center"
            width={160}
            height={50}
            className="h-10 w-auto object-contain brightness-0 invert"
          />
        </Link>
      </header>

      {/* Main content */}
      <main className="relative z-10 flex-1 flex items-center justify-center px-4 py-16">
        <div className="w-full max-w-2xl text-center">

          {/* Animated checkmark */}
          <div className="flex items-center justify-center mb-10">
            <div
              className="relative flex items-center justify-center rounded-full"
              style={{
                width: 120,
                height: 120,
                background: "rgba(255,255,255,0.07)",
                border: "2px solid rgba(201,168,76,0.4)",
                boxShadow: "0 0 60px rgba(201,168,76,0.2), 0 0 120px rgba(201,168,76,0.08)",
                animation: "success-pop 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275) both",
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="52"
                height="52"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#c9a84c"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                style={{ animation: "check-draw 0.4s ease 0.3s both" }}
              >
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>
          </div>

          {/* Heading */}
          <div
            className="mb-3 text-xs font-bold tracking-[0.2em] uppercase"
            style={{ color: "#c9a84c" }}
          >
            Registration Confirmed
          </div>
          <h1
            className="font-heading text-4xl sm:text-5xl font-bold text-white mb-5 leading-tight"
          >
            Thank You — You&apos;re
            <br />
            <span style={{ color: "#c9a84c" }}>All Registered!</span>
          </h1>

          {/* Course name pill */}
          {courseTitle && (
            <div className="inline-flex items-center gap-2 rounded-full px-5 py-2 mb-8 text-sm font-medium text-white/80" style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.15)" }}>
              <BookOpen className="h-4 w-4 shrink-0" style={{ color: "#c9a84c" }} />
              {courseTitle}
            </div>
          )}

          {/* Message card */}
          <div
            className="rounded-2xl p-8 mb-10 text-left"
            style={{
              background: "rgba(255,255,255,0.06)",
              border: "1px solid rgba(255,255,255,0.12)",
              backdropFilter: "blur(16px)",
            }}
          >
            <div className="space-y-4 text-white/75 text-base leading-relaxed">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full flex items-center justify-center shrink-0 mt-0.5" style={{ background: "rgba(201,168,76,0.2)" }}>
                  <span className="text-xs font-bold" style={{ color: "#c9a84c" }}>1</span>
                </div>
                <p>
                  <strong className="text-white">Payment received.</strong>{" "}
                  A receipt has been sent to your email address with your transaction details.
                </p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full flex items-center justify-center shrink-0 mt-0.5" style={{ background: "rgba(201,168,76,0.2)" }}>
                  <span className="text-xs font-bold" style={{ color: "#c9a84c" }}>2</span>
                </div>
                <p>
                  <strong className="text-white">We&apos;ll be in touch.</strong>{" "}
                  Our team will contact you within 1–2 business days with course details, schedule, and location information.
                </p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full flex items-center justify-center shrink-0 mt-0.5" style={{ background: "rgba(201,168,76,0.2)" }}>
                  <span className="text-xs font-bold" style={{ color: "#c9a84c" }}>3</span>
                </div>
                <p>
                  <strong className="text-white">Questions?</strong>{" "}
                  Reach us anytime — we&apos;re happy to help with anything before the course date.
                </p>
              </div>
            </div>

            {/* Divider */}
            <div className="mt-6 pt-6 border-t border-white/10 flex flex-col sm:flex-row gap-3">
              <a
                href="mailto:canadent.edu@gmail.com"
                className="flex items-center gap-2 text-sm text-white/60 hover:text-[#c9a84c] transition-colors"
              >
                <Mail className="h-4 w-4 shrink-0" style={{ color: "#c9a84c" }} />
                canadent.edu@gmail.com
              </a>
              <a
                href="tel:14373700122"
                className="flex items-center gap-2 text-sm text-white/60 hover:text-[#c9a84c] transition-colors"
              >
                <Phone className="h-4 w-4 shrink-0" style={{ color: "#c9a84c" }} />
                1.437.370.0122
              </a>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/courses" className="btn-primary">
              <BookOpen className="h-4 w-4" />
              Browse More Courses
            </Link>
            <Link href="/" className="btn-outline-white flex items-center gap-2">
              Back to Home
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </main>

      {/* Footer note */}
      <footer className="relative z-10 text-center py-6 text-xs text-white/30">
        © {new Date().getFullYear()} CanaDent Education Center. All rights reserved.
      </footer>

      <style>{`
        @keyframes success-pop {
          from { opacity: 0; transform: scale(0.5); }
          to   { opacity: 1; transform: scale(1); }
        }
        @keyframes check-draw {
          from { stroke-dasharray: 30; stroke-dashoffset: 30; opacity: 0; }
          to   { stroke-dasharray: 30; stroke-dashoffset: 0; opacity: 1; }
        }
      `}</style>
    </div>
  );
}
