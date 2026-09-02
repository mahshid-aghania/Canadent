import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import Stripe from "stripe";
import { BookOpen, Mail, Phone, ArrowRight, Calendar, MapPin, Video, User, Hash, CreditCard, Smartphone, AlertCircle } from "lucide-react";
import { getCourse } from "@/lib/courses";
import type { Course } from "@/lib/courses";
import { PaymentCompleted } from "./PaymentCompleted";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Registration — CanaDent Education Center",
  description: "Your CanaDent Education Center registration.",
  robots: { index: false, follow: false },
};

type Props = {
  searchParams: Promise<{ session_id?: string; course?: string; slug?: string }>;
};

type Confirmation = {
  courseTitle: string;
  course?: Course;
  name: string | null;
  attendance: string | null;
  isOnline: boolean;
  amountPaid: string;
  maskedPhone: string | null;
  regNumber: string;
};

function maskPhone(phone: string | null | undefined): string | null {
  if (!phone) return null;
  const digits = phone.replace(/\D/g, "");
  if (digits.length < 4) return null;
  return `•••• •••• ${digits.slice(-4)}`;
}

function compactUtc(iso: string): string {
  return iso.replace(/[-:]/g, "").replace(/\.\d+/, "");
}

function calendarLink(course: Course): string | null {
  if (!course.calendar) return null;
  const { startUtc, endUtc } = course.calendar;
  const dates = `${compactUtc(startUtc)}/${compactUtc(endUtc)}`;
  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: `${course.title} — CanaDent`,
    dates,
    details: `Instructor: ${course.instructor}. Continuing education with CanaDent Education Center.`,
    location: course.location,
  });
  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

async function loadConfirmation(sessionId: string): Promise<Confirmation | "unpaid" | null> {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) return null;
  const stripe = new Stripe(key);

  let session: Stripe.Checkout.Session;
  try {
    session = await stripe.checkout.sessions.retrieve(sessionId);
  } catch {
    return null;
  }

  // Only ever treat this as a confirmed registration once Stripe says it is paid.
  if (session.payment_status !== "paid" && session.status !== "complete") {
    return "unpaid";
  }

  const slug = session.metadata?.slug;
  const course = slug ? getCourse(slug) : undefined;
  const courseTitle = session.metadata?.title ?? course?.title ?? "Your course";
  const attendance = session.metadata?.attendance ?? null;
  const isOnline = (attendance ?? "").toLowerCase().includes("online");
  const amount = session.amount_total ?? 0;
  const regNumber =
    typeof session.payment_intent === "string"
      ? session.payment_intent.toUpperCase()
      : session.id.toUpperCase();

  return {
    courseTitle,
    course,
    name: session.customer_details?.name ?? null,
    attendance,
    isOnline,
    amountPaid: amount === 0 ? "Complimentary" : `$${(amount / 100).toFixed(2)} CAD`,
    maskedPhone: maskPhone(session.customer_details?.phone),
    regNumber: regNumber.replace(/^(PI_|CS_)/, "").slice(-12),
  };
}

const shell = "min-h-screen flex flex-col";
const shellStyle = { background: "linear-gradient(160deg, #0f2150 0%, #1b3a8a 55%, #1e4db7 100%)" };

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <div className={shell} style={shellStyle}>
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] rounded-full pointer-events-none" style={{ background: "radial-gradient(circle, rgba(201,168,76,0.12) 0%, transparent 65%)" }} />
      <header className="relative z-10 max-w-7xl mx-auto w-full px-6 py-6">
        <Link href="/">
          <Image src="/logo.png" alt="CanaDent Education Center" width={160} height={50} className="h-10 w-auto object-contain brightness-0 invert" />
        </Link>
      </header>
      <main className="relative z-10 flex-1 flex items-center justify-center px-4 py-12">{children}</main>
      <footer className="relative z-10 text-center py-6 text-xs text-white/30">
        © {new Date().getFullYear()} CanaDent Education Center. All rights reserved.
      </footer>
    </div>
  );
}

function SupportRow() {
  return (
    <div className="flex flex-col sm:flex-row gap-3">
      <a href="mailto:canadent.edu@gmail.com" className="flex items-center gap-2 text-sm text-white/60 hover:text-[#c9a84c] transition-colors">
        <Mail className="h-4 w-4 shrink-0" style={{ color: "#c9a84c" }} />
        canadent.edu@gmail.com
      </a>
      <a href="tel:14373700122" className="flex items-center gap-2 text-sm text-white/60 hover:text-[#c9a84c] transition-colors">
        <Phone className="h-4 w-4 shrink-0" style={{ color: "#c9a84c" }} />
        1.437.370.0122
      </a>
    </div>
  );
}

