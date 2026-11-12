import type { LucideIcon } from "lucide-react";

import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface StatCardProps {
  label: string;
  value: string | number;
  hint?: string;
  icon: LucideIcon;
  iconClassName?: string;
}

export function StatCard({ label, value, hint, icon: Icon, iconClassName }: StatCardProps) {
  return (
    <Card className="p-5 transition-colors hover:border-primary/30">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="eyebrow">{label}</p>
          <p className="mt-2 font-heading text-3xl font-bold">{value}</p>
          {hint && <p className="mt-1 text-xs text-muted-foreground">{hint}</p>}
        </div>
        <span
          className={cn(
            "hidden h-10 w-10 shrink-0 sm:flex items-center justify-center rounded-lg bg-primary/10 text-primary",
            iconClassName,
          )}
        >
          <Icon className="h-5 w-5" />
        </span>
      </div>
    </Card>
  );
}
