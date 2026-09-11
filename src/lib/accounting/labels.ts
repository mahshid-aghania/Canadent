// Client-safe display labels for accounting statuses. Restrained colours; every
// badge carries text, never colour alone (accessibility).

export function attendanceLabel(value: string | null | undefined): string {
  if (value === "in_person") return "In person";
  if (value === "online") return "Online";
  return "Not specified";
}

export const VERIFICATION_LABELS: Record<string, string> = {
  unverified: "Unverified",
  verified: "Verified",
  partial: "Partially verified",
  refunded: "Refunded",
};

export function verificationBadge(value: string): string {
  switch (value) {
    case "verified": return "badge-available";
    case "partial": return "badge-early-bird";
    case "refunded": return "badge-sold-out";
    default: return "badge-past"; // unverified — neutral, not alarming
  }
}

export const INVOICE_STATUS_LABELS: Record<string, string> = {
  draft: "Draft",
  issued: "Issued",
  partially_paid: "Partially paid",
  paid: "Paid",
  overdue: "Overdue",
  void: "Void",
};

export function invoiceStatusBadge(value: string | null): string {
  switch (value) {
    case "paid": return "badge-available";
    case "partially_paid": return "badge-early-bird";
    case "overdue": return "badge-sold-out";
    case "void": return "badge-past";
    default: return "badge-upcoming";
  }
}
