import Link from "next/link";
import Image from "next/image";
import { Phone, Mail, MapPin, Clock } from "lucide-react";
import { NewsletterForm } from "@/components/ContactForm";

const quickLinks = [
  { href: "/", label: "Home" },
  { href: "/courses", label: "Courses" },
  { href: "/my-account", label: "My Account" },
  { href: "/enrolment-agreement", label: "Enrolment Agreement" },
  { href: "/contact", label: "Contact Us" },
  { href: "/cart", label: "Cart" },
];

const iconClass = "w-8 h-8 rounded-full border border-white/20 flex items-center justify-center text-white/60 hover:border-[#c9a84c] hover:text-[#c9a84c] transition-colors";

export default function Footer() {
  return (
    <footer style={{ background: "#0f2150" }} className="text-white/80">
      {/* Main footer */}
      <div className="max-w-7xl mx-auto px-4 py-14 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
        {/* Brand */}
        <div>
          <div className="mb-5">
            <Image
              src="/logo.png"
              alt="CanaDent Education Center"
              width={160}
              height={50}
              className="h-10 w-auto object-contain brightness-0 invert"
            />
          </div>
          <p className="text-sm leading-relaxed text-white/60 mb-5">
            Inspired by excellence &amp; innovation. CanaDent Education Center offers world-class
            dental continuing education for dentists and dental professionals across Canada.
          </p>
          {/* Social icons */}
          <div className="flex items-center gap-2">
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook" className={iconClass}>
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
              </svg>
            </a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className={iconClass}>
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
              </svg>
            </a>
            <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" aria-label="YouTube" className={iconClass}>
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46a2.78 2.78 0 0 0-1.95 1.96A29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58A2.78 2.78 0 0 0 3.41 19.54C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.95-1.96A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z" />
                <polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02" />
              </svg>
            </a>
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className={iconClass}>
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                <rect x="2" y="9" width="4" height="12" />
                <circle cx="4" cy="4" r="2" />
              </svg>
            </a>
          </div>
        </div>

        {/* Quick links */}
        <div>
          <h3 className="font-heading text-white font-semibold text-base mb-5">Quick Links</h3>
          <ul className="space-y-2.5">
            {quickLinks.map((l) => (
              <li key={l.href}>
                <Link
                  href={l.href}
                  className="text-sm text-white/60 hover:text-[#c9a84c] transition-colors"
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h3 className="font-heading text-white font-semibold text-base mb-5">Contact Us</h3>
          <ul className="space-y-4">
            <li className="flex items-start gap-3">
              <MapPin className="h-4 w-4 mt-0.5 shrink-0 text-[#c9a84c]" />
              <span className="text-sm text-white/60">
                265 Rimrock Road, Units 209<br />
                North York, ON M3J3A6, Canada
              </span>
            </li>
            <li>
              <a
                href="tel:14373700122"
                className="flex items-center gap-3 text-sm text-white/60 hover:text-[#c9a84c] transition-colors"
              >
                <Phone className="h-4 w-4 shrink-0 text-[#c9a84c]" />
                1.437.370.0122
              </a>
            </li>
            <li>
              <a
                href="mailto:canadent.edu@gmail.com"
                className="flex items-center gap-3 text-sm text-white/60 hover:text-[#c9a84c] transition-colors"
              >
                <Mail className="h-4 w-4 shrink-0 text-[#c9a84c]" />
                canadent.edu@gmail.com
              </a>
            </li>
            <li className="flex items-start gap-3">
              <Clock className="h-4 w-4 mt-0.5 shrink-0 text-[#c9a84c]" />
              <span className="text-sm text-white/60">
                Monday – Friday<br />
                10:00 AM – 4:00 PM
              </span>
            </li>
          </ul>
        </div>

        {/* Newsletter */}
        <div>
          <h3 className="font-heading text-white font-semibold text-base mb-5">Stay Updated</h3>
          <p className="text-sm text-white/60 mb-4">
            Subscribe to receive news about upcoming CanaDent courses and events.
          </p>
          <NewsletterForm />
        </div>
      </div>

      {/* Bottom bar */}
      <div
        className="border-t px-4 py-5 text-center text-xs text-white/40"
        style={{ borderColor: "rgba(255,255,255,0.1)" }}
      >
        © Copyright {new Date().getFullYear()} CanaDent Education Center. All rights reserved.
      </div>
    </footer>
  );
}
