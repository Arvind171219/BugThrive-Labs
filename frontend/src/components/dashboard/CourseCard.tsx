import { Link } from "react-router-dom";
import { Clock, Star, Users } from "lucide-react";

import { FavouriteButton } from "@/components/course/FavouriteButton";
import { TierBadge } from "@/components/course/TierBadge";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useLearningState } from "@/lib/learning-state";
import type { Course } from "@/types";
import { CategoryBadge } from "./CategoryBadge";
import { CourseThumbnail } from "./CourseThumbnail";

/**
 * Whole card is clickable via a stretched title link; the save button sits
 * above it so the two interactive elements are not nested.
 */
export function CourseCard({ course }: { course: Course }) {
  const { courseProgress } = useLearningState();
  const progress = courseProgress(course);

  return (
    <Card className="group relative flex h-full flex-col overflow-hidden transition-all focus-within:ring-2 focus-within:ring-ring hover:-translate-y-0.5 hover:border-primary/40">
      <div className="relative">
        <CourseThumbnail category={course.category} className="h-28" />
        {course.isNew && <Badge className="absolute left-3 top-3">New</Badge>}
        <FavouriteButton courseId={course.id} className="absolute right-3 top-3 z-10" />
      </div>
      <div className="flex flex-1 flex-col p-4">
        <div className="flex items-center justify-between gap-2">
          <CategoryBadge category={course.category} />
          <TierBadge tier={course.tier} />
        </div>
        <h3 className="mt-3 line-clamp-2 font-semibold leading-snug transition-colors group-hover:text-primary">
          <Link to={`/courses/${course.slug}`} className="outline-none after:absolute after:inset-0">
            {course.title}
          </Link>
        </h3>
        <p className="mt-1 text-xs text-muted-foreground">
          {course.domain} · {course.level} · by {course.instructor}
        </p>
        <div className="mt-auto pt-4">
          {progress !== undefined ? (
            <div className="flex items-center gap-3">
              <Progress value={progress} className="h-1.5" />
              <span className="font-mono text-xs font-bold text-primary">{progress}%</span>
            </div>
          ) : (
            <div className="flex items-center gap-4 font-mono text-[11px] text-muted-foreground">
              <span className="flex items-center gap-1">
                <Clock className="h-3.5 w-3.5" />
                {course.durationHours}h
              </span>
              <span className="flex items-center gap-1">
                <Star className="h-3.5 w-3.5 fill-primary text-primary" />
                {course.rating}
              </span>
              <span className="flex items-center gap-1">
                <Users className="h-3.5 w-3.5" />
                {(course.students / 1000).toFixed(1)}k
              </span>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}
