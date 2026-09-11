import "server-only";
import type { SupabaseClient } from "@supabase/supabase-js";

// Append-only audit log. Writes go through the service-role client only (there
// is no client-side insert policy), so entries can't be forged from the browser.
// Failures are swallowed — auditing must never break the underlying action, but
// we log to the server console so issues are visible.
export async function logAudit(
  admin: SupabaseClient,
  entry: {
    actorId?: string | null;
    actorEmail?: string | null;
    action: string;
    entity?: string | null;
    entityId?: string | null;
    meta?: Record<string, unknown>;
  },
): Promise<void> {
  try {
    await admin.from("acct_audit_events").insert({
      actor_id: entry.actorId ?? null,
      actor_email: entry.actorEmail ?? null,
      action: entry.action,
      entity: entry.entity ?? null,
      entity_id: entry.entityId ?? null,
      meta: entry.meta ?? {},
    });
  } catch (err) {
    console.error("[audit] failed to record event", entry.action, err);
  }
}
