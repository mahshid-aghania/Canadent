"use client";

import Link from "next/link";
import { useActionState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { signIn, type FormState } from "../../actions";

function LoginInner() {
  const params = useSearchParams();
  const next = params.get("next") ?? "/accountant";
  const notice =
    params.get("e") === "forbidden"
      ? "That account doesn't have access to the accounting workspace."
      : params.get("e") === "unconfigured"
        ? "The accounting service isn't configured yet. Add Supabase credentials to enable sign-in."
        : params.get("m") === "invite-accepted"
          ? "Your account is ready — sign in to continue."
          : null;

  const [state, formAction, pending] = useActionState<FormState, FormData>(signIn, null);

  return (
    <>
      <h1 className="font-heading text-2xl font-bold text-[#0f2150] mb-1">Accountant sign in</h1>
      <p className="text-sm text-[#1a1a2e]/60 mb-6">Access the CanaDent accounting workspace.</p>

      {notice && (
        <p className="mb-4 rounded-lg bg-[#eff6ff] px-3 py-2 text-sm text-[#1e40af]">{notice}</p>
      )}
      {state?.error && (
        <p className="mb-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700" role="alert">{state.error}</p>
      )}

      <form action={formAction} className="space-y-4">
        <input type="hidden" name="next" value={next} />
        <label className="block">
          <span className="mb-1.5 block text-sm font-medium text-[#1a1a2e]/70">Email</span>
          <input name="email" type="email" autoComplete="email" required
            className="w-full rounded-lg border border-[#e2e8f0] px-4 py-3 text-sm focus:border-[#1b3a8a] focus:outline-none focus:ring-2 focus:ring-[#1b3a8a]/20" />
        </label>
        <label className="block">
          <span className="mb-1.5 block text-sm font-medium text-[#1a1a2e]/70">Password</span>
          <input name="password" type="password" autoComplete="current-password" required
            className="w-full rounded-lg border border-[#e2e8f0] px-4 py-3 text-sm focus:border-[#1b3a8a] focus:outline-none focus:ring-2 focus:ring-[#1b3a8a]/20" />
        </label>
        <button type="submit" disabled={pending} className="btn-primary w-full disabled:opacity-60">
          {pending ? "Signing in…" : "Sign In"}
        </button>
      </form>

      <p className="mt-5 text-center text-xs text-[#1a1a2e]/50">
        <Link href="/accountant/forgot-password" className="underline hover:text-[#1b3a8a]">Forgot password?</Link>
      </p>
    </>
  );
}

export default function AccountantLoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginInner />
    </Suspense>
  );
}
