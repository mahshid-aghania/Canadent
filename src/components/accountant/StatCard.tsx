import type { LucideIcon } from "lucide-react";

// Restrained metric card. `tone` only tints the small icon chip, never the whole
// card, keeping the dashboard calm and the numbers legible.
export function StatCard({
  label, value, sub, icon: Icon, tone = "neutral",
}: {
  label: string;
  value: string;
  sub?: string;
  icon: LucideIcon;
  tone?: "neutral" | "positive" | "warning" | "info";
}) {
  const tones: Record<string, string> = {
    neutral: "bg-[#f1f0ec] text-[#57534e]",
    positive: "bg-[#ecfdf5] text-[#065f46]",
    warning: "bg-[#fef3c7] text-[#92400e]",
    info: "bg-[#eff6ff] text-[#1e40af]",
  };
  return (
    <div className="card p-5">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-[#1a1a2e]/45">{label}</p>
          <p className="mt-2 font-heading text-2xl font-bold text-[#0f2150]">{value}</p>
          {sub && <p className="mt-1 text-xs text-[#1a1a2e]/55">{sub}</p>}
        </div>
        <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${tones[tone]}`}>
          <Icon className="h-4.5 w-4.5" aria-hidden="true" />
        </span>
      </div>
    </div>
  );
}
