import "server-only";
import type { SupabaseClient } from "@supabase/supabase-js";

// Admin-configured financial settings (legal seller details + tax). Imported
// course fees are NEVER auto-taxed; these values are only applied when an
// authorised user explicitly creates a new invoice.

export type SellerDetails = {
  legalName?: string;
  address?: string;
  taxNumber?: string; // e.g. HST/GST registration — only if the admin provides it
  email?: string;
  phone?: string;
};

export type AcctSettings = {
  seller: SellerDetails;
  taxLabel: string | null;
  taxRateBps: number | null; // basis points, e.g. 1300 = 13%
  defaultCurrency: string;
  invoicePrefix: string;
};

export const DEFAULT_SETTINGS: AcctSettings = {
  seller: {},
  taxLabel: null,
  taxRateBps: null,
  defaultCurrency: "cad",
  invoicePrefix: "CD",
};

export async function getSettings(admin: SupabaseClient): Promise<AcctSettings> {
  const { data } = await admin
    .from("acct_settings")
    .select("seller, tax_label, tax_rate_bps, default_currency, invoice_prefix")
    .eq("id", true)
    .maybeSingle();
  if (!data) return DEFAULT_SETTINGS;
  return {
    seller: (data.seller as SellerDetails) ?? {},
    taxLabel: data.tax_label ?? null,
    taxRateBps: data.tax_rate_bps ?? null,
    defaultCurrency: data.default_currency ?? "cad",
    invoicePrefix: data.invoice_prefix ?? "CD",
  };
}

/** True once the admin has entered the minimum legal seller details. */
export function sellerConfigured(s: AcctSettings): boolean {
  return Boolean(s.seller?.legalName && s.seller?.address);
}

export type PendingInvite = { id: string; email: string; role: string; status: string; expired: boolean };

/** Normalise raw invitation rows and stamp each with an `expired` flag. Kept out
 * of component render so the current-time read stays a pure-function concern. */
export function toPendingInvites(rows: Record<string, unknown>[]): PendingInvite[] {
  const now = Date.now();
  return rows.map((i) => ({
    id: String(i.id),
    email: String(i.email),
    role: String(i.role),
    status: String(i.status),
    expired: new Date(String(i.expires_at)).getTime() < now,
  }));
}
