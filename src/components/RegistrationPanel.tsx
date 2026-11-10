"use client";
import { useEffect, useRef, useState, useTransition } from "react";
import { createPortal } from "react-dom";
import { AlertCircle, Check, MapPin, Video, GraduationCap } from "lucide-react";
import { createCheckoutSession, previewCoupon } from "@/app/actions/checkout";
import { registerFree } from "@/app/actions/free-registration";
// Type-only import — erased at build time, so the coupon codes in lib/coupons
// are never bundled into the client.
import type { CouponResult } from "@/lib/coupons";
import { track } from "@/lib/analytics";
import { TAX_NOTE, TAX_PERCENTAGE, TAX_SUFFIX, totalWithTax } from "@/lib/tax";

interface PriceOption {
  label: string;
  price: number;
  originalPrice?: number;
}

interface AttendanceMode {
  label: string;
  kind: "online" | "in-person";
  summary: string;
  location?: string;
  includes: string[];
  access: string;
}

interface Props {
  slug: string;
  title: string;
  price: number;
  options?: PriceOption[];
  modes?: AttendanceMode[];
}

function money(n: number) {
  return n.toLocaleString("en-CA", { minimumFractionDigits: 0, maximumFractionDigits: 2 });
}

/** UTM params only — never any PII. Read from the current URL for attribution. */
function readUtm(): Record<string, string> {
  if (typeof window === "undefined") return {};
  const utm: Record<string, string> = {};
  const params = new URLSearchParams(window.location.search);
  for (const [key, value] of params.entries()) {
    if (key.toLowerCase().startsWith("utm_") && value) utm[key.toLowerCase()] = value;
  }
  return utm;
}

