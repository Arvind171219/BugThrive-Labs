import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  ArrowLeft,
  BookOpen,
  Check,
  CheckCircle2,
  ChevronDown,
  Circle,
  ClipboardList,
  Clock,
  Copy,
  Layers,
  Lock,
  PlayCircle,
  Star,
  Terminal,
  Trophy,
  Users,
} from "lucide-react";

import { SegmentedControl } from "@/components/common/SegmentedControl";
import { FavouriteButton } from "@/components/course/FavouriteButton";
import { TierBadge } from "@/components/course/TierBadge";
import { CategoryBadge } from "@/components/dashboard/CategoryBadge";
import { CourseThumbnail } from "@/components/dashboard/CourseThumbnail";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { getCourseBySlug } from "@/data/mockData";
import { useLearningState } from "@/lib/learning-state";
import { cn } from "@/lib/utils";
import type { Course } from "@/types";
import { NotFoundPage } from "./NotFoundPage";

type Tab = "curriculum" | "assessment" | "cheatsheet";

export function CourseDetailPage() {
  const { slug = "" } = useParams();
  const course = getCourseBySlug(slug);
  const [tab, setTab] = useState<Tab>("curriculum");
  const { courseProgress, nextSection, sectionStatus } = useLearningState();

  if (!course) return <NotFoundPage />;

  const progress = courseProgress(course);
  const enrolled = progress !== undefined;
  const status = sectionStatus(course);
  const sections = course.modules.flatMap((m) => m.sections);
  const doneCount = sections.filter((s) => status.get(s.id)).length;
  const questionCount = sections.reduce((sum, s) => sum + s.questions.length, 0);
  const next = nextSection(course);

  return (
    <div className="space-y-6">
      <Link
        to="/dashboard"
        className="inline-flex items-center gap-1.5 font-mono text-[11px] font-bold uppercase tracking-widest text-muted-foreground hover:text-primary"
      >
        <ArrowLeft className="h-3.5 w-3.5" /> Back to dashboard
      </Link>

      <Card className="overflow-hidden">
        <div className="grid md:grid-cols-[1fr_280px]">
          <div className="p-6 sm:p-8">
            <div className="flex flex-wrap items-center gap-2">
              <CategoryBadge category={course.category} />
              <Badge variant="outline">{course.domain}</Badge>
              <Badge variant="outline">{course.level}</Badge>
              {course.isNew && <Badge>New</Badge>}
              <TierBadge tier={course.tier} className="ml-1" />
            </div>
            <div className="mt-4 flex items-start justify-between gap-4">
              <h1 className="text-2xl font-bold sm:text-3xl">{course.title}</h1>
              <FavouriteButton courseId={course.id} className="mt-1 shrink-0" />
            </div>
            <p className="mt-3 max-w-2xl text-muted-foreground">{course.description}</p>
            <p className="mt-3 text-sm">
              Instructor: <span className="font-medium">{course.instructor}</span>
            </p>

            <div className="mt-5 flex flex-wrap gap-x-5 gap-y-2 font-mono text-xs text-muted-foreground">
              <span className="flex items-center gap-1.5"><Clock className="h-4 w-4" />{course.durationHours} hours</span>
              <span className="flex items-center gap-1.5"><Layers className="h-4 w-4" />{course.modules.length} modules · {sections.length} sections</span>
              <span className="flex items-center gap-1.5"><ClipboardList className="h-4 w-4" />{questionCount} questions</span>
              <span className="flex items-center gap-1.5"><Star className="h-4 w-4 fill-primary text-primary" />{course.rating}</span>
              <span className="flex items-center gap-1.5"><Users className="h-4 w-4" />{course.students.toLocaleString()} students</span>
            </div>

            <div className="mt-6 max-w-md">
              {enrolled && (
                <>
                  <div className="mb-2 flex justify-between text-sm">
                    <span className="text-muted-foreground">{doneCount} of {sections.length} sections</span>
                    <span className="font-mono font-bold text-primary">{progress}%</span>
                  </div>
                  <Progress value={progress} />
                </>
              )}
              <Button asChild className="mt-5">
                <Link to={`/courses/${course.slug}/sections/${(next ?? sections[0]).id}`}>
                  <PlayCircle />
                  {!enrolled ? "Start course" : next ? "Resume course" : "Review course"}
                </Link>
              </Button>
            </div>
          </div>
          <CourseThumbnail category={course.category} className="hidden min-h-full md:flex [&_svg]:h-20 [&_svg]:w-20" />
        </div>
      </Card>

      <SegmentedControl<Tab>
        label="Course sections"
        value={tab}
        onChange={setTab}
        options={[
          { value: "curriculum", label: "Curriculum" },
          { value: "assessment", label: "Skills Assessment" },
          { value: "cheatsheet", label: "Cheat Sheet" },
        ]}
      />

      {tab === "curriculum" && <Curriculum course={course} status={status} />}
      {tab === "assessment" && <Assessment course={course} complete={doneCount === sections.length} />}
      {tab === "cheatsheet" && <CheatSheet course={course} />}
    </div>
  );
}

