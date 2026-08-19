"use client";
import { useTransition, useState } from "react";
import { AlertCircle } from "lucide-react";
import { createCheckoutSession } from "@/app/actions/checkout";
import { TAX_NOTE, TAX_SUFFIX } from "@/lib/tax";

interface PriceOption {
  label: string;
  price: number;
  originalPrice?: number;
}

interface Props {
  slug: string;
  title: string;
  price: number;
  options?: PriceOption[];
}

export function RegisterButton({ slug, title, price, options }: Props) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [selected, setSelected] = useState(options?.[0]?.label ?? null);

  const activePrice = options
    ? (options.find((o) => o.label === selected)?.price ?? price)
    : price;

  function handleClick() {
    setError(null);
    startTransition(async () => {
      const result = await createCheckoutSession(slug, title, activePrice, selected);
      if (result && "error" in result) {
        setError(result.error);
      }
    });
  }

  return (
    <div>
      {options && (
        <fieldset className="mb-3">
          <legend className="text-xs font-semibold text-[#0f2150] mb-2">
            Choose how you&apos;ll attend
          </legend>
          <div className="space-y-2">
            {options.map((opt) => (
              <label
                key={opt.label}
                className="flex items-center justify-between gap-3 rounded-lg px-3 py-2.5 cursor-pointer text-sm transition-colors"
                style={{
                  background: selected === opt.label ? "#eef2fb" : "#f5f7fb",
                  border:
                    selected === opt.label
                      ? "1px solid #1b3a8a"
                      : "1px solid transparent",
                }}
              >
                <span className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="attendance-mode"
                    value={opt.label}
                    checked={selected === opt.label}
                    onChange={() => setSelected(opt.label)}
                    className="accent-[#1b3a8a]"
                  />
                  <span className="text-[#1a1a2e]/75">{opt.label}</span>
                </span>
                <span className="font-semibold text-[#0f2150] shrink-0">
                  ${opt.price.toLocaleString()}{" "}
                  <span className="font-normal text-xs text-[#1a1a2e]/50">{TAX_SUFFIX}</span>
                </span>
              </label>
            ))}
          </div>
        </fieldset>
      )}
      <button
        onClick={handleClick}
        disabled={isPending}
        className="btn-primary w-full flex items-center justify-center gap-2"
      >
        {isPending ? (
          <>
            <svg
              className="animate-spin h-4 w-4"
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
          "Register Now"
        )}
      </button>
      <p className="text-xs text-center text-[#1a1a2e]/50 mt-2.5">{TAX_NOTE}</p>
      {error && (
        <div className="flex items-start gap-2 mt-3 rounded-lg px-3 py-2.5 text-sm" style={{ background: "#fee2e2", color: "#b91c1c" }}>
          <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
          {error}
        </div>
      )}
    </div>
  );
}
