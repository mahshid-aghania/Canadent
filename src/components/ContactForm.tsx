"use client";

import Link from "next/link";

export function ContactForm() {
  return (
    <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
      <div className="grid sm:grid-cols-2 gap-5">
        <div>
          <label className="block text-sm font-medium text-[#1a1a2e]/70 mb-1.5">First Name</label>
          <input
            type="text"
            placeholder="Jane"
            className="w-full rounded-lg border border-[#e2e8f0] px-4 py-3 text-sm text-[#1a1a2e] placeholder:text-[#1a1a2e]/35 focus:border-[#1b3a8a] focus:outline-none focus:ring-2 focus:ring-[#1b3a8a]/20 transition-colors"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-[#1a1a2e]/70 mb-1.5">Last Name</label>
          <input
            type="text"
            placeholder="Smith"
            className="w-full rounded-lg border border-[#e2e8f0] px-4 py-3 text-sm text-[#1a1a2e] placeholder:text-[#1a1a2e]/35 focus:border-[#1b3a8a] focus:outline-none focus:ring-2 focus:ring-[#1b3a8a]/20 transition-colors"
          />
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-[#1a1a2e]/70 mb-1.5">Email Address</label>
        <input
          type="email"
          placeholder="jane@example.com"
          className="w-full rounded-lg border border-[#e2e8f0] px-4 py-3 text-sm text-[#1a1a2e] placeholder:text-[#1a1a2e]/35 focus:border-[#1b3a8a] focus:outline-none focus:ring-2 focus:ring-[#1b3a8a]/20 transition-colors"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-[#1a1a2e]/70 mb-1.5">Phone Number</label>
        <input
          type="tel"
          placeholder="+1 (416) 000-0000"
          className="w-full rounded-lg border border-[#e2e8f0] px-4 py-3 text-sm text-[#1a1a2e] placeholder:text-[#1a1a2e]/35 focus:border-[#1b3a8a] focus:outline-none focus:ring-2 focus:ring-[#1b3a8a]/20 transition-colors"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-[#1a1a2e]/70 mb-1.5">Subject</label>
        <select className="w-full rounded-lg border border-[#e2e8f0] px-4 py-3 text-sm text-[#1a1a2e] focus:border-[#1b3a8a] focus:outline-none focus:ring-2 focus:ring-[#1b3a8a]/20 transition-colors bg-white">
          <option value="">Select a topic…</option>
          <option>Course Registration</option>
          <option>Course Information</option>
          <option>Waitlist Request</option>
          <option>Cancellation / Refund</option>
          <option>CE Credits &amp; Accreditation</option>
          <option>Custom / Corporate Training</option>
          <option>Other</option>
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium text-[#1a1a2e]/70 mb-1.5">Message</label>
        <textarea
          rows={5}
          placeholder="Tell us how we can help…"
          className="w-full rounded-lg border border-[#e2e8f0] px-4 py-3 text-sm text-[#1a1a2e] placeholder:text-[#1a1a2e]/35 focus:border-[#1b3a8a] focus:outline-none focus:ring-2 focus:ring-[#1b3a8a]/20 transition-colors resize-none"
        />
      </div>
      <button type="submit" className="btn-primary w-full">
        Send Message
      </button>
    </form>
  );
}

export function NewsletterForm() {
  return (
    <form className="flex flex-col gap-2" onSubmit={(e) => e.preventDefault()}>
      <input
        type="email"
        placeholder="Your email address"
        className="w-full rounded-md border border-white/20 bg-white/5 px-3 py-2.5 text-sm text-white placeholder:text-white/35 focus:border-[#c9a84c] focus:outline-none"
      />
      <button type="submit" className="btn-primary w-full text-sm" style={{ padding: "0.6rem 1rem" }}>
        Subscribe
      </button>
    </form>
  );
}

export function AccountSidebar() {
  return (
    <nav className="space-y-1">
      {(
        [
          { label: "Dashboard", active: true },
          { label: "My Courses" },
          { label: "CE Certificates" },
          { label: "Account Settings" },
        ] as { label: string; active?: boolean }[]
      ).map(({ label, active }) => (
        <button
          key={label}
          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors text-left ${
            active
              ? "text-white"
              : "text-[#1a1a2e]/60 hover:text-[#0f2150] hover:bg-[#f5f7fb]"
          }`}
          style={active ? { background: "#1b3a8a" } : {}}
        >
          {label}
        </button>
      ))}
      <div className="pt-3 mt-3 border-t border-[#1a1a2e]/8">
        <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-red-500 hover:bg-red-50 transition-colors text-left">
          Log Out
        </button>
      </div>
    </nav>
  );
}

export function LoginForm() {
  return (
    <form className="max-w-sm mx-auto space-y-4 text-left" onSubmit={(e) => e.preventDefault()}>
      <div>
        <label className="block text-sm font-medium text-[#1a1a2e]/70 mb-1.5">Email Address</label>
        <input
          type="email"
          placeholder="you@example.com"
          className="w-full rounded-lg border border-[#e2e8f0] px-4 py-3 text-sm focus:border-[#1b3a8a] focus:outline-none focus:ring-2 focus:ring-[#1b3a8a]/20 transition-colors"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-[#1a1a2e]/70 mb-1.5">Password</label>
        <input
          type="password"
          placeholder="••••••••"
          className="w-full rounded-lg border border-[#e2e8f0] px-4 py-3 text-sm focus:border-[#1b3a8a] focus:outline-none focus:ring-2 focus:ring-[#1b3a8a]/20 transition-colors"
        />
      </div>
      <button type="submit" className="btn-primary w-full">
        Sign In
      </button>
      <p className="text-center text-xs text-[#1a1a2e]/50 mt-3">
        <a href="#" className="underline hover:text-[#1b3a8a]">Forgot password?</a>
        {" · "}
        <Link href="/contact" className="underline hover:text-[#1b3a8a]">Need help?</Link>
      </p>
    </form>
  );
}
