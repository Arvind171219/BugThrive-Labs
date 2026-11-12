import { Link } from "react-router-dom";

import { cn } from "@/lib/utils";

/** Official BugThrive wordmark + "LABS" suffix, matching labs.bugthrive.com. */
export function Logo({ className }: { className?: string }) {
  return (
    <Link to="/dashboard" className={cn("group flex items-center gap-3", className)} aria-label="BugThrive Labs home">
      <img
        src="/brand/bugthrive-logo.png"
        alt="BugThrive"
        className="h-6 w-auto object-contain opacity-90 transition-opacity group-hover:opacity-100 sm:h-7"
      />
      <span className="hidden h-6 w-px bg-white/10 sm:block" />
      <span className="hidden font-mono text-xs font-bold uppercase tracking-[0.35em] text-white/70 transition-colors group-hover:text-white sm:block">
        Labs
      </span>
    </Link>
  );
}
