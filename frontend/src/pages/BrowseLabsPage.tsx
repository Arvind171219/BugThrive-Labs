import { useState, type ReactNode } from "react";
import { SearchX } from "lucide-react";

import { EmptyState } from "@/components/common/EmptyState";
import { PageHeader } from "@/components/common/PageHeader";
import { SegmentedControl } from "@/components/common/SegmentedControl";
import { tierLabel } from "@/components/course/TierBadge";
import { CourseCard } from "@/components/dashboard/CourseCard";
import { useLayoutContext } from "@/components/layout/AppLayout";
import { categoryList } from "@/data/categories";
import { courses } from "@/data/mockData";
import { courseMatches } from "@/lib/search";
import { cn } from "@/lib/utils";
import type { CategoryId, Domain, Tier } from "@/types";

type DomainFilter = Domain | "All";
type Sort = "popular" | "newest" | "rating" | "easiest";

const TIERS: Tier[] = [0, 1, 2, 3, 4];

function Chip({ active, onClick, children }: { active: boolean; onClick: () => void; children: ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        "rounded-md border px-2.5 py-1 font-mono text-[11px] font-bold uppercase tracking-wider transition-colors",
        active ? "border-primary/50 bg-primary/10 text-primary" : "text-muted-foreground hover:border-foreground/30 hover:text-foreground",
      )}
    >
      {children}
    </button>
  );
}

export function BrowseLabsPage() {
  const { search } = useLayoutContext();
  const [domain, setDomain] = useState<DomainFilter>("All");
  const [category, setCategory] = useState<CategoryId | null>(null);
  const [tier, setTier] = useState<Tier | null>(null);
  const [sort, setSort] = useState<Sort>("popular");

  const countFor = (d: DomainFilter) => courses.filter((c) => d === "All" || c.domain === d).length;

  const results = courses
    .filter((c) => (domain === "All" || c.domain === domain) && (!category || c.category === category) && (tier === null || c.tier === tier))
    .filter((c) => courseMatches(c, search))
    .sort((a, b) => {
      if (sort === "newest") return Number(!!b.isNew) - Number(!!a.isNew);
      if (sort === "rating") return b.rating - a.rating;
      if (sort === "easiest") return a.tier - b.tier;
      return b.students - a.students;
    });

  const hasFilters = domain !== "All" || category || tier !== null;

  return (
    <div className="space-y-6">
      <PageHeader title="Browse Labs" description="Every course in the BugThrive Labs catalogue. Use the top search bar to search within results." />

      <SegmentedControl<DomainFilter>
        label="Domain"
        value={domain}
        onChange={setDomain}
        options={(["All", "Offensive", "Defensive", "General"] as const).map((d) => ({ value: d, label: d, count: countFor(d) }))}
      />

      <div className="space-y-3 rounded-lg border bg-card p-4">
        <div className="flex flex-wrap items-center gap-2">
          <span className="eyebrow w-20 text-[10px]">Category</span>
          {categoryList.map((cat) => (
            <Chip key={cat.id} active={category === cat.id} onClick={() => setCategory(category === cat.id ? null : cat.id)}>
              {cat.name}
            </Chip>
          ))}
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <span className="eyebrow w-20 text-[10px]">Difficulty</span>
          {TIERS.map((t) => (
            <Chip key={t} active={tier === t} onClick={() => setTier(tier === t ? null : t)}>
              {tierLabel(t)}
            </Chip>
          ))}
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <span className="eyebrow w-20 text-[10px]">Sort</span>
          {(
            [
              ["popular", "Most popular"],
              ["newest", "Newest"],
              ["rating", "Top rated"],
              ["easiest", "Easiest first"],
            ] as const
          ).map(([value, label]) => (
            <Chip key={value} active={sort === value} onClick={() => setSort(value)}>
              {label}
            </Chip>
          ))}
        </div>
      </div>

      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <span>
          {results.length} course{results.length === 1 ? "" : "s"}
          {search.trim() && <> matching “{search.trim()}”</>}
        </span>
        {hasFilters && (
          <button
            type="button"
            onClick={() => {
              setDomain("All");
              setCategory(null);
              setTier(null);
            }}
            className="font-mono text-[11px] font-bold uppercase tracking-wider hover:text-foreground"
          >
            Reset filters
          </button>
        )}
      </div>

      {results.length ? (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {results.map((course) => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>
      ) : (
        <EmptyState icon={SearchX} title="No courses match these filters">
          Try removing a filter or changing your search.
        </EmptyState>
      )}
    </div>
  );
}
