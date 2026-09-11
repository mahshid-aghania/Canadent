"use client";

import { useState, useTransition } from "react";
import { UserPlus, Trash2, Save } from "lucide-react";
import {
  createInvite, revokeInvite, setStaffRole, setEditPermission, updateSettings,
} from "@/app/accountant/admin-actions";
import { ROLE_LABELS, type Role } from "@/lib/accounting/roles";
import type { AcctSettings } from "@/lib/accounting/settings";

type StaffUser = { id: string; email: string; full_name: string | null; role: Role; can_edit_financials: boolean };
type Invite = { id: string; email: string; role: string; status: string; expired: boolean };

const field = "w-full rounded-lg border border-[#e2e8f0] px-3 py-2 text-sm focus:border-[#1b3a8a] focus:outline-none focus:ring-2 focus:ring-[#1b3a8a]/20";

function Note({ state }: { state: { error?: string; message?: string } | null }) {
  if (!state) return null;
  if (state.error) return <p className="mt-2 rounded-lg bg-red-50 px-3 py-2 text-xs text-red-700" role="alert">{state.error}</p>;
  if (state.message) return <p className="mt-2 rounded-lg bg-[#ecfdf5] px-3 py-2 text-xs text-[#065f46]">{state.message}</p>;
  return null;
}

