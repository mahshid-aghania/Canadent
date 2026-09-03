"use client";

import { useEffect, useId, useRef, useState } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import {
  X,
  Check,
  AlertCircle,
  Loader2,
  BadgeCheck,
  ArrowRight,
} from "lucide-react";
import {
  ATTENDANCE_PREFERENCES,
  PROFESSIONAL_ROLES,
  TIMING_PREFERENCES,
} from "@/lib/course-requests";
import { useCourseRequest, type FormValues } from "./CourseRequestProvider";

const EMPTY: FormValues = {
  name: "",
  email: "",
  phone: "",
  role: "",
  attendance: "No Preference",
  timing: "No Preference",
  message: "",
  consent: false,
};

export function RequestInterestDialog() {
  const {
    selected,
    count,
    remove,
    dialogOpen,
    closeDialog,
    phase,
    errorMessage,
    fieldErrors,
    result,
    submit,
    reset,
  } = useCourseRequest();

  const [mounted, setMounted] = useState(false);
  const [values, setValues] = useState<FormValues>(EMPTY);
  const panelRef = useRef<HTMLDivElement>(null);
  const previousFocus = useRef<HTMLElement | null>(null);
  const titleId = useId();
  const descId = useId();

  // Portals need the client DOM; gate rendering on mount for SSR/hydration safety.
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => setMounted(true), []);

  // Focus management + body scroll lock + ESC to close.
  useEffect(() => {
    if (!dialogOpen) return;
    previousFocus.current = document.activeElement as HTMLElement;
    const { overflow } = document.body.style;
    document.body.style.overflow = "hidden";

    // Focus the first focusable control after paint.
    const raf = requestAnimationFrame(() => {
      const focusable = panelRef.current?.querySelector<HTMLElement>(
        "input, select, textarea, button, [href]"
      );
      focusable?.focus();
    });

    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") {
        e.stopPropagation();
        closeDialog();
        return;
      }
      if (e.key === "Tab") trapFocus(e);
    }
    function trapFocus(e: KeyboardEvent) {
      const nodes = panelRef.current?.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
      );
      if (!nodes || nodes.length === 0) return;
      const list = Array.from(nodes).filter((n) => n.offsetParent !== null);
      const first = list[0];
      const last = list[list.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }

    document.addEventListener("keydown", onKey, true);
    return () => {
      cancelAnimationFrame(raf);
      document.removeEventListener("keydown", onKey, true);
      document.body.style.overflow = overflow;
      previousFocus.current?.focus?.();
    };
  }, [dialogOpen, closeDialog]);

  if (!mounted || !dialogOpen) return null;

  const multiple = count > 1;
  const submitting = phase === "submitting";
  const success = phase === "success";

  function update<K extends keyof FormValues>(key: K, val: FormValues[K]) {
    setValues((v) => ({ ...v, [key]: val }));
  }

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    submit(values);
  }

  function handleClose() {
    // Reset the form after a completed request so re-opening starts fresh.
    if (success) {
      reset();
      setValues(EMPTY);
    } else {
      closeDialog();
    }
  }

  const err = (k: keyof typeof fieldErrors) => fieldErrors[k];

  return createPortal(
    <div
      className="req-overlay"
      role="presentation"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) handleClose();
      }}
    >
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={descId}
        className="req-dialog"
      >
        <button
          type="button"
          onClick={handleClose}
          className="req-dialog__close"
          aria-label="Close"
        >
          <X className="h-5 w-5" aria-hidden="true" />
        </button>

        {success && result ? (
          // ── Success state ──────────────────────────────────────────────
          <div className="req-dialog__body text-center">
            <span className="req-success-icon" aria-hidden="true">
              <BadgeCheck className="h-8 w-8" />
            </span>
            <h2 id={titleId} className="font-heading text-2xl font-bold text-[#0f2150] mt-4 mb-2">
              Thank you for your interest!
            </h2>
            <p id={descId} className="text-sm text-[#1a1a2e]/65 mb-5 max-w-md mx-auto">
              We&apos;ve recorded your {result.results.length > 1 ? "requests" : "request"}.
              If CanaDent announces a new date, you&apos;ll be among the first to know.
            </p>

            <ul className="req-success-list" aria-label="Courses you requested">
              {result.results.map((r) => (
                <li key={r.slug}>
                  <Check className="h-4 w-4 shrink-0" style={{ color: "#16a34a" }} aria-hidden="true" />
                  <span className="text-left">
                    <span className="font-semibold text-[#0f2150]">{r.title}</span>
                    <span className="block text-xs text-[#1a1a2e]/50">
                      {r.status === "updated"
                        ? "Your preferences were updated — you're on the interest list."
                        : "You're on the interest list."}
                    </span>
                  </span>
                </li>
              ))}
            </ul>

            <div className="flex flex-col sm:flex-row gap-3 justify-center mt-7">
              <Link href="/courses" className="btn-primary" onClick={handleClose}>
                Explore Available Courses
              </Link>
              {result.results[0] && (
                <Link
                  href={`/courses/${result.results[0].slug}`}
                  className="btn-secondary"
                  onClick={handleClose}
                >
                  Return to Course Details
                </Link>
              )}
            </div>
          </div>
        ) : count === 0 ? (
          // ── Empty state ────────────────────────────────────────────────
          <div className="req-dialog__body text-center py-6">
            <h2 id={titleId} className="font-heading text-xl font-bold text-[#0f2150] mb-2">
              No courses selected yet
            </h2>
            <p id={descId} className="text-sm text-[#1a1a2e]/60 mb-6 max-w-sm mx-auto">
              Choose one or more courses you&apos;d like CanaDent to offer again, then
              come back to send your request.
            </p>
            <button type="button" className="btn-primary" onClick={handleClose}>
              Browse Courses
            </button>
          </div>
        ) : (
          // ── Form state ─────────────────────────────────────────────────
          <form className="req-dialog__body" onSubmit={onSubmit} noValidate>
            <h2 id={titleId} className="font-heading text-2xl font-bold text-[#0f2150] mb-1">
              Request a New Date
            </h2>
            <p id={descId} className="text-sm text-[#1a1a2e]/60 mb-4">
              Let us know you&apos;re interested. Your request helps us decide which
              courses to bring back next.
            </p>

            {/* Selected courses */}
            <div className="req-selected-panel" aria-live="polite">
              <div className="text-xs font-bold uppercase tracking-wide text-[#c9a84c] mb-2">
                You selected {count} {count === 1 ? "course" : "courses"}
              </div>
              <ul className="flex flex-wrap gap-2">
                {selected.map((c) => (
                  <li key={c.slug} className="req-chip">
                    <span className="line-clamp-1">{c.title}</span>
                    <button
                      type="button"
                      onClick={() => remove(c.slug)}
                      aria-label={`Remove ${c.title}`}
                      className="req-chip__x"
                    >
                      <X className="h-3 w-3" aria-hidden="true" />
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            <div className="grid sm:grid-cols-2 gap-4 mt-5">
              <Field
                label="Full name"
                required
                error={err("name")}
                id="req-name"
              >
                {(props) => (
                  <input
                    {...props}
                    type="text"
                    autoComplete="name"
                    value={values.name}
                    onChange={(e) => update("name", e.target.value)}
                  />
                )}
              </Field>
              <Field label="Email address" required error={err("email")} id="req-email">
                {(props) => (
                  <input
                    {...props}
                    type="email"
                    autoComplete="email"
                    value={values.email}
                    onChange={(e) => update("email", e.target.value)}
                  />
                )}
              </Field>
              <Field label="Phone number" required error={err("phone")} id="req-phone">
                {(props) => (
                  <input
                    {...props}
                    type="tel"
                    autoComplete="tel"
                    value={values.phone}
                    onChange={(e) => update("phone", e.target.value)}
                  />
                )}
              </Field>
              <Field label="Professional role" required error={err("role")} id="req-role">
                {(props) => (
                  <select
                    {...props}
                    value={values.role}
                    onChange={(e) => update("role", e.target.value)}
                    className="req-input bg-white"
                  >
                    <option value="">Select your role…</option>
                    {PROFESSIONAL_ROLES.map((r) => (
                      <option key={r} value={r}>
                        {r}
                      </option>
                    ))}
                  </select>
                )}
              </Field>
            </div>

            <div className="grid sm:grid-cols-2 gap-4 mt-4">
              <Field label="Preferred attendance" id="req-attendance" optional>
                {(props) => (
                  <select
                    {...props}
                    value={values.attendance}
                    onChange={(e) => update("attendance", e.target.value)}
                    className="req-input bg-white"
                  >
                    {ATTENDANCE_PREFERENCES.map((a) => (
                      <option key={a} value={a}>
                        {a}
                      </option>
                    ))}
                  </select>
                )}
              </Field>
              <Field label="Preferred timing" id="req-timing" optional>
                {(props) => (
                  <select
                    {...props}
                    value={values.timing}
                    onChange={(e) => update("timing", e.target.value)}
                    className="req-input bg-white"
                  >
                    {TIMING_PREFERENCES.map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                )}
              </Field>
            </div>

            <Field
              label="Anything specific you'd like this course to cover?"
              id="req-message"
              optional
              className="mt-4"
            >
              {(props) => (
                <textarea
                  {...props}
                  rows={3}
                  value={values.message}
                  onChange={(e) => update("message", e.target.value)}
                  className="req-input resize-none"
                  placeholder="Optional"
                />
              )}
            </Field>

            {/* Consent */}
            <div className="mt-5">
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={values.consent}
                  onChange={(e) => update("consent", e.target.checked)}
                  aria-invalid={Boolean(err("consent"))}
                  aria-describedby={err("consent") ? "req-consent-err" : undefined}
                  className="req-checkbox"
                />
                <span className="text-xs text-[#1a1a2e]/60 leading-relaxed">
                  By submitting this form, you agree that CanaDent may contact you about
                  future dates for the selected course. Submitting a request is free and
                  does not guarantee that the course will be scheduled.
                </span>
              </label>
              {err("consent") && (
                <p id="req-consent-err" className="req-field-error" role="alert">
                  {err("consent")}
                </p>
              )}
            </div>

            {errorMessage && phase === "error" && (
              <div className="req-form-error" role="alert">
                <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" aria-hidden="true" />
                <span>{errorMessage}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="btn-primary w-full mt-5 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {submitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                  Submitting…
                </>
              ) : (
                <>
                  {multiple ? "Submit My Course Requests" : "Submit My Request"}
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </>
              )}
            </button>
            <p className="text-[11px] text-center text-[#1a1a2e]/45 mt-2.5">
              Free · No payment · No commitment
            </p>
          </form>
        )}
      </div>
    </div>,
    document.body
  );
}

// ── Small labelled-field helper (keeps a11y wiring consistent) ───────────────

function Field({
  label,
  id,
  error,
  required,
  optional,
  className,
  children,
}: {
  label: string;
  id: string;
  error?: string;
  required?: boolean;
  optional?: boolean;
  className?: string;
  children: (props: {
    id: string;
    className: string;
    "aria-invalid"?: boolean;
    "aria-describedby"?: string;
    required?: boolean;
  }) => React.ReactNode;
}) {
  const errId = `${id}-err`;
  return (
    <div className={className}>
      <label htmlFor={id} className="block text-sm font-medium text-[#1a1a2e]/70 mb-1.5">
        {label}
        {required && <span className="text-red-500" aria-hidden="true"> *</span>}
        {optional && <span className="text-[#1a1a2e]/40 font-normal"> (optional)</span>}
      </label>
      {children({
        id,
        className: "req-input",
        "aria-invalid": error ? true : undefined,
        "aria-describedby": error ? errId : undefined,
        required,
      })}
      {error && (
        <p id={errId} className="req-field-error" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
