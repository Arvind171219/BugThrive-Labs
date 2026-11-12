import { Award, BookCheck, CheckCircle2, ClipboardCheck, Route, type LucideIcon } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Activity, ActivityType } from "@/types";

const activityIcons: Record<ActivityType, { icon: LucideIcon; className: string }> = {
  lesson: { icon: CheckCircle2, className: "bg-primary/10 text-primary" },
  course: { icon: BookCheck, className: "bg-emerald-400/10 text-emerald-400" },
  badge: { icon: Award, className: "bg-amber-400/10 text-amber-400" },
  quiz: { icon: ClipboardCheck, className: "bg-sky-400/10 text-sky-400" },
  path: { icon: Route, className: "bg-violet-400/10 text-violet-400" },
};

export function RecentActivity({ items }: { items: Activity[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Recent Activity</CardTitle>
      </CardHeader>
      <CardContent>
        <ol className="relative space-y-5 before:absolute before:bottom-2 before:left-4 before:top-2 before:w-px before:bg-border">
          {items.map((item) => {
            const { icon: Icon, className } = activityIcons[item.type];
            return (
              <li key={item.id} className="relative flex gap-3">
                <span className={`relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full ring-4 ring-card ${className}`}>
                  <Icon className="h-4 w-4" />
                </span>
                <div className="min-w-0 pt-0.5">
                  <p className="text-sm font-medium">{item.title}</p>
                  <p className="text-xs text-muted-foreground">{item.detail}</p>
                  <p className="mt-1 font-mono text-[10px] uppercase tracking-wider text-muted-foreground/70">
                    {item.time}
                  </p>
                </div>
              </li>
            );
          })}
        </ol>
      </CardContent>
    </Card>
  );
}
