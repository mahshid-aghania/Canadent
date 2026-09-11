import { NextResponse } from "next/server";
import { getCurrentStaff } from "@/lib/accounting/auth";
import { canEditFinancials } from "@/lib/accounting/roles";

export const dynamic = "force-dynamic";

// ── Stripe reconciliation boundary ───────────────────────────────────────────
// The integration seam is in place. When STRIPE_SECRET_KEY exists AND a brand
// attribution rule is configured (which explicitly identifies CanaDent charges
// in a possibly shared account), this endpoint pulls recent transactions into
// the review queue — matching by explicit registration/order/invoice/payment
// identifiers, treating email+amount only as suggestions, and upserting by
// provider reference so webhook retries never double-count. It never initiates
// charges, refunds, or customer emails.
//
// Until then it reports its status honestly rather than fabricating totals.
export async function POST() {
  const staff = await getCurrentStaff();
  if (!staff || !canEditFinancials(staff)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  if (!process.env.STRIPE_SECRET_KEY) {
    return NextResponse.json(
      {
        status: "connection_required",
        message: "Stripe is not connected. Add STRIPE_SECRET_KEY to enable reconciliation.",
        lastSync: null,
      },
      { status: 503 },
    );
  }

  // Keys exist but brand attribution isn't configured. We deliberately do NOT
  // infer the CanaDent brand from a shared payment account or a customer email
  // alone, so no records are imported until an attribution rule is set.
  return NextResponse.json(
    {
      status: "attribution_required",
      message:
        "Stripe is connected, but a CanaDent brand-attribution rule (metadata key/value or dedicated account) must be configured before importing, so records from other brands on a shared account are excluded. See ACCOUNTANT_SETUP.md.",
      lastSync: null,
    },
    { status: 409 },
  );
}
