import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

import type { Course, LearningPath, Section } from "@/types";
import { getCourseById } from "@/data/courses";

/*
 * Client-side learning state for the mock phase: saved courses and solved
 * questions, persisted in localStorage. This moves to the progress API later.
 */

const STORAGE_KEY = "bugthrive-labs:learning-state";

interface StoredState {
  favourites: string[];
  solved: string[];
}

function load(): StoredState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as Partial<StoredState>;
      return { favourites: parsed.favourites ?? [], solved: parsed.solved ?? [] };
    }
  } catch {
    // Storage unavailable or corrupt — start fresh.
  }
  return { favourites: [], solved: [] };
}

interface LearningState {
  isFavourite: (courseId: string) => boolean;
  toggleFavourite: (courseId: string) => void;
  favouriteIds: string[];
  isSolved: (questionId: string) => boolean;
  markSolved: (questionId: string) => void;
  /** Section completion map for a course. */
  sectionStatus: (course: Course) => Map<string, boolean>;
  courseProgress: (course: Course) => number | undefined;
  pathProgress: (path: LearningPath) => number;
  nextSection: (course: Course) => Section | undefined;
}

const LearningStateContext = createContext<LearningState | null>(null);

export function LearningStateProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<StoredState>(load);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      // Ignore quota / privacy-mode errors.
    }
  }, [state]);

  const favouriteSet = useMemo(() => new Set(state.favourites), [state.favourites]);
  const solvedSet = useMemo(() => new Set(state.solved), [state.solved]);

  const toggleFavourite = useCallback((courseId: string) => {
    setState((s) => ({
      ...s,
      favourites: s.favourites.includes(courseId)
        ? s.favourites.filter((id) => id !== courseId)
        : [...s.favourites, courseId],
    }));
  }, []);

  const markSolved = useCallback((questionId: string) => {
    setState((s) => (s.solved.includes(questionId) ? s : { ...s, solved: [...s.solved, questionId] }));
  }, []);

  const value = useMemo<LearningState>(() => {
    const sectionStatus = (course: Course) => {
      const sections = course.modules.flatMap((m) => m.sections);
      // Mock baseline: the first N% of sections are complete for enrolled courses.
      const baseline = Math.round(((course.progress ?? 0) / 100) * sections.length);
      return new Map(
        sections.map((s, i) => [
          s.id,
          i < baseline || (s.questions.length > 0 && s.questions.every((q) => solvedSet.has(q.id))),
        ]),
      );
    };

    const courseProgress = (course: Course) => {
      const status = [...sectionStatus(course).values()];
      const done = status.filter(Boolean).length;
      if (course.progress === undefined && done === 0) return undefined;
      return Math.round((done / status.length) * 100);
    };

    return {
      favouriteIds: state.favourites,
      isFavourite: (id) => favouriteSet.has(id),
      toggleFavourite,
      isSolved: (id) => solvedSet.has(id),
      markSolved,
      sectionStatus,
      courseProgress,
      pathProgress: (path) => {
        const values = path.courseIds.map((id) => {
          const course = getCourseById(id);
          return course ? courseProgress(course) ?? 0 : 0;
        });
        return values.length ? Math.round(values.reduce((a, b) => a + b, 0) / values.length) : 0;
      },
      nextSection: (course) => {
        const status = sectionStatus(course);
        return course.modules.flatMap((m) => m.sections).find((s) => !status.get(s.id));
      },
    };
  }, [state.favourites, favouriteSet, solvedSet, toggleFavourite, markSolved]);

  return <LearningStateContext.Provider value={value}>{children}</LearningStateContext.Provider>;
}

export function useLearningState() {
  const ctx = useContext(LearningStateContext);
  if (!ctx) throw new Error("useLearningState must be used inside <LearningStateProvider>");
  return ctx;
}
