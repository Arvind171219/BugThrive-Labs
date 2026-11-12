import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, X } from "lucide-react";

import { Input } from "@/components/ui/input";
import { categories } from "@/data/categories";
import { courses } from "@/data/mockData";
import { courseMatches } from "@/lib/search";

interface SearchBoxProps {
  value: string;
  onChange: (value: string) => void;
}

/**
 * Global search. Typing filters the dashboard content (via shared state)
 * and shows quick results that link straight to a course.
 */
export function SearchBox({ value, onChange }: SearchBoxProps) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const results = value.trim() ? courses.filter((c) => courseMatches(c, value)).slice(0, 6) : [];

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (!containerRef.current?.contains(event.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function openCourse(slug: string) {
    setOpen(false);
    navigate(`/courses/${slug}`);
  }

  return (
    <div ref={containerRef} className="relative w-full max-w-md">
      <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
      <Input
        type="search"
        value={value}
        placeholder="Search courses, topics, tools…"
        aria-label="Search courses"
        className="h-9 border-border/70 bg-card pl-9 pr-9 [&::-webkit-search-cancel-button]:hidden"
        onChange={(e) => {
          onChange(e.target.value);
          setOpen(true);
        }}
        onFocus={() => setOpen(true)}
        onKeyDown={(e) => {
          if (e.key === "Escape") {
            onChange("");
            setOpen(false);
          }
          if (e.key === "Enter" && results[0]) openCourse(results[0].slug);
        }}
      />
      {value && (
        <button
          type="button"
          onClick={() => onChange("")}
          className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded p-0.5 text-muted-foreground hover:text-foreground"
          aria-label="Clear search"
        >
          <X className="h-4 w-4" />
        </button>
      )}

      {open && value.trim() && (
        <div className="absolute left-0 right-0 top-full z-50 mt-2 overflow-hidden rounded-md border bg-popover shadow-lg shadow-black/40">
          {results.length === 0 ? (
            <p className="px-4 py-6 text-center text-sm text-muted-foreground">No courses match “{value}”.</p>
          ) : (
            <ul className="max-h-80 overflow-y-auto p-1">
              {results.map((course) => {
                const cat = categories[course.category];
                const Icon = cat.icon;
                return (
                  <li key={course.id}>
                    <button
                      type="button"
                      onClick={() => openCourse(course.slug)}
                      className="flex w-full items-center gap-3 rounded-sm px-3 py-2 text-left hover:bg-accent"
                    >
                      <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-md ${cat.bg} ${cat.text}`}>
                        <Icon className="h-4 w-4" />
                      </span>
                      <span className="min-w-0">
                        <span className="block truncate text-sm font-medium">{course.title}</span>
                        <span className="block text-xs text-muted-foreground">
                          {cat.name} · {course.level}
                        </span>
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