export default async function SuccessPage({ searchParams }: Props) {
  const { session_id, course: courseParam } = await searchParams;

  const result = session_id ? await loadConfirmation(session_id) : null;

  // ── Payment could not be verified as complete — never show a success state ──
  if (result === "unpaid") {
    return (
      <Shell>
        <div className="w-full max-w-lg text-center">
          <div className="mx-auto mb-6 w-16 h-16 rounded-full flex items-center justify-center" style={{ background: "rgba(201,168,76,0.15)", border: "1px solid rgba(201,168,76,0.4)" }}>
            <AlertCircle className="h-7 w-7" style={{ color: "#c9a84c" }} />
          </div>
          <h1 className="font-heading text-3xl font-bold text-white mb-3">We&apos;re confirming your payment</h1>
          <p className="text-white/70 mb-8">
            Your payment is still processing. This page will reflect your registration once it&apos;s confirmed —
            you&apos;ll also receive a confirmation email. If you have any questions, reach us below.
          </p>
          <div className="rounded-2xl p-6 mb-8" style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.12)" }}>
            <SupportRow />
          </div>
          <Link href="/courses" className="btn-outline-white inline-flex items-center gap-2">Browse Courses<ArrowRight className="h-4 w-4" /></Link>
        </div>
      </Shell>
    );
  }

  // ── Fallback: no verifiable session (e.g. an old/direct link). Stay truthful. ──
  if (!result) {
    const title = courseParam ? decodeURIComponent(courseParam) : null;
    return (
      <Shell>
        <div className="w-full max-w-lg text-center">
          <h1 className="font-heading text-3xl font-bold text-white mb-3">Thank you</h1>
          <p className="text-white/70 mb-8">
            {title ? <>Thank you for your interest in <strong className="text-white">{title}</strong>. </> : null}
            If you&apos;ve just paid, a confirmation email is on its way. For anything you need, our team is here to help.
          </p>
          <div className="rounded-2xl p-6 mb-8" style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.12)" }}>
            <SupportRow />
          </div>
          <Link href="/courses" className="btn-primary inline-flex items-center gap-2"><BookOpen className="h-4 w-4" />Browse Courses</Link>
        </div>
      </Shell>
    );
  }

  const c = result;
  const firstName = c.name ? c.name.trim().split(" ")[0] : null;
  const calLink = c.course ? calendarLink(c.course) : null;

  const rows: { icon: React.ElementType; label: string; value: string }[] = [
    { icon: User, label: "Registered to", value: c.name ?? "—" },
    { icon: Hash, label: "Registration #", value: c.regNumber },
    { icon: c.isOnline ? Video : MapPin, label: "Attendance", value: c.attendance ?? "—" },
    ...(c.course ? [{ icon: Calendar, label: "Date", value: c.course.date }] : []),
    ...(c.course?.time ? [{ icon: Calendar, label: "Time", value: `${c.course.time} ET (Toronto)` }] : []),
    { icon: CreditCard, label: "Amount paid", value: c.amountPaid },
    ...(c.maskedPhone ? [{ icon: Smartphone, label: "Mobile on file", value: c.maskedPhone }] : []),
  ];

  return (
    <Shell>
      <PaymentCompleted slug={c.course?.slug} attendance={c.isOnline ? "online" : "in-person"} />
      <div className="w-full max-w-2xl">
        <div className="text-center mb-8">
          <div className="mb-3 text-xs font-bold tracking-[0.2em] uppercase" style={{ color: "#c9a84c" }}>
            Registration Confirmed
          </div>
          <h1 className="font-heading text-4xl sm:text-5xl font-bold text-white leading-tight">
            {firstName ? <>You&apos;re registered, {firstName}.</> : <>Your registration is confirmed.</>}
          </h1>
          <p className="mt-4 text-white/70 text-lg">{c.courseTitle}</p>
        </div>

        {/* Details card */}
        <div className="rounded-2xl p-6 sm:p-8 mb-6" style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.12)", backdropFilter: "blur(16px)" }}>
          <dl className="divide-y divide-white/10">
            {rows.map(({ icon: Icon, label, value }) => (
              <div key={label} className="flex items-center justify-between gap-4 py-3">
                <dt className="flex items-center gap-2 text-sm text-white/55">
                  <Icon className="h-4 w-4 shrink-0" style={{ color: "#c9a84c" }} aria-hidden="true" />
                  {label}
                </dt>
                <dd className="text-sm font-semibold text-white text-right">{value}</dd>
              </div>
            ))}
          </dl>
        </div>

        {/* Next steps — differs by attendance type */}
        <div className="rounded-2xl p-6 sm:p-8 mb-6 text-left" style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.12)" }}>
          <h2 className="font-heading text-lg font-bold text-white mb-4">What happens next</h2>
          {c.isOnline ? (
            <ul className="space-y-3 text-white/75 text-sm leading-relaxed">
              <li className="flex items-start gap-3"><Video className="h-4 w-4 shrink-0 mt-0.5" style={{ color: "#c9a84c" }} /><span>Your joining link and access details will be emailed to you before the course date.</span></li>
              <li className="flex items-start gap-3"><BookOpen className="h-4 w-4 shrink-0 mt-0.5" style={{ color: "#c9a84c" }} /><span>The live session is recorded, and the recording will be shared with you afterward.</span></li>
            </ul>
          ) : (
            <ul className="space-y-3 text-white/75 text-sm leading-relaxed">
              <li className="flex items-start gap-3"><MapPin className="h-4 w-4 shrink-0 mt-0.5" style={{ color: "#c9a84c" }} /><span>{c.course?.attendanceModes?.find((m) => m.kind === "in-person")?.location ?? "265 Rimrock Road, North York, Ontario"}</span></li>
              <li className="flex items-start gap-3"><Calendar className="h-4 w-4 shrink-0 mt-0.5" style={{ color: "#c9a84c" }} /><span>Please plan to arrive 15 minutes early to check in. Lunch and refreshments are provided.</span></li>
            </ul>
          )}
          {c.maskedPhone && (
            <p className="mt-4 text-xs text-white/45">
              We&apos;ll use the mobile number ending in {c.maskedPhone.slice(-4)} only for important course updates.
            </p>
          )}
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-8">
          {calLink && (
            <a href={calLink} target="_blank" rel="noopener noreferrer" className="btn-primary">
              <Calendar className="h-4 w-4" />
              Add to Calendar
            </a>
          )}
          <Link href="/my-account" className="btn-outline-white flex items-center gap-2">
            Go to My Account
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="rounded-2xl p-6 text-center" style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.12)" }}>
          <p className="text-sm text-white/60 mb-3">Questions about your registration? We&apos;re here to help.</p>
          <div className="flex justify-center"><SupportRow /></div>
        </div>
      </div>
    </Shell>
  );
}
