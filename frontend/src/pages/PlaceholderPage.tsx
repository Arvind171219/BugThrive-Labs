import { Link } from "react-router-dom";
import { Construction, type LucideIcon } from "lucide-react";

import { Button } from "@/components/ui/button";

interface PlaceholderPageProps {
  title: string;
  description: string;
  icon: LucideIcon;
}

/** Shown for sidebar sections that are scheduled for later phases. */
export function PlaceholderPage({ title, description, icon: Icon }: PlaceholderPageProps) {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold sm:text-3xl">{title}</h1>
        <p className="mt-1 text-muted-foreground">{description}</p>
      </div>
      <div className="bg-grid flex flex-col items-center rounded-xl border border-dashed px-6 py-20 text-center">
        <span className="flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10 text-primary">
          <Icon className="h-7 w-7" />
        </span>
        <p className="mt-5 flex items-center gap-2 font-mono text-xs font-bold uppercase tracking-widest text-muted-foreground">
          <Construction className="h-4 w-4" /> Coming in a later phase
        </p>
        <p className="mt-2 max-w-md text-sm text-muted-foreground">
          This section is part of the BugThrive Labs roadmap. Your dashboard has everything you need for now.
        </p>
        <Button asChild variant="outline" className="mt-6">
          <Link to="/dashboard">Back to dashboard</Link>
        </Button>
      </div>
    </div>
  );
}
