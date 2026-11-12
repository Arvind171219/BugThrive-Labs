import { cn } from "@/lib/utils";

export interface SegmentOption<T extends string> {
  value: T;
  label: string;
  count?: number;
}

interface SegmentedControlProps<T extends string> {
  options: SegmentOption<T>[];
  value: T;
  onChange: (value: T) => void;
  label: string;
  className?: string;
}

/** Lightweight tab/filter switcher. */
export function SegmentedControl<T extends string>({ options, value, onChange, label, className }: SegmentedControlProps<T>) {
  return (
    <div role="tablist" aria-label={label} className={cn("inline-flex flex-wrap gap-1 rounded-lg border bg-card p-1", className)}>
      {options.map((option) => {
        const active = option.value === value;
        return (
          <button
            key={option.value}
            type="button"
            role="tab"
            aria-selected={active}
            onClick={() => onChange(option.value)}
            className={cn(
              "flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
              active ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-accent hover:text-foreground",
            )}
          >
            {option.label}
            {option.count !== undefined && (
              <span className={cn("font-mono text-[10px]", active ? "text-primary-foreground/70" : "text-muted-foreground/70")}>
                {option.count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
