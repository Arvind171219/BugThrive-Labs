import { categories } from "@/data/categories";
import { cn } from "@/lib/utils";
import type { CategoryId } from "@/types";

/** Generated cover art: category gradient + grid + icon. No image assets required. */
export function CourseThumbnail({ category, className }: { category: CategoryId; className?: string }) {
  const meta = categories[category];
  const Icon = meta.icon;
  return (
    <div
      className={cn(
        "bg-grid relative flex items-center justify-center overflow-hidden bg-gradient-to-br to-transparent",
        meta.gradient,
        className,
      )}
    >
      <Icon className={cn("h-10 w-10 opacity-80", meta.text)} strokeWidth={1.5} />
    </div>
  );
}
