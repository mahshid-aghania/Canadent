"use client";
import { useActionState } from "react";
import { AlertCircle } from "lucide-react";
import { login } from "./actions";

export function AdminLoginForm() {
  const [error, formAction, pending] = useActionState(login, null);

  return (
    <form action={formAction} className="space-y-4">
      <div>
        <label htmlFor="admin-password" className="block text-sm font-medium text-[#1a1a2e]/70 mb-1.5">
          Admin password
        </label>
        <input
          id="admin-password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          className="w-full rounded-lg border border-[#e2e8f0] px-4 py-3 text-sm focus:border-[#1b3a8a] focus:outline-none focus:ring-2 focus:ring-[#1b3a8a]/20 transition-colors"
        />
      </div>
      {error && (
        <div role="alert" className="flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm" style={{ background: "#fee2e2", color: "#b91c1c" }}>
          <AlertCircle className="h-4 w-4 shrink-0" aria-hidden="true" />
          {error}
        </div>
      )}
      <button type="submit" disabled={pending} className="btn-primary w-full disabled:opacity-50">
        {pending ? "Signing in…" : "Sign In"}
      </button>
    </form>
  );
}
