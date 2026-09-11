"use client";

import { usePathname } from "next/navigation";

// Hides the public site chrome (announcement bar, header, footer, chat widget)
// on the accountant dashboard, which renders its own full-screen shell. Keeps
// the existing single root layout intact for every other route.
export function ChromeGate({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  if (pathname?.startsWith("/accountant")) return null;
  return <>{children}</>;
}