export function StaffManager({ staff, invites, selfId }: { staff: StaffUser[]; invites: Invite[]; selfId: string }) {
  const [state, setState] = useState<{ error?: string; message?: string } | null>(null);
  const [pending, start] = useTransition();

  const run = (fn: (p: null, fd: FormData) => Promise<{ error?: string; message?: string } | null>, fd: FormData) =>
    start(async () => setState(await fn(null, fd)));

  return (
    <div className="space-y-6">
      {/* Invite */}
      <section className="card p-5">
        <h2 className="mb-3 flex items-center gap-2 font-heading text-base font-bold text-[#0f2150]"><UserPlus className="h-4 w-4 text-[#c9a84c]" aria-hidden="true" /> Invite staff</h2>
        <form
          className="flex flex-wrap items-end gap-3"
          onSubmit={(e) => { e.preventDefault(); run(createInvite, new FormData(e.currentTarget)); }}
        >
          <label className="block flex-1 min-w-[220px]">
            <span className="mb-1 block text-xs font-medium text-[#1a1a2e]/60">Email</span>
            <input name="email" type="email" required className={field} placeholder="accountant@example.com" />
          </label>
          <label className="block">
            <span className="mb-1 block text-xs font-medium text-[#1a1a2e]/60">Role</span>
            <select name="role" className={field} defaultValue="accountant">
              <option value="accountant">Accountant</option>
              <option value="admin">Administrator</option>
            </select>
          </label>
          <button type="submit" disabled={pending} className="btn-primary text-sm disabled:opacity-60">Send invitation</button>
        </form>
        <Note state={state} />

        {invites.length > 0 && (
          <div className="mt-4 border-t border-[#1a1a2e]/8 pt-4">
            <p className="mb-2 text-xs font-bold uppercase tracking-wide text-[#1a1a2e]/45">Pending invitations</p>
            <ul className="space-y-2">
              {invites.map((inv) => {
                return (
                  <li key={inv.id} className="flex items-center justify-between gap-3 text-sm">
                    <span className="text-[#1a1a2e]/75">{inv.email} · <span className="text-[#1a1a2e]/50">{ROLE_LABELS[inv.role as Role]}</span> {inv.expired && <span className="badge-sold-out ml-1">Expired</span>}</span>
                    <button
                      onClick={() => { const fd = new FormData(); fd.set("id", inv.id); run(revokeInvite, fd); }}
                      disabled={pending}
                      className="inline-flex items-center gap-1 text-xs font-medium text-red-600 hover:underline disabled:opacity-50"
                    >
                      <Trash2 className="h-3.5 w-3.5" aria-hidden="true" /> Revoke
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        )}
      </section>

      {/* Staff list */}
      <section className="card p-5">
        <h2 className="mb-3 font-heading text-base font-bold text-[#0f2150]">Staff access</h2>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[560px] text-sm">
            <thead>
              <tr className="border-b border-[#1a1a2e]/8 text-left text-[11px] font-bold uppercase tracking-wide text-[#1a1a2e]/45">
                <th className="px-2 py-2">User</th>
                <th className="px-2 py-2">Role</th>
                <th className="px-2 py-2">Can edit financials</th>
              </tr>
            </thead>
            <tbody>
              {staff.map((u) => (
                <tr key={u.id} className="border-b border-[#1a1a2e]/6 last:border-0">
                  <td className="px-2 py-2.5">
                    <p className="font-medium text-[#0f2150]">{u.full_name || "—"}</p>
                    <p className="text-xs text-[#1a1a2e]/50">{u.email}</p>
                  </td>
                  <td className="px-2 py-2.5">
                    <select
                      className={field}
                      defaultValue={u.role}
                      disabled={pending || u.id === selfId}
                      onChange={(e) => { const fd = new FormData(); fd.set("userId", u.id); fd.set("role", e.target.value); run(setStaffRole, fd); }}
                    >
                      <option value="admin">Administrator</option>
                      <option value="accountant">Accountant</option>
                      <option value="student">Student (revoke)</option>
                    </select>
                  </td>
                  <td className="px-2 py-2.5">
                    <label className="inline-flex items-center gap-2">
                      <input
                        type="checkbox"
                        defaultChecked={u.can_edit_financials}
                        disabled={pending || u.role === "admin"}
                        onChange={(e) => { const fd = new FormData(); fd.set("userId", u.id); if (e.target.checked) fd.set("canEdit", "on"); run(setEditPermission, fd); }}
                      />
                      <span className="text-xs text-[#1a1a2e]/60">{u.role === "admin" ? "Always (admin)" : "Allow edits"}</span>
                    </label>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Note state={state} />
      </section>
    </div>
  );
}

export function SettingsForm({ settings }: { settings: AcctSettings }) {
  const [state, setState] = useState<{ error?: string; message?: string } | null>(null);
  const [pending, start] = useTransition();
  return (
    <section className="card p-5">
      <h2 className="mb-3 font-heading text-base font-bold text-[#0f2150]">Financial settings</h2>
      <p className="mb-4 text-xs text-[#1a1a2e]/55">
        Used only when creating new invoices. Imported course fees are never auto-taxed.
      </p>
      <form
        className="grid gap-4 sm:grid-cols-2"
        onSubmit={(e) => { e.preventDefault(); const fd = new FormData(e.currentTarget); start(async () => setState(await updateSettings(null, fd))); }}
      >
        <label className="block sm:col-span-2"><span className="mb-1 block text-xs font-medium text-[#1a1a2e]/60">Legal seller name</span><input name="legalName" defaultValue={settings.seller.legalName ?? ""} className={field} /></label>
        <label className="block sm:col-span-2"><span className="mb-1 block text-xs font-medium text-[#1a1a2e]/60">Address</span><input name="address" defaultValue={settings.seller.address ?? ""} className={field} /></label>
        <label className="block"><span className="mb-1 block text-xs font-medium text-[#1a1a2e]/60">Tax registration # (optional)</span><input name="taxNumber" defaultValue={settings.seller.taxNumber ?? ""} className={field} /></label>
        <label className="block"><span className="mb-1 block text-xs font-medium text-[#1a1a2e]/60">Invoice prefix</span><input name="invoicePrefix" defaultValue={settings.invoicePrefix} className={field} /></label>
        <label className="block"><span className="mb-1 block text-xs font-medium text-[#1a1a2e]/60">Seller email</span><input name="sellerEmail" type="email" defaultValue={settings.seller.email ?? ""} className={field} /></label>
        <label className="block"><span className="mb-1 block text-xs font-medium text-[#1a1a2e]/60">Seller phone</span><input name="sellerPhone" defaultValue={settings.seller.phone ?? ""} className={field} /></label>
        <label className="block"><span className="mb-1 block text-xs font-medium text-[#1a1a2e]/60">Tax label (e.g. HST)</span><input name="taxLabel" defaultValue={settings.taxLabel ?? ""} className={field} /></label>
        <label className="block"><span className="mb-1 block text-xs font-medium text-[#1a1a2e]/60">Tax rate %</span><input name="taxRate" type="number" step="0.01" defaultValue={settings.taxRateBps != null ? (settings.taxRateBps / 100).toString() : ""} className={field} /></label>
        <div className="sm:col-span-2">
          <button type="submit" disabled={pending} className="btn-primary inline-flex items-center gap-2 text-sm disabled:opacity-60"><Save className="h-4 w-4" aria-hidden="true" /> Save settings</button>
          <Note state={state} />
        </div>
      </form>
    </section>
  );
}
