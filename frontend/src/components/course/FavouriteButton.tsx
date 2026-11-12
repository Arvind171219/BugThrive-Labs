import { Bookmark } from "lucide-react";

import { useLearningState } from "@/lib/learning-state";
import { cn } from "@/lib/utils";

export function FavouriteButton({ courseId, className }: { courseId: string; className?: string }) {
  const { isFavourite, toggleFavourite } = useLearningState();
  const saved = isFavourite(courseId);

  return (
    <button
      type="button"
      onClick={() => toggleFavourite(courseId)}
      aria-pressed={saved}
      aria-label={saved ? "Remove from saved" : "Save for later"}
      title={saved ? "Remove from saved" : "Save for later"}
      className={cn(
        "flex h-8 w-8 items-center justify-center rounded-md border bg-background/80 backdrop-blur transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        saved ? "border-primary/40 text-primary" : "text-muted-foreground hover:text-foreground",
        className,
      )}
    >
      <Bookmark className={cn("h-4 w-4", saved && "fill-primary")} />
    </button>
  );
}
