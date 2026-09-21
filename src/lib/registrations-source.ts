import "server-only";
import Stripe from "stripe";
import { getSupabaseAdmin } from "@/lib/supabase/admin";
import { applyRegistrationFilters, type RegistrationFilters } from "@/lib/registrations";

// A single registration row, shared by the admin list, the CSV export, and the
// summary widgets. The shape matches the Supabase `registrations` table, but
// rows can also be reconstructed live from Stripe when Supabase isn't
// provisioned (see loadRegistrations).
export type Registration = {
  id: string;
  created_at: string;
  course_slug: string | null;
  course_title: string;
  attendance: string | null;
  student_name: string | null;
  student_email: string;
  student_phone: string | null;
  amount_total_cents: number | null;
  currency: string | null;
  stripe_session_id: string | null;
  stripe_payment_intent: string | null;
  utm: Record<string, string> | null;
};

export type RegistrationsResult = {
  rows: Registration[];
  /** Where the data came from, so the UI can be honest about it. */
  source: "supabase" | "stripe" | "none";
  error: string | null;
};

const SUPABASE_COLUMNS =
  "id, created_at, course_slug, course_title, attendance, student_name, student_email, student_phone, amount_total_cents, currency, stripe_session_id, stripe_payment_intent, utm";

/**
 * Load registrations from the best available source:
 *   1. Supabase, once its env vars are provisioned (the durable store), else
 *   2. Stripe paid Checkout sessions (the source of truth for payments), so the
 *      dashboard is useful immediately even before the datastore exists.
 * Returns source: "none" only when neither is configured.
 */
export async function loadRegistrations(
  filters: RegistrationFilters,
  limit = 500
): Promise<RegistrationsResult> {
  const supabase = getSupabaseAdmin();
  if (supabase) {
    const { data, error } = await applyRegistrationFilters(
      supabase.from("registrations").select(SUPABASE_COLUMNS),
      filters
    )
      .order("created_at", { ascending: false })
      .limit(limit);
    return {
      rows: (data ?? []) as Registration[],
      source: "supabase",
      error: error?.message ?? null,
    };
  }

  if (process.env.STRIPE_SECRET_KEY) {
    try {
      const all = await loadFromStripe(limit);
      return { rows: filterInJs(all, filters).slice(0, limit), source: "stripe", error: null };
    } catch (err) {
      return {
        rows: [],
        source: "stripe",
        error: err instanceof Error ? err.message : "Failed to load from Stripe.",
      };
    }
  }

  return { rows: [], source: "none", error: null };
}

async function loadFromStripe(limit: number): Promise<Registration[]> {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
  const rows: Registration[] = [];
  let startingAfter: string | undefined;

  // Paginate defensively (cap at 10 pages / 1000 sessions) — plenty for now,
  // and a hard backstop against an unbounded loop.
  for (let page = 0; page < 10 && rows.length < limit + 100; page++) {
    const res = await stripe.checkout.sessions.list({
      limit: 100,
      expand: ["data.customer_details"],
      ...(startingAfter ? { starting_after: startingAfter } : {}),
    });
    for (const s of res.data) {
      if (s.payment_status !== "paid") continue;
      rows.push(mapSession(s));
    }
    if (!res.has_more || res.data.length === 0) break;
    startingAfter = res.data[res.data.length - 1].id;
  }

  // Stripe already returns newest-first; keep that ordering explicit.
  rows.sort((a, b) => (a.created_at < b.created_at ? 1 : -1));
  return rows;
}

function mapSession(s: Stripe.Checkout.Session): Registration {
  const cd = s.customer_details;
  const md = (s.metadata ?? {}) as Record<string, string>;
  const utm: Record<string, string> = {};
  for (const [k, v] of Object.entries(md)) {
    if (/^utm_[a-z]+$/.test(k) && typeof v === "string") utm[k] = v;
  }
  return {
    id: s.id,
    created_at: new Date(s.created * 1000).toISOString(),
    course_slug: md.slug ?? null,
    course_title: md.title ?? "—",
    attendance: md.attendance ?? null,
    student_name: cd?.name ?? null,
    student_email: cd?.email ?? "—",
    student_phone: cd?.phone ?? null,
    amount_total_cents: s.amount_total ?? null,
    currency: s.currency ?? "cad",
    stripe_session_id: s.id,
    stripe_payment_intent:
      typeof s.payment_intent === "string" ? s.payment_intent : null,
    utm: Object.keys(utm).length ? utm : null,
  };
}

function filterInJs(rows: Registration[], f: RegistrationFilters): Registration[] {
  return rows.filter((r) => {
    if (f.course && r.course_slug !== f.course) return false;
    if (f.from && r.created_at < `${f.from}T00:00:00.000Z`) return false;
    if (f.to && r.created_at > `${f.to}T23:59:59.999Z`) return false;
    return true;
  });
}

// ── Summary for the dashboard widgets ────────────────────────────────────────

export type RegistrationSummary = {
  total: number;
  revenueCents: number;
  currency: string;
  byCourse: { title: string; count: number; revenueCents: number }[];
};

export function summarize(rows: Registration[]): RegistrationSummary {
  const byCourse = new Map<string, { count: number; revenueCents: number }>();
  let revenueCents = 0;
  let currency = "cad";

  for (const r of rows) {
    const cents = r.amount_total_cents ?? 0;
    revenueCents += cents;
    if (r.currency) currency = r.currency;
    const key = r.course_title || "—";
    const agg = byCourse.get(key) ?? { count: 0, revenueCents: 0 };
    agg.count += 1;
    agg.revenueCents += cents;
    byCourse.set(key, agg);
  }

  return {
    total: rows.length,
    revenueCents,
    currency,
    byCourse: [...byCourse.entries()]
      .map(([title, v]) => ({ title, ...v }))
      .sort((a, b) => b.count - a.count || b.revenueCents - a.revenueCents),
  };
}
