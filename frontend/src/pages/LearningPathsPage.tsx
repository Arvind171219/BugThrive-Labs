import { useState } from "react";
import { Briefcase, Target } from "lucide-react";

import { PageHeader } from "@/components/common/PageHeader";
import { SegmentedControl } from "@/components/common/SegmentedControl";
import { LearningPathCard } from "@/components/dashboard/LearningPathCard";
import { useLayoutContext } from "@/components/layout/AppLayout";
import { learningPaths } from "@/data/mockData";
import { pathMatches } from "@/lib/search";
import type { PathType } from "@/types";

type Filter = PathType | "all";

export function LearningPathsPage() {
  const { search } = useLayoutContext();
  const [filter, setFilter] = useState<Filter>("all");

  const count = (t: Filter) => learningPaths.filter((p) => t === "all" || p.type === t).length;
  const paths = learningPaths.filter((p) => (filter === "all" || p.type === filter) && pathMatches(p, search));

  return (
    <div className="space-y-6">
      <PageHeader title="Learning Paths" description="Structured tracks that take you from fundamentals to job-ready." />

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="flex gap-3 rounded-lg border bg-card p-4">
          <Briefcase className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
          <div>
            <p className="font-medium">Job Role paths</p>
            <p className="text-sm text-muted-foreground">
              Everything needed for a security role, ending in a BugThrive certification exam.
            </p>
          </div>
        </div>
        <div className="flex gap-3 rounded-lg border bg-card p-4">
          <Target className="mt-0.5 h-5 w-5 shrink-0 text-sky-400" />
          <div>
            <p className="font-medium">Skill paths</p>
            <p className="text-sm text-muted-foreground">Shorter tracks that go deep on a single topic or toolset.</p>
          </div>
        </div>
      </div>

      <SegmentedControl<Filter>
        label="Path type"
        value={filter}
        onChange={setFilter}
        options={[
          { value: "all", label: "All", count: count("all") },
          { value: "job-role", label: "Job Role", count: count("job-role") },
          { value: "skill", label: "Skill", count: count("skill") },
        ]}
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {paths.map((path) => (
          <LearningPathCard key={path.id} path={path} />
        ))}
      </div>
      {!paths.length && <p className="text-sm text-muted-foreground">No paths match “{search.trim()}”.</p>}
    </div>
  );
}
