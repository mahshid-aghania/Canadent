"use client";
import { useEffect, useRef, useState, useTransition } from "react";
import { createPortal } from "react-dom";
import { AlertCircle, Check, MapPin, Video, GraduationCap } from "lucide-react";
import { createCheckoutSession } from "@/app/actions/checkout";
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
  const [mounted, setMounted] = useState(false);
  const [panelInView, setPanelInView] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);

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
  const canRegister = options ? selected !== null : true;
  const total = activePrice != null ? totalWithTax(activePrice) : null;

  function selectOption(opt: PriceOption) {
    setSelected(opt.label);
    setError(null);
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
        readUtm()
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
          <div className="grid sm:grid-cols-2 gap-3" role="radiogroup" aria-label="Attendance option">
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
                  <span className="flex items-baseline gap-1.5 mt-3">
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
            <div className="flex items-center justify-between">
              <span className="text-[#1a1a2e]/60">{TAX_PERCENTAGE}% HST (at checkout)</span>
              <span className="text-[#1a1a2e]/70">
                ${money(totalWithTax(activePrice) - activePrice)} CAD
              </span>
            </div>
            <div className="flex items-center justify-between pt-1.5 border-t border-[#e2e8f0] font-bold text-base">
              <span className="text-[#0f2150]">Total</span>
              <span className="text-[#0f2150]">${money(total!)} CAD</span>
            </div>
          </div>
        )}
      </div>

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
                onClick={selected ? register : scrollToPanel}
                disabled={isPending}
                className="btn-primary shrink-0 disabled:opacity-50"
              >
                {isPending ? spinner : selected ? "Continue" : "Choose Attendance"}
              </button>
            </div>
          </div>,
          document.body
        )}
    </div>
  );
}
