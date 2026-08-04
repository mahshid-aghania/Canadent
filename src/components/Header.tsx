"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { Menu, X, Phone, ShoppingCart, User } from "lucide-react";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/courses", label: "Courses" },
  { href: "/articles", label: "Articles" },
  { href: "/my-account", label: "My Account" },
  { href: "/enrolment-agreement", label: "Enrolment Agreement" },
  { href: "/cart", label: "Cart" },
];

export default function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="w-full">
      {/* Top bar */}
      <div style={{ background: "#0f2150" }} className="py-2 px-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between text-xs text-white/80">
          <div className="flex items-center gap-4">
            <a
              href="tel:14373700122"
              className="flex items-center gap-1.5 hover:text-[#c9a84c] transition-colors"
            >
              <Phone className="h-3.5 w-3.5" />
              1.437.370.0122
            </a>
            <a
              href="mailto:canadent.edu@gmail.com"
              className="hidden sm:block hover:text-[#c9a84c] transition-colors"
            >
              canadent.edu@gmail.com
            </a>
          </div>
          <div className="flex items-center gap-4 text-white/60 text-xs">
            <span>Mon–Fri: 10:00 AM – 4:00 PM</span>
            <Link href="/contact" className="hover:text-[#c9a84c] transition-colors">
              Contact Us
            </Link>
          </div>
        </div>
      </div>

      {/* Main nav */}
      <div style={{ background: "#1b3a8a" }} className="px-4 shadow-md">
        <div className="max-w-7xl mx-auto flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <Image
              src="/logo.png"
              alt="CanaDent Education Center"
              width={160}
              height={50}
              className="h-10 w-auto object-contain"
              priority
            />
          </Link>

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="px-3 py-2 text-sm font-medium text-white/85 rounded-md hover:text-white hover:bg-white/10 transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Icons */}
          <div className="flex items-center gap-3">
            <Link
              href="/my-account"
              className="hidden lg:flex text-white/70 hover:text-white transition-colors"
              aria-label="My Account"
            >
              <User className="h-5 w-5" />
            </Link>
            <Link
              href="/cart"
              className="hidden lg:flex text-white/70 hover:text-white transition-colors"
              aria-label="Cart"
            >
              <ShoppingCart className="h-5 w-5" />
            </Link>
            <button
              className="lg:hidden text-white"
              onClick={() => setOpen(!open)}
              aria-label="Toggle menu"
            >
              {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile nav */}
        {open && (
          <div className="lg:hidden border-t border-white/10 pb-4">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="block px-3 py-3 text-sm font-medium text-white/85 hover:text-white hover:bg-white/10 rounded-md transition-colors"
                onClick={() => setOpen(false)}
              >
                {link.label}
              </Link>
            ))}
          </div>
        )}
      </div>
    </header>
  );
}
