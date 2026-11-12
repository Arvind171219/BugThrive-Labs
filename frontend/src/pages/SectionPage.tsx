import { useState, type FormEvent } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, ArrowRight, BookOpen, Check, CheckCircle2, Lightbulb, Server, Terminal, X } from "lucide-react";

import { CategoryBadge } from "@/components/dashboard/CategoryBadge";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { getCourseBySlug } from "@/data/mockData";
import { useLearningState } from "@/lib/learning-state";
import { cn } from "@/lib/utils";
import type { Question } from "@/types";
import { NotFoundPage } from "./NotFoundPage";

export function SectionPage() {
  const { slug = "", sectionId = "" } = useParams();
  const { sectionStatus } = useLearningState();
  const course = getCourseBySlug(slug);

  const flat = course?.modules.flatMap((m) => m.sections.map((s) => ({ module: m, section: s }))) ?? [];
  const index = flat.findIndex((x) => x.section.id === sectionId);
  if (!course || index === -1) return <NotFoundPage />;

  const { module, section } = flat[index];
  const prev = flat[index - 1]?.section;
  const next = flat[index + 1]?.section;
  const status = sectionStatus(course);
  const sectionHref = (id: string) => `/courses/${course.slug}/sections/${id}`;

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_280px]">
      <div className="min-w-0 space-y-6">
        <Link
          to={`/courses/${course.slug}`}
          className="inline-flex items-center gap-1.5 font-mono text-[11px] font-bold uppercase tracking-widest text-muted-foreground hover:text-primary"
        >
          <ArrowLeft className="h-3.5 w-3.5" /> {course.title}
        </Link>

        <div>
          <div className="flex flex-wrap items-center gap-2">
            <CategoryBadge category={course.category} />
            <Badge variant="outline">{section.type === "interactive" ? "Interactive" : "Reading"}</Badge>
            <span className="font-mono text-[11px] text-muted-foreground">{section.minutes} min</span>
            {status.get(section.id) && (
              <span className="flex items-center gap-1 font-mono text-[11px] font-bold uppercase text-primary">
                <CheckCircle2 className="h-3.5 w-3.5" /> Completed
              </span>
            )}
          </div>
          <p className="eyebrow mt-4">{module.title}</p>
          <h1 className="mt-1 text-2xl font-bold sm:text-3xl">{section.title}</h1>
        </div>

        <Card>
          <CardContent className="space-y-4 p-6 leading-relaxed text-muted-foreground">
            {/* Placeholder copy — real section content will come from the course API. */}
            <p>
              In this section of <span className="text-foreground">{module.title}</span> we cover{" "}
              <span className="text-foreground">{section.title.toLowerCase()}</span>: what it is, why it matters to
              attackers and defenders, and how to recognise it in real environments.
            </p>
            <p>
              Work through the explanation, try the examples in your own lab, and check the course cheat sheet for the
              key commands. When you're comfortable, answer the questions below to complete the section.
            </p>
          </CardContent>
        </Card>

        {section.type === "interactive" && (
          <div className="flex items-start gap-3 rounded-lg border border-dashed border-primary/30 bg-primary/5 p-4 text-sm">
            <Server className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
            <div>
              <p className="font-medium">Target machine</p>
              <p className="text-muted-foreground">
                Spawnable targets for interactive sections arrive in a later phase. You can still answer the questions
                below.
              </p>
            </div>
          </div>
        )}

        {section.questions.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Questions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {section.questions.map((q, i) => (
                <QuestionItem key={q.id} question={q} number={i + 1} sectionComplete={Boolean(status.get(section.id))} />
              ))}
            </CardContent>
          </Card>
        )}

        <div className="flex items-center justify-between gap-3">
          {prev ? (
            <Button variant="outline" asChild>
              <Link to={sectionHref(prev.id)}>
                <ArrowLeft /> Previous
              </Link>
            </Button>
          ) : (
            <span />
          )}
          {next ? (
            <Button asChild>
              <Link to={sectionHref(next.id)}>
                Next section <ArrowRight />
              </Link>
            </Button>
          ) : (
            <Button asChild>
              <Link to={`/courses/${course.slug}`}>
                Back to course <ArrowRight />
              </Link>
            </Button>
          )}
        </div>
      </div>

      {/* Module outline */}
      <aside className="hidden lg:block">
        <Card className="sticky top-24">
          <CardHeader>
            <p className="eyebrow text-[10px]">Module</p>
            <CardTitle className="text-base">{module.title}</CardTitle>
          </CardHeader>
          <CardContent>
            <ol className="space-y-1">
              {module.sections.map((s) => {
                const Icon = s.type === "interactive" ? Terminal : BookOpen;
                const active = s.id === section.id;
                return (
                  <li key={s.id}>
                    <Link
                      to={sectionHref(s.id)}
                      className={cn(
                        "-mx-2 flex items-center gap-2 rounded-md px-2 py-1.5 text-sm transition-colors",
                        active ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-accent hover:text-foreground",
                      )}
                    >
                      <Icon className="h-3.5 w-3.5 shrink-0" />
                      <span className="min-w-0 flex-1 truncate">{s.title}</span>
                      {status.get(s.id) && <Check className="h-3.5 w-3.5 shrink-0 text-primary" />}
                    </Link>
                  </li>
                );
              })}
            </ol>
          </CardContent>
        </Card>
      </aside>
    </div>
  );
}

