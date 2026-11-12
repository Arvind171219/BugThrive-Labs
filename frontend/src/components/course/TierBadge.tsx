import { cn } from "@/lib/utils";
import type { Tier } from "@/types";

const ROMAN = ["0", "I", "II", "III", "IV"] as const;

export function tierLabel(tier: Tier) {
  return `Tier ${ROMAN[tier]}`;
}

/** Difficulty tier shown as a label plus five pips. */
export function TierBadge({ tier, className }: { tier: Tier; className?: string }) {
  return (
    <span
      className={cn("inline-flex items-center gap-1.5 font-mono text-[10px] font-bold uppercase tracking-wider text-muted-foreground", className)}
      title={`Difficulty ${tierLabel(tier)} of IV`}
    >
      <span className="flex gap-0.5" aria-hidden>
        {[0, 1, 2, 3, 4].map((i) => (
          <span key={i} className={cn("h-2.5 w-1 rounded-sm", i <= tier ? "bg-primary" : "bg-muted")} />
        ))}
      </span>
      {tierLabel(tier)}
    </span>
  );
}
