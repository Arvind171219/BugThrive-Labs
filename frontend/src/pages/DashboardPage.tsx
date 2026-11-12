import { BookOpen, Clock, Flame, GraduationCap, SearchX, X } from "lucide-react";

import { ContinueLearningCard } from "@/components/dashboard/ContinueLearningCard";
import { CourseCard } from "@/components/dashboard/CourseCard";
import { LearningPathCard } from "@/components/dashboard/LearningPathCard";
import { NewReleases } from "@/components/dashboard/NewReleases";
import { ProgressOverview } from "@/components/dashboard/ProgressOverview";
import { RecentActivity } from "@/components/dashboard/RecentActivity";
import { SectionHeader } from "@/components/dashboard/SectionHeader";
import { StatCard } from "@/components/dashboard/StatCard";
import { WelcomeBanner } from "@/components/dashboard/WelcomeBanner";
import { useLayoutContext } from "@/components/layout/AppLayout";
import {
  completedCourses,
  enrolledCourses,
  inProgressCourses,
  learningPaths,
  newCourses,
  recentActivity,
  recommendedCourses,
  student,
} from "@/data/mockData";
import { useAuth } from "@/auth/AuthContext";
import { useLearningState } from "@/lib/learning-state";
import { courseMatches, pathMatches } from "@/lib/search";

export function DashboardPage() {
  const { search, setSearch } = useLayoutContext();
  const { user } = useAuth();
  // Greeting uses the signed-in user; learning stats are still mock data.
  const firstName = user?.fullName.trim().split(/\s+/)[0] ?? student.firstName;
  const { pathProgress } = useLearningState();
  const query = search.trim();

  // Most recently touched in-progress course, sorted by highest progress as a simple proxy.
  const resumeCourse = [...inProgressCourses].sort((a, b) => (b.progress ?? 0) - (a.progress ?? 0))[0];

  const continueLearning = inProgressCourses.filter((c) => courseMatches(c, query));
  const recommended = recommendedCourses.filter((c) => courseMatches(c, query));
  // Show the paths the student is furthest along first; cap at four unless searching.
  const paths = learningPaths
    .filter((p) => pathMatches(p, query))
    .sort((a, b) => pathProgress(b) - pathProgress(a))
    .slice(0, query ? undefined : 4);
  const noResults = query && !continueLearning.length && !recommended.length && !paths.length;

  return (
    <div className="space-y-8">
      <WelcomeBanner student={{ ...student, firstName }} resumeCourse={resumeCourse} />

      <section className="grid grid-cols-2 gap-4 lg:grid-cols-4" aria-label="Learning statistics">
        <StatCard
          label="Enrolled"
          value={enrolledCourses.length}
          hint={`${inProgressCourses.length} in progress`}
          icon={BookOpen}
        />
        <StatCard
          label="Completed"
          value={completedCourses.length}
          hint={`${completedCourses.length} certificates earned`}
          icon={GraduationCap}
          iconClassName="bg-emerald-400/10 text-emerald-400"
        />
        <StatCard
          label="Learning Hours"
          value={student.learningHours}
          hint={`+${student.hoursThisWeek}h this week`}
          icon={Clock}
          iconClassName="bg-sky-400/10 text-sky-400"
        />
        <StatCard
          label="Current Streak"
          value={`${student.streakDays}d`}
          hint={`Longest: ${student.longestStreak} days`}
          icon={Flame}
          iconClassName="bg-orange-400/10 text-orange-400"
        />
      </section>

      {query && (
        <div className="flex items-center justify-between rounded-lg border border-primary/20 bg-primary/5 px-4 py-2.5 text-sm">
          <span>
            Showing results for <span className="font-medium text-primary">“{query}”</span>
          </span>
          <button
            type="button"
            onClick={() => setSearch("")}
            className="flex items-center gap-1 font-mono text-[11px] font-bold uppercase tracking-wider text-muted-foreground hover:text-foreground"
          >
            <X className="h-3.5 w-3.5" /> Clear
          </button>
        </div>
      )}

      {noResults ? (
        <div className="flex flex-col items-center rounded-lg border border-dashed py-16 text-center">
          <SearchX className="h-10 w-10 text-muted-foreground" />
          <p className="mt-3 font-medium">No courses or paths match “{query}”</p>
          <p className="mt-1 text-sm text-muted-foreground">Try a category like “Cloud”, a tool like “Burp Suite”, or a level.</p>
        </div>
      ) : (
        <>
          <div className="grid gap-8 lg:grid-cols-3">
            <div className="space-y-8 lg:col-span-2">
              {continueLearning.length > 0 && (
                <section>
                  <SectionHeader title="Continue Learning" subtitle="Pick up where you left off" actionLabel="My learning" actionTo="/my-learning" />
                  <div className="space-y-3">
                    {continueLearning.map((course) => (
                      <ContinueLearningCard key={course.id} course={course} />
                    ))}
                  </div>
                </section>
              )}

              {recommended.length > 0 && (
                <section>
                  <SectionHeader title="Recommended for You" subtitle="Based on your skills and goals" actionLabel="Browse all" actionTo="/labs" />
                  <div className="grid gap-4 sm:grid-cols-2">
                    {recommended.map((course) => (
                      <CourseCard key={course.id} course={course} />
                    ))}
                  </div>
                </section>
              )}
            </div>

            <aside className="space-y-8">
              <ProgressOverview enrolled={enrolledCourses} />
              <NewReleases items={newCourses} />
              <RecentActivity items={recentActivity} />
            </aside>
          </div>

          {paths.length > 0 && (
            <section>
              <SectionHeader title="Learning Paths" subtitle="Structured tracks toward a security career" actionLabel="All paths" actionTo="/learning-paths" />
              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                {paths.map((path) => (
                  <LearningPathCard key={path.id} path={path} />
                ))}
              </div>
            </section>
          )}
        </>
      )}
    </div>
  );
}
