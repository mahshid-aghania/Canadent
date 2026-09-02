import { createClient, type SupabaseClient } from "@supabase/supabase-js";

// Browser-safe Supabase client using the public anon key. Safe to use in client
// components. Anon access is governed by Row Level Security policies in the
// database. Returns null until the public env vars are provisioned.
let cached: SupabaseClient | null = null;

export function getSupabaseBrowser(): SupabaseClient | null {
  if (cached) return cached;
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anonKey) return null;
  cached = createClient(url, anonKey);
  return cached;
}
