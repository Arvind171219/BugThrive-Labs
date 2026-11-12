import { Cloud, Flag, Flame, KeyRound, Lock, Moon, Radar, Route, Search, Syringe, Trophy, type LucideIcon } from "lucide-react";

import { PageHeader } from "@/components/common/PageHeader";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { badges } from "@/data/mockData";
import { cn } from "@/lib/utils";
import type { Badge } from "@/types";

const ICONS: Record<Badge["icon"], LucideIcon> = {
  flag: Flag,
  syringe: Syringe,
  radar: Radar,
  key: KeyRound,
  flame: Flame,
  route: Route,
  cloud: Cloud,
  search: Search,
  moon: Moon,
  trophy: Trophy,
};

const RARITY: Record<Badge["rarity"], string> = {
  Common: "text-slate-300 border-slate-400/30 bg-slate-400/10",
  Rare: "text-sky-400 border-sky-400/30 bg-sky-400/10",
  Epic: "text-violet-400 border-violet-400/30 bg-violet-400/10",
  Legendary: "text-amber-400 border-amber-400/30 bg-amber-400/10",
};

export function AchievementsPage() {
  const earned = badges.filter((b) => b.earnedOn);
  const locked = badges.filter((b) => !b.earnedOn);

  return (
    <div className="space-y-8">
      <PageHeader title="Achievements" description="Badges you earn by completing courses, paths and streaks.">
        <div className="rounded-lg border bg-card px-4 py-2 text-right">
          <p className="font-heading text-2xl font-bold">
            {earned.length}
            <span className="text-base text-muted-foreground"> / {badges.length}</span>
          </p>
          <p className="eyebrow text-[10px]">Badges earned</p>
        </div>
      </PageHeader>

      <section>
        <h2 className="mb-4 text-lg font-semibold">Earned</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {earned.map((b) => (
            <BadgeCard key={b.id} badge={b} />
          ))}
        </div>
      </section>

      <section>
        <h2 className="mb-4 text-lg font-semibold">In progress</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {locked.map((b) => (
            <BadgeCard key={b.id} badge={b} />
          ))}
        </div>
      </section>
    </div>
  );
}

function BadgeCard({ badge }: { badge: Badge }) {
  const Icon = ICONS[badge.icon];
  const isEarned = Boolean(badge.earnedOn);
  const pct = badge.progress ? Math.round((badge.progress.current / badge.progress.target) * 100) : 0;

  return (
    <Card className={cn("flex gap-4 p-5", !isEarned && "opacity-75")}>
      <span
        className={cn(
          "relative flex h-14 w-14 shrink-0 items-center justify-center rounded-xl border",
          isEarned ? RARITY[badge.rarity] : "border-border bg-muted text-muted-foreground",
        )}
      >
        <Icon className="h-6 w-6" />
        {!isEarned && <Lock className="absolute -bottom-1 -right-1 h-4 w-4 rounded-full bg-card p-0.5" />}
      </span>
      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between gap-2">
          <p className="truncate font-semibold">{badge.name}</p>
          <span className={cn("rounded border px-1.5 py-0.5 font-mono text-[9px] font-bold uppercase", RARITY[badge.rarity])}>
            {badge.rarity}
          </span>
        </div>
        <p className="mt-1 text-sm text-muted-foreground">{badge.description}</p>
        {isEarned ? (
          <p className="mt-2 font-mono text-[10px] uppercase tracking-wider text-muted-foreground">Earned {badge.earnedOn}</p>
        ) : (
          badge.progress && (
            <div className="mt-3 flex items-center gap-2">
              <Progress value={pct} className="h-1.5" />
              <span className="whitespace-nowrap font-mono text-[10px] text-muted-foreground">
                {badge.progress.current}/{badge.progress.target}
              </span>
            </div>
          )
        )}
      </div>
    </Card>
  );
}
