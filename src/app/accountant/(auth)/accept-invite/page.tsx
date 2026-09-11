"use client";

import Link from "next/link";
import { useActionState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { acceptInvite, type FormState } from "../../actions";

function AcceptInviteInner() {
  const token = useSearchParams().get("token") ?? "";
  const [state, formAction, pending] = useActionState<FormState, FormData>(acceptInvite, null);

  if (!token) {
    return (
      <>
        <h1 className="font-heading text-2xl font-bold text-[#0f2150] mb-2">Invitation link incomplete</h1>
        <p className="text-sm text-[#1a1a2e]/60">
          This link is missing its token. Ask an administrator to resend your invitation.
        </p>
        <p className="mt-5 text-center text-xs text-[#1a1a2e]/50">
          <Link href="/accountant/login" className="underline hover:text-[#1b3a8a]">Back to sign in</Link>
        </p>
      </>
    );
  }

  return (
    <>
      <h1 className="font-heading text-2xl font-bold text-[#0f2150] mb-1">Accept your invitation</h1>
      <p className="text-sm text-[#1a1a2e]/60 mb-6">Set a password to activate your staff account.</p>
      {state?.error && <p className="mb-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700" role="alert">{state.error}</p>}
      <form action={formAction} className="space-y-4">
        <input type="hidden" name="token" value={token} />
        <label className="block">
          <span className="mb-1.5 block text-sm font-medium text-[#1a1a2e]/70">Full name</span>
          <input name="fullName" type="text" autoComplete="name"
            className="w-full rounded-lg border border-[#e2e8f0] px-4 py-3 text-sm focus:border-[#1b3a8a] focus:outline-none focus:ring-2 focus:ring-[#1b3a8a]/20" />
        </label>
        <label className="block">
          <span className="mb-1.5 block text-sm font-medium text-[#1a1a2e]/70">Password</span>
          <input name="password" type="password" autoComplete="new-password" minLength={10} required
            className="w-full rounded-lg border border-[#e2e8f0] px-4 py-3 text-sm focus:border-[#1b3a8a] focus:outline-none focus:ring-2 focus:ring-[#1b3a8a]/20" />
        </label>
        <button type="submit" disabled={pending} className="btn-primary w-full disabled:opacity-60">
          {pending ? "Activating…" : "Activate account"}
        </button>
      </form>
    </>
  );
}

export default function AcceptInvitePage() {
  return (
    <Suspense fallback={null}>
      <AcceptInviteInner />
    </Suspense>
  );
}