function normalise(value: string) {
  return value.trim().toLowerCase().replace(/\s+/g, " ");
}

function QuestionItem({ question, number, sectionComplete }: { question: Question; number: number; sectionComplete: boolean }) {
  const { isSolved, markSolved } = useLearningState();
  // Questions in a section that is already complete (mock baseline) count as solved.
  const solved = sectionComplete || isSolved(question.id);
  const [value, setValue] = useState("");
  const [wrong, setWrong] = useState(false);
  const [showHint, setShowHint] = useState(false);

  function submit(e: FormEvent) {
    e.preventDefault();
    if (normalise(value) === normalise(question.answer)) {
      markSolved(question.id);
      setWrong(false);
    } else {
      setWrong(true);
    }
  }

  return (
    <div>
      <div className="flex items-start justify-between gap-3">
        <p className="text-sm">
          <span className="mr-2 font-mono text-xs text-muted-foreground">Q{number}.</span>
          {question.prompt}
        </p>
        <span className="shrink-0 font-mono text-[11px] text-primary">+{question.points} XP</span>
      </div>

      {solved ? (
        <div className="mt-3 flex items-center gap-2 rounded-md border border-primary/30 bg-primary/5 px-3 py-2 text-sm">
          <CheckCircle2 className="h-4 w-4 text-primary" />
          <span className="font-mono text-primary">{question.answer}</span>
          <span className="ml-auto text-xs text-muted-foreground">Solved</span>
        </div>
      ) : (
        <form onSubmit={submit} className="mt-3 flex gap-2">
          <Input
            value={value}
            onChange={(e) => {
              setValue(e.target.value);
              setWrong(false);
            }}
            placeholder="Your answer"
            aria-label={`Answer for question ${number}`}
            aria-invalid={wrong}
            className={cn("font-mono", wrong && "border-destructive focus-visible:ring-destructive")}
          />
          <Button type="submit" disabled={!value.trim()}>
            Submit
          </Button>
        </form>
      )}

      {!solved && (
        <div className="mt-2 flex items-center gap-4 text-xs">
          {wrong && (
            <span className="flex items-center gap-1 text-destructive">
              <X className="h-3.5 w-3.5" /> Not quite — try again.
            </span>
          )}
          <button
            type="button"
            onClick={() => setShowHint((h) => !h)}
            className="flex items-center gap-1 text-muted-foreground hover:text-foreground"
          >
            <Lightbulb className="h-3.5 w-3.5" /> {showHint ? "Hide hint" : "Show hint"}
          </button>
        </div>
      )}
      {!solved && showHint && <p className="mt-2 rounded-md bg-muted px-3 py-2 text-xs text-muted-foreground">{question.hint}</p>}
    </div>
  );
}
