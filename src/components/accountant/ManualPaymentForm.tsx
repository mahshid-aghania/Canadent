"use client";

import { useActionState } from "react";
import { recordManualPayment, type ActionState } from "@/app/accountant/admin-actions";

// Authorised manual verification of an e-transfer / cheque / cash payment, with
// evidence (date + reference). Creates a VERIFIED payment and an audit entry.
export function ManualPaymentForm({ studentId }: { studentId: string }) {
  const [state, action, pending] = useActionState<ActionState, FormData>(recordManualPayment, null);
  const field = "w-full rounded-lg border border-[#e2e8f0] px-3 py-2 text-sm focus:border-[#1b3a8a] focus:outline-none focus:ring-2 focus:ring-[#1b3a8a]/20";

  return (
    <form action={action} className="space-y-3">
      <input type="hidden" name="studentId" value={studentId} />
      {state?.error && <p className="rounded-lg bg-red-50 px-3 py-2 text-xs text-red-700" role="alert">{state.error}</p>}
      {state?.message && <p className="rounded-lg bg-[#ecfdf5] px-3 py-2 text-xs text-[#065f46]">{state.message}</p>}
      <div className="grid grid-cols-2 gap-3">
        <label className="block">
          <span className="mb-1 block text-xs font-medium text-[#1a1a2e]/60">Amount (CAD)</span>
          <input name="amount" type="number" step="0.01" min="0" required className={field} placeholder="699.00" />
        </label>
        <label className="block">
          <span className="mb-1 block text-xs font-medium text-[#1a1a2e]/60">Method</span>
          <select name="method" className={field} defaultValue="etransfer">
            <option value="etransfer">E-transfer</option>
            <option value="cheque">Cheque</option>
            <option value="cash">Cash</option>
            <option value="other">Other</option>
          </select>
        </label>
        <label className="block">
          <span className="mb-1 block text-xs font-medium text-[#1a1a2e]/60">Payment date</span>
          <input name="paidAt" type="date" required className={field} />
        </label>
        <label className="block">
          <span className="mb-1 block text-xs font-medium text-[#1a1a2e]/60">Reference</span>
          <input name="reference" type="text" className={field} placeholder="e-transfer ref / cheque #" />
        </label>
      </div>
      <button type="submit" disabled={pending} className="btn-primary w-full text-sm disabled:opacity-60">
        {pending ? "Recording…" : "Record verified payment"}
      </button>
    </form>
  );
}
