"use client";

import { usePathname } from "next/navigation";

// Hides the public site chrome (announcement bar, header, footer, chat widget)
// on the accountant dashboard, which renders its own full-screen shell. Keeps
// the existing single root layout intact for every other route.
// Routes that render their own full-screen shell (no public header/footer).
const HIDDEN_PREFIXES = ["/accountant", "/orders-c78ff5517d2c820f"];

export function ChromeGate({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  if (pathname && HIDDEN_PREFIXES.some((p) => pathname.startsWith(p))) return null;
  return <>{children}</>;
}
