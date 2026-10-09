"use client";

import { useEffect, useState, useTransition } from "react";
import { AlertCircle } from "lucide-react";
import { createFinancialInsuranceCheckout } from "@/app/actions/financial-insurance-checkout";

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

export function FinancialInsuranceCheckoutButton() {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [cancelled, setCancelled] = useState(false);

  // Surface a gentle notice if the visitor returned from a cancelled checkout.
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setCancelled(new URLSearchParams(window.location.search).get("cancelled") === "true");
  }, []);

  function pay() {
    setError(null);
    startTransition(async () => {
      const result = await createFinancialInsuranceCheckout(readUtm());
      if (result && "error" in result) setError(result.error);
    });
  }

  const spinner = (
    <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" aria-hidden="true">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 100 16v-4l-3 3 3 3v-4a8 8 0 01-8-8z" />
    </svg>
  );

  return (
    <div className="mt-5">
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
        onClick={pay}
        disabled={isPending}
        aria-disabled={isPending}
        aria-label="Pay initial sponsorship payment of 2,000 Canadian dollars"
        className="btn-green w-full sm:w-auto min-h-[44px] text-base font-bold flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isPending ? (
          <>
            {spinner}
            Redirecting to payment…
          </>
        ) : (
          "Pay Initial CAD $2,000"
        )}
      </button>

      <p className="text-[13px] text-[#1a1a2e]/60 mt-2.5">
        Initial sponsorship payment: CAD $2,000.
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
