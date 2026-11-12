import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useLearningState } from "@/lib/learning-state";
import type { Course, Student } from "@/types";

interface WelcomeBannerProps {
  student: Student;
  resumeCourse?: Course;
}

function greeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
}

export function WelcomeBanner({ student, resumeCourse }: WelcomeBannerProps) {
  const { courseProgress, nextSection } = useLearningState();
  const resumeProgress = resumeCourse ? courseProgress(resumeCourse) : undefined;
  const next = resumeCourse ? nextSection(resumeCourse) : undefined;
  const resumeHref = resumeCourse
    ? next
      ? `/courses/${resumeCourse.slug}/sections/${next.id}`
      : `/courses/${resumeCourse.slug}`
    : "/dashboard";
  const today = new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" });

  return (
    <section className="bg-grid relative overflow-hidden rounded-xl border border-primary/15 bg-card p-6 sm:p-8">
      <div
        className="pointer-events-none absolute -right-20 -top-24 h-72 w-72 rounded-full bg-brand-violet/20 blur-3xl"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -bottom-24 right-32 h-56 w-56 rounded-full bg-primary/10 blur-3xl"
        aria-hidden
      />

      <div className="relative flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
        <div className="max-w-2xl">
          <p className="eyebrow">{today}</p>
          <h1 className="mt-2 text-2xl font-bold sm:text-3xl">
            {greeting()}, <span className="text-primary">{student.firstName}</span>
          </h1>
          <p className="mt-2 text-sm text-muted-foreground sm:text-base">
            {resumeCourse ? (
              <>
                You&apos;re <span className="font-medium text-foreground">{resumeProgress}%</span> through{" "}
                <span className="font-medium text-foreground">{resumeCourse.title}</span>. Keep the momentum going.
              </>
            ) : (
              "Pick a course below and start hacking."
            )}
          </p>
          <div className="mt-5 flex flex-wrap items-center gap-3">
            {resumeCourse && (
              <Button asChild>
                <Link to={resumeHref}>
                  Resume learning
                  <ArrowRight />
                </Link>
              </Button>
            )}
            <Button variant="outline" asChild>
              <Link to="/learning-paths">Explore paths</Link>
            </Button>
          </div>
        </div>

        <WeeklyActivity minutes={student.weeklyMinutes} />
      </div>
    </section>
  );
}

const DAYS = ["M", "T", "W", "T", "F", "S", "S"];

/** Minutes studied per day this week, as a compact bar chart. */
function WeeklyActivity({ minutes }: { minutes: number[] }) {
  const max = Math.max(...minutes, 1);
  const total = minutes.reduce((sum, m) => sum + m, 0);

  return (
    <div className="rounded-lg border bg-background/60 p-4 md:w-60">
      <div className="flex items-baseline justify-between">
        <p className="eyebrow text-[10px]">This week</p>
        <p className="font-mono text-xs font-bold text-primary">{(total / 60).toFixed(1)}h</p>
      </div>
      <div className="mt-3 flex h-20 items-end gap-2">
        {minutes.map((m, i) => (
          <div key={i} className="flex flex-1 flex-col items-center gap-1.5">
            <div
              className="w-full rounded-sm bg-primary/80 transition-colors hover:bg-primary"
              style={{ height: `${Math.max((m / max) * 64, 4)}px` }}
              title={`${m} min`}
            />
            <span className="font-mono text-[10px] text-muted-foreground">{DAYS[i]}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
