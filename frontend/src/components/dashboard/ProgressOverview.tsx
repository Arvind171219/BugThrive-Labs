import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { categoryList } from "@/data/categories";
import { useLearningState } from "@/lib/learning-state";
import type { Course } from "@/types";

interface ProgressOverviewProps {
  enrolled: Course[];
}

function average(values: number[]) {
  return values.length ? Math.round(values.reduce((sum, v) => sum + v, 0) / values.length) : 0;
}

/** Overall completion ring + per-category breakdown for enrolled courses. */
export function ProgressOverview({ enrolled }: ProgressOverviewProps) {
  const { courseProgress } = useLearningState();
  const progressOf = (c: Course) => courseProgress(c) ?? 0;
  const overall = average(enrolled.map(progressOf));
  const radius = 52;
  const circumference = 2 * Math.PI * radius;

  const byCategory = categoryList.map((cat) => {
    const inCategory = enrolled.filter((c) => c.category === cat.id);
    return { cat, count: inCategory.length, progress: average(inCategory.map(progressOf)) };
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Learning Progress</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-5">
          <div className="relative h-32 w-32 shrink-0">
            <svg viewBox="0 0 120 120" className="h-full w-full -rotate-90" role="img" aria-label={`${overall}% overall progress`}>
              <circle cx="60" cy="60" r={radius} fill="none" strokeWidth="10" className="stroke-muted" />
              <circle
                cx="60"
                cy="60"
                r={radius}
                fill="none"
                strokeWidth="10"
                strokeLinecap="round"
                className="stroke-primary transition-all"
                strokeDasharray={circumference}
                strokeDashoffset={circumference * (1 - overall / 100)}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="font-heading text-3xl font-bold">{overall}%</span>
              <span className="eyebrow text-[9px]">Overall</span>
            </div>
          </div>
          <p className="text-sm text-muted-foreground">
            Average completion across your <span className="font-medium text-foreground">{enrolled.length}</span>{" "}
            enrolled courses.
          </p>
        </div>

        <ul className="mt-6 space-y-3">
          {byCategory.map(({ cat, count, progress }) => (
            <li key={cat.id}>
              <div className="mb-1.5 flex items-center justify-between text-xs">
                <span className="flex items-center gap-2">
                  <cat.icon className={`h-3.5 w-3.5 ${cat.text}`} />
                  {cat.name}
                </span>
                <span className="font-mono text-muted-foreground">{count ? `${progress}%` : "—"}</span>
              </div>
              <Progress value={progress} className="h-1.5" indicatorClassName={cat.bar} />
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
