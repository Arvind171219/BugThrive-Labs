import { NavLink } from "react-router-dom";
import { X, Zap } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { student } from "@/data/mockData";
import { cn } from "@/lib/utils";
import { navSections } from "./navigation";

interface SidebarProps {
  open: boolean;
  onClose: () => void;
}

export function Sidebar({ open, onClose }: SidebarProps) {
  const xpPercent = Math.round((student.xp / student.xpToNextLevel) * 100);

  return (
    <>
      {/* Mobile backdrop */}
      <div
        className={cn(
          "fixed inset-0 z-30 bg-black/60 backdrop-blur-sm transition-opacity lg:hidden",
          open ? "opacity-100" : "pointer-events-none opacity-0",
        )}
        onClick={onClose}
        aria-hidden
      />

      <aside
        className={cn(
          "fixed bottom-0 left-0 top-16 z-40 flex w-64 flex-col border-r bg-background transition-transform lg:translate-x-0",
          open ? "translate-x-0" : "-translate-x-full",
        )}
        aria-label="Main navigation"
      >
        <div className="flex items-center justify-end p-2 lg:hidden">
          <Button variant="ghost" size="icon" onClick={onClose} aria-label="Close navigation">
            <X />
          </Button>
        </div>

        <nav className="flex-1 space-y-6 overflow-y-auto px-3 py-4 lg:pt-6">
          {navSections.map((section) => (
            <div key={section.title}>
              <p className="eyebrow mb-2 px-3 text-[10px]">{section.title}</p>
              <ul className="space-y-1">
                {section.items.map(({ label, path, icon: Icon }) => (
                  <li key={path}>
                    <NavLink
                      to={path}
                      onClick={onClose}
                      className={({ isActive }) =>
                        cn(
                          "group relative flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                          isActive
                            ? "bg-primary/10 text-primary"
                            : "text-muted-foreground hover:bg-accent hover:text-foreground",
                        )
                      }
                    >
                      {({ isActive }) => (
                        <>
                          {isActive && (
                            <span className="absolute inset-y-1.5 left-0 w-0.5 rounded-full bg-primary" aria-hidden />
                          )}
                          <Icon className="h-4 w-4 shrink-0" />
                          {label}
                        </>
                      )}
                    </NavLink>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>

        <div className="border-t p-4">
          <div className="rounded-lg border bg-card p-4">
            <div className="flex items-center justify-between">
              <span className="eyebrow text-[10px]">Level {student.level}</span>
              <span className="flex items-center gap-1 font-mono text-xs font-bold text-primary">
                <Zap className="h-3 w-3" />
                {student.rank}
              </span>
            </div>
            <Progress value={xpPercent} className="mt-3 h-1.5" />
            <p className="mt-2 font-mono text-[11px] text-muted-foreground">
              {student.xp.toLocaleString()} / {student.xpToNextLevel.toLocaleString()} XP
            </p>
          </div>
        </div>
      </aside>
    </>
  );
}
