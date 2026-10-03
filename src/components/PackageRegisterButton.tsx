"use client";

import { useEffect, useState, useTransition } from "react";
import { AlertCircle, Lock } from "lucide-react";
import { createPackageCheckout } from "@/app/actions/package-checkout";
import { TAX_PERCENTAGE, taxOn, totalWithTax } from "@/lib/tax";

/** UTM params only — never PII. */
function readUtm(): Record<string, string> {
  if (typeof window === "undefined") return {};
  const utm: Record<string, string> = {};
  const params = new URLSearchParams(window.location.search);
  for (const [k, v] of params.entries()) {
    if (k.toLowerCase().startsWith("utm_") && v) utm[k.toLowerCase()] = v;
  }
  return utm;
}

function money(n: number) {
  return n.toLocaleString("en-CA", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

interface Props {
  /** Package slug — identifies which bundle to check out (server-side priced). */
  slug: string;
  /** Tax-exclusive package total in CAD. */
  priceCAD: number;
  /**
   * When false, the package is still a preview (a course is unconfirmed) and
   * purchasing is disabled — no checkout can be started.
   */
  enabled: boolean;
}

export function PackageRegisterButton({ slug, priceCAD, enabled }: Props) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [cancelled, setCancelled] = useState(false);

  // Surface a gentle notice if the visitor returned from a cancelled checkout.
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setCancelled(new URLSearchParams(window.location.search).get("cancelled") === "true");
  }, []);

  function buy() {
    setError(null);
    startTransition(async () => {
      const result = await createPackageCheckout(slug, readUtm());
      if (result && "error" in result) setError(result.error);
    });
  }

  const spinner = (
    <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" aria-hidden="true">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 100 16v-4l-3 3 3 3v-4a8 8 0 01-8-8z" />
    </svg>
  );

  const taxAmount = taxOn(priceCAD);
  const grandTotal = totalWithTax(priceCAD);

  // ── Preview state: purchasing disabled until the third course is confirmed ──
  if (!enabled) {
    return (
      <div>
        <button
          type="button"
          disabled
          aria-disabled="true"
          className="btn-primary w-full opacity-50 cursor-not-allowed"
        >
          <Lock className="h-4 w-4" aria-hidden="true" />
          Registration Opens Soon
        </button>
        <div
          className="flex items-start gap-2 mt-3 rounded-lg px-3 py-2.5 text-sm"
          style={{ background: "#fef9ec", color: "#92400e" }}
          role="status"
        >
          <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" aria-hidden="true" />
          <span>
            Online registration opens once the third course is confirmed. To
            reserve your place now, call{" "}
            <a href="tel:14373700122" className="underline font-semibold">1.437.370.0122</a>{" "}
            or email{" "}
            <a href="mailto:admin@canadent.net" className="underline font-semibold">admin@canadent.net</a>.
          </span>
        </div>
      </div>
    );
  }

  return (
    <div>
      {cancelled && !error && (
        <div
          className="flex items-start gap-2 mb-4 rounded-lg px-3 py-2.5 text-sm"
          style={{ background: "#fef9ec", color: "#92400e" }}
          role="status"
        >
          <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" aria-hidden="true" />
          Payment was cancelled. You can try again below.
        </div>
      )}

      <button
        onClick={buy}
        disabled={isPending}
        aria-disabled={isPending}
        className="btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isPending ? (
          <>
            {spinner}
            Redirecting to secure payment…
          </>
        ) : (
          <>
            <Lock className="h-4 w-4" aria-hidden="true" />
            Register for the Package
          </>
        )}
      </button>

      <p className="text-xs text-center text-[#1a1a2e]/55 mt-2.5">
        Secure checkout · ${money(priceCAD)} CAD + {TAX_PERCENTAGE}% HST (${money(taxAmount)}) ={" "}
        <strong>${money(grandTotal)} CAD</strong> total
      </p>

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
    </div>
  );
}
