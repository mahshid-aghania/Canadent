import { PlugZap } from "lucide-react";

// Shown wherever a required integration (database, Stripe) isn't configured.
// We never fabricate totals — the dashboard stays honestly empty until a real
// connection exists.
export function ConnectionRequired({
  service = "Database",
  detail,
}: {
  service?: string;
  detail?: string;
}) {
  return (
    <div className="card flex flex-col items-center gap-3 p-10 text-center">
      <span className="flex h-12 w-12 items-center justify-center rounded-full bg-[#fef3c7] text-[#92400e]">
        <PlugZap className="h-6 w-6" aria-hidden="true" />
      </span>
      <h2 className="font-heading text-xl font-bold text-[#0f2150]">{service} connection required</h2>
      <p className="max-w-md text-sm text-[#1a1a2e]/60">
        {detail ?? `${service} isn't configured yet. Add the required credentials to enable this area. No figures are shown until a real connection is available.`}
      </p>
    </div>
  );
}
