import "server-only";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";

// Server-side Supabase client using the SERVICE ROLE key. This bypasses Row
// Level Security, so it must NEVER be imported into a client component or
// exposed to the browser. Use it only in server actions, route handlers, and
// webhooks. Returns null when the environment isn't provisioned yet, so callers
// can degrade gracefully (mirrors how Stripe/Resend are handled).
export function getSupabaseAdmin(): SupabaseClient | null {
  const url = process.env.SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceKey) return null;
  return createClient(url, serviceKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