export function RegistrationPanel({ slug, title, price, options, modes }: Props) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [selected, setSelected] = useState<string | null>(null); // never pre-select
  const [couponInput, setCouponInput] = useState("");
  const [couponApplied, setCouponApplied] = useState<
    Extract<CouponResult, { ok: true }> | null
  >(null);
  const [couponError, setCouponError] = useState<string | null>(null);
  const [couponPending, startCouponTransition] = useTransition();
  const [mounted, setMounted] = useState(false);
  const [panelInView, setPanelInView] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);

  // $0 ("free") registration — handled entirely on the front end, no Stripe.
  const [freeForm, setFreeForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    line1: "",
    line2: "",
    city: "",
    province: "",
    postalCode: "",
  });
  const [freeErrors, setFreeErrors] = useState<Record<string, string>>({});
  const [freeSubmitting, startFreeTransition] = useTransition();
  const [freeSuccess, setFreeSuccess] = useState<{ regNumber: string; email: string } | null>(null);

  // Portals need the client DOM; gate on mount to stay SSR/hydration-safe.
  // Also restore the visitor's own prior choice if they cancelled at Stripe and
  // came back with ?attendance= — this is their selection, not a silent default.
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
    if (!options) return;
    const restore = new URLSearchParams(window.location.search).get("attendance");
    if (restore && options.some((o) => o.label === restore)) {
      setSelected((prev) => prev ?? restore);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Hide the sticky mobile bar once the registration panel itself is on screen,
  // so the bar never covers the real CTA, policies, or help section.
  useEffect(() => {
    const el = panelRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => setPanelInView(entry.isIntersecting),
      { threshold: 0.35 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const selectedOption = options?.find((o) => o.label === selected) ?? null;
  const selectedMode = modes?.find((m) => m.label === selected) ?? null;
  const activePrice = options ? (selectedOption?.price ?? null) : price;
  // The fee actually charged: discounted when a coupon is applied.
  const effectivePrice = couponApplied ? couponApplied.finalPrice : activePrice;
  const canRegister = options ? selected !== null : true;
  const total = effectivePrice != null ? totalWithTax(effectivePrice) : null;
  // A coupon that fully covers the fee ($0 total): we skip Stripe and collect
  // the attendee's details here on the front end instead.
  const isFree = couponApplied?.isFree === true;

  // A coupon is validated against a specific fee, so drop it if the attendance
  // option (and therefore the price) changes — the visitor can re-apply.
  function clearCoupon() {
    setCouponApplied(null);
    setCouponError(null);
    setCouponInput("");
    setFreeErrors({});
    setFreeSuccess(null);
  }

  function updateFree(key: keyof typeof freeForm, value: string) {
    setFreeForm((f) => ({ ...f, [key]: value }));
    if (freeErrors[key]) {
      setFreeErrors((e) => {
        const next = { ...e };
        delete next[key];
        return next;
      });
    }
  }

  function submitFree() {
    const applied = couponApplied;
    if (!applied?.isFree) return;
    if (options && !selected) {
      setError("Please choose how you would like to attend.");
      return;
    }
    setError(null);
    startFreeTransition(async () => {
      const result = await registerFree({
        slug,
        couponCode: applied.code,
        firstName: freeForm.firstName,
        lastName: freeForm.lastName,
        email: freeForm.email,
        phone: freeForm.phone,
        address: {
          line1: freeForm.line1,
          line2: freeForm.line2,
          city: freeForm.city,
          province: freeForm.province,
          postalCode: freeForm.postalCode,
          country: "Canada",
        },
        optionLabel: selected,
        utm: readUtm(),
      });
      if (result.ok) {
        track("free_registration_completed", { slug, code: applied.code });
        setFreeErrors({});
        setFreeSuccess({ regNumber: result.regNumber, email: freeForm.email.trim() });
      } else {
        setFreeErrors(result.fieldErrors ?? {});
        setError(result.error);
      }
    });
  }

  function applyCouponCode() {
    if (options && !selected) {
      setCouponError("Please choose an attendance option first.");
      return;
    }
    const code = couponInput.trim();
    if (!code) {
      setCouponError("Please enter a discount code.");
      return;
    }
    setCouponError(null);
    startCouponTransition(async () => {
      const result = await previewCoupon(code, slug, selected);
      if (result.ok) {
        setCouponApplied(result);
        setCouponError(null);
        track("coupon_applied", { slug, code: result.code });
      } else {
        setCouponApplied(null);
        setCouponError(result.error);
      }
    });
  }

  function selectOption(opt: PriceOption) {
    setSelected(opt.label);
    setError(null);
    if (couponApplied) clearCoupon();
    const kind = modes?.find((m) => m.label === opt.label)?.kind;
    track("attendance_selected", { slug, attendance: kind, price: opt.price });
  }

  function register() {
    if (!canRegister || activePrice == null) {
      setError("Please choose how you would like to attend.");
      return;
    }
    setError(null);
    track("registration_started", {
      slug,
      attendance: selectedMode?.kind,
      price: activePrice,
    });
    startTransition(async () => {
      track("checkout_started", {
        slug,
        attendance: selectedMode?.kind,
        price: activePrice,
      });
      const result = await createCheckoutSession(
        slug,
        title,
        activePrice,
        selected,
        readUtm(),
        couponApplied?.code ?? null
      );
      if (result && "error" in result) setError(result.error);
    });
  }

  function scrollToPanel() {
    panelRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
  }

  const ctaLabel = options
    ? selected
      ? `Register for ${selected}`
      : "Select an attendance option above"
    : "Register Now";

  const spinner = (
    <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" aria-hidden="true">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 100 16v-4l-3 3 3 3v-4a8 8 0 01-8-8z" />
    </svg>
  );

  const freeField = (
    key: keyof typeof freeForm,
    label: string,
    autoComplete: string,
    type: string = "text"
  ) => (
    <div>
      <label htmlFor={`free-${key}`} className="block text-xs font-medium text-[#1a1a2e]/60 mb-1">
        {label}
      </label>
      <input
        id={`free-${key}`}
        type={type}
        value={freeForm[key]}
        autoComplete={autoComplete}
        onChange={(e) => updateFree(key, e.target.value)}
        aria-invalid={Boolean(freeErrors[key])}
        className="w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#c9a84c]/50"
        style={{ borderColor: freeErrors[key] ? "#fca5a5" : "#e2e8f0" }}
      />
      {freeErrors[key] && (
        <p className="mt-1 text-xs" style={{ color: "#b91c1c" }} role="alert">
          {freeErrors[key]}
        </p>
      )}
    </div>
  );

  return (
    <div ref={panelRef} id="register" className="scroll-mt-24">
      {options && (
        <fieldset className="mb-5">
          <legend className="font-heading text-lg font-bold text-[#0f2150] mb-1">
            Choose your attendance
          </legend>
          <p className="text-sm text-[#1a1a2e]/55 mb-4">
            Select an option to continue. Prices are per person.
          </p>
          <div className="grid grid-cols-1 gap-3" role="radiogroup" aria-label="Attendance option">
            {options.map((opt) => {
              const mode = modes?.find((m) => m.label === opt.label);
              const isSel = selected === opt.label;
              const Icon = mode?.kind === "in-person" ? MapPin : Video;
              return (
                <label
                  key={opt.label}
                  className={`attendance-card ${isSel ? "attendance-card--selected" : ""}`}
                >
                  <input
                    type="radio"
                    name="attendance-mode"
                    value={opt.label}
                    checked={isSel}
                    onChange={() => selectOption(opt)}
                    className="sr-only peer"
                  />
                  <span className="flex items-start justify-between gap-2">
                    <span className="flex items-center gap-2 font-semibold text-[#0f2150]">
                      <Icon className="h-4 w-4" style={{ color: "#c9a84c" }} aria-hidden="true" />
                      {opt.label}
                    </span>
                    <span
                      className={`attendance-check ${isSel ? "attendance-check--on" : ""}`}
                      aria-hidden="true"
                    >
                      {isSel && <Check className="h-3.5 w-3.5" strokeWidth={3} />}
                    </span>
                  </span>
                  {mode && <span className="block text-xs text-[#1a1a2e]/55 mt-1.5">{mode.summary}</span>}
                  <span className="flex flex-wrap items-baseline gap-1.5 mt-3">
                    {opt.originalPrice != null && opt.originalPrice > opt.price && (
                      <span className="font-heading text-lg font-semibold text-[#1a1a2e]/40 line-through">
                        ${money(opt.originalPrice)}
                      </span>
                    )}
                    <span className="font-heading text-2xl font-bold text-[#0f2150]">
                      ${money(opt.price)}
                    </span>
                    <span className="text-xs text-[#1a1a2e]/50">CAD {TAX_SUFFIX}</span>
                  </span>
                  {mode && (
                    <span className="block mt-3 space-y-1.5">
                      {mode.includes.map((inc) => (
                        <span key={inc} className="flex items-start gap-2 text-xs text-[#1a1a2e]/70">
                          <Check className="h-3.5 w-3.5 shrink-0 mt-0.5" style={{ color: "#16a34a" }} aria-hidden="true" />
                          {inc}
                        </span>
                      ))}
                    </span>
                  )}
                  <span className="attendance-selected-flag" aria-hidden={!isSel}>
                    {isSel ? "✓ Selected" : ""}
                  </span>
                </label>
              );
            })}
          </div>
        </fieldset>
      )}

      {/* Live order summary — announced to screen readers on change */}
      <div
        className="rounded-xl p-4 mb-4"
        style={{ background: "#f5f7fb", border: "1px solid #e2e8f0" }}
        aria-live="polite"
      >
        {activePrice == null ? (
          <p className="text-sm text-[#1a1a2e]/55">
            No option selected yet. Choose online or in-person above to see your total.
          </p>
        ) : (
          <div className="space-y-1.5 text-sm">
            {selected && (
              <div className="flex items-center justify-between">
                <span className="text-[#1a1a2e]/60">Selected</span>
                <span className="font-semibold text-[#0f2150]">{selected}</span>
              </div>
            )}
            <div className="flex items-center justify-between">
              <span className="text-[#1a1a2e]/60">Course fee</span>
              <span className="font-semibold text-[#0f2150]">${money(activePrice)} CAD</span>
            </div>
            {couponApplied && (
              <div className="flex items-center justify-between" style={{ color: "#16a34a" }}>
                <span>Discount ({couponApplied.code})</span>
                <span className="font-semibold">−${money(couponApplied.discountAmount)} CAD</span>
              </div>
            )}
            <div className="flex items-center justify-between">
              <span className="text-[#1a1a2e]/60">{TAX_PERCENTAGE}% HST (at checkout)</span>
              <span className="text-[#1a1a2e]/70">
                ${money(total! - effectivePrice!)} CAD
              </span>
            </div>
            <div className="flex items-center justify-between pt-1.5 border-t border-[#e2e8f0] font-bold text-base">
              <span className="text-[#0f2150]">Total</span>
              <span className="text-[#0f2150]">${money(total!)} CAD</span>
            </div>
          </div>
        )}
      </div>

      {activePrice != null && (
        <div className="mb-4">
          {couponApplied ? (
            <div
              className="flex items-center justify-between rounded-lg px-3 py-2 text-sm"
              style={{ background: "#ecfdf5", border: "1px solid #a7f3d0" }}
            >
              <span className="flex items-center gap-1.5 font-medium" style={{ color: "#15803d" }}>
                <Check className="h-4 w-4" strokeWidth={3} aria-hidden="true" />
                {couponApplied.label} applied ({couponApplied.code})
              </span>
              <button
                type="button"
                onClick={clearCoupon}
                className="text-xs font-semibold underline"
                style={{ color: "#15803d" }}
              >
                Remove
              </button>
            </div>
          ) : (
            <div>
              <label htmlFor="coupon" className="block text-xs font-medium text-[#1a1a2e]/60 mb-1.5">
                Have a discount code?
              </label>
              <div className="flex gap-2">
                <input
                  id="coupon"
                  type="text"
                  value={couponInput}
                  onChange={(e) => {
                    setCouponInput(e.target.value);
                    if (couponError) setCouponError(null);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      applyCouponCode();
                    }
                  }}
                  placeholder="Enter code"
                  autoComplete="off"
                  autoCapitalize="characters"
                  spellCheck={false}
                  className="flex-1 min-w-0 rounded-lg border border-[#e2e8f0] px-3 py-2 text-sm uppercase tracking-wide focus:outline-none focus:ring-2 focus:ring-[#c9a84c]/50"
                />
                <button
                  type="button"
                  onClick={applyCouponCode}
                  disabled={couponPending || !couponInput.trim()}
                  className="shrink-0 rounded-lg px-4 py-2 text-sm font-semibold text-[#0f2150] border border-[#c9a84c] disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{ background: "#faf5e6" }}
                >
                  {couponPending ? "Checking…" : "Apply"}
                </button>
              </div>
              {couponError && (
                <p className="mt-1.5 text-xs" style={{ color: "#b91c1c" }} role="alert">
                  {couponError}
                </p>
              )}
            </div>
          )}
        </div>
      )}

      {freeSuccess ? (
        <div
          role="status"
          className="rounded-xl p-5 text-center"
          style={{ background: "#ecfdf5", border: "1px solid #a7f3d0" }}
        >
          <div
            className="flex items-center justify-center gap-2 font-heading text-lg font-bold"
            style={{ color: "#15803d" }}
          >
            <Check className="h-5 w-5" strokeWidth={3} aria-hidden="true" />
            You&rsquo;re registered!
          </div>
          <p className="mt-2 text-sm text-[#1a1a2e]/70">
            Your complimentary seat for <strong className="text-[#0f2150]">{title}</strong> is
            confirmed.
          </p>
          <p className="mt-1 text-sm text-[#1a1a2e]/70">
            Registration #<strong className="text-[#0f2150]">{freeSuccess.regNumber}</strong>
          </p>
          <p className="mt-2 text-xs text-[#1a1a2e]/55">
            A confirmation email is on its way to <strong>{freeSuccess.email}</strong>.
          </p>
        </div>
      ) : isFree ? (
        <div className="space-y-3">
          <p className="text-sm font-semibold text-[#0f2150]">
            Complete your complimentary registration
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {freeField("firstName", "First name", "given-name")}
            {freeField("lastName", "Last (family) name", "family-name")}
          </div>
          {freeField("email", "Email address", "email", "email")}
          {freeField("phone", "Phone number", "tel", "tel")}
          {freeField("line1", "Street address", "address-line1")}
          {freeField("line2", "Apartment, suite (optional)", "address-line2")}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {freeField("city", "City", "address-level2")}
            {freeField("province", "Province", "address-level1")}
            {freeField("postalCode", "Postal code", "postal-code")}
          </div>
          <button
            onClick={submitFree}
            disabled={freeSubmitting}
            aria-disabled={freeSubmitting}
            className="btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {freeSubmitting ? (
              <>
                {spinner}
                Registering…
              </>
            ) : (
              "Complete free registration — $0 CAD"
            )}
          </button>
          <p className="text-xs text-center text-[#1a1a2e]/50">
            No payment required. We&rsquo;ll email your confirmation.
          </p>
        </div>
      ) : (
        <>
          <button
            onClick={register}
            disabled={isPending || !canRegister}
            aria-disabled={isPending || !canRegister}
            className="btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isPending ? (
              <>
                {spinner}
                Redirecting to secure payment…
              </>
            ) : (
              ctaLabel
            )}
          </button>
          <p className="text-xs text-center text-[#1a1a2e]/50 mt-2.5">{TAX_NOTE}</p>
        </>
      )}

      {selectedMode && (
        <p className="text-xs text-center text-[#1a1a2e]/55 mt-2 flex items-center justify-center gap-1.5">
          <GraduationCap className="h-3.5 w-3.5" style={{ color: "#c9a84c" }} aria-hidden="true" />
          {selectedMode.access}
        </p>
      )}

      {error && (
        <div
          role="alert"
          className="flex items-start gap-2 mt-3 rounded-lg px-3 py-2.5 text-sm"
          style={{ background: "#fee2e2", color: "#b91c1c" }}
        >
          <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" aria-hidden="true" />
          {error}
        </div>
      )}

      {/* Sticky mobile CTA — hidden once the panel itself is visible so it never covers content */}
      {mounted &&
        options &&
        !panelInView &&
        createPortal(
          <div className="reg-sticky lg:hidden" role="region" aria-label="Registration">
            <div className="reg-sticky__inner">
              <div className="min-w-0">
                {selected ? (
                  <>
                    <div className="text-[11px] text-[#1a1a2e]/55 truncate">{selected}</div>
                    <div className="font-bold text-[#0f2150] leading-tight">
                      ${money(total!)} CAD <span className="font-normal text-xs text-[#1a1a2e]/50">incl. HST</span>
                    </div>
                  </>
                ) : (
                  <div className="text-sm font-semibold text-[#0f2150]">
                    From ${money(options[0].price)} CAD <span className="font-normal text-xs text-[#1a1a2e]/50">{TAX_SUFFIX}</span>
                  </div>
                )}
              </div>
              <button
                onClick={selected && !isFree ? register : scrollToPanel}
                disabled={isPending}
                className="btn-primary shrink-0 disabled:opacity-50"
              >
                {isPending ? spinner : isFree ? "Complete Registration" : selected ? "Continue" : "Choose Attendance"}
              </button>
            </div>
          </div>,
          document.body
        )}
    </div>
  );
}
