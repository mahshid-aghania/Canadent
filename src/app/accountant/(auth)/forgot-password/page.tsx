"use client";

import Link from "next/link";
import { useActionState } from "react";
import { requestPasswordReset, type FormState } from "../../actions";

export default function ForgotPasswordPage() {
  const [state, formAction, pending] = useActionState<FormState, FormData>(requestPasswordReset, null);
  return (
    <>
      <h1 className="font-heading text-2xl font-bold text-[#0f2150] mb-1">Reset your password</h1>
      <p className="text-sm text-[#1a1a2e]/60 mb-6">
        Enter your email and we&apos;ll send a secure reset link.
      </p>
      {state?.message && <p className="mb-4 rounded-lg bg-[#ecfdf5] px-3 py-2 text-sm text-[#065f46]">{state.message}</p>}
      {state?.error && <p className="mb-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700" role="alert">{state.error}</p>}
      <form action={formAction} className="space-y-4">
        <label className="block">
          <span className="mb-1.5 block text-sm font-medium text-[#1a1a2e]/70">Email</span>
          <input name="email" type="email" autoComplete="email" required
            className="w-full rounded-lg border border-[#e2e8f0] px-4 py-3 text-sm focus:border-[#1b3a8a] focus:outline-none focus:ring-2 focus:ring-[#1b3a8a]/20" />
        </label>
        <button type="submit" disabled={pending} className="btn-primary w-full disabled:opacity-60">
          {pending ? "Sending…" : "Send reset link"}
        </button>
      </form>
      <p className="mt-5 text-center text-xs text-[#1a1a2e]/50">
        <Link href="/accountant/login" className="underline hover:text-[#1b3a8a]">Back to sign in</Link>
      </p>
    </>
  );
}
