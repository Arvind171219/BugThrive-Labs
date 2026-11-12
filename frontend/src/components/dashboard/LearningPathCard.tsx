import { Link } from "react-router-dom";
import { Award, BookOpen, Clock } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { categories } from "@/data/categories";
import { useLearningState } from "@/lib/learning-state";
import { cn } from "@/lib/utils";
import type { LearningPath } from "@/types";

export function LearningPathCard({ path }: { path: LearningPath }) {
  const { pathProgress } = useLearningState();
  const meta = categories[path.category];
  const Icon = meta.icon;
  const progress = pathProgress(path);

  return (
    <Link
      to={`/learning-paths/${path.id}`}
      className="group block rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
    >
      <Card className="flex h-full flex-col p-5 transition-all group-hover:-translate-y-0.5 group-hover:border-primary/40">
        <div className="flex items-start justify-between gap-3">
          <span className={cn("flex h-10 w-10 items-center justify-center rounded-lg border", meta.bg, meta.text, meta.border)}>
            <Icon className="h-5 w-5" />
          </span>
          <Badge variant={path.type === "job-role" ? "default" : "outline"}>
            {path.type === "job-role" ? "Job Role" : "Skill"}
          </Badge>
        </div>
        <h3 className="mt-4 font-semibold transition-colors group-hover:text-primary">{path.title}</h3>
        <p className="mt-1 flex-1 text-sm text-muted-foreground">{path.description}</p>
        <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-1 font-mono text-[11px] text-muted-foreground">
          <span className="flex items-center gap-1">
            <BookOpen className="h-3.5 w-3.5" />
            {path.courseIds.length} courses
          </span>
          <span className="flex items-center gap-1">
            <Clock className="h-3.5 w-3.5" />
            {path.totalHours}h
          </span>
          {path.examId && (
            <span className="flex items-center gap-1 text-primary">
              <Award className="h-3.5 w-3.5" />
              Exam
            </span>
          )}
        </div>
        <div className="mt-3 flex items-center gap-3">
          <Progress value={progress} className="h-1.5" indicatorClassName={meta.bar} />
          <span className="whitespace-nowrap font-mono text-xs font-bold">
            {progress > 0 ? `${progress}%` : "Not started"}
          </span>
        </div>
      </Card>
    </Link>
  );
}
