import { Link } from "react-router-dom";
import { Sparkles } from "lucide-react";

import { TierBadge } from "@/components/course/TierBadge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { categories } from "@/data/categories";
import type { Course } from "@/types";

export function NewReleases({ items }: { items: Course[] }) {
  if (!items.length) return null;

  return (
    <Card>
      <CardHeader className="flex-row items-center justify-between space-y-0">
        <CardTitle className="text-base">New Releases</CardTitle>
        <Sparkles className="h-4 w-4 text-primary" />
      </CardHeader>
      <CardContent>
        <ul className="space-y-1">
          {items.map((course) => {
            const meta = categories[course.category];
            return (
              <li key={course.id}>
                <Link
                  to={`/courses/${course.slug}`}
                  className="-mx-2 flex items-center gap-3 rounded-md px-2 py-2 transition-colors hover:bg-accent"
                >
                  <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-md ${meta.bg} ${meta.text}`}>
                    <meta.icon className="h-4 w-4" />
                  </span>
                  <span className="min-w-0">
                    <span className="block truncate text-sm font-medium">{course.title}</span>
                    <TierBadge tier={course.tier} className="mt-0.5" />
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      </CardContent>
    </Card>
  );
}
