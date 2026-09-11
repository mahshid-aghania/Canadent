"use client";

import { useActionState } from "react";
import { uploadDocument, type ActionState } from "@/app/accountant/admin-actions";

// Uploads a PDF (invoice / receipt / evidence) into the private storage bucket
// and links it to the student. Editor-only; the server re-checks permission.
export function DocumentUpload({ studentId, defaultKind = "invoice" }: { studentId: string; defaultKind?: string }) {
  const [state, action, pending] = useActionState<ActionState, FormData>(uploadDocument, null);
  const field = "w-full rounded-lg border border-[#e2e8f0] px-3 py-2 text-sm focus:border-[#1b3a8a] focus:outline-none focus:ring-2 focus:ring-[#1b3a8a]/20";

  return (
    <form action={action} className="space-y-3">
      <input type="hidden" name="studentId" value={studentId} />
      {state?.error && <p className="rounded-lg bg-red-50 px-3 py-2 text-xs text-red-700" role="alert">{state.error}</p>}
      {state?.message && <p className="rounded-lg bg-[#ecfdf5] px-3 py-2 text-xs text-[#065f46]">{state.message}</p>}
      <div className="grid grid-cols-[1fr_auto] gap-3">
        <input name="file" type="file" accept="application/pdf" required className={field} />
        <select name="kind" className={field} defaultValue={defaultKind}>
          <option value="invoice">Invoice</option>
          <option value="receipt">Receipt</option>
          <option value="evidence">Evidence</option>
          <option value="other">Other</option>
        </select>
      </div>
      <button type="submit" disabled={pending} className="btn-secondary w-full text-sm disabled:opacity-60">
        {pending ? "Uploading…" : "Upload PDF"}
      </button>
    </form>
  );
}
