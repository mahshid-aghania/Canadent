// ── Privacy-safe funnel tracking ──────────────────────────────────────────
// Emits a small set of named funnel events. It NEVER receives or forwards
// personally identifiable information (no email, name, or phone) — only the
// course slug, attendance label, and price. Events are pushed to
// window.dataLayer when an analytics provider is present, and mirrored to
// console.debug in development. If no provider is configured, this is a no-op.

export type FunnelEvent =
  | "course_viewed"
  | "attendance_selected"
  | "registration_started"
  | "checkout_started"
  | "payment_completed";

type FunnelPayload = {
  slug?: string;
  attendance?: "online" | "in-person";
  price?: number;
};

// Keys that must never appear in an analytics payload.
const PII_KEYS = ["email", "name", "phone", "tel", "customer"];

export function track(event: FunnelEvent, payload: FunnelPayload = {}): void {
  if (typeof window === "undefined") return;

  // Defensive: strip anything that looks like PII before it leaves the page.
  const safe: FunnelPayload = {};
  for (const [key, value] of Object.entries(payload)) {
    if (PII_KEYS.some((p) => key.toLowerCase().includes(p))) continue;
    if (value !== undefined && value !== null) {
      (safe as Record<string, unknown>)[key] = value;
    }
  }

  const w = window as unknown as { dataLayer?: Record<string, unknown>[] };
  if (Array.isArray(w.dataLayer)) {
    w.dataLayer.push({ event, ...safe });
  }

  if (process.env.NODE_ENV !== "production") {
    console.debug("[funnel]", event, safe);
  }
}
