import "server-only";
import { cookies } from "next/headers";
import { createServerClient, type CookieOptions } from "@supabase/ssr";
import type { SupabaseClient } from "@supabase/supabase-js";

// Cookie-bound Supabase client for the App Router (RSC, route handlers, server
// actions). It reads/writes the auth session cookies so the logged-in user is
// available on the server. Anon-key client, governed by RLS. Returns null until
// the public env vars are provisioned, so callers can show "Connection required".
export async function getSupabaseServer(): Promise<SupabaseClient | null> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anonKey) return null;

  const cookieStore = await cookies();
  return createServerClient(url, anonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          for (const { name, value, options } of cookiesToSet) {
            cookieStore.set(name, value, options as CookieOptions);
          }
        } catch {
          // Called from a Server Component where cookies are read-only — the
          // middleware refreshes the session instead, so this is safe to ignore.
        }
      },
    },
  });
}
