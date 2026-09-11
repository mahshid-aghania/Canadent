import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";

// Next.js 16 "proxy" (formerly middleware). Its job here is narrow and cheap:
//   1. Keep the Supabase auth session fresh on every accountant request.
//   2. Bounce unauthenticated visitors away from the dashboard to the login page.
// It deliberately does NOT check roles — the dashboard layout performs the
// authoritative staff/admin check server-side (see lib/accounting/auth.ts), and
// Postgres RLS is the final backstop.

// Auth pages that must stay reachable while signed out.
const PUBLIC_ACCOUNTANT_PATHS = [
  "/accountant/login",
  "/accountant/forgot-password",
  "/accountant/reset-password",
  "/accountant/accept-invite",
];

export async function proxy(request: NextRequest) {
  let response = NextResponse.next({ request });

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const { pathname } = request.nextUrl;
  const isPublic = PUBLIC_ACCOUNTANT_PATHS.some(
    (p) => pathname === p || pathname.startsWith(`${p}/`),
  );

  // Env not provisioned — let the pages render their "Connection required" state.
  if (!url || !anonKey) return response;

  const supabase = createServerClient(url, anonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        for (const { name, value } of cookiesToSet) {
          request.cookies.set(name, value);
        }
        response = NextResponse.next({ request });
        for (const { name, value, options } of cookiesToSet) {
          response.cookies.set(name, value, options);
        }
      },
    },
  });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user && !isPublic) {
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = "/accountant/login";
    redirectUrl.searchParams.set("next", pathname);
    return NextResponse.redirect(redirectUrl);
  }

  return response;
}

export const config = {
  matcher: ["/accountant/:path*"],
};
