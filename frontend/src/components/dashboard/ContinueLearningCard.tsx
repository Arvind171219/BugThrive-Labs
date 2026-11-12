import { Link } from "react-router-dom";
import { PlayCircle } from "lucide-react";

import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useLearningState } from "@/lib/learning-state";
import type { Course } from "@/types";
import { CategoryBadge } from "./CategoryBadge";
import { CourseThumbnail } from "./CourseThumbnail";

export function ContinueLearningCard({ course }: { course: Course }) {
  const { courseProgress, nextSection } = useLearningState();
  const progress = courseProgress(course) ?? 0;
  const next = nextSection(course);

  return (
    <Link
      to={next ? `/courses/${course.slug}/sections/${next.id}` : `/courses/${course.slug}`}
      className="group block rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
    >
      <Card className="flex overflow-hidden transition-colors group-hover:border-primary/40">
        <CourseThumbnail category={course.category} className="hidden w-28 shrink-0 sm:flex" />
        <div className="min-w-0 flex-1 p-4">
          <div className="flex items-center justify-between gap-2">
            <CategoryBadge category={course.category} />
            <span className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
              {course.lastAccessed}
            </span>
          </div>
          <h3 className="mt-2 truncate font-semibold transition-colors group-hover:text-primary">{course.title}</h3>
          {next && (
            <p className="mt-0.5 flex items-center gap-1.5 truncate text-xs text-muted-foreground">
              <PlayCircle className="h-3.5 w-3.5 shrink-0 text-primary" />
              Next: {next.title}
            </p>
          )}
          <div className="mt-3 flex items-center gap-3">
            <Progress value={progress} className="h-1.5" />
            <span className="font-mono text-xs font-bold text-primary">{progress}%</span>
          </div>
        </div>
      </Card>
    </Link>
  );
}
