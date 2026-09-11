"use client";

import { useActionState } from "react";
import { updatePassword, type FormState } from "../../actions";

// Supabase puts a recovery session in place via the emailed link before this
// page loads; updateUser then sets the new password.
export default function ResetPasswordPage() {
  const [state, formAction, pending] = useActionState<FormState, FormData>(updatePassword, null);
  return (
    <>
      <h1 className="font-heading text-2xl font-bold text-[#0f2150] mb-1">Choose a new password</h1>
      <p className="text-sm text-[#1a1a2e]/60 mb-6">At least 10 characters.</p>
      {state?.error && <p className="mb-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700" role="alert">{state.error}</p>}
      <form action={formAction} className="space-y-4">
        <label className="block">
          <span className="mb-1.5 block text-sm font-medium text-[#1a1a2e]/70">New password</span>
          <input name="password" type="password" autoComplete="new-password" minLength={10} required
            className="w-full rounded-lg border border-[#e2e8f0] px-4 py-3 text-sm focus:border-[#1b3a8a] focus:outline-none focus:ring-2 focus:ring-[#1b3a8a]/20" />
        </label>
        <button type="submit" disabled={pending} className="btn-primary w-full disabled:opacity-60">
          {pending ? "Saving…" : "Update password"}
        </button>
      </form>
    </>
  );
}
