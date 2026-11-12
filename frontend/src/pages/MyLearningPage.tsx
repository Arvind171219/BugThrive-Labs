import { useState } from "react";
import { Link } from "react-router-dom";
import { Bookmark, BookOpen, GraduationCap } from "lucide-react";

import { EmptyState } from "@/components/common/EmptyState";
import { PageHeader } from "@/components/common/PageHeader";
import { SegmentedControl } from "@/components/common/SegmentedControl";
import { CourseCard } from "@/components/dashboard/CourseCard";
import { courses } from "@/data/mockData";
import { useLearningState } from "@/lib/learning-state";

type Tab = "in-progress" | "completed" | "saved";

export function MyLearningPage() {
  const [tab, setTab] = useState<Tab>("in-progress");
  const { courseProgress, favouriteIds } = useLearningState();

  const withProgress = courses.map((c) => ({ course: c, progress: courseProgress(c) }));
  const lists: Record<Tab, typeof courses> = {
    "in-progress": withProgress.filter((x) => x.progress !== undefined && x.progress < 100).map((x) => x.course),
    completed: withProgress.filter((x) => x.progress === 100).map((x) => x.course),
    saved: courses.filter((c) => favouriteIds.includes(c.id)),
  };
  const items = lists[tab];

  return (
    <div className="space-y-6">
      <PageHeader title="My Learning" description="Your enrolled, completed and saved courses." />

      <SegmentedControl<Tab>
        label="My learning"
        value={tab}
        onChange={setTab}
        options={[
          { value: "in-progress", label: "In Progress", count: lists["in-progress"].length },
          { value: "completed", label: "Completed", count: lists.completed.length },
          { value: "saved", label: "Saved", count: lists.saved.length },
        ]}
      />

      {items.length ? (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {items.map((course) => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>
      ) : tab === "saved" ? (
        <EmptyState icon={Bookmark} title="Nothing saved yet">
          Use the bookmark on any course card to save it for later.{" "}
          <Link to="/labs" className="text-primary hover:underline">Browse courses</Link>
        </EmptyState>
      ) : tab === "completed" ? (
        <EmptyState icon={GraduationCap} title="No completed courses yet" />
      ) : (
        <EmptyState icon={BookOpen} title="No courses in progress">
          <Link to="/labs" className="text-primary hover:underline">Find something to learn</Link>
        </EmptyState>
      )}
    </div>
  );
}
