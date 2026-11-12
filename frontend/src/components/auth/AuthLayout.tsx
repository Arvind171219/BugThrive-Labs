import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { Award, FlaskConical, Route } from "lucide-react";

const highlights = [
  { icon: FlaskConical, text: "Hands-on courses across six security domains" },
  { icon: Route, text: "Skill and job-role paths from beginner to expert" },
  { icon: Award, text: "Certifications that prove job-ready skills" },
];

/** Split layout for login/register: brand panel on the left (desktop), form on the right. */
export function AuthLayout({ title, subtitle, children }: { title: string; subtitle: string; children: ReactNode }) {
  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <aside className="bg-grid relative hidden overflow-hidden border-r border-primary/10 bg-card lg:flex lg:flex-col lg:justify-between lg:p-12">
        <div className="pointer-events-none absolute -left-24 -top-24 h-96 w-96 rounded-full bg-brand-violet/20 blur-3xl" aria-hidden />
        <div className="pointer-events-none absolute -bottom-32 right-0 h-80 w-80 rounded-full bg-primary/10 blur-3xl" aria-hidden />

        <Link to="/login" className="relative flex items-center gap-3" aria-label="BugThrive Labs">
          <img src="/brand/bugthrive-logo.png" alt="BugThrive" className="h-8 w-auto" />
          <span className="h-6 w-px bg-white/10" />
          <span className="font-mono text-xs font-bold uppercase tracking-[0.35em] text-white/70">Labs</span>
        </Link>

        <div className="relative max-w-md">
          <p className="eyebrow text-primary">Cybersecurity training</p>
          <h2 className="mt-3 text-4xl font-bold leading-tight">
            Learn to hack. <span className="text-brand-gradient">Learn to defend.</span>
          </h2>
          <ul className="mt-8 space-y-4">
            {highlights.map(({ icon: Icon, text }) => (
              <li key={text} className="flex items-center gap-3 text-muted-foreground">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Icon className="h-4 w-4" />
                </span>
                {text}
              </li>
            ))}
          </ul>
        </div>

        <p className="relative font-mono text-[11px] uppercase tracking-widest text-muted-foreground">
          © {new Date().getFullYear()} BugThrive Labs
        </p>
      </aside>

      <main className="flex items-center justify-center px-4 py-12 sm:px-8">
        <div className="w-full max-w-sm">
          <Link to="/login" className="mb-10 flex items-center gap-3 lg:hidden" aria-label="BugThrive Labs">
            <img src="/brand/bugthrive-logo.png" alt="BugThrive" className="h-7 w-auto" />
            <span className="h-5 w-px bg-white/10" />
            <span className="font-mono text-xs font-bold uppercase tracking-[0.35em] text-white/70">Labs</span>
          </Link>
          <h1 className="text-2xl font-bold">{title}</h1>
          <p className="mt-1.5 text-sm text-muted-foreground">{subtitle}</p>
          <div className="mt-8">{children}</div>
        </div>
      </main>
    </div>
  );
}
