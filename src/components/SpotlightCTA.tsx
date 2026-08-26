"use client";
import { useTransition, useState } from "react";
import { ArrowRight, AlertCircle } from "lucide-react";
import { createCheckoutSession } from "@/app/actions/checkout";

export function SpotlightCTA() {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function handleClick() {
    setError(null);
    startTransition(async () => {
      const result = await createCheckoutSession(
        "advanced-adhesive-dentistry-master-blueprint",
        "Advanced Adhesive Dentistry: The Master Blueprint",
        799,
        "In-Person Attendance"
      );
      if (result && "error" in result) {
        setError(result.error);
      }
    });
  }

  return (
    <div>
      <button
        onClick={handleClick}
        disabled={isPending}
        className="btn-reserve"
      >
        {isPending ? (
          <>
            <svg
              className="animate-spin h-5 w-5"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 100 16v-4l-3 3 3 3v-4a8 8 0 01-8-8z" />
            </svg>
            Redirecting to payment…
          </>
        ) : (
          <>
            Reserve Your Seat
            <ArrowRight className="h-5 w-5" />
          </>
        )}
      </button>
      {error && (
        <div className="flex items-start gap-2 mt-3 text-xs text-red-300" style={{ maxWidth: 320 }}>
          <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
          {error}
        </div>
      )}
    </div>
  );
}
