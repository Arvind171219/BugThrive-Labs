import { tierLabel } from "@/components/course/TierBadge";
import { categories } from "@/data/categories";
import type { Course, LearningPath } from "@/types";

function normalize(value: string) {
  return value.trim().toLowerCase();
}

export function courseMatches(course: Course, query: string) {
  const q = normalize(query);
  if (!q) return true;
  return [
    course.title,
    course.description,
    course.instructor,
    course.level,
    course.domain,
    tierLabel(course.tier),
    categories[course.category].name,
    ...course.tags,
  ].some((field) => field.toLowerCase().includes(q));
}

export function pathMatches(path: LearningPath, query: string) {
  const q = normalize(query);
  if (!q) return true;
  return [path.title, path.description, path.level, path.type === "job-role" ? "job role" : "skill", categories[path.category].name]
    .some((field) => field.toLowerCase().includes(q));
}
