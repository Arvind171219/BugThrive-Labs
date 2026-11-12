import { categories } from "@/data/categories";
import { cn } from "@/lib/utils";
import type { CategoryId } from "@/types";

export function CategoryBadge({ category, className }: { category: CategoryId; className?: string }) {
  const meta = categories[category];
  const Icon = meta.icon;
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-md border px-2 py-0.5 font-mono text-[10px] font-bold uppercase tracking-wider",
        meta.bg,
        meta.text,
        meta.border,
        className,
      )}
    >
      <Icon className="h-3 w-3" />
      {meta.name}
    </span>
  );
}
