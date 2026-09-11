import { TAX_LABEL, TAX_PERCENTAGE } from "@/lib/tax";

// ── Seed data for the (unlisted) WooCommerce-style Orders view ───────────────
// From CanaDent_Advanced_Adhesive_Dentistry.xlsx, worksheet "Course Registrants".
// Order numbers and order dates are GENERATED for display; participant names,
// emails, fees, status and attendance are verbatim from the spreadsheet. (The
// source omits participant no. 13; 13 people are listed.) Client/server-safe.

export const COURSE = "Advanced Adhesive Dentistry: The Master Blueprint";
export const COURSE_DATE = "September 6, 2026";
export const DELIVERY = "Hybrid";
export const INSTRUCTOR = "Dr. Amin Asadollahi";
export const CE_CREDITS = "6 CE Credits";
export const LOCATION = "265 Rimrock Rd, North York, ON";

export type Attendance = "in_person" | "online";

export type Order = {
  number: number;
  date: string; // generated order date (ISO)
  name: string;
  organization: string | null;
  email: string | null;
  totalCents: number;
  attendance: Attendance;
  status: "Confirmed";
};

export const ORDERS: Order[] = [
  { number: 1001, date: "2026-07-02", name: "Dr. Neda Khebreh", organization: null, email: "neda_khebreh@yahoo.com", totalCents: 69900, attendance: "in_person", status: "Confirmed" },
  { number: 1002, date: "2026-07-06", name: "Dr. Bita Bondari", organization: null, email: "bitabondari@yahoo.com", totalCents: 69900, attendance: "in_person", status: "Confirmed" },
  { number: 1003, date: "2026-07-10", name: "Dr. Elaheh (Eli) Hashemi", organization: null, email: "elihashemi2@yahoo.com", totalCents: 69900, attendance: "in_person", status: "Confirmed" },
  { number: 1004, date: "2026-07-14", name: "Dr. Parastoo Afghari", organization: null, email: "parastoo.afghari@gmail.com", totalCents: 69900, attendance: "in_person", status: "Confirmed" },
  { number: 1005, date: "2026-07-18", name: "Dr. Leila Hosseini", organization: null, email: "leila.hsn@outlook.com", totalCents: 69900, attendance: "in_person", status: "Confirmed" },
  { number: 1006, date: "2026-07-22", name: "Dr. Niousha Zerafatjou", organization: null, email: "ddszerafatjou.niousha@gmail.com", totalCents: 59900, attendance: "in_person", status: "Confirmed" },
  { number: 1007, date: "2026-07-26", name: "Dr. Sahar Ghareghashi", organization: null, email: "sahar.ghareghashi@gmail.com", totalCents: 49900, attendance: "online", status: "Confirmed" },
  { number: 1008, date: "2026-07-30", name: "Dr. Katayoon Shojaei", organization: null, email: "katayoon.shojaei@gmail.com", totalCents: 69900, attendance: "online", status: "Confirmed" },
  { number: 1009, date: "2026-08-03", name: "Dr. Roula Skaff", organization: null, email: "roula_skaf@hotmail.com", totalCents: 49900, attendance: "online", status: "Confirmed" },
  { number: 1010, date: "2026-08-07", name: "Dr. Maria Eva Sayas", organization: null, email: "dentev_a@hotmail.com", totalCents: 49900, attendance: "online", status: "Confirmed" },
  { number: 1011, date: "2026-08-11", name: "Dr. Najmeh Showraki", organization: null, email: "nshowraki@gmail.com", totalCents: 24950, attendance: "online", status: "Confirmed" },
  { number: 1012, date: "2026-08-15", name: "Dr. Neda Kadivar", organization: null, email: "kadivarneda@yahoo.com", totalCents: 69900, attendance: "in_person", status: "Confirmed" },
  { number: 1013, date: "2026-08-19", name: "Dr. Atefeh Ehteshamfar", organization: null, email: "atefeh.eht@gmail.com", totalCents: 69900, attendance: "in_person", status: "Confirmed" },
];

export function getOrder(number: number): Order | undefined {
  return ORDERS.find((o) => o.number === number);
}

export function attendanceLabel(a: Attendance): string {
  return a === "in_person" ? "In person" : "Online";
}

export function fmtDate(iso: string): string {
  return new Date(`${iso}T12:00:00Z`).toLocaleDateString("en-CA", {
    year: "numeric", month: "short", day: "numeric",
  });
}

export function initials(name: string): string {
  return name
    .replace(/\(.*?\)/g, "")
    .replace(/^(dr|prof|mr|mrs|ms|miss)\.?\s+/i, "") // drop a leading honorific
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? "")
    .join("");
}

// ── Ontario HST (13%) ────────────────────────────────────────────────────────
// Course fees are treated as tax-exclusive (matching the site's checkout model).
// Integer-cent math; exported label/rate kept in sync with the site's tax config.
export { TAX_LABEL, TAX_PERCENTAGE };

export function hstCents(subtotalCents: number): number {
  return Math.round((subtotalCents * TAX_PERCENTAGE) / 100);
}

export function totalWithTaxCents(subtotalCents: number): number {
  return subtotalCents + hstCents(subtotalCents);
}
