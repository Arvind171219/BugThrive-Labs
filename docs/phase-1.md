# Phase 1 — Scope & Decisions

## Delivered

### 1A · Student dashboard (`frontend/`)
- App shell: fixed top bar (logo, global search, notifications, profile menu) and sidebar
  (Dashboard, Browse Labs, Learning Paths, My Learning, Achievements, Leaderboard, Certificates,
  Profile, Settings). The sidebar becomes a slide-in drawer below 1024px.
- Dashboard: welcome banner with weekly study chart, stat cards (enrolled, completed, learning
  hours, streak), overall progress ring with per-category breakdown, Continue Learning,
  Recommended courses, Learning Paths, Recent Activity.
- Course detail page (`/courses/:slug`) reached from any course or path card.
- Search: filters dashboard sections live and shows quick results that link to courses.
- All data is mock data in `frontend/src/data/`.

### 1A+ · Learning features (added after review)
- **Course structure:** course → modules → sections (reading / interactive) → questions. Answers are
  checked client-side against mock data (`/courses/:slug/sections/:sectionId`), with hints and XP.
- **Difficulty tiers** (Tier 0–IV) and **domains** (Offensive / Defensive / General) on every course.
- **Skills assessment** per course (locked until all sections are complete) and a **cheat sheet** tab.
- **Skill paths vs Job Role paths**; job-role paths end in a **certification exam**
  (`/learning-paths/:id`, `/certificates`).
- **Browse Labs** catalogue with domain / category / tier filters and sorting.
- **My Learning** (in progress / completed / saved), **bookmarks** on course cards,
  **Achievements** (earned and in-progress badges), **New Releases** on the dashboard.
- Saved courses and solved questions persist in `localStorage` (`lib/learning-state.tsx`) until the
  progress API exists.
- Interactive sections show a "target machine — later phase" notice; exam booking and certificate PDF
  downloads are disabled placeholders.
- Leaderboard, Profile and Settings remain placeholders.

### 1B · Backend skeleton (`backend/`)
- Spring Boot 3.5 / Java 21 / Maven wrapper.
- Module packages: `config`, `common`, `auth`, `user`, `dashboard`, `course`, `learningpath`, `progress`.
- `GET /api/v1/health`, `ApiResponse<T>` envelope, `GlobalExceptionHandler`.
- Env-driven datasource, `dev` / `prod` profiles, Flyway enabled (no migrations yet).
- Spring Security wired permit-all with CORS for the frontend dev server.

## Explicitly out of scope
Interactive Docker labs, browser terminal, lab orchestration, WebSockets, payments,
subscriptions, admin panel, production deployment, authentication, business APIs, entities.

## Branding reference
Taken from the default theme of https://labs.bugthrive.com:

| Token        | Value                   | Use                             |
|--------------|-------------------------|---------------------------------|
| Background   | `hsl(216 26% 7.5%)`     | page                            |
| Card         | `hsl(216 26% 11%)`      | surfaces                        |
| Primary      | `hsl(72 100% 50%)` (#CCFF00) | CTAs, active nav, progress |
| Brand magenta/violet | `hsl(297 100% 50%)` / `hsl(252 100% 66%)` | logo gradient, glows |
| Fonts        | Space Grotesk (headings), Inter (body), JetBrains Mono (labels) | |

Logo: official wordmark (`frontend/public/brand/bugthrive-logo.png`, cropped from the site's
`Full-word_11zon.png`) followed by a divider and "LABS" in mono caps, as on the live site.

## Suggested next steps (Phase 2)
1. Flyway `V1` for `users`; JWT auth in `auth/`; lock down `SecurityConfig`.
2. Entities mirroring the frontend model: `course` → `course_module` → `section` → `question`,
   `learning_path` (+ type, exam), `exam`, `badge`, and per-user `section_progress`,
   `question_attempt`, `saved_course`. Answers must be verified server-side.
3. `GET /api/v1/dashboard` aggregating the data the frontend currently mocks.
4. Replace `frontend/src/data/mockData.ts` with an API client.