function Curriculum({ course, status }: { course: Course; status: Map<string, boolean> }) {
  const [open, setOpen] = useState<Set<string>>(() => new Set(course.modules.map((m) => m.id)));
  const toggle = (id: string) =>
    setOpen((prev) => {
      const nextSet = new Set(prev);
      if (nextSet.has(id)) nextSet.delete(id);
      else nextSet.add(id);
      return nextSet;
    });

  return (
    <div className="space-y-3">
      {course.modules.map((mod, i) => {
        const done = mod.sections.filter((s) => status.get(s.id)).length;
        const isOpen = open.has(mod.id);
        return (
          <Card key={mod.id} className="overflow-hidden">
            <button
              type="button"
              onClick={() => toggle(mod.id)}
              aria-expanded={isOpen}
              className="flex w-full items-center gap-4 px-5 py-4 text-left transition-colors hover:bg-accent/50"
            >
              {done === mod.sections.length ? (
                <CheckCircle2 className="h-5 w-5 shrink-0 text-primary" />
              ) : (
                <Circle className="h-5 w-5 shrink-0 text-muted-foreground" />
              )}
              <div className="min-w-0 flex-1">
                <p className="eyebrow text-[10px]">Module {i + 1}</p>
                <p className="truncate font-medium">{mod.title}</p>
              </div>
              <span className="whitespace-nowrap font-mono text-xs text-muted-foreground">
                {done}/{mod.sections.length}
              </span>
              <ChevronDown className={cn("h-4 w-4 shrink-0 text-muted-foreground transition-transform", isOpen && "rotate-180")} />
            </button>
            {isOpen && (
              <ol className="divide-y border-t">
                {mod.sections.map((section) => {
                  const complete = status.get(section.id);
                  const Icon = section.type === "interactive" ? Terminal : BookOpen;
                  return (
                    <li key={section.id}>
                      <Link
                        to={`/courses/${course.slug}/sections/${section.id}`}
                        className="flex items-center gap-4 py-3 pl-14 pr-5 text-sm transition-colors hover:bg-accent/50"
                      >
                        <Icon className={cn("h-4 w-4 shrink-0", section.type === "interactive" ? "text-primary" : "text-muted-foreground")} />
                        <span className={cn("min-w-0 flex-1 truncate", complete && "text-muted-foreground")}>{section.title}</span>
                        {section.questions.length > 0 && (
                          <span className="hidden font-mono text-[11px] text-muted-foreground sm:inline">
                            {section.questions.length} Q
                          </span>
                        )}
                        <span className="hidden w-14 text-right font-mono text-[11px] text-muted-foreground sm:inline">
                          {section.minutes} min
                        </span>
                        {complete ? <Check className="h-4 w-4 shrink-0 text-primary" /> : <span className="w-4" />}
                      </Link>
                    </li>
                  );
                })}
              </ol>
            )}
          </Card>
        );
      })}
    </div>
  );
}

function Assessment({ course, complete }: { course: Course; complete: boolean }) {
  const passed = course.progress === 100;
  const state = passed ? "passed" : complete ? "unlocked" : "locked";

  return (
    <Card>
      <CardContent className="flex flex-col gap-6 p-6 sm:flex-row sm:items-start">
        <span
          className={cn(
            "flex h-14 w-14 shrink-0 items-center justify-center rounded-xl",
            state === "locked" ? "bg-muted text-muted-foreground" : "bg-primary/10 text-primary",
          )}
        >
          {state === "locked" ? <Lock className="h-6 w-6" /> : <Trophy className="h-6 w-6" />}
        </span>
        <div className="flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="text-lg font-semibold">{course.assessment.title}</h2>
            <Badge variant={state === "passed" ? "default" : "outline"}>
              {state === "passed" ? "Passed" : state === "unlocked" ? "Unlocked" : "Locked"}
            </Badge>
          </div>
          <p className="mt-2 text-muted-foreground">{course.assessment.description}</p>
          <p className="mt-4 text-sm">
            {state === "locked" && "Complete every section in this course to unlock the skills assessment."}
            {state === "unlocked" && "You're ready. The assessment runs in a live environment, which arrives in a later phase."}
            {state === "passed" && "You passed this assessment — your course certificate has been issued."}
          </p>
          <Button className="mt-5" disabled={state !== "passed"} variant={state === "passed" ? "outline" : "default"} asChild={state === "passed"}>
            {state === "passed" ? <Link to="/certificates">View certificate</Link> : <span>Start assessment</span>}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

function CheatSheet({ course }: { course: Course }) {
  const [copied, setCopied] = useState<number | null>(null);

  if (!course.cheatSheet.length) {
    return (
      <Card>
        <CardContent className="p-6 text-sm text-muted-foreground">A cheat sheet for this course is being prepared.</CardContent>
      </Card>
    );
  }

  const copy = async (text: string, index: number) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(index);
      setTimeout(() => setCopied((c) => (c === index ? null : c)), 1500);
    } catch {
      // Clipboard not available — ignore.
    }
  };

  return (
    <Card>
      <CardContent className="divide-y p-0">
        {course.cheatSheet.map((entry, i) => (
          <div key={entry.command} className="flex flex-col gap-2 px-5 py-4 sm:flex-row sm:items-center sm:gap-6">
            <p className="text-sm text-muted-foreground sm:w-56 sm:shrink-0">{entry.description}</p>
            <div className="flex min-w-0 flex-1 items-center gap-2 rounded-md border bg-background px-3 py-2">
              <code className="min-w-0 flex-1 overflow-x-auto whitespace-nowrap font-mono text-xs text-primary">{entry.command}</code>
              <button
                type="button"
                onClick={() => copy(entry.command, i)}
                className="shrink-0 text-muted-foreground hover:text-foreground"
                aria-label="Copy command"
              >
                {copied === i ? <Check className="h-4 w-4 text-primary" /> : <Copy className="h-4 w-4" />}
              </button>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
