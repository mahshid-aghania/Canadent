// ── Seed data for the (unlisted) WooCommerce-style Orders view ───────────────
// From CanaDent_Advanced_Adhesive_Dentistry_Registrants (1) (1).xlsx, worksheet
// "Registrants". Order numbers and order dates are GENERATED for display; names,
// organizations, emails, fees and status are verbatim from the spreadsheet.
// Client/server-safe (no server-only imports) so both the list and the order
// detail page can share it.

export const COURSE = "Advanced Adhesive Dentistry: The Master Blueprint";
export const COURSE_DATE = "September 6, 2026";
export const DELIVERY = "Hybrid";
export const INSTRUCTOR = "Dr. Amin Asadollahi";
export const CE_CREDITS = "6 CE Credits";
export const LOCATION = "265 Rimrock Rd, North York, ON";

export type Order = {
  number: number;
  date: string; // generated order date (ISO)
  name: string;
  organization: string | null;
  email: string | null;
  totalCents: number;
  status: "Confirmed";
};

export const ORDERS: Order[] = [
  { number: 1001, date: "2026-07-02", name: "Neda Khebreh", organization: null, email: "neda_khebreh@yahoo.com", totalCents: 69900, status: "Confirmed" },
  { number: 1002, date: "2026-07-06", name: "Bita Bondari", organization: null, email: "bitabondari@yahoo.com", totalCents: 69900, status: "Confirmed" },
  { number: 1003, date: "2026-07-10", name: "Elaheh (Eli) Hashemi", organization: null, email: "elihashemi2@yahoo.com", totalCents: 69900, status: "Confirmed" },
  { number: 1004, date: "2026-07-14", name: "Parastoo Afghari", organization: null, email: "parastoo.afghari@gmail.com", totalCents: 69900, status: "Confirmed" },
  { number: 1005, date: "2026-07-18", name: "Leila Hosseini", organization: null, email: "leila.hsn@outlook.com", totalCents: 69900, status: "Confirmed" },
  { number: 1006, date: "2026-07-22", name: "Niousha Zerafatjou", organization: null, email: "ddszerafatjou.niousha@gmail.com", totalCents: 59900, status: "Confirmed" },
  { number: 1007, date: "2026-07-26", name: "Sahar Ghareghashi", organization: null, email: "sahar.ghareghashi@gmail.com", totalCents: 49900, status: "Confirmed" },
  { number: 1008, date: "2026-07-30", name: "Katayoon Shojaei", organization: null, email: "katayoon.shojaei@gmail.com", totalCents: 69900, status: "Confirmed" },
  { number: 1009, date: "2026-08-03", name: "Roula Skaff", organization: null, email: "roula_skaf@hotmail.com", totalCents: 49900, status: "Confirmed" },
  { number: 1010, date: "2026-08-07", name: "Maria Eva Sayas", organization: null, email: "dentev_a@hotmail.com", totalCents: 49900, status: "Confirmed" },
  { number: 1011, date: "2026-08-11", name: "Najmeh Showraki", organization: null, email: "nshowraki@gmail.com", totalCents: 24950, status: "Confirmed" },
  { number: 1012, date: "2026-08-15", name: "Dr. Neda Kadivar", organization: "DPC", email: null, totalCents: 69900, status: "Confirmed" },
];

export function getOrder(number: number): Order | undefined {
  return ORDERS.find((o) => o.number === number);
}

export function fmtDate(iso: string): string {
  return new Date(`${iso}T12:00:00Z`).toLocaleDateString("en-CA", {
    year: "numeric", month: "short", day: "numeric",
  });
}

export function initials(name: string): string {
  return name.replace(/\(.*?\)/g, "").trim().split(/\s+/).slice(0, 2).map((w) => w[0]?.toUpperCase() ?? "").join("");
}
