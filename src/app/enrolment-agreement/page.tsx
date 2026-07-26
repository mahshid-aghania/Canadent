import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Enrolment Agreement",
  description: "CanaDent Education Center course enrolment agreement, cancellation policy, and terms of participation.",
};

const sections = [
  {
    number: "1",
    title: "Course Fees",
    body: "Credits are non-refundable and non-transferable, and expire after six months from the date of purchase. When multiple discount offers are available simultaneously, only the highest applicable discount will be applied.",
  },
  {
    number: "2",
    title: "Enrollment",
    body: "Applications are submitted upon signing this agreement. CanaDent Education Center has three weeks from the date of submission to review and, if necessary, reject an application. Silence beyond this period constitutes acceptance of the application.",
  },
  {
    number: "3",
    title: "Services Provided",
    body: "Upon enrollment, students are granted access to scheduled sessions as outlined in the course description. Instructors retain control over timing and topic allocation within each session. The program does not guarantee admission to any dental school, and examination results cannot be guaranteed.",
  },
  {
    number: "4",
    title: "Cancellation Policy",
    body: "CanaDent may adjust schedules or cancel a session with advance notice and reimbursement for cancelled sessions. Student cancellations are subject to the following penalties: 25% of the course fee if notice is given less than three weeks before the start date; 50% if notice is given less than one week before the start date; 100% (no refund) if cancellation occurs after the course has begun. No refunds apply for courses with fewer than eight enrolled participants, payment plan arrangements, on-demand services, or one-on-one sessions.",
  },
  {
    number: "5",
    title: "Communications",
    body: "By enrolling, students consent to receive email communications from CanaDent Education Center for a period of up to 24 months following course completion. Students may opt out of non-essential communications at any time using the unsubscribe link included in each email.",
  },
  {
    number: "6",
    title: "Property Damage",
    body: "Students are personally liable for any damage caused to CanaDent premises, equipment, or materials during the course. Acts of vandalism or deliberate damage will result in immediate termination of enrollment without refund.",
  },
  {
    number: "7",
    title: "Code of Conduct",
    body: "Participants are expected to maintain a respectful and professional environment at all times. Violations — including but not limited to unauthorized recording of sessions, disruptive behaviour, or harassment of instructors or fellow participants — may result in immediate expulsion from the course without a refund.",
  },
  {
    number: "8",
    title: "Copyright",
    body: "All course materials, presentations, handouts, and recordings are the intellectual property of CanaDent Education Center. Reproduction, distribution, or use of these materials for any purpose other than personal study requires prior written permission from CanaDent.",
  },
  {
    number: "9",
    title: "Liability Release",
    body: "Students assume full responsibility for their personal safety during all CanaDent events, including in-person sessions and hands-on workshops. By enrolling, students release CanaDent Education Center, its instructors, and its staff from liability for any injury, loss, or damage arising from participation in the program.",
  },
  {
    number: "10",
    title: "Privacy & Promotional Use",
    body: "CanaDent Education Center may use participant names, photographs, video recordings, and voice recordings for promotional, marketing, and educational purposes worldwide, unless the participant has withdrawn consent in writing prior to the event.",
  },
];

export default function EnrolmentAgreementPage() {
  return (
    <>
      {/* Header */}
      <section
        className="py-14 px-4"
        style={{ background: "linear-gradient(135deg, #0f2150, #1b3a8a)" }}
      >
        <div className="max-w-4xl mx-auto">
          <nav className="text-sm text-white/50 mb-4">
            <Link href="/" className="hover:text-[#c9a84c] transition-colors">Home</Link>
            <span className="mx-2">/</span>
            <span className="text-white">Enrolment Agreement</span>
          </nav>
          <span className="section-label">Legal</span>
          <h1 className="font-heading text-4xl sm:text-5xl font-bold text-white mt-3 mb-4">
            Enrolment Agreement
          </h1>
          <p className="text-white/70">
            Please read this agreement carefully before registering for any CanaDent Education
            Center course. By submitting an application, you agree to all terms below.
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="py-14 px-4 bg-white">
        <div className="max-w-4xl mx-auto">
          <div className="space-y-8">
            {sections.map((s) => (
              <div
                key={s.number}
                className="rounded-xl p-7"
                style={{ background: "#f5f7fb", border: "1px solid #e2e8f0" }}
              >
                <div className="flex items-start gap-4">
                  <div
                    className="w-9 h-9 rounded-full shrink-0 flex items-center justify-center text-sm font-bold text-white"
                    style={{ background: "#1b3a8a" }}
                  >
                    {s.number}
                  </div>
                  <div>
                    <h2 className="font-heading text-lg font-bold text-[#0f2150] mb-3">
                      {s.title}
                    </h2>
                    <p className="text-sm text-[#1a1a2e]/70 leading-relaxed">{s.body}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div
            className="mt-10 rounded-xl p-6 text-sm text-[#1a1a2e]/65 leading-relaxed"
            style={{ background: "#fffbeb", border: "1px solid #fde68a" }}
          >
            <strong className="text-[#92400e]">Note:</strong> This agreement is subject to change
            without prior notice. The most current version is always available on this page. If you
            have questions, please contact us at{" "}
            <a
              href="mailto:canadent.edu@gmail.com"
              className="underline hover:text-[#1b3a8a]"
            >
              canadent.edu@gmail.com
            </a>{" "}
            or call{" "}
            <a href="tel:14373700122" className="underline hover:text-[#1b3a8a]">
              1.437.370.0122
            </a>
            .
          </div>

          <div className="mt-8 flex flex-wrap gap-4">
            <Link href="/courses" className="btn-primary">
              Browse Courses
            </Link>
            <Link href="/contact" className="btn-secondary">
              Contact Us
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
