import type { Metadata } from "next";
import Link from "next/link";
import { Phone, Mail, MapPin, Clock } from "lucide-react";
import { ContactForm } from "@/components/ContactForm";

export const metadata: Metadata = {
  title: "Contact Us",
  description:
    "Get in touch with CanaDent Education Center — North York, ON. Call, email, or send us a message about upcoming dental continuing education courses.",
};

export default function ContactPage() {
  return (
    <>
      <section
        className="py-14 px-4"
        style={{ background: "linear-gradient(135deg, #0f2150, #1b3a8a)" }}
      >
        <div className="max-w-7xl mx-auto">
          <nav className="text-sm text-white/50 mb-4">
            <Link href="/" className="hover:text-[#c9a84c] transition-colors">Home</Link>
            <span className="mx-2">/</span>
            <span className="text-white">Contact Us</span>
          </nav>
          <span className="section-label">Get in Touch</span>
          <h1 className="font-heading text-4xl sm:text-5xl font-bold text-white mt-3 mb-4">
            Contact Us
          </h1>
          <p className="text-white/70 max-w-xl">
            Have a question about an upcoming course, need help with registration, or want to
            discuss a custom program? We&apos;re here to help.
          </p>
        </div>
      </section>

      <section className="py-16 px-4" style={{ background: "#f5f7fb" }}>
        <div className="max-w-7xl mx-auto grid lg:grid-cols-[1fr_400px] gap-12">
          {/* Contact form */}
          <div className="card p-8">
            <h2 className="font-heading text-2xl font-bold text-[#0f2150] mb-7">
              Send Us a Message
            </h2>
            <ContactForm />
          </div>

          {/* Contact details */}
          <div className="space-y-5">
            <div className="card p-7">
              <h2 className="font-heading text-xl font-bold text-[#0f2150] mb-6">Contact Info</h2>
              <ul className="space-y-5">
                {[
                  {
                    icon: MapPin,
                    label: "Address",
                    content: (
                      <span className="text-sm text-[#1a1a2e]/60">
                        265 Rimrock Road, Units 209<br />
                        North York, ON M3J3A6, Canada
                      </span>
                    ),
                  },
                  {
                    icon: Phone,
                    label: "Phone",
                    content: (
                      <a href="tel:14373700122" className="text-sm text-[#1a1a2e]/60 hover:text-[#1b3a8a] transition-colors">
                        1.437.370.0122
                      </a>
                    ),
                  },
                  {
                    icon: Mail,
                    label: "Email",
                    content: (
                      <a href="mailto:canadent.edu@gmail.com" className="text-sm text-[#1a1a2e]/60 hover:text-[#1b3a8a] transition-colors break-all">
                        canadent.edu@gmail.com
                      </a>
                    ),
                  },
                  {
                    icon: Clock,
                    label: "Office Hours",
                    content: (
                      <span className="text-sm text-[#1a1a2e]/60">
                        Monday – Friday<br />
                        10:00 AM – 4:00 PM
                      </span>
                    ),
                  },
                ].map(({ icon: Icon, label, content }) => (
                  <li key={label} className="flex items-start gap-4">
                    <div
                      className="w-10 h-10 rounded-xl shrink-0 flex items-center justify-center"
                      style={{ background: "#1b3a8a" }}
                    >
                      <Icon className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-[#0f2150] mb-0.5">{label}</div>
                      {content}
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            <div
              className="rounded-xl overflow-hidden h-52 flex items-center justify-center"
              style={{ background: "#e2e8f0" }}
            >
              <a
                href="https://maps.google.com/?q=265+Rimrock+Road+North+York+ON"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#1b3a8a] underline text-sm"
              >
                📍 Open in Google Maps
              </a>
            </div>

            <div className="card p-6">
              <h3 className="font-heading font-bold text-[#0f2150] mb-4">Quick Links</h3>
              <div className="space-y-2">
                <Link href="/courses" className="flex items-center justify-between text-sm text-[#1a1a2e]/65 hover:text-[#1b3a8a] transition-colors py-1">
                  Browse Courses <span style={{ color: "#c9a84c" }}>→</span>
                </Link>
                <Link href="/enrolment-agreement" className="flex items-center justify-between text-sm text-[#1a1a2e]/65 hover:text-[#1b3a8a] transition-colors py-1">
                  Enrolment Agreement <span style={{ color: "#c9a84c" }}>→</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
