import Link from "next/link";
import { Phone, Mail, MapPin, Clock } from "lucide-react";
import { NewsletterForm } from "@/components/ContactForm";

const socialLinks = [
  { label: "Facebook", href: "https://facebook.com", icon: "f" },
  { label: "Instagram", href: "https://instagram.com", icon: "in" },
  { label: "YouTube", href: "https://youtube.com", icon: "yt" },
  { label: "LinkedIn", href: "https://linkedin.com", icon: "li" },
];

const quickLinks = [
  { href: "/", label: "Home" },
  { href: "/courses", label: "Courses" },
  { href: "/my-account", label: "My Account" },
  { href: "/enrolment-agreement", label: "Enrolment Agreement" },
  { href: "/contact", label: "Contact Us" },
  { href: "/cart", label: "Cart" },
];

export default function Footer() {
  return (
    <footer style={{ background: "#0f2150" }} className="text-white/80">
      {/* Main footer */}
      <div className="max-w-7xl mx-auto px-4 py-14 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
        {/* Brand */}
        <div>
          <div className="flex items-center gap-2 mb-5">
            <div
              className="w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm shrink-0"
              style={{ background: "#c9a84c", color: "#0f2150" }}
            >
              CD
            </div>
            <div>
              <div className="font-heading text-lg font-bold text-white leading-none">
                CanaDent
              </div>
              <div className="text-[10px] text-[#c9a84c] uppercase tracking-widest">
                Education Center
              </div>
            </div>
          </div>
          <p className="text-sm leading-relaxed text-white/60 mb-5">
            Inspired by excellence &amp; innovation. CanaDent Education Center offers world-class
            dental continuing education for dentists and dental professionals across Canada.
          </p>
          {/* Social */}
          <div className="flex items-center gap-2">
            {socialLinks.map((s) => (
              <a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={s.label}
                className="w-8 h-8 rounded-full border border-white/20 flex items-center justify-center text-xs font-bold text-white/60 hover:border-[#c9a84c] hover:text-[#c9a84c] transition-colors"
              >
                {s.icon}
              </a>
            ))}
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

        {/* Newsletter placeholder */}
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
