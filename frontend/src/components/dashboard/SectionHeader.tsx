import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  actionLabel?: string;
  actionTo?: string;
  children?: ReactNode;
}

export function SectionHeader({ title, subtitle, actionLabel, actionTo, children }: SectionHeaderProps) {
  return (
    <div className="mb-4 flex flex-wrap items-end justify-between gap-2">
      <div>
        <h2 className="text-lg font-semibold sm:text-xl">{title}</h2>
        {subtitle && <p className="mt-0.5 text-sm text-muted-foreground">{subtitle}</p>}
      </div>
      {children}
      {actionLabel && actionTo && (
        <Link
          to={actionTo}
          className="group flex items-center gap-1 font-mono text-[11px] font-bold uppercase tracking-widest text-muted-foreground transition-colors hover:text-primary"
        >
          {actionLabel}
          <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
        </Link>
      )}
    </div>
  );
}
