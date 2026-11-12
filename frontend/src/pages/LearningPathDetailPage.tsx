import { Link, useParams } from "react-router-dom";
import { ArrowLeft, Award, BookOpen, CheckCircle2, Clock, Lock } from "lucide-react";

import { TierBadge } from "@/components/course/TierBadge";
import { CategoryBadge } from "@/components/dashboard/CategoryBadge";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { exams, getCourseById, getPathById } from "@/data/mockData";
import { useLearningState } from "@/lib/learning-state";
import { cn } from "@/lib/utils";
import type { Course } from "@/types";
import { NotFoundPage } from "./NotFoundPage";

export function LearningPathDetailPage() {
  const { pathId = "" } = useParams();
  const { pathProgress, courseProgress } = useLearningState();
  const path = getPathById(pathId);
  if (!path) return <NotFoundPage />;

  const progress = pathProgress(path);
  const pathCourses = path.courseIds.map(getCourseById).filter((c): c is Course => Boolean(c));
  const exam = path.examId ? exams.find((e) => e.id === path.examId) : undefined;

  return (
    <div className="space-y-6">
      <Link
        to="/learning-paths"
        className="inline-flex items-center gap-1.5 font-mono text-[11px] font-bold uppercase tracking-widest text-muted-foreground hover:text-primary"
      >
        <ArrowLeft className="h-3.5 w-3.5" /> All learning paths
      </Link>

      <Card className="bg-grid">
        <CardContent className="p-6 sm:p-8">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant={path.type === "job-role" ? "default" : "outline"}>{path.type === "job-role" ? "Job Role Path" : "Skill Path"}</Badge>
            <CategoryBadge category={path.category} />
            <Badge variant="outline">{path.level}</Badge>
          </div>
          <h1 className="mt-4 text-2xl font-bold sm:text-3xl">{path.title}</h1>
          <p className="mt-2 max-w-2xl text-muted-foreground">{path.description}</p>
          <div className="mt-4 flex flex-wrap gap-5 font-mono text-xs text-muted-foreground">
            <span className="flex items-center gap-1.5"><BookOpen className="h-4 w-4" />{pathCourses.length} courses</span>
            <span className="flex items-center gap-1.5"><Clock className="h-4 w-4" />{path.totalHours} hours</span>
            {exam && <span className="flex items-center gap-1.5 text-primary"><Award className="h-4 w-4" />{exam.code} exam</span>}
          </div>
          <div className="mt-6 flex max-w-md items-center gap-3">
            <Progress value={progress} />
            <span className="font-mono text-sm font-bold text-primary">{progress}%</span>
          </div>
        </CardContent>
      </Card>

      <ol className="space-y-3">
        {pathCourses.map((course, i) => {
          const p = courseProgress(course) ?? 0;
          return (
            <li key={course.id}>
              <Link to={`/courses/${course.slug}`} className="group block">
                <Card className="flex items-center gap-4 p-4 transition-colors group-hover:border-primary/40">
                  <span
                    className={cn(
                      "flex h-9 w-9 shrink-0 items-center justify-center rounded-full border font-mono text-sm font-bold",
                      p === 100 ? "border-primary bg-primary text-primary-foreground" : "text-muted-foreground",
                    )}
                  >
                    {p === 100 ? <CheckCircle2 className="h-5 w-5" /> : i + 1}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-medium transition-colors group-hover:text-primary">{course.title}</p>
                    <div className="mt-1 flex flex-wrap items-center gap-3">
                      <TierBadge tier={course.tier} />
                      <span className="font-mono text-[11px] text-muted-foreground">{course.durationHours}h</span>
                    </div>
                  </div>
                  <div className="hidden w-40 items-center gap-2 sm:flex">
                    <Progress value={p} className="h-1.5" />
                    <span className="w-9 text-right font-mono text-xs">{p}%</span>
                  </div>
                </Card>
              </Link>
            </li>
          );
        })}
      </ol>

      {exam && (
        <Card className={cn(progress === 100 ? "border-primary/40" : "")}>
          <CardContent className="flex flex-col gap-4 p-6 sm:flex-row sm:items-center">
            <span className={cn("flex h-12 w-12 shrink-0 items-center justify-center rounded-xl", progress === 100 ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground")}>
              {progress === 100 ? <Award className="h-6 w-6" /> : <Lock className="h-6 w-6" />}
            </span>
            <div className="flex-1">
              <p className="eyebrow text-[10px]">Final exam · {exam.code}</p>
              <p className="font-semibold">{exam.title}</p>
              <p className="mt-1 text-sm text-muted-foreground">
                {progress === 100 ? "You're eligible to take this exam." : "Complete every course in this path to unlock the exam."}
              </p>
            </div>
            <Button variant="outline" asChild>
              <Link to="/certificates">Exam details</Link>
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
